<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    // Platos y bebidas de ejemplo realistas para un restaurante
    private static array $platos = [
        'Ensalada César', 'Gazpacho andaluz', 'Croquetas de jamón',
        'Paella valenciana', 'Entrecot a la plancha', 'Merluza al horno',
        'Risotto de setas', 'Pulpo a la gallega', 'Carrilleras al vino tinto',
        'Tortilla española', 'Patatas bravas', 'Tabla de ibéricos',
        'Salmón marinado', 'Secreto ibérico', 'Bacalao al pil-pil',
        'Crema catalana', 'Tiramisú', 'Tarta de queso',
    ];

    private static array $bebidas = [
        'Agua mineral', 'Refresco de cola', 'Zumo de naranja natural',
        'Cerveza artesanal', 'Vino tinto Rioja', 'Vino blanco Albariño',
        'Cava brut', 'Café solo', 'Café con leche',
        'Té verde', 'Limonada casera', 'Horchata',
    ];

    private static array $alergenos = [
        'Gluten', 'Lactosa', 'Huevo', 'Frutos secos',
        'Mariscos', 'Pescado', 'Soja', 'Mostaza', null,
    ];

    public function definition(): array
    {
        $tipo = fake()->randomElement(['plato', 'bebida']);

        $nombre = $tipo === 'plato'
            ? fake()->randomElement(self::$platos)
            : fake()->randomElement(self::$bebidas);

        $precio = $tipo === 'plato'
            ? fake()->randomFloat(2, 6, 28)
            : fake()->randomFloat(2, 1.5, 6);

        return [
            'tipo'          => $tipo,
            'nombre'        => $nombre,
            'descripcion'   => fake()->optional(0.75)->sentence(10),
            'precio'        => $precio,
            'url_imagen'    => fake()->optional(0.6)->imageUrl(640, 480, 'food'),
            'es_recomendado'=> fake()->boolean(20),   // 20 % de probabilidad
            'alergeno'      => fake()->randomElement(self::$alergenos),
        ];
    }

    // -------------------------------------------------------
    // Estados
    // -------------------------------------------------------

    public function plato(): static
    {
        return $this->state(fn () => [
            'tipo'   => 'plato',
            'nombre' => fake()->randomElement(self::$platos),
            'precio' => fake()->randomFloat(2, 6, 28),
        ]);
    }

    public function bebida(): static
    {
        return $this->state(fn () => [
            'tipo'   => 'bebida',
            'nombre' => fake()->randomElement(self::$bebidas),
            'precio' => fake()->randomFloat(2, 1.5, 6),
        ]);
    }

    public function recomendado(): static
    {
        return $this->state(fn () => ['es_recomendado' => true]);
    }
}
