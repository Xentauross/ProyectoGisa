<?php

// app/Models/Horario.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Horario extends Model
{
    protected $table = 'horarios';

    protected $fillable = [
        'user_id',
        'inicio_turno',
        'fin_turno',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'inicio_turno' => 'datetime',
            'fin_turno'    => 'datetime',
        ];
    }

    // -------------------------------------------------------
    // Helpers de estado
    // -------------------------------------------------------
    public function estaPendiente(): bool  { return $this->estado === 'pendiente'; }
    public function estaConfirmado(): bool { return $this->estado === 'confirmado'; }
    public function estaCancelado(): bool  { return $this->estado === 'cancelado'; }

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}