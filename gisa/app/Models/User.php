<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // -------------------------------------------------------
    // Helpers de rol
    // -------------------------------------------------------
    public function esAdmin(): bool      { return $this->role === 'admin'; }
    public function esGerente(): bool    { return $this->role === 'gerente'; }
    public function esMetre(): bool      { return $this->role === 'metre'; }
    public function esCamarero(): bool   { return $this->role === 'camarero'; }
    public function esJefeCocina(): bool { return $this->role === 'jefe_cocina'; }
    public function esCocinero(): bool   { return $this->role === 'cocinero'; }

    public function puedeCrearPedidos(): bool
    {
        return in_array($this->role, ['admin', 'metre', 'camarero']);
    }

    // -------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------

    public function perfil(): HasOne
    {
        return $this->hasOne(Perfil::class);
    }

    public function horarios(): HasMany
    {
        return $this->hasMany(Horario::class);
    }

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'camarero_id');
    }
}