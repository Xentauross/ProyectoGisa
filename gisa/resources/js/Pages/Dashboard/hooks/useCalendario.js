import { useState, useMemo } from 'react';
import { turnosDia } from '../utils';

/**
 * Encapsula toda la lógica del calendario mensual.
 * @param {Array} horarios
 * @returns {{
 *   mesVista: {year: number, month: number},
 *   diasEnMes: number,
 *   offset: number,
 *   hoy: Date,
 *   prevMes: () => void,
 *   nextMes: () => void,
 *   getTurnosDia: (dia: number) => Array,
 * }}
 */
export function useCalendario(horarios) {
    const hoy = useMemo(() => new Date(), []);

    const [mesVista, setMesVista] = useState({
        year: hoy.getFullYear(),
        month: hoy.getMonth(),
    });

    const diasEnMes = useMemo(
        () => new Date(mesVista.year, mesVista.month + 1, 0).getDate(),
        [mesVista],
    );

    const offset = useMemo(() => {
        const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();
        return (primerDia + 6) % 7; // lunes = 0
    }, [mesVista]);

    const prevMes = () =>
        setMesVista(v => {
            const d = new Date(v.year, v.month - 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });

    const nextMes = () =>
        setMesVista(v => {
            const d = new Date(v.year, v.month + 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });

    const getTurnosDia = (dia) =>
        turnosDia(horarios, mesVista.year, mesVista.month, dia);

    return { mesVista, diasEnMes, offset, hoy, prevMes, nextMes, getTurnosDia };
}
