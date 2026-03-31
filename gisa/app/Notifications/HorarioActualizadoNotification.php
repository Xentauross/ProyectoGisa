<?php 
namespace App\Notifications;

use App\Models\Horario;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class HorarioActualizadoNotification extends Notification
{
    public function __construct(
        private Horario $horario
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $estado  = strtoupper($this->horario->estado);
        $inicio  = $this->horario->inicio_turno->format('d/m/Y H:i');
        $fin     = $this->horario->fin_turno->format('d/m/Y H:i');

        return (new MailMessage)
            ->subject("Tu turno ha sido {$this->horario->estado}")
            ->greeting("Hola {$notifiable->name},")
            ->line("Tu turno ha cambiado de estado a: **{$estado}**")
            ->line("Inicio: **{$inicio}**")
            ->line("Fin: **{$fin}**")
            ->action('Ver mis turnos', url('/horarios/mis-turnos'))
            ->salutation('Un saludo, el equipo de ' . config('app.name'));
    }
}