<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,        // users + perfiles
            IngredienteSeeder::class, // ingredientes base
            ProductoSeeder::class,    // platos y bebidas + relación producto_ingrediente
        ]);
    }
}
