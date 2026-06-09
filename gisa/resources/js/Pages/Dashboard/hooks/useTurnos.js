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

    // Turno seleccionado actualmente (el que se muestra en el modal).
    // null = ningún modal abierto.
    const [turnoActivo, setTurnoActivo] = useState(null);

    // Lista de los próximos N turnos, ordenados por fecha ascendente.
    // useMemo evita recalcular la lista en cada render si horarios no cambia.
    const proximosTurnos = useMemo(
        () => getProximosTurnos(horarios, MAX_PROXIMOS_TURNOS),
        [horarios],
    );

    // Abre el modal con el turno seleccionado.
    const abrirTurno = (turno) => setTurnoActivo(turno);

    // Cierra el modal poniendo turnoActivo a null.
    const cerrarTurno = () => setTurnoActivo(null);

    // Se llama cuando el usuario guarda cambios en el modal.
    // e.target es el <form> del modal, de donde leemos los valores.
    function guardarTurno(e) {
        e.preventDefault();
        const form = e.target;

        // router.patch() envía una petición PATCH (actualización parcial)
        // a la ruta 'mis-turnos.update' con el ID del turno activo.
        router.patch(
            route('mis-turnos.update', turnoActivo.id),
            {
                estado: form.estado.value,
                // Añadimos ':00' al final porque el input datetime-local
                // devuelve "2024-06-15T09:00" y el servidor espera segundos.
                inicio_turno: form.inicio_turno.value ? form.inicio_turno.value + ':00' : null,
                fin_turno: form.fin_turno.value ? form.fin_turno.value + ':00' : null,
            },
            {
                // no sube al top de la página al guardar
                preserveScroll: true,
                // cierra el modal si la petición fue bien
                onSuccess: cerrarTurno,
            },
        );
    }

    return { turnoActivo, proximosTurnos, abrirTurno, cerrarTurno, guardarTurno };
}
