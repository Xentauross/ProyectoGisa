<?php

namespace Database\Seeders;

use App\Models\Ingrediente;
use Illuminate\Database\Seeder;

class IngredienteSeeder extends Seeder
{
    /**
     * Lista fija de ingredientes de base.
     * Añade o quita según las necesidades del restaurante.
     */
    private array $ingredientes = [
        'Harina de trigo',
        'Aceite de oliva virgen extra',
        'Sal marina',
        'Pimienta negra',
        'Ajo',
        'Cebolla',
        'Tomate',
        'Pimiento rojo',
        'Pimiento verde',
        'Zanahoria',
        'Patata',
        'Huevo',
        'Leche entera',
        'Nata líquida',
        'Mantequilla',
        'Queso parmesano',
        'Queso manchego',
        'Jamón ibérico',
        'Chorizo',
        'Lomo de cerdo',
        'Pollo',
        'Ternera',
        'Salmón',
        'Merluza',
        'Bacalao',
        'Gambas',
        'Mejillones',
        'Arroz redondo',
        'Pasta',
        'Pan rallado',
        'Azúcar',
        'Levadura',
        'Limón',
        'Naranja',
        'Perejil',
        'Albahaca',
        'Romero',
        'Tomillo',
        'Pimentón dulce',
        'Azafrán',
        'Caldo de pollo',
        'Vino blanco',
        'Vino tinto',
        'Vinagre de Jerez',
        'Mostaza',
        'Miel',
    ];

    public function run(): void
    {
        foreach ($this->ingredientes as $nombre) {
            Ingrediente::firstOrCreate(['nombre' => $nombre]);
        }

        $this->command->info('IngredienteSeeder: ' . count($this->ingredientes) . ' ingredientes insertados.');
    }
}
