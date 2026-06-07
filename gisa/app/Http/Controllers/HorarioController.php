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
        $allowed = ['inicio_turno', 'fin_turno', 'estado'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'inicio_turno';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';

        $user = auth()->user();

        $query = Horario::with('user.perfil')->orderBy($sort, $dir);

        // Si no es admin ni gerente, filtra solo sus horarios
        if (!in_array($user->role, ['admin', 'gerente'])) {
            $query->where('user_id', $user->id);
        }

        $horarios = $query->paginate(10)->appends($request->only('sort', 'dir'));

        return Inertia::render('Horarios/Index', [
            'horarios' => $horarios,
            'sort'     => $sort,
            'dir'      => $dir,
        ]);
    }
    public function create(): Response
    {
        $users = User::with('perfil')->get();

        return Inertia::render('Horarios/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
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

        $horario = Horario::create($data);

        try {
            $usuario = User::find($request->user_id);
            Mail::to($usuario->email)->send(new HorarioAsignado($usuario, $horario, 'asignado'));
        } catch (\Exception $e) {
            \Log::error("Email horario fallido para user {$request->user_id}: " . $e->getMessage());
        }

        return redirect()->route('horarios.index')
            ->with('success', 'Horario creado correctamente.');
    }

    public function edit(Horario $horario): Response
    {
        $users = User::with('perfil')->get();

        return Inertia::render('Horarios/Edit', [
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

        $horario->update($data);

        try {
            $usuario = User::find($request->user_id);
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