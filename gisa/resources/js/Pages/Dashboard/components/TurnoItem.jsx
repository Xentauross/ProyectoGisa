import React, { memo } from 'react';
import { NOMBRES_MES } from '../constants';
import { colorEstado, fmtHora } from '../utils';

const TurnoItem = memo(function TurnoItem({ turno, onGestionar }) {
    const inicio = new Date(turno.inicio_turno);
    const fin    = turno.fin_turno ? new Date(turno.fin_turno) : null;
    const color  = colorEstado(turno.estado);

    const horaTexto = fin
        ? `${fmtHora(inicio)} — ${fmtHora(fin)}`
        : fmtHora(inicio);

    return (
        <article className="dashb-turno-item" aria-label={`Turno el ${inicio.toLocaleDateString('es-ES')}`}>
            <div className="dashb-turno-fecha" aria-hidden="true">
                <span className="dashb-turno-fecha-dia">{inicio.getDate()}</span>
                <span className="dashb-turno-fecha-mes">{NOMBRES_MES[inicio.getMonth()].slice(0, 3)}</span>
            </div>

            <div className="dashb-turno-info">
                <div className="dashb-turno-hora">{horaTexto}</div>
                <div className="dashb-turno-estado" style={{ color }} aria-label={`Estado: ${turno.estado}`}>
                    <div className="dashb-turno-dot" style={{ background: color }} aria-hidden="true" />
                    {turno.estado}
                </div>
            </div>

            <button
                className="dashb-btn-sm"
                onClick={() => onGestionar(turno)}
                aria-label={`Gestionar turno del ${inicio.toLocaleDateString('es-ES')}`}
            >
                Gestionar
            </button>
        </article>
    );
});

export default TurnoItem;
