import { memo, useRef, useEffect } from 'react';
import MiniCard from './MiniCard';

const HorizontalSection = memo(function HorizontalSection({ titulo, productos, divider = false }) {
    if (!productos?.length) return null;

    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const interval = setInterval(() => {
            // Si llegó al final, vuelve al principio
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: 230, behavior: 'smooth' });
            }
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className={`horizontal-section ${divider ? 'horizontal-section--divider' : ''}`}
            aria-label={titulo}
        >
            <h3 className="horizontal-title">{titulo}</h3>
            <div className="cards-scroll" ref={scrollRef} role="list">
                {productos.map(p => (
                    <MiniCard key={p.id} producto={p} />
                ))}
            </div>
        </section>
    );
});

export default HorizontalSection;