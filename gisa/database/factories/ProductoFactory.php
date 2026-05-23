<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    public function definition(): array
    {
        $tipo = $this->faker->randomElement(['plato', 'bebida']);

        return [
            'tipo'           => $tipo,
            'nombre'         => $this->nombreSegunTipo($tipo),
            'descripcion'    => $this->faker->optional(0.8)->sentence(10),
            'precio'         => $this->faker->randomFloat(2, 2, 28),
            'url_imagen'     => null,
            'es_recomendado' => $this->faker->boolean(20), // 20% de probabilidad
        ];
    }

    // ── States ────────────────────────────────────────────────────────────────

    public function plato(): static
    {
        return $this->state(fn () => [
            'tipo'   => 'plato',
            'nombre' => $this->nombrePlato(),
            'precio' => $this->faker->randomFloat(2, 8, 28),
        ]);
    }

    public function bebida(): static
    {
        return $this->state(fn () => [
            'tipo'   => 'bebida',
            'nombre' => $this->nombreBebida(),
            'precio' => $this->faker->randomFloat(2, 1.5, 8),
        ]);
    }

    public function recomendado(): static
    {
        return $this->state(fn () => ['es_recomendado' => true]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function nombreSegunTipo(string $tipo): string
    {
        return $tipo === 'plato' ? $this->nombrePlato() : $this->nombreBebida();
    }

    private function nombrePlato(): string
    {
        $platos = [
            'Croquetas de jamón ibérico',
            'Croquetas de bacalao',
            'Jamón ibérico con pan con tomate',
            'Tabla de quesos de la tierra',
            'Boquerones en vinagre',
            'Pulpo a la gallega',
            'Gambas al ajillo',
            'Pimientos del Padrón',
            'Patatas bravas',
            'Tortilla española',
            'Ensalada mixta',
            'Ensalada César',
            'Ensalada de rúcula con parmesano',
            'Gazpacho andaluz',
            'Salmorejo cordobés',
            'Crema de calabaza',
            'Sopa de fideos',
            'Paella valenciana',
            'Arroz negro con alioli',
            'Fideuà de marisco',
            'Risotto de setas',
            'Pasta carbonara',
            'Pasta pesto con parmesano',
            'Lasaña de carne',
            'Hamburguesa artesanal',
            'Solomillo de ternera',
            'Entrecot a la brasa',
            'Secreto ibérico',
            'Pechuga de pollo a la plancha',
            'Pollo al limón',
            'Carrillera de cerdo estofada',
            'Costillas BBQ',
            'Merluza a la romana',
            'Dorada al horno',
            'Bacalao al pil pil',
            'Rape con gambas',
            'Lubina a la sal',
            'Sepia a la plancha',
            'Calamares fritos',
            'Berberechos al vapor',
            'Tarta de queso',
            'Coulant de chocolate',
            'Crema catalana',
            'Tiramisú',
            'Brownie con helado',
        ];

        return $this->faker->unique()->randomElement($platos);
    }

    private function nombreBebida(): string
    {
        $bebidas = [
            'Agua mineral',
            'Agua con gas',
            'Coca-Cola',
            'Coca-Cola Zero',
            'Fanta naranja',
            'Fanta limón',
            'Sprite',
            'Zumo de naranja natural',
            'Zumo de tomate',
            'Limonada casera',
            'Horchata',
            'Café solo',
            'Café con leche',
            'Cortado',
            'Capuchino',
            'Té negro',
            'Té verde',
            'Manzanilla',
            'Infusión de menta',
            'Cerveza Cruzcampo',
            'Cerveza San Miguel',
            'Cerveza 0,0',
            'Caña',
            'Clara con limón',
            'Vino blanco Verdejo',
            'Vino blanco Albariño',
            'Vino tinto Rioja',
            'Vino tinto Ribera del Duero',
            'Vino rosado',
            'Copa de cava',
            'Botella de cava',
            'Vermut rojo',
            'Tinto de verano',
            'Sangría',
            'Rebujito',
            'Gin tonic',
            'Mojito',
            'Daiquiri de fresa',
            'Piña colada',
            'Aperol Spritz',
        ];

        return $this->faker->unique()->randomElement($bebidas);
    }
}
