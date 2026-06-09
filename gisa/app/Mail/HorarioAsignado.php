<?php

namespace App\Mail;

use App\Models\Horario;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HorarioAsignado extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * $tipo puede ser 'asignado' (turno nuevo) o 'actualizado' (turno modificado).
     * El valor por defecto es 'asignado', así solo hay que pasarlo cuando sea 'actualizado'.
     */
    public function __construct(
        public User    $usuario,
        public Horario $horario,
        public string  $tipo = 'asignado', // valor por defecto
    ) {}

    /**
     * El asunto cambia dinámicamente según $tipo.
     * Usamos $this->tipo dentro de la clase para acceder a la propiedad.
     */
    public function envelope(): Envelope
    {
        $asunto = $this->tipo === 'actualizado'
            ? 'Tu turno ha sido modificado — Gisa Restaurante'
            : 'Nuevo turno asignado — Gisa Restaurante';

        return new Envelope(subject: $asunto);
    }

    /**
     * La vista es la misma para ambos tipos.
     * Dentro de la vista usamos $tipo para cambiar el título del email.
     * El template Blade accede a $usuario, $horario y $tipo directamente
     * porque son propiedades public.
     */
    public function content(): Content
    {
        return new Content(view: 'emails.horario-asignado');
    }
}