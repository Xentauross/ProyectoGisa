<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class IngredienteFactory extends Factory
{
    public function definition(): array
    {
        $ingredientes = [
            // Verduras y hortalizas
            'Tomate', 'Lechuga', 'Cebolla', 'Ajo', 'Pimiento rojo', 'Pimiento verde',
            'Zanahoria', 'Calabacín', 'Berenjena', 'Espinacas', 'Rúcula', 'Pepino',
            'Patata', 'Cebolla caramelizada', 'Tomate cherry', 'Aceitunas negras',
            'Aceitunas verdes', 'Alcaparras', 'Puerro', 'Champiñones',

            // Proteínas
            'Pollo', 'Ternera', 'Cerdo', 'Jamón ibérico', 'Jamón york',
            'Bacon', 'Chorizo', 'Morcilla', 'Atún', 'Salmón', 'Gambas',
            'Pulpo', 'Sepia', 'Mejillones', 'Almejas', 'Huevo',

            // Lácteos
            'Queso manchego', 'Queso mozzarella', 'Queso parmesano', 'Queso brie',
            'Queso cabra', 'Nata', 'Mantequilla', 'Queso crema',

            // Salsas y condimentos
            'Aceite de oliva virgen extra', 'Vinagre de Jerez', 'Mayonesa',
            'Salsa de tomate', 'Alioli', 'Mostaza', 'Salsa pesto',

            // Especias y hierbas
            'Sal', 'Pimienta negra', 'Pimentón de la vera', 'Orégano', 'Tomillo',
            'Romero', 'Albahaca', 'Perejil', 'Cilantro', 'Comino',

            // Otros
            'Pan de cristal', 'Pan tostado', 'Arroz bomba', 'Pasta', 'Limón',
        ];

        return [
            'nombre' => $this->faker->unique()->randomElement($ingredientes),
        ];
    }
}
