<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BienvenidaEmpleado extends Mailable
{
    // Queueable → permite enviar este email en segundo plano con php artisan queue:work
    // SerializesModels → convierte el modelo $usuario a formato que puede guardarse en cola
    use Queueable, SerializesModels;

    /**
     * Constructor: recibe los datos que necesita el email.
     *
     * Las propiedades PUBLIC son automáticamente accesibles en la vista Blade.
     * Es decir, en emails/bienvenida-empleado.blade.php podemos usar:
     *   {{ $usuario->name }}
     *   {{ $passwordTemporal }}
     * Sin necesidad de pasarlos explícitamente al with().
     *
     * Usamos "constructor promotion" de PHP 8:
     * 'public User $usuario' es equivalente a:
     *   public User $usuario;
     *   public function __construct(User $usuario, ...) { $this->usuario = $usuario; }
     */

    public function __construct(
        // El modelo del usuario recién creado
        public User   $usuario,
        // La contraseña temporal generada en el controlador
        public string $passwordTemporal,
    ) {}

    /**
     * envelope() define el "sobre" del email: asunto, de, para...
     * El destinatario (to) ya lo pone Mail::to() en el controlador,
     * aquí solo ponemos el asunto.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenido/a a Gisa Restaurante — Tus credenciales de acceso',
        );
    }

    /**
     * content() define qué vista Blade se usa para el cuerpo del email.
     * 'emails.bienvenida-empleado' → resources/views/emails/bienvenida-empleado.blade.php
     *
     * Como $usuario y $passwordTemporal son public, la vista puede acceder
     * a ellos directamente como $usuario y $passwordTemporal.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.bienvenida-empleado',
        );
    }
}
