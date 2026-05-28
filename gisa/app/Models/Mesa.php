<?php

// app/Models/Mesa.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mesa extends Model
{
    protected $table = 'mesas';

    protected $fillable = [
        'numero',
        'estado',
    ];

    // -------------------------------------------------------
    // Helpers de estado
    // -------------------------------------------------------
    protected $casts = [
        'estado' => 'string',
    ];
    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------

    // Todos los pedidos históricos de la mesa
    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }

    // Solo el pedido activo actual (no pagado ni servido)
    public function pedidoActivo(): HasMany
    {
        return $this->hasMany(Pedido::class)
                    ->whereNotIn('estado', ['servido', 'pagado']);
    }
}