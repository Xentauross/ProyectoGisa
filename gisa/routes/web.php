<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\IngredienteController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ═══════════════════════════════════════════════════════
// PÚBLICA
// ═══════════════════════════════════════════════════════

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
})->name('home');

// Deshabilitar registro público
Route::get('/register',  fn() => redirect('/login'))->name('register');
Route::post('/register', fn() => redirect('/login'));

// ═══════════════════════════════════════════════════════
// AUTENTICADO — cualquier rol
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        $user = auth()->user()->load([
            'perfil',
            'horarios' => fn($q) => $q->orderBy('inicio_turno', 'asc'),
        ]);

        return Inertia::render('Dashboard', [
            'miPerfil'    => $user->perfil,
            'misHorarios' => $user->horarios,
        ]);
    })->name('dashboard');

    // Perfil Breeze (cuenta propia)
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Turnos propios
    Route::patch('mis-turnos/{horario}', function (Request $request, \App\Models\Horario $horario) {
        abort_if($horario->user_id !== auth()->id(), 403);

        $request->validate([
            'estado'       => 'required|in:pendiente,confirmado,cancelado',
            'inicio_turno' => 'nullable|date',
            'fin_turno'    => 'nullable|date|after_or_equal:inicio_turno',
        ]);

        $horario->update($request->only('estado', 'inicio_turno', 'fin_turno'));

        return back()->with('success', 'Turno actualizado.');
    })->name('mis-turnos.update');

    // Perfil propio (cualquier usuario puede editar el suyo)
    Route::get('perfiles/{perfil}/edit', [PerfilController::class, 'edit'])->name('perfiles.edit');
    Route::patch('perfiles/{perfil}',    [PerfilController::class, 'update'])->name('perfiles.update');
});

// ═══════════════════════════════════════════════════════
// ADMINISTRACIÓN — admin + gerente
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified', 'role:admin,gerente'])->group(function () {

    // Usuarios
    Route::resource('usuarios', UsuarioController::class);
    Route::get('/usuarios/crear', [RegisteredUserController::class, 'create'])->name('usuarios.crear');

    // Horarios
    Route::resource('horarios', HorarioController::class);

    // Catálogo
    Route::resource('productos',    ProductoController::class);
    Route::resource('ingredientes', IngredienteController::class)->except(['show']);

    // Mesas — CRUD completo
    Route::resource('mesas', MesaController::class);

    // Pedidos — CRUD completo
    Route::resource('pedidos', PedidoController::class);
    Route::post('pedidos/{pedido}/lineas',           [PedidoController::class, 'addLinea'])->name('pedidos.addLinea');
    Route::delete('pedidos/{pedido}/lineas/{linea}', [PedidoController::class, 'removeLinea'])->name('pedidos.removeLinea');

    // Perfiles — CRUD completo + crear
    Route::resource('perfiles', PerfilController::class)
        ->parameters(['perfiles' => 'perfil']);
});

// ═══════════════════════════════════════════════════════
// ADMINISTRACIÓN — aux_administrativo
// Puede ver y editar perfiles, pero no crear ni eliminar
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified', 'role:aux_administrativo'])->group(function () {
    Route::resource('perfiles', PerfilController::class)
        ->parameters(['perfiles' => 'perfil'])
        ->only(['index', 'show', 'edit', 'update']);
});

// ═══════════════════════════════════════════════════════
// SALA — metre
// Acceso completo a mesas y pedidos
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified', 'role:metre'])->group(function () {

    // Mesas — ver + editar
    Route::resource('mesas', MesaController::class)
        ->only(['index', 'show', 'edit', 'update']);

    // Pedidos — CRUD completo + líneas
    Route::resource('pedidos', PedidoController::class);
    Route::post('pedidos/{pedido}/lineas',           [PedidoController::class, 'addLinea'])->name('pedidos.addLinea');
    Route::delete('pedidos/{pedido}/lineas/{linea}', [PedidoController::class, 'removeLinea'])->name('pedidos.removeLinea');
});

// ═══════════════════════════════════════════════════════
// SALA — camarero
// Ver y editar mesas
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified', 'role:camarero'])->group(function () {
    Route::resource('mesas', MesaController::class)
        ->only(['index', 'show', 'edit', 'update']);
});

// ═══════════════════════════════════════════════════════
// COCINA — jefe_cocina + cocinero
// Ver y editar estado de pedidos
// ═══════════════════════════════════════════════════════

Route::middleware(['auth', 'verified', 'role:jefe_cocina,cocinero'])->group(function () {
    Route::resource('pedidos', PedidoController::class)
        ->only(['index', 'show', 'edit', 'update']);
});

// ═══════════════════════════════════════════════════════
// AUTH (Breeze)
// ═══════════════════════════════════════════════════════

require __DIR__.'/auth.php';