import { memo } from 'react';
import { formatPrecio } from './welcomeUtils';

/**
 * Tarjeta compacta usada en las secciones horizontales de recomendados y más vendidos.
 */
const MiniCard = memo(function MiniCard({ producto }) {
    return (
        <article className="card-mini" aria-label={producto.nombre}>
            <div className="card-mini-image" aria-hidden="true">
                {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    : <span></span>
                }
            </div>
            <div className="card-mini-body">
                <p className="card-mini-nombre">{producto.nombre}</p>
                <p className="card-mini-precio">{formatPrecio(producto.precio)}</p>
            </div>
        </article>
    );
});

export default MiniCard;
