<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Ingrediente;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{

    /**
     * __invoke() se llama cuando el controlador se usa como callable.
     * Permite registrarlo en routes/web.php como: Route::get('/', WelcomeController::class)
     * sin tener que especificar el método: Route::get('/', [WelcomeController::class, 'index'])
     */
    public function __invoke(): Response
    {
        // ── 1. TODOS LOS PRODUCTOS con sus ingredientes ────────
        // with('ingredientes') es "eager loading": carga todos los ingredientes
        // de todos los productos en UNA sola query adicional (JOIN).
        // Sin él, Laravel haría una query por cada producto (N+1 problem).
        $productos = Producto::with('ingredientes')->get();

        // ── 2. RECOMENDADOS ────────────────────────────────────
        // Filtramos del array ya cargado (sin nueva query a la BD).
        // where() en colecciones de Laravel funciona como array_filter.
        $recomendados = $productos
            ->where('es_recomendado', true)
            ->take(5)
            ->values();

        // ── 3. MÁS VENDIDOS ────────────────────────────────────
        // Esta es la query más inteligente del controlador.
        // withSum('lineas', 'cantidad') calcula la suma de lineas.cantidad
        // para cada producto en UNA sola query con GROUP BY.
        // Sin esto, necesitaríamos una query por producto para contar sus pedidos.
        $masVendidos = Producto::withSum('lineas', 'cantidad')
            ->orderByDesc('lineas_sum_cantidad')
            ->take(5)
            ->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                // Añadimos el campo 'pedidos' con el total calculado.
                // (int) convierte null a 0 si el producto nunca fue pedido.
                'pedidos' => (int) ($p->lineas_sum_cantidad ?? 0),
            ]));

        // ── 4. INGREDIENTES para el selector del sidebar ───────
        // Solo necesitamos id y nombre (no el resto de campos).
        // orderBy para mostrarlos alfabéticamente en el dropdown.
        $ingredientes = Ingrediente::orderBy('nombre')->get(['id', 'nombre']);


        // ── 5. RESPUESTA con Inertia ───────────────────────────
        // Inertia::render() devuelve el componente React 'Welcome'
        // con los datos como props. El componente React los recibe
        // automáticamente como argumentos de función.
        return Inertia::render('Welcome', [
            'canLogin'     => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister'  => \Illuminate\Support\Facades\Route::has('register'),
            
            // Transformamos la colección a array y añadimos los alérgenos.
            // $p->alergenos es un atributo cast en el modelo (array JSON en BD).
            'productos'    => $productos->map(fn($p) => array_merge($p->toArray(), [
                'alergenos' => $p->alergenos,
            ]))->values(),
            'recomendados' => $recomendados,
            'masVendidos'  => $masVendidos,
            'ingredientes' => $ingredientes,
        ]);
    }
}