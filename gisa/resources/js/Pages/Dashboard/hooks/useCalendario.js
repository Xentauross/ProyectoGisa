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

    // useMemo recuerda el resultado de una función y solo lo recalcula
    // si las dependencias (array del segundo argumento) cambian.
    // new Date() solo se ejecuta una vez; si el componente se redibuja
    // por otro motivo, 'hoy' sigue siendo la misma instancia de Date.
    const hoy = useMemo(() => new Date(), []);

    // Estado del mes que estamos viendo actualmente en el calendario.
    // Empezamos en el mes y año actual.
    const [mesVista, setMesVista] = useState({
        year: hoy.getFullYear(),
        month: hoy.getMonth(),
    });

    // Calculamos cuántos días tiene el mes actual.
    // Truco: new Date(año, mes+1, 0) devuelve el último día del mes.
    // getDate() de ese día = número de días del mes.
    const diasEnMes = useMemo(
        () => new Date(mesVista.year, mesVista.month + 1, 0).getDate(),
        // se recalcula solo cuando cambia el mes
        [mesVista],
    );

    // Calculamos cuántas celdas vacías poner al principio del calendario.
    // En nuestro calendario la semana empieza en Lunes (L=0, M=1...D=6).
    // getDay() devuelve 0=domingo, 1=lunes... así que reordenamos con la fórmula.
    const offset = useMemo(() => {
        const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();
        // convierte domingo(0) → 6, lunes(1) → 0, etc.
        return (primerDia + 6) % 7;
    }, [mesVista]);

    // Funciones para navegar entre meses.
    // Creamos una nueva fecha retrocediendo/avanzando un mes y actualizamos el estado.
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

    // Función que dado un número de día devuelve los turnos de ese día.
    // Delega la lógica a la función turnosDia() de utils/index.js.
    const getTurnosDia = (dia) =>
        turnosDia(horarios, mesVista.year, mesVista.month, dia);

    // Devolvemos todo lo que el componente necesita saber del calendario.
    // El componente CalendarCard desestructurará estas propiedades.
    return { mesVista, diasEnMes, offset, hoy, prevMes, nextMes, getTurnosDia };
}
