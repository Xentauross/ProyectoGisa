<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Primero limpiamos los valores actuales (strings sueltos → array vacío)
        DB::table('productos')->update(['alergeno' => null]);

        Schema::table('productos', function (Blueprint $table) {
            $table->text('alergeno')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->string('alergeno', 45)->nullable()->change();
        });
    }
};