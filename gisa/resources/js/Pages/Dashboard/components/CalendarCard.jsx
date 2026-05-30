import React, { memo } from 'react';
import { DIAS_SEMANA, NOMBRES_MES, LEYENDA_ESTADOS } from '../constants';
import { colorEstado } from '../utils';

const CalCelda = memo(function CalCelda({ dia, turnos, esHoy }) {
    const clases = [
        'dashb-cal-celda',
        esHoy                       ? 'dashb-cal-celda-hoy'   : '',
        !esHoy && turnos.length > 0 ? 'dashb-cal-celda-turno' : '',
    ].filter(Boolean).join(' ');

    const primerTurno = turnos[0];

    return (
        <div
            className={clases}
            aria-label={`Día ${dia}${turnos.length > 0 ? `, ${turnos.length} turno(s)` : ''}${esHoy ? ', hoy' : ''}`}
        >
            {dia}
            {primerTurno && !esHoy && (
                <div
                    className="dashb-cal-dot"
                    style={{ background: colorEstado(primerTurno.estado) }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
});

const CalendarCard = memo(function CalendarCard({
    mesVista, diasEnMes, offset, hoy, prevMes, nextMes, getTurnosDia,
}) {
    return (
        <div className="dashb-card" style={{ gridRow: 'span 2' }} aria-label="Calendario de turnos">
            <p className="dashb-card-label">Mis turnos</p>

            <div className="dashb-cal-header">
                <span className="dashb-cal-mes">
                    {NOMBRES_MES[mesVista.month]} {mesVista.year}
                </span>
                <nav className="dashb-cal-nav" aria-label="Navegación de mes">
                    <button className="dashb-cal-btn" onClick={prevMes} aria-label="Mes anterior">‹</button>
                    <button className="dashb-cal-btn" onClick={nextMes} aria-label="Mes siguiente">›</button>
                </nav>
            </div>

            <div className="dashb-cal-dias-semana" aria-hidden="true">
                {DIAS_SEMANA.map(d => (
                    <div key={d} className="dashb-cal-ds">{d}</div>
                ))}
            </div>

            <div className="dashb-cal-celdas" role="grid" aria-label="Días del mes">
                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} aria-hidden="true" />
                ))}
                {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                    const turnos = getTurnosDia(dia);
                    const esHoy  =
                        hoy.getDate()     === dia            &&
                        hoy.getMonth()    === mesVista.month &&
                        hoy.getFullYear() === mesVista.year;
                    return <CalCelda key={dia} dia={dia} turnos={turnos} esHoy={esHoy} />;
                })}
            </div>

            <div className="dashb-leyenda" aria-label="Leyenda de estados">
                {LEYENDA_ESTADOS.map(({ color, label }) => (
                    <div key={label} className="dashb-leyenda-item">
                        <div className="dashb-leyenda-dot" style={{ background: color }} aria-hidden="true" />
                        <span className="dashb-leyenda-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default CalendarCard;
