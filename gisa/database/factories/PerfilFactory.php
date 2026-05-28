<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Perfil>
 */
class PerfilFactory extends Factory
{
    public function definition(): array
    {
        // Genera un IBAN español ficticio (ES + 22 dígitos)
        $iban = 'ES' . fake()->numerify('####################' . '####');

        return [
            'user_id'             => User::factory(),
            'nombre'              => fake()->firstName(),
            'apellido1'           => fake()->lastName(),
            'apellido2'           => fake()->optional(0.8)->lastName(),
            'dni'                 => fake()->unique()->numerify('########') . fake()->randomLetter(),
            'num_seguridad_social'=> fake()->unique()->numerify('############'),
            'telefono'            => fake()->unique()->numerify('6########'),
            'fecha_nacimiento'    => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'localidad'           => fake()->city(),
            'cuenta_bancaria'     => fake()->unique()->iban('ES'),
        ];
    }
}
