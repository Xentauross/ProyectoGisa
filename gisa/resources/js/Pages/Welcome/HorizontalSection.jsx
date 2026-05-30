import { memo } from 'react';
import MiniCard from './MiniCard';

/**
 * Sección de scroll horizontal (recomendados, más vendidos).
 * Retorna null si no hay productos — evita renders vacíos.
 */
const HorizontalSection = memo(function HorizontalSection({ titulo, productos, divider = false }) {
    if (!productos?.length) return null;

    return (
        <section
            className={`horizontal-section ${divider ? 'horizontal-section--divider' : ''}`}
            aria-label={titulo}
        >
            <h3 className="horizontal-title">{titulo}</h3>
            <div className="cards-scroll" role="list">
                {productos.map(p => (
                    <div key={p.id} role="listitem">
                        <MiniCard producto={p} />
                    </div>
                ))}
            </div>
        </section>
    );
});

export default HorizontalSection;
