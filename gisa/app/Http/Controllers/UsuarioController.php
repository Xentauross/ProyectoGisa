<?php

namespace App\Http\Controllers;

use App\Mail\BienvenidaEmpleado;
use App\Models\User;
use App\Models\Perfil;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
public function index(Request $request): Response
    {
        // Añadimos lista de columnas permitidas
        $allowed = ['name', 'email', 'role', 'created_at', 'nombre'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'created_at';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        // Preparamos la consulta base uniendo la tabla perfiles
        $query = User::with('perfil')
            ->leftJoin('perfiles', 'users.id', '=', 'perfiles.user_id')
            ->select('users.*'); //Elegimos solo users.* para que el 'id' de perfil no machaque al 'id' de usuario
    
        // Aplicamos el orden dependiendo de si es un campo de perfil o de usuario
        if ($sort === 'nombre') {
            $query->orderBy('perfiles.nombre', $dir);
        } else {
            $query->orderBy("users.{$sort}", $dir);
        }
    
        // Paginamos
        $usuarios = $query->paginate(10)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'sort'     => $sort,
            'dir'      => $dir,
        ]);
    }
    public function create(): Response
    {
        return Inertia::render('Usuarios/Create', [
            'roles' => self::roles(),
        ]);
    }

public function store(Request $request): RedirectResponse
{
    $request->validate([
        'nombre'               => 'required|string|max:40',
        'apellido1'            => 'required|string|max:40',
        'apellido2'            => 'nullable|string|max:40',
        'dni'                  => 'required|string|max:9|unique:perfiles,dni',
        'email'                => 'required|email|max:100|unique:users,email',
        'num_seguridad_social' => 'required|string|max:12|unique:perfiles,num_seguridad_social',
        'telefono'             => 'required|string|max:15',
        'fecha_nacimiento'     => 'required|date|before:today',
        'localidad'            => 'required|string|max:100',
        'cuenta_bancaria'      => 'required|string|max:34|unique:perfiles,cuenta_bancaria',
        'role'                 => ['required', Rule::in(array_keys(self::roles()))],
    ]);

    $nombre    = $request->nombre;
    $apellido1 = $request->apellido1;
    $apellido2 = $request->apellido2 ?? '';
    $dni       = $request->dni;

    $username         = self::generarUsername($nombre, $apellido1, $apellido2, $dni);
    $passwordTemporal = Str::random(10);

    // ── Crear usuario y perfil en una transacción ──────────────────────
    $usuario = \DB::transaction(function () use ($request, $nombre, $apellido1, $apellido2, $dni, $username, $passwordTemporal) {
        $usuario = User::create([
            'name'     => $username,
            'email'    => $request->email,
            'password' => Hash::make($passwordTemporal),
            'role'     => $request->role,
        ]);

        Perfil::create([
            'user_id'              => $usuario->id,
            'nombre'               => $nombre,
            'apellido1'            => $apellido1,
            'apellido2'            => $apellido2 ?: null,
            'dni'                  => $dni,
            'num_seguridad_social' => $request->num_seguridad_social,
            'telefono'             => $request->telefono,
            'fecha_nacimiento'     => $request->fecha_nacimiento,
            'localidad'            => $request->localidad,
            'cuenta_bancaria'      => $request->cuenta_bancaria,
        ]);

        return $usuario;
    });

    // ── Enviar email (fallo no crítico) ────────────────────────────────
    $emailEnviado = true;
    try {
        Mail::to($usuario->email)
            ->send(new BienvenidaEmpleado($usuario, $passwordTemporal));
    } catch (\Exception $e) {
        $emailEnviado = false;
        \Log::error("Email bienvenida fallido para {$usuario->email}: " . $e->getMessage());
    }

    $mensaje = $emailEnviado
        ? "Usuario {$username} creado. Credenciales enviadas a {$usuario->email}."
        : "Usuario {$username} creado, pero el email no pudo enviarse. Contraseña temporal: {$passwordTemporal}";

    return redirect()->route('usuarios.index')->with('success', $mensaje);
    }

    public function show(User $usuario): Response
    {
        return Inertia::render('Usuarios/Show', [
            'usuario' => $usuario->load('perfil', 'horarios'),
        ]);
    }

    public function edit(User $usuario): Response
    {
        return Inertia::render('Usuarios/Edit', [
            'usuario' => $usuario->load('perfil'),
            'roles'   => self::roles(),
        ]);
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($usuario->id)],
            'role'  => ['required', Rule::in(array_keys(self::roles()))],
        ]);

        $usuario->update([
            'email' => $request->email,
            'role'  => $request->role,
        ]);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $usuario): RedirectResponse
    {
        abort_if($usuario->id === auth()->id(), 403, 'No puedes eliminarte a ti mismo.');

        $usuario->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static function generarUsername(string $nombre, string $apellido1, string $apellido2, string $dni): string
    {
        // 1ª letra del nombre + 3 primeras del apellido1 + 3 primeras del apellido2 + 3 últimos numeros del DNI
        $parte1 = Str::upper(Str::substr($nombre,    0, 1));
        $parte2 = Str::upper(Str::substr($apellido1, 0, 3));
        $parte3 = Str::upper(Str::substr($apellido2, 0, 3));
        $parte4 = Str::upper(Str::substr($dni, 5,8));

        $username = $parte1 . $parte2 . $parte3 . $parte4;

        // Si el username ya existe, añadir un número incremental
        $base  = $username;
        $i     = 1;
        while (User::where('name', $username)->exists()) {
            $username = $base . $i;
            $i++;
        }

        return $username;
    }

    private static function roles(): array
    {
        return [
            'admin'       => 'Administrador',
            'gerente'     => 'Gerente',
            'metre'       => 'Metre',
            'camarero'    => 'Camarero',
            'jefe_cocina' => 'Jefe de cocina',
            'cocinero'    => 'Cocinero',
            'aux_administrativo'    => 'Auxiliar Administrativo',
        ];
    }
}