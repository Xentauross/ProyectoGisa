/**
 * Formatea un número como precio en euros con 2 decimales.
 *
 * Ejemplos:
 *   formatPrecio(8)     → "8,00 €"
 *   formatPrecio(12.5)  → "12,50 €"
 *   formatPrecio("9.9") → "9,90 €"  (también acepta strings)
 *
 * Usamos toLocaleString con 'es-ES' para que:
 *   - El separador decimal sea coma (,) en vez de punto (.)
 *   - minimumFractionDigits: 2  → siempre muestra dos decimales
 *   - maximumFractionDigits: 2  → nunca muestra más de dos
 */
export function formatPrecio(precio) {
    return Number(precio).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + ' €';
}
