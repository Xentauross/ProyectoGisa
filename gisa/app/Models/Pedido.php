<?php

// app/Models/Pedido.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'mesa_id',
        'camarero_id',
        'estado',
        'precio_total',
    ];

    protected function casts(): array
    {
        return [
            'precio_total' => 'decimal:2',
        ];
    }

    // -------------------------------------------------------
    // Helpers de estado
    // -------------------------------------------------------
    public function estaPendiente(): bool { return $this->estado === 'pendiente'; }
    public function estaListo(): bool     { return $this->estado === 'listo'; }
    public function estaServido(): bool   { return $this->estado === 'servido'; }
    public function estaPagado(): bool    { return $this->estado === 'pagado'; }

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------
    public function mesa(): BelongsTo
    {
        return $this->belongsTo(Mesa::class);
    }

    public function camarero(): BelongsTo
    {
        return $this->belongsTo(User::class, 'camarero_id');
    }

    public function lineas(): HasMany
    {
        return $this->hasMany(LineaPedido::class);
    }
}