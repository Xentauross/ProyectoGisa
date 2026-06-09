import { memo, useRef, useEffect } from 'react';
import MiniCard from './MiniCard';

/**
 * Props:
 *   titulo    → texto del encabezado de la sección
 *   productos → array de productos a mostrar como MiniCards
 *   divider   → boolean, si es true añade un separador visual arriba
 */

const HorizontalSection = memo(function HorizontalSection({ titulo, productos, divider = false }) {

    // Si no hay productos, no renderizamos nada en absoluto
    if (!productos?.length) return null;

    // useRef nos da acceso directo al elemento DOM del contenedor de scroll.
    // Es como hacer document.querySelector('.cards-scroll') pero en React.
    const scrollRef = useRef(null);

    // useEffect se ejecuta DESPUÉS de que React pinte el componente en pantalla.
    // Aquí lo usamos para arrancar el auto-scroll cuando el componente aparece.
    useEffect(() => {
        // el elemento DOM real
        const el = scrollRef.current;
        // protección: si no existe, salimos
        if (!el) return;

        // setInterval ejecuta la función cada 2500ms (2,5 segundos)
        const interval = setInterval(() => {

            // scrollLeft  = píxeles desplazados desde la izquierda
            // clientWidth = ancho visible del contenedor
            // scrollWidth = ancho total del contenido (incluyendo lo oculto)
            // El -1 es por redondeos de decimales en algunos navegadores
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                // Si sí: volvemos al principio con animación suave
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Si no: avanzamos 230px hacia la derecha con animación suave
                el.scrollBy({ left: 230, behavior: 'smooth' });
            }
        }, 2500);

        // La función de "limpieza" que devuelve useEffect se ejecuta cuando
        // el componente se desmonta (desaparece de pantalla).
        // IMPORTANTE: siempre hay que limpiar los intervals/timeouts para
        // evitar memory leaks (fugas de memoria).
        return () => clearInterval(interval);

    }, []); // [] = solo se ejecuta una vez, al montar el componente

    return (
        <section
            className={`horizontal-section ${divider ? 'horizontal-section--divider' : ''}`}
            aria-label={titulo}
        >
            {/* div con overflow-x: scroll en el CSS + ref para controlarlo desde JS */}
            <h3 className="horizontal-title">{titulo}</h3>
            <div className="cards-scroll" ref={scrollRef} role="list">
                {productos.map(p => (
                    <MiniCard key={p.id} producto={p} />
                    // key={p.id} es obligatorio en listas: ayuda a React a saber
                    // qué elemento cambió cuando el array se actualiza
                ))}
            </div>
        </section>
    );
});

export default HorizontalSection;