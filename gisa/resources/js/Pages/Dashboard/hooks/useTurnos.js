import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { getProximosTurnos } from '../utils';
import { MAX_PROXIMOS_TURNOS } from '../constants';

/**
 * Encapsula la lógica de selección y actualización de turnos.
 * @param {Array} horarios
 * @returns {{
 *   turnoActivo: object|null,
 *   proximosTurnos: Array,
 *   abrirTurno: (turno: object) => void,
 *   cerrarTurno: () => void,
 *   guardarTurno: (e: Event) => void,
 * }}
 */
export function useTurnos(horarios) {
    const [turnoActivo, setTurnoActivo] = useState(null);

    const proximosTurnos = useMemo(
        () => getProximosTurnos(horarios, MAX_PROXIMOS_TURNOS),
        [horarios],
    );

    const abrirTurno = (turno) => setTurnoActivo(turno);
    const cerrarTurno = () => setTurnoActivo(null);

    function guardarTurno(e) {
        e.preventDefault();
        const form = e.target;
        router.patch(
            route('mis-turnos.update', turnoActivo.id),
            {
                estado: form.estado.value,
                inicio_turno: form.inicio_turno.value ? form.inicio_turno.value + ':00' : null,
                fin_turno: form.fin_turno.value ? form.fin_turno.value + ':00' : null,
            },
            {
                preserveScroll: true,
                onSuccess: cerrarTurno,
            },
        );
    }

    return { turnoActivo, proximosTurnos, abrirTurno, cerrarTurno, guardarTurno };
}
