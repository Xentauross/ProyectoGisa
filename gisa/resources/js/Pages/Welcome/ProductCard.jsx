// resources/js/Pages/Welcome/ProductCard.jsx
import { memo } from 'react';
import { formatPrecio } from './welcomeUtils';

/**
 * Tarjeta de producto del grid principal.
 * Resalta ingredientes que coinciden con el filtro activo.
 */
const ProductCard = memo(function ProductCard({ producto, filtroIngredientes }) {
    return (
        <article
            className="product-card"
            aria-label={`${producto.nombre}, ${formatPrecio(producto.precio)}`}
        >
            <div className="product-image" aria-hidden="true">
                {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    : <span className="product-emoji">{ }</span>
                }
            </div>

            <div className="product-info">
                <div className="product-header">
                    <div className="product-title-group">
                        <h2 className="product-name">{producto.nombre}</h2>
                        {producto.es_recomendado && (
                            <span className="badge-rec" aria-label="Plato recomendado">★ Recomendación</span>
                        )}
                    </div>
                    <span className="product-price">{formatPrecio(producto.precio)}</span>
                </div>

                {producto.descripcion && (
                    <p className="product-desc">{producto.descripcion}</p>
                )}

                {producto.ingredientes?.length > 0 && (
                    <div className="product-tags" role="list" aria-label="Ingredientes">
                        {producto.ingredientes.map(ing => (
                            <span
                                key={ing.id}
                                role="listitem"
                                className={`tag ${filtroIngredientes.includes(ing.id) ? 'tag-match' : ''}`}
                            >
                                {ing.nombre}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
});

export default ProductCard;
