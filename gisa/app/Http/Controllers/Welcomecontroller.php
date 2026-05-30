<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Ingrediente;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(): Response
    {
        $productos = Producto::with('ingredientes')->get();

        $recomendados = $productos
            ->where('es_recomendado', true)
            ->take(6)
            ->values();

        // 1 sola query en lugar de N queries (una por producto)
        $masVendidos = Producto::withSum('lineas', 'cantidad')
            ->orderByDesc('lineas_sum_cantidad')
            ->take(6)
            ->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'pedidos' => (int) ($p->lineas_sum_cantidad ?? 0),
            ]));

        $ingredientes = Ingrediente::orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Welcome', [
            'canLogin'     => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister'  => \Illuminate\Support\Facades\Route::has('register'),
            'productos'    => $productos->map(fn($p) => array_merge($p->toArray(), [
                'alergenos' => $p->alergenos,
            ]))->values(),
            'recomendados' => $recomendados,
            'masVendidos'  => $masVendidos,
            'ingredientes' => $ingredientes,
        ]);
    }
}