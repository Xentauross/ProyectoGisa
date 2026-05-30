<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perfiles', function (Blueprint $table) {
            // Primero eliminar el índice unique
            $table->dropUnique(['cuenta_bancaria']);
        });
 
        Schema::table('perfiles', function (Blueprint $table) {
            // Luego ampliar la columna a TEXT
            $table->text('cuenta_bancaria')->nullable()->change();
        });
    }
 
    public function down(): void
    {
        Schema::table('perfiles', function (Blueprint $table) {
            $table->string('cuenta_bancaria', 34)->nullable()->change();
            $table->unique('cuenta_bancaria');
        });
    }
};
