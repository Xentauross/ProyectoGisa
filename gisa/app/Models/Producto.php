<?php

// app/Models/Producto.php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;
    protected $table = 'productos';

    protected $fillable = [
        'tipo',
        'nombre',
        'descripcion',
        'precio',
        'url_imagen',
        'es_recomendado',
        'alergeno'
    ];

    protected function casts(): array
    {
        return [
            'precio'         => 'decimal:2',
            'es_recomendado' => 'boolean',
        ];
    }

    // -------------------------------------------------------
    // Accessors
    // -------------------------------------------------------

    // Ventas totales calculadas dinámicamente desde lineas_pedido
    public function getVentasTotalesAttribute(): int
    {
        return $this->lineas()->sum('cantidad');
    }

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------

    // N:M con ingredientes a través de producto_ingrediente
    public function ingredientes(): BelongsToMany
    {
        return $this->belongsToMany(
            Ingrediente::class,
            'producto_ingrediente'
        );
    }

    public function lineas(): HasMany
    {
        return $this->hasMany(LineaPedido::class);
    }
}