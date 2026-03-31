<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NuevoUsuarioNotification extends Notification
{
    public function __construct(
        private string $passwordTemporal
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bienvenido/a — Tu cuenta ha sido creada')
            ->greeting("Hola {$notifiable->name},")
            ->line('El administrador ha creado tu cuenta en el sistema.')
            ->line("Tu rol asignado es: **{$notifiable->role}**")
            ->line("Tu contraseña temporal es: **{$this->passwordTemporal}**")
            ->line('Te recomendamos cambiarla tras tu primer inicio de sesión.')
            ->action('Iniciar sesión', url('/login'))
            ->salutation('Un saludo, el equipo de ' . config('app.name'));
    }
}