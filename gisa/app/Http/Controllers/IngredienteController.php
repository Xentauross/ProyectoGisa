<?php

namespace App\Http\Controllers;

use App\Models\Ingrediente;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class IngredienteController extends Controller
{
    public function index(Request $request): Response
    {
        $allowed = ['nombre', 'productos_count'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'nombre';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $ingredientes = Ingrediente::withCount('productos')
            ->orderBy($sort, $dir)
            ->paginate(20)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Ingredientes/Index', [
            'ingredientes' => $ingredientes,
            'sort'         => $sort,
            'dir'          => $dir,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Ingredientes/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:50|unique:ingredientes,nombre',
        ]);

        Ingrediente::create($request->only('nombre'));

        return redirect()->route('ingredientes.index')
            ->with('success', 'Ingrediente creado correctamente.');
    }

    public function edit(Ingrediente $ingrediente): Response
    {
        return Inertia::render('Ingredientes/Edit', [
            'ingrediente' => $ingrediente,
        ]);
    }

    public function update(Request $request, Ingrediente $ingrediente): RedirectResponse
    {
        $request->validate([
            'nombre' => [
                'required', 'string', 'max:50',
                Rule::unique('ingredientes', 'nombre')->ignore($ingrediente->id),
            ],
        ]);

        $ingrediente->update($request->only('nombre'));

        return redirect()->route('ingredientes.index')
            ->with('success', 'Ingrediente actualizado correctamente.');
    }

    public function destroy(Ingrediente $ingrediente): RedirectResponse
    {
        $ingrediente->delete();

        return redirect()->route('ingredientes.index')
            ->with('success', 'Ingrediente eliminado correctamente.');
    }
}
