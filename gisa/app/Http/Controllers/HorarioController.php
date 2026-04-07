<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HorarioController extends Controller
{
    public function index(): Response
    {
        $horarios = Horario::with('user')->latest('inicio_turno')->paginate(20);

        return Inertia::render('Horarios/Index', [
            'horarios' => $horarios,
        ]);
    }

    public function create(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name']);

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

        Horario::create($request->only('user_id', 'inicio_turno', 'fin_turno', 'estado'));

        return redirect()->route('horarios.index')
            ->with('success', 'Horario creado correctamente.');
    }

    public function edit(Horario $horario): Response
    {
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Horarios/Edit', [
            'horario' => $horario,
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

        $horario->update($request->only('user_id', 'inicio_turno', 'fin_turno', 'estado'));

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