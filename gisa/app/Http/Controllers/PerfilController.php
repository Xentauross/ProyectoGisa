<?php

namespace App\Http\Controllers;

use App\Models\Perfil;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PerfilController extends Controller
{
    // Roles que pueden gestionar perfiles de OTROS empleados.
    // Un camarero solo puede editar su propio perfil, no el de los demás.
    // private const = constante de clase privada (no cambia nunca)
    private const ROLES_GESTION = ['admin', 'gerente', 'aux_administrativo'];

    public function index(Request $request): Response
    {
        $allowed = ['nombre', 'apellido1', 'dni', 'telefono', 'num_seguridad_social'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'nombre';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';

        $perfiles = Perfil::with('user')
            ->orderBy($sort, $dir)
            ->paginate(10)
            ->appends($request->only('sort', 'dir'));

        return Inertia::render('Perfiles/Index', [
            'perfiles' => $perfiles,
            'sort'     => $sort,
            'dir'      => $dir,
        ]);
    }

    // NOTA: Normalmente los perfiles se crean automáticamente junto
    // con el usuario en UsuarioController@store. Este método existe
    // para casos donde se creó un User sin perfil.
    public function create(): Response
    {
        // abort_if(condicion, código_http) — si la condición es true, devuelve 403 Forbidden
        // Solo los roles de gestión pueden crear perfiles de otros
        abort_if(!in_array(auth()->user()->role, self::ROLES_GESTION), 403);

        // Solo mostramos usuarios que NO tienen perfil aún (doesntHave)
        // No tiene sentido crear un perfil para alguien que ya tiene uno
        $users = User::doesntHave('perfil')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Perfiles/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(!in_array(auth()->user()->role, self::ROLES_GESTION), 403);

        // exists:users,id → comprueba que el user_id exista en la tabla users
        // unique:perfiles,user_id → comprueba que ese user no tenga ya un perfil
        $request->validate([
            'user_id'              => 'required|integer|exists:users,id|unique:perfiles,user_id',
            'nombre'               => 'required|string|max:40',
            'apellido1'            => 'required|string|max:40',
            'apellido2'            => 'nullable|string|max:40',
            'dni'                  => 'required|string|max:9|unique:perfiles,dni',
            'num_seguridad_social' => 'required|string|max:12|unique:perfiles,num_seguridad_social',
            'telefono'             => 'required|string|max:15',
            'fecha_nacimiento'     => 'required|date|before:today',
            'localidad'            => 'required|string|max:100',
            'cuenta_bancaria'      => 'required|string|max:34',
        ]);

        // $request->all() pasa todos los campos del request al create()
        // Funciona porque los nombres de los campos coinciden con las columnas de BD
        Perfil::create($request->all());

        return redirect()->route('perfiles.index')
            ->with('success', 'Perfil creado correctamente.');
    }

    public function show(Perfil $perfil): Response
    {
        // cargamos el usuario asociado
        $perfil->load('user');
        return Inertia::render('Perfiles/Show', [
            'perfil' => $perfil,
        ]);
    }

    // REGLA DE ACCESO:
    //   - Si eres admin/gerente/aux_admin → puedes editar cualquier perfil
    //   - Si NO eres de esos roles → solo puedes editar TU PROPIO perfil
    public function edit(Perfil $perfil): Response
    {

        // abort_if con condición compuesta:
        //   - ¿El perfil NO es tuyo? (perfil->user_id !== tu id)
        //   - Y ¿no tienes rol de gestión?
        //   → Si AMBAS son true: 403 Forbidden
        abort_if(
            $perfil->user_id !== auth()->id() && !in_array(auth()->user()->role, self::ROLES_GESTION),
            403
        );

        // Los roles de gestión ven el campo user para poder reasignar el perfil
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Perfiles/Edit', [
            'perfil' => $perfil->load('user'),
            'users'  => $users,
        ]);
    }

    public function update(Request $request, Perfil $perfil): RedirectResponse
    {
        // Misma lógica de acceso que edit()
        abort_if(
            $perfil->user_id !== auth()->id() && !in_array(auth()->user()->role, self::ROLES_GESTION),
            403
        );

        // Rule::unique()->ignore($perfil->id) → permite que el perfil mantenga
        // su propio DNI/NSS sin que unique falle al compararlo consigo mismo
        $request->validate([
            'nombre'               => 'required|string|max:40',
            'apellido1'            => 'required|string|max:40',
            'apellido2'            => 'nullable|string|max:40',
            'dni'                  => ['required', 'string', 'max:9',  Rule::unique('perfiles', 'dni')->ignore($perfil->id)],
            'num_seguridad_social' => ['required', 'string', 'max:12', Rule::unique('perfiles', 'num_seguridad_social')->ignore($perfil->id)],
            'telefono'             => 'required|string|max:15',
            'fecha_nacimiento'     => 'required|date|before:today',
            'localidad'            => 'required|string|max:100',
            'cuenta_bancaria'      => ['required', 'string', 'max:34'],
        ]);

        // except('user_id') excluye ese campo del update.
        // No queremos que un empleado pueda cambiar a qué user está vinculado su perfil.
        $perfil->update($request->except('user_id'));

        // Redirigimos a sitios diferentes según quién haya editado:
        //   - Si editó su propio perfil (y no es gestor): va al dashboard
        //   - Si es un gestor editando el perfil de otro: va a la lista de perfiles
        $destino = $perfil->user_id === auth()->id() && !in_array(auth()->user()->role, self::ROLES_GESTION)
            ? redirect()->route('dashboard')->with('success', 'Perfil actualizado correctamente.')
            : redirect()->route('perfiles.index')->with('success', 'Perfil actualizado correctamente.');

        return $destino;
    }

    public function destroy(Perfil $perfil): RedirectResponse
    {
        abort_if(!in_array(auth()->user()->role, self::ROLES_GESTION), 403);

        $perfil->delete();

        return redirect()->route('perfiles.index')
            ->with('success', 'Perfil eliminado correctamente.');
    }
}