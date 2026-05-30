import { useState, useRef, useEffect, memo } from 'react';
import { ALERGENOS_COMUNES } from './welcomeConstants';

/**
 * Selector de alérgenos.
 * Semántica inversa: los productos que los contengan se ocultan.
 */
const AlergenoSelect = memo(function AlergenoSelect({
    filtroAlergenos = [],
    toggleAlergeno,
    onClear,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        function onOut(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false); setBusqueda('');
            }
        }
        document.addEventListener('mousedown', onOut);
        return () => document.removeEventListener('mousedown', onOut);
    }, []);

    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') { setIsOpen(false); setBusqueda(''); } }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const filtrados = ALERGENOS_COMUNES.filter(a =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    const total = filtroAlergenos.length;

    return (
        <div className="alg-select-wrapper" ref={ref}>
            <button
                className={[
                    'alg-select-trigger',
                    isOpen ? 'alg-select-trigger--open' : '',
                    total ? 'alg-select-trigger--active' : '',
                ].join(' ')}
                onClick={() => setIsOpen(p => !p)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Filtrar alérgenos a evitar"
            >
                <span className="alg-trigger-label">
                    {total === 0
                        ? 'Sin restricciones'
                        : total === 1
                            ? `Sin ${ALERGENOS_COMUNES.find(a => a.id === filtroAlergenos[0])?.nombre}`
                            : `${total} alérgenos excluidos`
                    }
                </span>
                {total > 0
                    ? <span className="alg-badge" aria-label={`${total} excluidos`}>{total}</span>
                    : <span className="alg-arrow" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
                }
            </button>

            {isOpen && (
                <div className="alg-dropdown" role="listbox" aria-multiselectable="true" aria-label="Alérgenos a excluir">
                    <div className="alg-dropdown-hint">
                        Marca los alérgenos que quieres <strong>evitar</strong>. Los platos que los contengan desaparecerán de la carta.
                    </div>
                    <div className="alg-dropdown-search">
                        <input
                            type="text"
                            placeholder="Buscar alérgeno..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="alg-search-input"
                            aria-label="Buscar alérgeno"
                            autoFocus
                        />
                    </div>

                    {total > 0 && (
                        <div className="alg-dropdown-actions">
                            <button className="alg-action-btn" onClick={() => { onClear(); setBusqueda(''); }}>
                                Quitar restricciones ✕
                            </button>
                        </div>
                    )}

                    <ul className="alg-options-list">
                        {filtrados.length === 0 ? (
                            <li className="alg-option-empty">Sin resultados</li>
                        ) : filtrados.map(a => {
                            const sel = filtroAlergenos.includes(a.id);
                            return (
                                <li
                                    key={a.id}
                                    role="option"
                                    aria-selected={sel}
                                    className={`alg-option ${sel ? 'alg-option--selected' : ''}`}
                                    onClick={() => toggleAlergeno(a.id)}
                                    onKeyDown={e => e.key === 'Enter' && toggleAlergeno(a.id)}
                                    tabIndex={0}
                                >
                                    <span className="alg-option-icon" aria-hidden="true">{a.icono}</span>
                                    <span className="alg-option-label">{a.nombre}</span>
                                    {sel && <span className="alg-option-check" aria-hidden="true">✕</span>}
                                </li>
                            );
                        })}
                    </ul>

                    <div className="alg-dropdown-footer">
                        {total > 0
                            ? `Excluyendo ${total} alérgeno${total > 1 ? 's' : ''}`
                            : `${ALERGENOS_COMUNES.length} alérgenos disponibles`
                        }
                    </div>
                </div>
            )}

            {total > 0 && (
                <div className="alg-tags" role="list" aria-label="Alérgenos excluidos">
                    {filtroAlergenos.map(id => {
                        const a = ALERGENOS_COMUNES.find(x => x.id === id);
                        if (!a) return null;
                        return (
                            <span key={id} className="alg-tag" role="listitem">
                                <span aria-hidden="true">{a.icono}</span> Sin {a.nombre}
                                <button className="alg-tag-remove" onClick={() => toggleAlergeno(id)} aria-label={`Quitar restricción ${a.nombre}`}>✕</button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default AlergenoSelect;