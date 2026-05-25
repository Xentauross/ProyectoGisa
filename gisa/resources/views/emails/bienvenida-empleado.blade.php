<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenido/a a Gisa Restaurante</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background: #f5f4f0;
            color: #1c1917;
            padding: 40px 16px;
        }

        .wrapper {
            max-width: 560px;
            margin: 0 auto;
        }

        /* Cabecera */
        .header {
            background: #1a1917;
            border-radius: 16px 16px 0 0;
            padding: 32px 40px;
            text-align: center;
        }

        .header-logo {
            font-size: 1.6rem;
            color: #d4b070;
            letter-spacing: 0.04em;
        }

        .header-logo span {
            font-style: italic;
            color: #f0ebe3;
        }

        .header-tagline {
            font-size: 0.78rem;
            color: rgba(240,235,227,0.45);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 6px;
        }

        /* Cuerpo */
        .body {
            background: #ffffff;
            padding: 40px;
        }

        .saludo {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 12px;
        }

        .texto {
            font-size: 0.92rem;
            color: #57534e;
            line-height: 1.7;
            margin-bottom: 24px;
        }

        /* Caja de credenciales */
        .credenciales {
            background: #f5f4f0;
            border: 1px solid #e7e5e4;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 28px;
        }

        .credenciales-titulo {
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #a8a29e;
            margin-bottom: 16px;
        }

        .credencial-fila {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e7e5e4;
        }

        .credencial-fila:last-child {
            border-bottom: none;
        }

        .credencial-label {
            font-size: 0.8rem;
            color: #78716c;
        }

        .credencial-valor {
            font-size: 0.9rem;
            font-weight: 600;
            color: #1c1917;
            font-family: 'Courier New', monospace;
            background: #fff;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #e7e5e4;
        }

        /* Botón */
        .btn-wrap {
            text-align: center;
            margin-bottom: 28px;
        }

        .btn {
            display: inline-block;
            background: #1a1917;
            color: #ffffff !important;
            text-decoration: none;
            padding: 13px 32px;
            border-radius: 999px;
            font-size: 0.88rem;
            font-weight: 500;
            letter-spacing: 0.03em;
        }

        /* Aviso contraseña */
        .aviso {
            background: #fef3c7;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 0.82rem;
            color: #92400e;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .aviso strong { color: #78350f; }

        .despedida {
            font-size: 0.88rem;
            color: #78716c;
            line-height: 1.7;
        }

        /* Pie */
        .footer {
            background: #f5f4f0;
            border-radius: 0 0 16px 16px;
            padding: 20px 40px;
            text-align: center;
            border-top: 1px solid #e7e5e4;
        }

        .footer p {
            font-size: 0.72rem;
            color: #a8a29e;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="wrapper">

        <div class="header">
            <div class="header-logo">Gisa <span>Restaurante</span></div>
            <div class="header-tagline">Panel de gestión interna</div>
        </div>

        <div class="body">
            <p class="saludo">Bienvenido/a, {{ $usuario->name }} 👋</p>

            <p class="texto">
                Tu cuenta en el sistema de gestión de <strong>Gisa Restaurante</strong> ha sido creada.
                A continuación encontrarás tus credenciales de acceso:
            </p>

            <div class="credenciales">
                <p class="credenciales-titulo">Tus credenciales</p>

                <div class="credencial-fila">
                    <span class="credencial-label">Email</span>
                    <span class="credencial-valor">{{ $usuario->email }}</span>
                </div>

                <div class="credencial-fila">
                    <span class="credencial-label">Contraseña temporal</span>
                    <span class="credencial-valor">{{ $passwordTemporal }}</span>
                </div>

                <div class="credencial-fila">
                    <span class="credencial-label">Rol asignado</span>
                    <span class="credencial-valor">{{ $usuario->role }}</span>
                </div>
            </div>

            <div class="btn-wrap">
                <a href="{{ url('/login') }}" class="btn">
                    Acceder al panel →
                </a>
            </div>

            <div class="aviso">
                <strong>Cambia tu contraseña</strong> en cuanto accedas por primera vez.
                Ve a tu perfil y actualízala por una que solo conozcas tú.
                Esta contraseña temporal ha sido generada automáticamente.
            </div>

            <p class="despedida">
                Si tienes cualquier problema para acceder, contacta con el administrador del sistema.<br /><br />
                Un saludo,<br />
                <strong>Equipo de Gisa Restaurante</strong>
            </p>
        </div>

        <div class="footer">
            <p>
                Este mensaje ha sido enviado automáticamente. Por favor no respondas a este email.<br />
                © {{ date('Y') }} Gisa Restaurante · Todos los derechos reservados.
            </p>
        </div>

    </div>
</body>
</html>
