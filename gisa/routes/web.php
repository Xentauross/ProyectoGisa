<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\IngredienteController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -------------------------------------------------------
// Página de bienvenida pública
// -------------------------------------------------------
Route::get('/', function () {
    $productos    = \App\Models\Producto::with('ingredientes')->get();
    $recomendados = $productos->where('es_recomendado', true)->take(6)->values();
    $masVendidos  = $productos->sortByDesc(fn($p) => $p->lineas()->sum('cantidad'))->take(6)->values();
    $ingredientes = \App\Models\Ingrediente::orderBy('nombre')->get(['id', 'nombre']);
 
    return Inertia::render('Welcome', [
        'canLogin'     => Route::has('login'),
        'canRegister'  => Route::has('register'),
        'productos'    => $productos->values(),
        'recomendados' => $recomendados,
        'masVendidos'  => $masVendidos,
        'ingredientes' => $ingredientes,
    ]);
});

// -------------------------------------------------------
// Dashboard
// -------------------------------------------------------
Route::get('/dashboard', function () {
    $user = auth()->user()->load([
        'perfil',
        'horarios' => fn($q) => $q->orderBy('inicio_turno', 'asc'),
    ]);
 
    return Inertia::render('Dashboard', [
        'miPerfil'    => $user->perfil,
        'misHorarios' => $user->horarios,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// -------------------------------------------------------
// Perfil de Breeze (nombre/email del usuario logueado)
// -------------------------------------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -------------------------------------------------------
// Admin / Gerente: usuarios, perfiles, horarios, mesas, productos
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,gerente'])->group(function () {
    Route::resource('usuarios', UsuarioController::class);
    Route::resource('perfiles', PerfilController::class)->parameters(['perfiles' => 'perfil']);
    Route::resource('horarios', HorarioController::class);
    Route::resource('mesas',    MesaController::class);
    Route::resource('productos', ProductoController::class);
    Route::resource('ingredientes', IngredienteController::class)->except(['show']);
});

// -------------------------------------------------------
// Admin + Metre + Camarero: pedidos
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,metre,camarero'])->group(function () {
    Route::resource('pedidos', PedidoController::class);

    Route::post('pedidos/{pedido}/lineas',           [PedidoController::class, 'addLinea'])->name('pedidos.addLinea');
    Route::delete('pedidos/{pedido}/lineas/{linea}', [PedidoController::class, 'removeLinea'])->name('pedidos.removeLinea');
});

// -------------------------------------------------------
// Modificar los turnos
// -------------------------------------------------------
Route::patch('mis-turnos/{horario}', function (\Illuminate\Http\Request $request, \App\Models\Horario $horario) {
    // Solo puede tocar sus propios turnos
    abort_if($horario->user_id !== auth()->id(), 403);
 
    $request->validate([
        'estado'       => 'required|in:pendiente,confirmado,cancelado',
        'inicio_turno' => 'nullable|date',
        'fin_turno'    => 'nullable|date|after_or_equal:inicio_turno',
    ]);
 
    $horario->update($request->only('estado', 'inicio_turno', 'fin_turno'));
 
    return back()->with('success', 'Turno actualizado.');
})->middleware(['auth', 'verified'])->name('mis-turnos.update');

// -------------------------------------------------------
// Rutas de autenticación de Breeze
// -------------------------------------------------------

Route::get('/register',  fn() => redirect('/login'))->name('register');
Route::post('/register', fn() => redirect('/login'));

require __DIR__.'/auth.php';