<?php

// database/migrations/xxxx_xx_xx_xxxxxx_crear_tabla_producto_ingrediente.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla pivote Many-to-Many: un producto tiene muchos ingredientes y viceversa
        Schema::create('producto_ingrediente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('ingrediente_id')->constrained('ingredientes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producto_ingrediente');
    }
};