import { memo } from 'react';
import { formatPrecio } from './welcomeUtils';

/**
 * Props que recibe:
 *   producto          → objeto con todos los datos del plato/bebida
 *   filtroIngredientes → array de IDs de ingredientes activos en el filtro
 *                        (si está vacío, no se resalta nada)
 */

const ProductCard = memo(function ProductCard({ producto, filtroIngredientes }) {
    return (
        <article
            className="product-card"
            // aria-label describe la tarjeta para lectores de pantalla
            aria-label={`${producto.nombre}, ${formatPrecio(producto.precio)}`}
        >
            {/* ── Imagen del producto ── */}
            <div className="product-image" aria-hidden="true">
                {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    // Si no tiene imagen mostramos un icono de cocina como fallback
                    : <span className="product-emoji" aria-hidden="true"><i className="ti ti-tools-kitchen-2" /></span>
                }
            </div>

            {/* ── Información del producto ── */}
            <div className="product-info">
                {/* Cabecera: nombre + badge de recomendado + precio */}
                <div className="product-header">
                    <div className="product-title-group">
                        <h2 className="product-name">{producto.nombre}</h2>
                        {/* Solo mostramos el badge si es_recomendado es true */}
                        {producto.es_recomendado && (
                            <span className="badge-rec" aria-label="Plato recomendado">Recomendación</span>
                        )}
                    </div>
                    <span className="product-price">{formatPrecio(producto.precio)}</span>
                </div>

                {/* Descripción (opcional: solo se renderiza si existe) */}
                {producto.descripcion && (
                    <p className="product-desc">{producto.descripcion}</p>
                )}

                {/* ── Tags de ingredientes ── */}
                {/* Solo se muestra si el producto tiene al menos un ingrediente */}
                {producto.ingredientes?.length > 0 && (
                    <div className="product-tags" role="list" aria-label="Ingredientes">
                        {producto.ingredientes.map(ing => (
                            <span
                                key={ing.id}
                                role="listitem"
                                // Si este ingrediente está en el filtro activo,
                                // añadimos la clase 'tag-match' para resaltarlo
                                // (el CSS lo pone de otro color)
                                className={`tag ${filtroIngredientes.includes(ing.id) ? 'tag-match' : ''}`}
                            >
                                {ing.nombre}
                            </span>
                        ))}
                    </div>
                )}


                {/* ── Tags de alérgenos ── */}
                {/* Solo se muestra si el producto tiene alérgenos */}
                {producto.alergenos?.length > 0 && (
                    <div className="product-alergenos" role="list" aria-label="Alérgenos">
                        {producto.alergenos.map(a => {
                            // Los alérgenos pueden venir como string simple ("gluten")
                            // o como objeto { id: 'gluten', nombre: 'Gluten' }
                            // Gestionamos ambos casos para ser flexibles
                            const id = typeof a === 'string' ? a : a.id;
                            const nombre = typeof a === 'string' ? a : a.nombre;
                            return (
                                <span key={id} role="listitem" className="tag tag-alergeno" title={`Contiene: ${nombre}`}>
                                    {nombre}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </article>
    );
});

export default ProductCard;