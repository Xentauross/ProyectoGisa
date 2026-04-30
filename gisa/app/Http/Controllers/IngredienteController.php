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
    public function index(): Response
    {
        $ingredientes = Ingrediente::withCount('productos')->orderBy('nombre')->paginate(20);

        return Inertia::render('Ingredientes/Index', [
            'ingredientes' => $ingredientes,
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
