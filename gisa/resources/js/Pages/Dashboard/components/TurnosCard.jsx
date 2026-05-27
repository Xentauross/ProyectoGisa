import React, { memo } from 'react';
import TurnoItem from './TurnoItem';

/**
 * Tarjeta con la lista de próximos turnos.
 *
 * @param {{ turnos: Array, onGestionar: (turno: object) => void }} props
 */
const TurnosCard = memo(function TurnosCard({ turnos, onGestionar }) {
    return (
        <section className="card" aria-label="Lista de próximos turnos">
            <p className="card-label">Mis turnos</p>

            {turnos.length > 0 ? (
                turnos.map(turno => (
                    <TurnoItem
                        key={turno.id}
                        turno={turno}
                        onGestionar={onGestionar}
                    />
                ))
            ) : (
                <div className="turnos-vacio" role="status">
                    No tienes turnos asignados
                </div>
            )}
        </section>
    );
});

export default TurnosCard;
