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
        // Whitelist de columnas por las que se puede ordenar.
        // Si el usuario manipula la URL con una columna que no está aquí,
        // se usa 'created_at' por defecto. SEGURIDAD: evita SQL injection.
        $allowed = ['name', 'email', 'role', 'created_at', 'nombre'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'created_at';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        // Preparamos la consulta base.
        // with('perfil') hace eager loading: carga el perfil de cada usuario
        // en UNA sola query extra (evita el problema N+1).
        // leftJoin con 'perfiles' nos permite ordenar por columnas del perfil
        // (como 'nombre') aunque estén en otra tabla.
        $query = User::with('perfil')
            ->leftJoin('perfiles', 'users.id', '=', 'perfiles.user_id')
            ->select('users.*');
    
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
        // Pasamos los roles disponibles para rellenar el <select>
        // self::roles() llama al método privado de esta misma clase
        return Inertia::render('Usuarios/Create', [
            'roles' => self::roles(),
        ]);
    }

public function store(Request $request): RedirectResponse
{
    // VALIDACIÓN: si alguna regla falla, Laravel redirige automáticamente
    // al formulario con los errores. El código de abajo NO se ejecuta.

    // Rule::in() valida que el valor esté entre las claves del array de roles.
    // Así evitamos que alguien envíe un rol inventado.
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

    // Extraemos los datos que necesitamos para generar el username
    $nombre    = $request->nombre;
    $apellido1 = $request->apellido1;
    $apellido2 = $request->apellido2 ?? '';
    $dni       = $request->dni;

    // Generamos el username siguiendo la lógica del método privado generarUsername()
    // Ejemplo: nombre=Juan, apellido1=García, apellido2=López, dni=12345678A
    // → JGAR López→LOP 678 → JGARLÓ...
    $username         = self::generarUsername($nombre, $apellido1, $apellido2, $dni);

    // Generamos una contraseña temporal aleatoria de 10 caracteres
    // Str::random() genera letras y números aleatorios. Ej: "xK9mPqRt2N"
    $passwordTemporal = Str::random(10);

    // ── Crear usuario y perfil en una transacción ──────────────────────
    $usuario = \DB::transaction(function () use ($request, $nombre, $apellido1, $apellido2, $dni, $username, $passwordTemporal) {
        $usuario = User::create([
            'name'     => $username,
            'email'    => $request->email,
            'password' => Hash::make($passwordTemporal),
            'role'     => $request->role,
        ]);

        // Creamos el registro en la tabla 'perfiles', vinculado al usuario por user_id
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

        // Devolvemos el usuario creado para usarlo fuera de la transacción
        return $usuario;
    });

    // ── ENVÍO DE EMAIL (fuera de la transacción) ──────────
    // El email se envía DESPUÉS de que la transacción haya terminado con éxito.
    // Si el email falla, NO queremos deshacer la creación del usuario.
    // Por eso usamos try/catch: si falla el email, registramos el error en el log
    // pero el usuario queda creado igualmente.
    $emailEnviado = true;
    try {
        Mail::to($usuario->email)
            ->send(new BienvenidaEmpleado($usuario, $passwordTemporal));
    } catch (\Exception $e) {
        $emailEnviado = false;
        \Log::error("Email bienvenida fallido para {$usuario->email}: " . $e->getMessage());
    }

    // Mensaje de éxito diferente según si el email se envió o no.
    // Si no se envió, mostramos la contraseña temporal en el flash message
    // para que el admin se la pueda dar manualmente al empleado.
    $mensaje = $emailEnviado
        ? "Usuario {$username} creado. Credenciales enviadas a {$usuario->email}."
        : "Usuario {$username} creado, pero el email no pudo enviarse. Contraseña temporal: {$passwordTemporal}";

    // Redirigimos al listado con el mensaje flash de éxito
    // with('success', ...) guarda el mensaje en la sesión una sola vez
    return redirect()->route('usuarios.index')->with('success', $mensaje);
    }

    public function show(User $usuario): Response
    {
        return Inertia::render('Usuarios/Show', [
            // load() hace lazy loading: carga perfil y horarios en este momento.
            // Equivale a hacer las queries ahora en vez de al acceder a la propiedad.
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

    // NOTA: en edición solo se permite cambiar email y rol.
    // Los datos del perfil (nombre, DNI, etc.) se editan
    // desde PerfilController, no desde aquí.
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

    // ══════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES PRIVADOS
    // Son 'private static' porque:
    //   - private: solo se usan dentro de este controlador
    //   - static: no necesitan instanciar la clase (se llaman con self::)
    // ══════════════════════════════════════════════════════════

    /**
     * Genera un username único a partir de los datos personales.
     *
     * Fórmula:
     *   - 1ª letra del nombre (mayúscula)
     *   - 3 primeras letras del apellido1 (mayúsculas)
     *   - 3 primeras letras del apellido2 (mayúsculas)
     *   - últimos 3 caracteres del DNI (posiciones 5,6,7 → ej: "678" de "12345678A")
     *
     * Ejemplo:
     *   nombre="Juan", apellido1="García", apellido2="López", dni="12345678A"
     *   → J + GAR + LÓP + 678 = "JGARLÓP678"
     *
     * Si el username ya existe en la BD (dos personas con los mismos datos),
     * añade un número incremental: "JGARLÓP6781", "JGARLÓP6782", etc.
     */
    private static function generarUsername(string $nombre, string $apellido1, string $apellido2, string $dni): string
    {
        // 1ª letra del nombre + 3 primeras del apellido1 + 3 primeras del apellido2 + 3 últimos numeros del DNI
        $parte1 = Str::upper(Str::substr($nombre,    0, 1));
        $parte2 = Str::upper(Str::substr($apellido1, 0, 3));
        $parte3 = Str::upper(Str::substr($apellido2, 0, 3));
        $parte4 = Str::upper(Str::substr($dni, 5,8));

        $username = $parte1 . $parte2 . $parte3 . $parte4;

        // Comprobamos si el username ya existe en la BD.
        // Si existe, añadimos un número hasta encontrar uno libre.
        $base  = $username;
        $i     = 1;
        while (User::where('name', $username)->exists()) {
            $username = $base . $i;
            $i++;
        }

        return $username;
    }

    /**
     * Lista de roles disponibles en la aplicación.
     * Formato: ['clave' => 'Etiqueta visible']
     *
     * Se usa en:
     *   - Los formularios de create/edit (para el <select> de roles)
     *   - La validación (Rule::in(array_keys(...))) para asegurar que el rol sea válido
     */
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