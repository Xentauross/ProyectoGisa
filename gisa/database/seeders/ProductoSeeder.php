<?php

namespace Database\Seeders;

use App\Models\Ingrediente;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $ingredientes = Ingrediente::all();

        if ($ingredientes->isEmpty()) {
            $this->command->warn('⚠ No hay ingredientes. Ejecuta IngredienteSeeder primero.');
            return;
        }

        // ── Platos recomendados (siempre presentes) ────────────────────────
        $platosRecomendados = [
            [
                'tipo'           => 'plato',
                'nombre'         => 'Croquetas de jamón ibérico',
                'descripcion'    => 'Croquetas artesanales de jamón ibérico con bechamel cremosa y rebozado crujiente.',
                'precio'         => 8.50,
                'es_recomendado' => true,
            ],
            [
                'tipo'           => 'plato',
                'nombre'         => 'Pulpo a la gallega',
                'descripcion'    => 'Pulpo cocido sobre cama de patata con pimentón de la vera y aceite de oliva virgen extra.',
                'precio'         => 16.00,
                'es_recomendado' => true,
            ],
            [
                'tipo'           => 'plato',
                'nombre'         => 'Solomillo de ternera',
                'descripcion'    => 'Solomillo de ternera a la brasa con guarnición de patatas y salsa de pimienta verde.',
                'precio'         => 22.00,
                'es_recomendado' => true,
            ],
            [
                'tipo'           => 'plato',
                'nombre'         => 'Bacalao al pil pil',
                'descripcion'    => 'Bacalao confitado con salsa pil pil tradicional y pimientos del piquillo.',
                'precio'         => 18.50,
                'es_recomendado' => true,
            ],
            [
                'tipo'           => 'bebida',
                'nombre'         => 'Vino tinto Rioja Reserva',
                'descripcion'    => 'Copa de vino tinto Rioja Reserva, con crianza en barrica de roble.',
                'precio'         => 4.50,
                'es_recomendado' => true,
            ],
        ];

        foreach ($platosRecomendados as $datos) {
            $producto = Producto::firstOrCreate(
                ['nombre' => $datos['nombre']],
                $datos
            );
            // Asociar entre 2 y 5 ingredientes aleatorios
            $producto->ingredientes()->syncWithoutDetaching(
                $ingredientes->random(rand(2, 5))->pluck('id')->toArray()
            );
        }

        // ── Platos normales ────────────────────────────────────────────────
        Producto::factory()
            ->count(20)
            ->plato()
            ->create()
            ->each(function (Producto $producto) use ($ingredientes) {
                $producto->ingredientes()->attach(
                    $ingredientes->random(rand(2, 6))->pluck('id')->toArray()
                );
            });

        // ── Bebidas ────────────────────────────────────────────────────────
        Producto::factory()
            ->count(15)
            ->bebida()
            ->create();
        // Las bebidas generalmente no tienen ingredientes listados

        $this->command->info('✓ Productos: ' . Producto::count() . ' registros');
    }
}
