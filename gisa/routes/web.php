<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -------------------------------------------------------
// Página de bienvenida pública
// -------------------------------------------------------
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

// -------------------------------------------------------
// Dashboard
// -------------------------------------------------------
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
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
    Route::resource('perfiles', PerfilController::class);
    Route::resource('horarios', HorarioController::class);
    Route::resource('mesas',    MesaController::class);
    Route::resource('productos', ProductoController::class);
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
// Rutas de autenticación de Breeze
// -------------------------------------------------------
require __DIR__.'/auth.php';