<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MesaController extends Controller
{
    public function index(): Response
    {
        $mesas = Mesa::orderBy('numero')->paginate(20);

        return Inertia::render('Mesas/Index', [
            'mesas' => $mesas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Mesas/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'numero' => 'required|integer|min:1|unique:mesas,numero',
            'estado' => 'required|in:libre,ocupada',
        ]);

        Mesa::create($request->only('numero', 'estado'));

        return redirect()->route('mesas.index')
            ->with('success', 'Mesa creada correctamente.');
    }

    public function edit(Mesa $mesa): Response
    {
        return Inertia::render('Mesas/Edit', [
            'mesa' => $mesa,
        ]);
    }

    public function update(Request $request, Mesa $mesa): RedirectResponse
    {
        $request->validate([
            'numero' => 'required|integer|min:1|unique:mesas,numero,' . $mesa->id,
            'estado' => 'required|in:libre,ocupada',
        ]);

        $mesa->update($request->only('numero', 'estado'));

        return redirect()->route('mesas.index')
            ->with('success', 'Mesa actualizada correctamente.');
    }

    public function destroy(Mesa $mesa): RedirectResponse
    {
        $mesa->delete();

        return redirect()->route('mesas.index')
            ->with('success', 'Mesa eliminada correctamente.');
    }
}