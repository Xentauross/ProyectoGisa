import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { ESTADOS_TURNO } from '../constants';
import { fmtDatetimeLocal } from '../utils';

const TurnoModal = memo(function TurnoModal({ turno, onClose, onGuardar }) {
    if (!turno) return null;

    return createPortal(
        <div
            className="dashb-modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Gestionar turno"
        >
            <div className="dashb-modal" onClick={e => e.stopPropagation()}>
                <h3>Gestionar turno</h3>

                <form onSubmit={onGuardar} noValidate>
                    <div className="dashb-modal-campo">
                        <label htmlFor="estado">Estado</label>
                        <select id="estado" name="estado" defaultValue={turno.estado}>
                            {ESTADOS_TURNO.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="dashb-modal-campo">
                        <label htmlFor="inicio_turno">Inicio real del turno</label>
                        <input
                            id="inicio_turno"
                            type="datetime-local"
                            name="inicio_turno"
                            defaultValue={fmtDatetimeLocal(turno.inicio_turno)}
                        />
                    </div>

                    <div className="dashb-modal-campo">
                        <label htmlFor="fin_turno">Fin real del turno</label>
                        <input
                            id="fin_turno"
                            type="datetime-local"
                            name="fin_turno"
                            defaultValue={fmtDatetimeLocal(turno.fin_turno)}
                        />
                    </div>

                    <div className="dashb-modal-acciones">
                        <button
                            type="button"
                            className="dashb-btn-secondary"
                            onClick={onClose}
                            aria-label="Cancelar y cerrar modal"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="dashb-btn-primary"
                            aria-label="Guardar cambios del turno"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
});

export default TurnoModal;
