<?php

// database/migrations/xxxx_xx_xx_xxxxxx_crear_tabla_productos.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['plato', 'bebida']);
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 8, 2);
            $table->string('url_imagen')->nullable();
            $table->boolean('es_recomendado')->default(false);
            $table->string('alergeno');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
