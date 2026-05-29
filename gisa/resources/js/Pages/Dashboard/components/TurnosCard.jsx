import React, { memo } from 'react';
import TurnoItem from './TurnoItem';

const TurnosCard = memo(function TurnosCard({ turnos, onGestionar }) {
    return (
        <section className="dashb-card" aria-label="Lista de próximos turnos">
            <p className="dashb-card-label">Mis turnos</p>

            {turnos.length > 0 ? (
                turnos.map(turno => (
                    <TurnoItem
                        key={turno.id}
                        turno={turno}
                        onGestionar={onGestionar}
                    />
                ))
            ) : (
                <div className="dashb-turnos-vacio" role="status">
                    No tienes turnos asignados
                </div>
            )}
        </section>
    );
});

export default TurnosCard;
