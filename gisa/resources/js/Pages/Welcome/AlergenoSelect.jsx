import { useState, useRef, useEffect, memo } from 'react';
// Los alérgenos son fijos (definidos por ley europea), por eso
// los importamos de las constantes en vez de recibirlos del servidor
import { ALERGENOS_COMUNES } from './welcomeConstants';

/**
 * Selector de alérgenos.
 * Semántica inversa: los productos que los contengan se ocultan.
 */
const AlergenoSelect = memo(function AlergenoSelect({
    // array de IDs de alérgenos que queremos evitar
    filtroAlergenos = [],
    // función para añadir/quitar un alérgeno
    toggleAlergeno,
    // función para quitar todos los alérgenos de golpe
    onClear,
}) {
    const [isOpen, setIsOpen] = useState(false);
    // busqueda aquí es el texto del buscador INTERNO del dropdown
    const [busqueda, setBusqueda] = useState('');
    const ref = useRef(null);

    // ── CERRAR AL HACER CLIC FUERA DEL COMPONENTE ─────────────
    useEffect(() => {
        function onOut(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false); setBusqueda('');
            }
        }
        document.addEventListener('mousedown', onOut);
        return () => document.removeEventListener('mousedown', onOut);
    }, []);

    // ── CERRAR CON ESCAPE ──────────────────────────────────────
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') { setIsOpen(false); setBusqueda(''); } }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Filtramos la lista de alérgenos según lo que escriba el usuario
    // en el buscador interno del dropdown
    const filtrados = ALERGENOS_COMUNES.filter(a =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    // Total de alérgenos marcados como "a evitar"
    const total = filtroAlergenos.length;

    return (
        <div className="alg-select-wrapper" ref={ref}>

            {/* ── BOTÓN TRIGGER ── */}
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
                        ? 'Sin restricciones'  // no hay ninguno marcado
                        : total === 1
                            // exactamente uno: "Sin Gluten", "Sin Lácteos", etc.
                            ? `Sin ${ALERGENOS_COMUNES.find(a => a.id === filtroAlergenos[0])?.nombre}`
                            : `${total} alérgenos excluidos`  // dos o más
                    }
                </span>
                {total > 0
                    ? <span className="alg-badge" aria-label={`${total} excluidos`}>{total}</span>
                    : <span className="alg-arrow" aria-hidden="true"><i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'}`} /></span>
                }
            </button>

            {/* ── DROPDOWN ── */}
            {isOpen && (
                <div className="alg-dropdown" role="listbox" aria-multiselectable="true" aria-label="Alérgenos a excluir">

                    {/* Texto explicativo de la semántica inversa.
                        Es importante que el usuario entienda que marcar = excluir */}
                    <div className="alg-dropdown-hint">
                        Marca los alérgenos que quieres <strong>evitar</strong>. Los platos que los contengan desaparecerán de la carta.
                    </div>

                    {/* Buscador interno */}
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

                    {/* Botón para quitar todas las restricciones (solo si hay alguna) */}
                    {total > 0 && (
                        <div className="alg-dropdown-actions">
                            <button className="alg-action-btn" onClick={() => { onClear(); setBusqueda(''); }}>
                                Quitar restricciones <i className="ti ti-x" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {/* Lista de alérgenos */}
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
                                    {/* Si está seleccionado (marcado para excluir), mostramos una X */}
                                    {sel && <span className="alg-option-check" aria-hidden="true"><i className="ti ti-x" /></span>}
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

            {/* ── TAGS DE RESTRICCIONES ACTIVAS ── */}
            {/* Visibles aunque el dropdown esté cerrado */}
            {total > 0 && (
                <div className="alg-tags" role="list" aria-label="Alérgenos excluidos">
                    {filtroAlergenos.map(id => {
                        const a = ALERGENOS_COMUNES.find(x => x.id === id);
                        if (!a) return null;
                        return (
                            <span key={id} className="alg-tag" role="listitem">
                                <span aria-hidden="true">{a.icono}</span> Sin {a.nombre}
                                <button className="alg-tag-remove" onClick={() => toggleAlergeno(id)} aria-label={`Quitar restricción ${a.nombre}`}><i className="ti ti-x" aria-hidden="true" /></button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default AlergenoSelect;