<?php

namespace Database\Seeders;

use App\Models\Ingrediente;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    /**
     * Catálogo base de productos con sus ingredientes asociados.
     * Ajusta precios, descripciones e ingredientes a tu carta real.
     */
    private array $platos = [
    [
        'nombre'        => 'Ensalada César',
        'descripcion'   => 'Lechuga romana, pollo a la plancha, picatostes, parmesano y aderezo César casero.',
        'precio'        => 9.50,
        'es_recomendado'=> false,
        'alergeno'      => ['gluten', 'huevo'],
        'ingredientes'  => ['Pollo', 'Queso parmesano', 'Ajo', 'Aceite de oliva virgen extra'],
    ],
    [
        'nombre'        => 'Gazpacho andaluz',
        'descripcion'   => 'Sopa fría de tomate, pimiento, pepino y ajo. Servida con guarnición.',
        'precio'        => 6.00,
        'es_recomendado'=> true,
        'alergeno'      => [],
        'ingredientes'  => ['Tomate', 'Pimiento rojo', 'Pimiento verde', 'Ajo', 'Aceite de oliva virgen extra', 'Vinagre de Jerez'],
    ],
    [
        'nombre'        => 'Croquetas de jamón',
        'descripcion'   => 'Croquetas artesanales de jamón ibérico con bechamel casera. Ración de 6 uds.',
        'precio'        => 8.00,
        'es_recomendado'=> true,
        'alergeno'      => ['gluten', 'lacteos', 'huevo'],
        'ingredientes'  => ['Jamón ibérico', 'Harina de trigo', 'Leche entera', 'Mantequilla', 'Huevo', 'Pan rallado'],
    ],
    [
        'nombre'        => 'Paella valenciana',
        'descripcion'   => 'Paella tradicional con pollo, conejo, judía verde y garrofón. Para dos personas.',
        'precio'        => 22.00,
        'es_recomendado'=> true,
        'alergeno'      => [],
        'ingredientes'  => ['Arroz redondo', 'Pollo', 'Tomate', 'Pimiento rojo', 'Aceite de oliva virgen extra', 'Azafrán', 'Pimentón dulce'],
    ],
    [
        'nombre'        => 'Entrecot a la plancha',
        'descripcion'   => 'Entrecot de ternera madurado, a la plancha, con guarnición de patatas y pimientos.',
        'precio'        => 24.00,
        'es_recomendado'=> false,
        'alergeno'      => [],
        'ingredientes'  => ['Ternera', 'Patata', 'Pimiento verde', 'Sal marina', 'Aceite de oliva virgen extra'],
    ],
    [
        'nombre'        => 'Merluza al horno',
        'descripcion'   => 'Merluza fresca al horno con patatas, cebolla y vino blanco.',
        'precio'        => 18.00,
        'es_recomendado'=> false,
        'alergeno'      => ['pescado'],
        'ingredientes'  => ['Merluza', 'Patata', 'Cebolla', 'Vino blanco', 'Aceite de oliva virgen extra', 'Perejil'],
    ],
    [
        'nombre'        => 'Pulpo a la gallega',
        'descripcion'   => 'Pulpo cocido sobre cama de patata cocida, aceite de oliva y pimentón.',
        'precio'        => 16.00,
        'es_recomendado'=> true,
        'alergeno'      => ['moluscos'],
        'ingredientes'  => ['Patata', 'Aceite de oliva virgen extra', 'Pimentón dulce', 'Sal marina'],
    ],
    [
        'nombre'        => 'Patatas bravas',
        'descripcion'   => 'Patatas fritas con salsa brava picante y alioli.',
        'precio'        => 5.50,
        'es_recomendado'=> false,
        'alergeno'      => ['huevo'],
        'ingredientes'  => ['Patata', 'Tomate', 'Ajo', 'Aceite de oliva virgen extra', 'Pimentón dulce'],
    ],
    [
        'nombre'        => 'Tiramisú',
        'descripcion'   => 'Postre italiano de mascarpone, bizcocho de soletilla, café y cacao.',
        'precio'        => 5.50,
        'es_recomendado'=> false,
        'alergeno'      => ['gluten', 'lacteos', 'huevo'],
        'ingredientes'  => ['Huevo', 'Azúcar', 'Nata líquida'],
    ],
    [
        'nombre'        => 'Tarta de queso',
        'descripcion'   => 'Tarta de queso artesanal al estilo vasco, con base de galleta.',
        'precio'        => 5.00,
        'es_recomendado'=> true,
        'alergeno'      => ['gluten', 'lacteos', 'huevo'],
        'ingredientes'  => ['Queso manchego', 'Huevo', 'Nata líquida', 'Azúcar', 'Harina de trigo'],
    ],
];

private array $bebidas = [
    [
        'nombre'        => 'Agua mineral 50cl',
        'descripcion'   => null,
        'precio'        => 1.50,
        'es_recomendado'=> false,
        'alergeno'      => [],
        'ingredientes'  => [],
    ],
    [
        'nombre'        => 'Cerveza artesanal 33cl',
        'descripcion'   => 'Cerveza rubia de producción local.',
        'precio'        => 3.00,
        'es_recomendado'=> false,
        'alergeno'      => ['gluten'],
        'ingredientes'  => ['Levadura'],
    ],
    [
        'nombre'        => 'Vino tinto Rioja (copa)',
        'descripcion'   => 'Crianza D.O. Rioja.',
        'precio'        => 3.50,
        'es_recomendado'=> false,
        'alergeno'      => ['sulfitos'],
        'ingredientes'  => ['Vino tinto'],
    ],
    [
        'nombre'        => 'Vino blanco Albariño (copa)',
        'descripcion'   => 'D.O. Rías Baixas, fresco y afrutado.',
        'precio'        => 3.50,
        'es_recomendado'=> true,
        'alergeno'      => ['sulfitos'],
        'ingredientes'  => ['Vino blanco'],
    ],
    [
        'nombre'        => 'Zumo de naranja natural',
        'descripcion'   => 'Zumo exprimido al momento.',
        'precio'        => 2.50,
        'es_recomendado'=> false,
        'alergeno'      => [],
        'ingredientes'  => ['Naranja'],
    ],
    [
        'nombre'        => 'Café solo',
        'descripcion'   => null,
        'precio'        => 1.50,
        'es_recomendado'=> false,
        'alergeno'      => [],
        'ingredientes'  => [],
    ],
    [
        'nombre'        => 'Refresco de cola',
        'descripcion'   => null,
        'precio'        => 2.50,
        'es_recomendado'=> false,
        'alergeno'      => [],
        'ingredientes'  => [],
    ],
];

    public function run(): void
    {
        $todos = array_merge(
            array_map(fn ($p) => array_merge($p, ['tipo' => 'plato']),   $this->platos),
            array_map(fn ($b) => array_merge($b, ['tipo' => 'bebida']),  $this->bebidas),
        );

        foreach ($todos as $data) {
            $nombresIngredientes = $data['ingredientes'];
            unset($data['ingredientes']);

            $producto = Producto::firstOrCreate(
                ['nombre' => $data['nombre'], 'tipo' => $data['tipo']],
                $data,
            );

            // Asociar ingredientes (N:M)
            if (!empty($nombresIngredientes)) {
                $ids = Ingrediente::whereIn('nombre', $nombresIngredientes)
                    ->pluck('id');

                $producto->ingredientes()->syncWithoutDetaching($ids);
            }
        }

        $total = count($todos);
        $this->command->info("ProductoSeeder: {$total} productos insertados/actualizados.");
    }
}
