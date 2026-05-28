<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ingrediente>
 */
class IngredienteFactory extends Factory
{
    // Lista de ingredientes únicos para restaurante
    private static array $ingredientes = [
        'Harina de trigo', 'Aceite de oliva virgen extra', 'Sal marina',
        'Pimienta negra', 'Ajo', 'Cebolla', 'Tomate', 'Pimiento rojo',
        'Pimiento verde', 'Zanahoria', 'Patata', 'Huevo', 'Leche entera',
        'Nata líquida', 'Mantequilla', 'Queso parmesano', 'Queso manchego',
        'Jamón ibérico', 'Chorizo', 'Lomo de cerdo', 'Pollo', 'Ternera',
        'Salmón', 'Merluza', 'Bacalao', 'Gambas', 'Mejillones',
        'Arroz redondo', 'Pasta', 'Pan rallado', 'Azúcar', 'Levadura',
        'Limón', 'Naranja', 'Perejil', 'Albahaca', 'Romero', 'Tomillo',
        'Pimentón dulce', 'Azafrán', 'Caldo de pollo', 'Vino blanco',
        'Vino tinto', 'Vinagre de Jerez', 'Mostaza', 'Miel',
    ];

    // Índice estático para garantizar unicidad durante la sesión de seeding
    private static int $index = 0;

    public function definition(): array
    {
        // Usa la lista ordenada antes de recurrir a faker para evitar duplicados únicos
        if (self::$index < count(self::$ingredientes)) {
            $nombre = self::$ingredientes[self::$index++];
        } else {
            $nombre = fake()->unique()->word() . ' ' . fake()->unique()->word();
        }

        return [
            'nombre' => $nombre,
        ];
    }
}
