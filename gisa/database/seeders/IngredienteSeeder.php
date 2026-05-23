<?php

namespace Database\Seeders;

use App\Models\Ingrediente;
use Illuminate\Database\Seeder;

class IngredienteSeeder extends Seeder
{
    public function run(): void
    {


// Crear directamente 50 ingredientes usando el factory
        Ingrediente::factory()->count(50)->create();

        $this->command->info('✓ Ingredientes: ' . Ingrediente::count() . ' registros');
    }
}
