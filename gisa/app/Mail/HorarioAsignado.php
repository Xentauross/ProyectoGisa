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

    public function __construct(
        public User    $usuario,
        public Horario $horario,
        public string  $tipo = 'asignado', // 'asignado' o 'actualizado'
    ) {}

    public function envelope(): Envelope
    {
        $asunto = $this->tipo === 'actualizado'
            ? 'Tu turno ha sido modificado — Gisa Restaurante'
            : 'Nuevo turno asignado — Gisa Restaurante';

        return new Envelope(subject: $asunto);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.horario-asignado');
    }
}