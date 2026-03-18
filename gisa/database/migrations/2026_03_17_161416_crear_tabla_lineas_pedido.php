<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lineas_pedido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')
                  ->constrained('pedidos')
                  ->onDelete('cascade');

            // restrict: no se puede borrar un producto con líneas de pedido históricas
            $table->foreignId('producto_id')
                  ->constrained('productos')
                  ->onDelete('restrict');

            $table->integer('cantidad')->default(1);
            $table->string('notas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lineas_pedido');
    }
};