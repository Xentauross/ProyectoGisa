<?php
// database/migrations/0001_01_01_000001_crear_tabla_perfiles.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfiles', function (Blueprint $table) {
            $table->id();

            // Relación 1-a-1 con users (Breeze)
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->onDelete('cascade');

            // Datos personales del negocio
            $table->string('nombre');
            $table->string('apellido1');
            $table->string('apellido2')->nullable();
            $table->string('dni')->unique();
            $table->string('num_seguridad_social', 12)->unique();
            $table->string('telefono', 15)->unique();
            $table->date('fecha_nacimiento');
            $table->string('localidad');
            $table->string('cuenta_bancaria', 34)->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfiles');
    }
};