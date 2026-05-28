<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MesaController extends Controller
{
    public function index(Request $request): Response
    {
        $allowed = ['numero', 'estado'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'numero';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $mesas = Mesa::orderBy($sort, $dir)
            ->paginate(10)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Mesas/Index', [
            'mesas' => $mesas,
            'sort'  => $sort,
            'dir'   => $dir,
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
            'estado' => 'required|in:libre,ocupada,reservada',
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
            'estado' => 'required|in:libre,ocupada,reservada',
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