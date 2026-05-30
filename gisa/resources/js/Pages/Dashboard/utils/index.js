import { ESTADO_COLORES, NOMBRES_MES } from '../constants';

/**
 * Devuelve el color hex asociado a un estado de turno.
 * @param {string} estado
 * @returns {string}
 */
export function colorEstado(estado) {
    return ESTADO_COLORES[estado] ?? ESTADO_COLORES.pendiente;
}

/**
 * Formatea un datetime ISO para usar en <input type="datetime-local">.
 * @param {string|null} iso
 * @returns {string}
 */
export function fmtDatetimeLocal(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    // Convertir a hora local de Madrid para el input
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

/**
 * Formatea una hora de una fecha para mostrar en ES.
 * @param {Date} date
 * @returns {string}
 */
export function fmtHora(date) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid', });
}

/**
 * Obtiene las iniciales (máx. 2) del nombre completo.
 * @param {string} nombre
 * @returns {string}
 */
export function getIniciales(nombre) {
    return nombre
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

/**
 * Filtra los horarios que corresponden a un día concreto.
 * @param {Array}  horarios
 * @param {number} year
 * @param {number} month
 * @param {number} dia
 * @returns {Array}
 */
export function turnosDia(horarios, year, month, dia) {
    return horarios.filter(h => {
        const d = new Date(h.inicio_turno);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dia;
    });
}

/**
 * Devuelve los próximos N turnos ordenados por fecha.
 * @param {Array}  horarios
 * @param {number} limit
 * @returns {Array}
 */
export function getProximosTurnos(horarios, limit) {
    return [...horarios]
        .sort((a, b) => new Date(a.inicio_turno) - new Date(b.inicio_turno))
        .slice(0, limit);
}

/**
 * Nombre corto del mes (3 letras) para un índice 0-11.
 * @param {number} mesIndex
 * @returns {string}
 */
export function mesCortoPorIndice(mesIndex) {
    return NOMBRES_MES[mesIndex].slice(0, 3);
}
