<?php

// database/migrations/xxxx_xx_xx_xxxxxx_crear_tabla_pedidos.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesa_id')->constrained('mesas')->onDelete('cascade');
            $table->foreignId('camarero_id')->constrained('users');
            $table->enum('estado', ['pendiente', 'listo', 'servido', 'pagado'])->default('pendiente');
            $table->decimal('precio_total', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};