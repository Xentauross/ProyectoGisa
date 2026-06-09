// Tarjeta pequeña para las secciones horizontales (recomendados y más vendidos).
import { memo } from 'react';
import { formatPrecio } from './welcomeUtils';

/**
 * memo() es una optimización de React: si las props no cambian
 * entre renders, React reutiliza el resultado anterior sin
 * volver a ejecutar la función. Ideal para listas largas.
 */

const MiniCard = memo(function MiniCard({ producto }) {
    return (
        // <article> es más semántico que <div> para representar
        // un "ítem de contenido" independiente
        <article className="card-mini" role="listitem" aria-label={producto.nombre}>

            {/* Zona de imagen */}
            <div className="card-mini-image" aria-hidden="true">
                {producto.imagen
                    // Si tiene imagen, la mostramos. loading="lazy" hace que
                    // el navegador solo cargue la imagen cuando va a ser visible
                    ? <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    // Si no tiene imagen, mostramos un emoji de placeholder
                    : <span></span>
                }
            </div>
            {/* Nombre y precio */}
            <div className="card-mini-body">
                <p className="card-mini-nombre">{producto.nombre}</p>
                {/* formatPrecio convierte 8.5 → "8,50 €" */}
                <p className="card-mini-precio">{formatPrecio(producto.precio)}</p>
            </div>
        </article>
    );
});

export default MiniCard;
