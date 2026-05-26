<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Mesa;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PedidoController extends Controller
{
    public function index(Request $request): Response
    {
        $allowed = ['id', 'mesa_id', 'camarero_id', 'estado', 'precio_total'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'id';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $pedidos = Pedido::with('mesa', 'camarero')
            ->orderBy($sort, $dir)
            ->paginate(20)
            ->appends($request->only('sort', 'dir'));
    
        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
            'sort'    => $sort,
            'dir'     => $dir,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pedidos/Create', [
            'mesas'     => Mesa::where('estado', 'libre')->orderBy('numero')->get(['id', 'numero']),
            'camareros' => User::whereIn('role', ['admin', 'metre', 'camarero'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'mesa_id'     => 'required|integer|exists:mesas,id',
            'camarero_id' => 'required|integer|exists:users,id',
            'estado'      => 'required|in:pendiente,listo,servido,pagado',
        ]);

        $pedido = Pedido::create([
            'mesa_id'     => $request->mesa_id,
            'camarero_id' => $request->camarero_id,
            'estado'      => $request->estado,
            'precio_total'=> 0,
        ]);

        Mesa::find($request->mesa_id)->update(['estado' => 'ocupada']);

        return redirect()->route('pedidos.edit', $pedido)
            ->with('success', 'Pedido creado. Añade los productos.');
    }

    public function edit(Pedido $pedido): Response
    {
        return Inertia::render('Pedidos/Edit', [
            'pedido'    => $pedido->load('mesa', 'camarero', 'lineas.producto'),
            'mesas'     => Mesa::orderBy('numero')->get(['id', 'numero']),
            'camareros' => User::whereIn('role', ['admin', 'metre', 'camarero'])->orderBy('name')->get(['id', 'name']),
            'productos' => Producto::orderBy('nombre')->get(['id', 'nombre', 'precio']),
        ]);
    }

    public function update(Request $request, Pedido $pedido): RedirectResponse
    {
        $request->validate([
            'mesa_id'     => 'required|integer|exists:mesas,id',
            'camarero_id' => 'required|integer|exists:users,id',
            'estado'      => 'required|in:pendiente,listo,servido,pagado',
        ]);

        $pedido->update($request->only('mesa_id', 'camarero_id', 'estado'));

        if (in_array($request->estado, ['pagado', 'servido'])) {
            $pedido->mesa->update(['estado' => 'libre']);
        }

        return redirect()->route('pedidos.index')
            ->with('success', 'Pedido actualizado correctamente.');
    }

    public function destroy(Pedido $pedido): RedirectResponse
    {
        $pedido->mesa->update(['estado' => 'libre']);
        $pedido->delete();

        return redirect()->route('pedidos.index')
            ->with('success', 'Pedido eliminado correctamente.');
    }

    // Añadir línea al pedido
    public function addLinea(Request $request, Pedido $pedido): RedirectResponse
    {
        $request->validate([
            'producto_id' => 'required|integer|exists:productos,id',
            'cantidad'    => 'required|integer|min:1',
            'notas'       => 'nullable|string|max:200',
        ]);

        // Buscamos el producto para obtener su precio actual
        $producto = Producto::findOrFail($request->producto_id);

        //Guardamos la línea con el precio histórico
        $pedido->lineas()->create([
            'producto_id'     => $request->producto_id,
            'cantidad'        => $request->cantidad,
            'precio_unitario' => $producto->precio,
            'notas'           => $request->notas,
        ]);

        // Recalculamos usando el precio de la línea, no el del producto
        $total = $pedido->lineas()->get()->sum(fn($l) => $l->cantidad * $l->precio_unitario);
        $pedido->update(['precio_total' => $total]);

        return redirect()->route('pedidos.edit', $pedido);
    }

    // Eliminar línea del pedido
    public function removeLinea(Pedido $pedido, $lineaId): RedirectResponse
    {
        $pedido->lineas()->findOrFail($lineaId)->delete();

        $total = $pedido->lineas()->get()->sum(fn($l) => $l->cantidad * $l->precio_unitario);
        $pedido->update(['precio_total' => $total]);

        return redirect()->route('pedidos.edit', $pedido);
    }
}