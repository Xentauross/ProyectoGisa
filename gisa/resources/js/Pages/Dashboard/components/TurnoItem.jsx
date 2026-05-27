import React, { memo } from 'react';
import { NOMBRES_MES } from '../constants';
import { colorEstado, fmtHora } from '../utils';

/**
 * Fila individual de un turno en la lista de próximos turnos.
 *
 * @param {{ turno: object, onGestionar: (turno: object) => void }} props
 */
const TurnoItem = memo(function TurnoItem({ turno, onGestionar }) {
    const inicio = new Date(turno.inicio_turno);
    const fin    = turno.fin_turno ? new Date(turno.fin_turno) : null;
    const color  = colorEstado(turno.estado);

    const horaTexto = fin
        ? `${fmtHora(inicio)} — ${fmtHora(fin)}`
        : fmtHora(inicio);

    return (
        <article className="turno-item" aria-label={`Turno el ${inicio.toLocaleDateString('es-ES')}`}>
            <div className="turno-fecha" aria-hidden="true">
                <span className="turno-fecha-dia">{inicio.getDate()}</span>
                <span className="turno-fecha-mes">{NOMBRES_MES[inicio.getMonth()].slice(0, 3)}</span>
            </div>

            <div className="turno-info">
                <div className="turno-hora">{horaTexto}</div>
                <div className="turno-estado" style={{ color }} aria-label={`Estado: ${turno.estado}`}>
                    <div className="turno-dot" style={{ background: color }} aria-hidden="true" />
                    {turno.estado}
                </div>
            </div>

            <button
                className="btn-sm"
                onClick={() => onGestionar(turno)}
                aria-label={`Gestionar turno del ${inicio.toLocaleDateString('es-ES')}`}
            >
                Gestionar
            </button>
        </article>
    );
});

export default TurnoItem;
