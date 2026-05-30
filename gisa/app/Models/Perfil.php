<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Perfil extends Model
{
    use HasFactory;

    protected $table = 'perfiles';

    protected $fillable = [
        'user_id',
        'nombre',
        'apellido1',
        'apellido2',
        'dni',
        'num_seguridad_social',
        'telefono',
        'fecha_nacimiento',
        'localidad',
        'cuenta_bancaria',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
            'cuenta_bancaria'  => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}