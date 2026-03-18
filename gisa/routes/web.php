<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -------------------------------------------------------
// Rutas públicas de Breeze 
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
// Dashboard — redirige según rol tras login
// -------------------------------------------------------
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// -------------------------------------------------------
// Perfil de Breeze 
// -------------------------------------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -------------------------------------------------------
// Solo admin: gestión de usuarios y perfiles
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,gerente'])->group(function () {
    Route::resource('usuarios', UsuarioController::class);
});

// -------------------------------------------------------
// Admin + metre: horarios, mesas y productos
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,gerente'])->group(function () {
    Route::resource('horarios', HorarioController::class);
    Route::resource('mesas', MesaController::class);
    Route::resource('productos', ProductoController::class);
});

// -------------------------------------------------------
// Admin + metre + camarero: gestión de pedidos
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,metre,camarero'])->group(function () {
    Route::resource('pedidos', PedidoController::class)->except(['destroy']);
});

// -------------------------------------------------------
// Todos los roles: ver pedidos activos y turnos propios
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'role:admin,metre,camarero'])->group(function () {
    Route::get('pedidos',                   [PedidoController::class,  'index'])    ->name('pedidos.index');
    Route::get('horarios/mis-turnos',       [HorarioController::class, 'misTurnos'])->name('horarios.mis-turnos');

    // Cambio de estado según rol (la lógica de qué rol puede qué estado va en el Controller/Policy)
    Route::patch('pedidos/{pedido}/estado', [PedidoController::class,  'cambiarEstado'])->name('pedidos.estado');
});

// -------------------------------------------------------
// Rutas de autenticación de Breeze
// -------------------------------------------------------
require __DIR__.'/auth.php';
