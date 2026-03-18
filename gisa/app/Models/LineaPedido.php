<?php

// app/Models/LineaPedido.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LineaPedido extends Model
{
    protected $table = 'lineas_pedido';

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'notas',
    ];

    // -------------------------------------------------------
    // Accessors
    // -------------------------------------------------------

    // Subtotal de la línea calculado dinámicamente
    public function getSubtotalAttribute(): float
    {
        return $this->cantidad * $this->producto->precio;
    }

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }
}