import React, { memo } from 'react';
import { DIAS_SEMANA, NOMBRES_MES, LEYENDA_ESTADOS } from '../constants';
import { colorEstado } from '../utils';

/**
 * Renderiza una celda individual del calendario.
 */
const CalCelda = memo(function CalCelda({ dia, turnos, esHoy }) {
    const clases = [
        'cal-celda',
        esHoy             ? 'cal-celda-hoy'   : '',
        !esHoy && turnos.length > 0 ? 'cal-celda-turno' : '',
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
                    className="cal-dot"
                    style={{ background: colorEstado(primerTurno.estado) }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
});

/**
 * Calendario mensual con navegación y leyenda de estados.
 *
 * @param {{
 *   mesVista:     { year: number, month: number },
 *   diasEnMes:    number,
 *   offset:       number,
 *   hoy:          Date,
 *   prevMes:      () => void,
 *   nextMes:      () => void,
 *   getTurnosDia: (dia: number) => Array,
 * }} props
 */
const CalendarCard = memo(function CalendarCard({
    mesVista, diasEnMes, offset, hoy, prevMes, nextMes, getTurnosDia,
}) {
    return (
        <div className="card" style={{ gridRow: 'span 2' }} aria-label="Calendario de turnos">
            <p className="card-label">Mis turnos</p>

            <div className="cal-header">
                <span className="cal-mes">
                    {NOMBRES_MES[mesVista.month]} {mesVista.year}
                </span>
                <nav className="cal-nav" aria-label="Navegación de mes">
                    <button
                        className="cal-btn"
                        onClick={prevMes}
                        aria-label="Mes anterior"
                    >‹</button>
                    <button
                        className="cal-btn"
                        onClick={nextMes}
                        aria-label="Mes siguiente"
                    >›</button>
                </nav>
            </div>

            <div className="cal-dias-semana" aria-hidden="true">
                {DIAS_SEMANA.map(d => (
                    <div key={d} className="cal-ds">{d}</div>
                ))}
            </div>

            <div className="cal-celdas" role="grid" aria-label="Días del mes">
                {/* Celdas vacías de offset */}
                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} aria-hidden="true" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                    const turnos = getTurnosDia(dia);
                    const esHoy  =
                        hoy.getDate()     === dia           &&
                        hoy.getMonth()    === mesVista.month &&
                        hoy.getFullYear() === mesVista.year;

                    return (
                        <CalCelda
                            key={dia}
                            dia={dia}
                            turnos={turnos}
                            esHoy={esHoy}
                        />
                    );
                })}
            </div>

            <div className="leyenda" aria-label="Leyenda de estados">
                {LEYENDA_ESTADOS.map(({ color, label }) => (
                    <div key={label} className="leyenda-item">
                        <div className="leyenda-dot" style={{ background: color }} aria-hidden="true" />
                        <span className="leyenda-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default CalendarCard;
