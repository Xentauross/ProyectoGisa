<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\HorarioAsignado;
use Illuminate\Support\Facades\Mail;

class HorarioController extends Controller
{
    public function index(Request $request): Response
    {
        // Solo permitimos ordenar por estas columnas para evitar
        // que alguien manipule la URL y ordene por campos internos.
        $allowed = ['inicio_turno', 'fin_turno', 'estado'];

        // Si el parámetro ?sort= viene en la URL y es válido lo usamos,
        // si no, usamos 'inicio_turno' como valor por defecto.
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'inicio_turno';

        // El parámetro ?dir= indica si ordenamos ascendente o descendente.
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';

        // Obtenemos el usuario que está logueado ahora mismo.
        $user = auth()->user();

        // Empezamos a construir la consulta SQL.
        // with('user.perfil') hace un JOIN automático (eager loading)
        // para traer los datos del empleado de cada horario en una sola
        // consulta, evitando el problema N+1.
        $query = Horario::with('user.perfil')->orderBy($sort, $dir);

        // Si el usuario NO es admin ni gerente, solo puede ver sus
        // propios horarios (filtramos por su user_id).
        if (!in_array($user->role, ['admin', 'gerente'])) {
            $query->where('user_id', $user->id);
        }

        // paginate(10) divide los resultados en páginas de 10 elementos.
        // appends() añade los parámetros de ordenación a los links de paginación
        // para que al cambiar de página no se pierda el orden elegido.
        $horarios = $query->paginate(10)->appends($request->only('sort', 'dir'));


        // Inertia::render() es como return view() de Laravel clásico,
        // pero en lugar de una plantilla Blade renderiza un componente React.
        // Los datos del segundo argumento llegan como props al componente.
        return Inertia::render('Horarios/Index', [
            'horarios' => $horarios,
            'sort'     => $sort,
            'dir'      => $dir,
        ]);
    }


    public function create(): Response
    {
        // Necesitamos la lista de usuarios para el <select> del formulario.
        // with('perfil') carga también su perfil (nombre, DNI, etc.).
        $users = User::with('perfil')->get();

        return Inertia::render('Horarios/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        // validate() comprueba que los datos del formulario sean correctos.
        // Si algo falla, Laravel redirige automáticamente al formulario
        // con los mensajes de error (que React muestra como $errors).
        $request->validate([
            'user_id'      => 'required|integer|exists:users,id',
            'inicio_turno' => 'required|date',
            'fin_turno'    => 'required|date|after:inicio_turno',
            'estado'       => 'required|in:pendiente,confirmado,cancelado',
        ]);

        // Preparamos los datos que vamos a guardar.
        $data = $request->only('user_id', 'estado');

        // Convertimos las fechas de zona horaria Madrid → UTC antes de guardar.
        // La BD siempre guarda en UTC; la conversión a Madrid se hace al mostrar.
        $data['inicio_turno'] = Carbon::parse($request->inicio_turno, 'Europe/Madrid')->utc();
        $data['fin_turno']    = Carbon::parse($request->fin_turno, 'Europe/Madrid')->utc();

        // Guardamos el nuevo registro en la tabla 'horarios'.
        $horario = Horario::create($data);

        // Intentamos enviar un email al empleado notificándole el nuevo turno.
        // Usamos try/catch para que si el email falla, la app no se rompa.
        try {
            $usuario = User::find($request->user_id);
            Mail::to($usuario->email)->send(new HorarioAsignado($usuario, $horario, 'asignado'));
        } catch (\Exception $e) {
            // Solo guardamos el error en el log, no lo mostramos al usuario.
            \Log::error("Email horario fallido para user {$request->user_id}: " . $e->getMessage());
        }

        // Redirigimos al listado con un mensaje flash de éxito.
        return redirect()->route('horarios.index')
            ->with('success', 'Horario creado correctamente.');
    }

    public function edit(Horario $horario): Response
    {
        // Laravel hace "Route Model Binding": detecta que el parámetro
        // se llama $horario y busca automáticamente el registro en BD
        // por el ID que viene en la URL. Si no existe, devuelve 404.
        $users = User::with('perfil')->get();

        return Inertia::render('Horarios/Edit', [
            // cargamos también el usuario relacionado
            'horario' => $horario->load('user'),
            'users'   => $users,
        ]);
    }

    public function update(Request $request, Horario $horario): RedirectResponse
    {
        $request->validate([
            'user_id'      => 'required|integer|exists:users,id',
            'inicio_turno' => 'required|date',
            'fin_turno'    => 'required|date|after:inicio_turno',
            'estado'       => 'required|in:pendiente,confirmado,cancelado',
        ]);

        $data = $request->only('user_id', 'estado');
        $data['inicio_turno'] = Carbon::parse($request->inicio_turno, 'Europe/Madrid')->utc();
        $data['fin_turno']    = Carbon::parse($request->fin_turno, 'Europe/Madrid')->utc();

        // update() modifica el registro que ya existe en la BD.
        $horario->update($data);

        try {
            $usuario = User::find($request->user_id);
            // Enviamos email indicando que el turno fue 'actualizado'.
            Mail::to($usuario->email)->send(new HorarioAsignado($usuario, $horario, 'actualizado'));
        } catch (\Exception $e) {
            \Log::error("Email horario actualizado fallido para user {$request->user_id}: " . $e->getMessage());
        }

        return redirect()->route('horarios.index')
            ->with('success', 'Horario actualizado correctamente.');
    }

    public function destroy(Horario $horario): RedirectResponse
    {
        $horario->delete();

        return redirect()->route('horarios.index')
            ->with('success', 'Horario eliminado correctamente.');
    }
}