import React, { memo } from 'react';

/**
 * Tarjeta de bienvenida — fila completa en el grid.
 *
 * @param {{ iniciales: string, nombre: string, fecha: string, rol: string }} props
 */
const WelcomeCard = memo(function WelcomeCard({ iniciales, nombre, fecha, rol }) {
    return (
        <div className="card-bienvenida" aria-label="Bienvenida">
            <div className="avatar" aria-hidden="true">{iniciales}</div>
            <div className="bienvenida-texto">
                <h3>Hola, {nombre}</h3>
                <p aria-label="Fecha de hoy">{fecha}</p>
            </div>
            <span className="badge-rol" aria-label={`Rol: ${rol}`}>{rol}</span>
        </div>
    );
});

export default WelcomeCard;
