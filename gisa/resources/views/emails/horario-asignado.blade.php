<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .card { background: white; max-width: 520px; margin: 0 auto; border-radius: 8px; padding: 36px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        h1 { color: #1e3a5f; font-size: 22px; margin-bottom: 4px; }
        p { color: #444; line-height: 1.6; }
        .turno { background: #f0f4ff; border-radius: 6px; padding: 16px 20px; margin: 20px 0; }
        .turno p { margin: 4px 0; font-size: 15px; }
        .turno strong { color: #1e3a5f; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;
            background: {{ $horario->estado === 'confirmado' ? '#dcfce7' : ($horario->estado === 'cancelado' ? '#fee2e2' : '#fef9c3') }};
            color: {{ $horario->estado === 'confirmado' ? '#166534' : ($horario->estado === 'cancelado' ? '#991b1b' : '#854d0e') }};
        }
        .aviso { font-size: 13px; color: #888; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>{{ $tipo === 'actualizado' ? 'Tu turno ha sido modificado' : 'Nuevo turno asignado' }}</h1>
        <p>Hola, <strong>{{ $usuario->name }}</strong>. Te informamos de los detalles de tu turno:</p>

        <div class="turno">
            <p><strong>Inicio:</strong> {{ \Carbon\Carbon::parse($horario->inicio_turno)->format('d/m/Y H:i') }}</p>
            <p><strong>Fin:</strong>   {{ \Carbon\Carbon::parse($horario->fin_turno)->format('d/m/Y H:i') }}</p>
            <p><strong>Estado:</strong> <span class="badge">{{ ucfirst($horario->estado) }}</span></p>
        </div>

        <p>Puedes consultar todos tus turnos en: <a href="{{ url('/dashboard') }}">{{ url('/dashboard') }}</a></p>

        <p class="aviso">Si crees que hay un error, contacta con el administrador.</p>
    </div>
</body>
</html>