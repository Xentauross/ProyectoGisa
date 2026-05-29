import React, { memo } from 'react';

const WelcomeCard = memo(function WelcomeCard({ iniciales, nombre, fecha, rol }) {
    return (
        <div className="dashb-card-bienvenida" aria-label="Bienvenida">
            <div className="dashb-avatar" aria-hidden="true">{iniciales}</div>
            <div className="dashb-bienvenida-texto">
                <h3>Hola, {nombre}</h3>
                <p aria-label="Fecha de hoy">{fecha}</p>
            </div>
            <span className="dashb-badge-rol" aria-label={`Rol: ${rol}`}>{rol}</span>
        </div>
    );
});

export default WelcomeCard;
