<?php

namespace Database\Seeders;

use App\Models\Perfil;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Usuarios fijos de referencia (uno por rol) + usuarios aleatorios.
     */
    private array $usuariosFijos = [
        [
            'name'  => 'Admin Principal',
            'email' => 'admin@gisa.es',
            'role'  => 'admin',
            'perfil' => [
                'nombre'              => 'Admin',
                'apellido1'           => 'Principal',
                'apellido2'           => null,
                'dni'                 => '00000001A',
                'num_seguridad_social'=> '280000000001',
                'telefono'            => '600000001',
                'fecha_nacimiento'    => '1980-01-01',
                'localidad'           => 'Madrid',
                'cuenta_bancaria'     => 'ES7621000418401234567891',
            ],
        ],
        [
            'name'  => 'Gerente Ejemplo',
            'email' => 'gerente@gisa.es',
            'role'  => 'gerente',
            'perfil' => [
                'nombre'              => 'Gerente',
                'apellido1'           => 'Ejemplo',
                'apellido2'           => 'García',
                'dni'                 => '00000002B',
                'num_seguridad_social'=> '280000000002',
                'telefono'            => '600000002',
                'fecha_nacimiento'    => '1985-06-15',
                'localidad'           => 'Barcelona',
                'cuenta_bancaria'     => 'ES7621000418401234567892',
            ],
        ],
        [
            'name'  => 'Metre Ejemplo',
            'email' => 'metre@gisa.es',
            'role'  => 'metre',
            'perfil' => null,
        ],
        [
            'name'  => 'Camarero Ejemplo',
            'email' => 'camarero@gisa.es',
            'role'  => 'camarero',
            'perfil' => null,
        ],
        [
            'name'  => 'Jefe Cocina Ejemplo',
            'email' => 'jefe.cocina@gisa.es',
            'role'  => 'jefe_cocina',
            'perfil' => null,
        ],
        [
            'name'  => 'Cocinero Ejemplo',
            'email' => 'cocinero@gisa.es',
            'role'  => 'cocinero',
            'perfil' => null,
        ],
        [
            'name'  => 'Auxiliar Ejemplo',
            'email' => 'auxiliar@gisa.es',
            'role'  => 'aux_administrativo',
            'perfil' => null,
        ],
    ];

    public function run(): void
    {
        // ----- Usuarios fijos con contraseña conocida -----
        foreach ($this->usuariosFijos as $datos) {
            $perfilData = $datos['perfil'];
            unset($datos['perfil']);

            $user = User::firstOrCreate(
                ['email' => $datos['email']],
                array_merge($datos, [
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                ]),
            );

            if ($perfilData && !$user->perfil) {
                $user->perfil()->create($perfilData);
            }
        }

        // ----- Usuarios aleatorios con perfil -----
        User::factory(20)
            ->create()
            ->each(function (User $user) {
                Perfil::factory()->create(['user_id' => $user->id]);
            });

        $this->command->info('✅  UserSeeder: usuarios fijos y 20 aleatorios insertados.');
    }
}
