<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Ingrediente;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $allowed = ['nombre', 'tipo', 'precio', 'es_recomendado'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'nombre';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $productos = Producto::with('ingredientes')
            ->orderBy($sort, $dir)
            ->paginate(10)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'sort'      => $sort,
            'dir'       => $dir,
        ]);
    }
    public function show(Producto $producto): Response
    {
    $producto->load('ingredientes');

    return Inertia::render('Productos/Show', [
        'producto' => $producto,
    ]);
    }

    public function create(): Response
    {
        $ingredientes = Ingrediente::orderBy('nombre')->get();

        return Inertia::render('Productos/Create', [
            'ingredientes' => $ingredientes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'tipo'           => 'required|in:plato,bebida',
            'nombre'         => 'required|string|max:40',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'url_imagen'     => 'nullable|url|max:150',
            'es_recomendado' => 'boolean',
            'alergeno'       => 'nullable|string|max:45',
            'ingredientes'   => 'nullable|array',
            'ingredientes.*' => 'integer|exists:ingredientes,id',
        ]);

        $producto = Producto::create($data);

        if (!empty($data['ingredientes'])) {
            $producto->ingredientes()->sync($data['ingredientes']);
        }

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function edit(Producto $producto): Response
    {
        $ingredientes = Ingrediente::orderBy('nombre')->get();

        return Inertia::render('Productos/Edit', [
            'producto'     => $producto->load('ingredientes'),
            'ingredientes' => $ingredientes,
        ]);
    }

    public function update(Request $request, Producto $producto): RedirectResponse
    {
        $data = $request->validate([
            'tipo'           => 'required|in:plato,bebida',
            'nombre'         => 'required|string|max:40',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'url_imagen'     => 'nullable|url|max:150',
            'es_recomendado' => 'boolean',
            'alergeno'       => 'nullable|string|max:45',
            'ingredientes'   => 'nullable|array',
            'ingredientes.*' => 'integer|exists:ingredientes,id',
        ]);

        $producto->update($data);
        $producto->ingredientes()->sync($data['ingredientes'] ?? []);

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado correctamente.');
    }
}