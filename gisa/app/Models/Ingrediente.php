<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingrediente extends Model
{
    use HasFactory;
    
    protected $table = 'ingredientes';

    protected $fillable = [
        'nombre',
    ];

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------

    // N:M con productos a través de producto_ingrediente
    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(
            Producto::class,
            'producto_ingrediente'
        );
    }
}