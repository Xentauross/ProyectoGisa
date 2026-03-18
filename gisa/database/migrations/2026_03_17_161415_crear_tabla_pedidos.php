<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            // restrict: no se puede borrar una mesa con pedidos históricos asociados
            $table->foreignId('mesa_id')
                  ->constrained('mesas')
                  ->onDelete('restrict');

            // restrict: no se puede borrar un camarero con pedidos asociados
            $table->foreignId('camarero_id')
                  ->constrained('users')
                  ->onDelete('restrict');

            $table->enum('estado', ['pendiente', 'listo', 'servido', 'pagado'])
                  ->default('pendiente');
            $table->decimal('precio_total', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};