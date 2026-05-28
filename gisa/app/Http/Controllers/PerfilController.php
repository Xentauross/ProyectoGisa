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
    public function index(Request $request): Response
    {
        $allowed = ['nombre', 'apellido1', 'dni', 'telefono', 'num_seguridad_social', 'cuenta_bancaria'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'nombre';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $perfiles = Perfil::with('user')
            ->orderBy($sort, $dir)
            ->paginate(20)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Perfiles/Index', [
            'perfiles' => $perfiles,
            'sort'     => $sort,
            'dir'      => $dir,
        ]);
    }

    public function create(): Response
    {
        // Solo usuarios que aún no tienen perfil
        $users = User::doesntHave('perfil')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Perfiles/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
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
            'cuenta_bancaria'      => 'required|string|max:34|unique:perfiles,cuenta_bancaria',
        ]);

        Perfil::create($request->all());

        return redirect()->route('perfiles.index')
            ->with('success', 'Perfil creado correctamente.');
    }

    public function show(Perfil $perfil): Response
    {
        $perfil->load('user');  // carga la relación en el modelo
        return Inertia::render('Perfiles/Show', [
            'perfil' => $perfil,  // ahora manda el modelo ya con la relación cargada
        ]);
    }

    public function edit(Perfil $perfil): Response
    {
        // Permite al propio usuario o a admin/gerente
        abort_if(
            $perfil->user_id !== auth()->id() && !in_array(auth()->user()->role, ['admin', 'gerente', 'aux_administrativo']),
            403
        );

        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Perfiles/Edit', [
            'perfil' => $perfil->load('user'),
            'users'  => $users,
        ]);
    }

    public function update(Request $request, Perfil $perfil): RedirectResponse
    {
        // Permite al propio usuario o a admin/gerente
        abort_if(
            $perfil->user_id !== auth()->id() && !in_array(auth()->user()->role, ['admin', 'gerente', 'aux_administrativo']),
            403
        );

        $request->validate([
            'nombre'               => 'required|string|max:40',
            'apellido1'            => 'required|string|max:40',
            'apellido2'            => 'nullable|string|max:40',
            'dni'                  => ['required', 'string', 'max:9',  Rule::unique('perfiles', 'dni')->ignore($perfil->id)],
            'num_seguridad_social' => ['required', 'string', 'max:12', Rule::unique('perfiles', 'num_seguridad_social')->ignore($perfil->id)],
            'telefono'             => 'required|string|max:15',
            'fecha_nacimiento'     => 'required|date|before:today',
            'localidad'            => 'required|string|max:100',
            'cuenta_bancaria'      => ['required', 'string', 'max:34', Rule::unique('perfiles', 'cuenta_bancaria')->ignore($perfil->id)],
        ]);

        // Usa only() sin user_id para que nunca se pueda cambiar
        $perfil->update($request->except('user_id'));

        // Redirige según quién actualizó
        $destino = $perfil->user_id === auth()->id() && !in_array(auth()->user()->role, ['admin', 'gerente', 'aux_administrativo'])
            ? redirect()->route('dashboard')->with('success', 'Perfil actualizado correctamente.')
            : redirect()->route('perfiles.index')->with('success', 'Perfil actualizado correctamente.');

        return $destino;
    }   

    public function destroy(Perfil $perfil): RedirectResponse
    {
        $perfil->delete();

        return redirect()->route('perfiles.index')
            ->with('success', 'Perfil eliminado correctamente.');
    }
}