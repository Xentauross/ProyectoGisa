import { useState, useRef, useEffect, memo } from 'react';

/**
 * Select múltiple con buscador interno para filtrar por ingredientes.
 * Accesible: aria-haspopup, aria-expanded, aria-selected, Escape para cerrar.
 */
const IngredienteSelect = memo(function IngredienteSelect({
    ingredientes,
    filtroIngredientes,
    toggleIngrediente,
    onClear,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [busquedaIng, setBusquedaIng] = useState('');
    const ref = useRef(null);

    // Cerrar al clic fuera
    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
                setBusquedaIng('');
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') { setIsOpen(false); setBusquedaIng(''); }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const ingredientesFiltrados = ingredientes.filter(ing =>
        ing.nombre.toLowerCase().includes(busquedaIng.toLowerCase())
    );
    const totalSeleccionados = filtroIngredientes.length;

    return (
        <div className="ing-select-wrapper" ref={ref}>
            {/* Trigger */}
            <button
                className={[
                    'ing-select-trigger',
                    isOpen ? 'ing-select-trigger--open' : '',
                    totalSeleccionados ? 'ing-select-trigger--active' : '',
                ].join(' ')}
                onClick={() => setIsOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Filtrar por ingredientes"
            >
                <span className="ing-select-trigger-label">
                    {totalSeleccionados === 0
                        ? 'Todos los ingredientes'
                        : totalSeleccionados === 1
                            ? ingredientes.find(i => i.id === filtroIngredientes[0])?.nombre
                            : `${totalSeleccionados} ingredientes`
                    }
                </span>
                {totalSeleccionados > 0
                    ? <span className="ing-select-badge" aria-label={`${totalSeleccionados} seleccionados`}>{totalSeleccionados}</span>
                    : <span className="ing-select-arrow" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
                }
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="ing-dropdown" role="listbox" aria-multiselectable="true" aria-label="Ingredientes disponibles">
                    <div className="ing-dropdown-search">
                        <input
                            type="text"
                            placeholder="Buscar ingrediente..."
                            value={busquedaIng}
                            onChange={e => setBusquedaIng(e.target.value)}
                            className="ing-search-input"
                            aria-label="Buscar ingrediente"
                            autoFocus
                        />
                    </div>

                    {totalSeleccionados > 0 && (
                        <div className="ing-dropdown-actions">
                            <button className="ing-action-btn" onClick={() => { onClear(); setBusquedaIng(''); }}>
                                Quitar todos ✕
                            </button>
                        </div>
                    )}

                    <ul className="ing-options-list">
                        {ingredientesFiltrados.length === 0 ? (
                            <li className="ing-option-empty">Sin resultados</li>
                        ) : (
                            ingredientesFiltrados.map(ing => {
                                const selected = filtroIngredientes.includes(ing.id);
                                return (
                                    <li
                                        key={ing.id}
                                        role="option"
                                        aria-selected={selected}
                                        className={`ing-option ${selected ? 'ing-option--selected' : ''}`}
                                        onClick={() => toggleIngrediente(ing.id)}
                                        onKeyDown={e => e.key === 'Enter' && toggleIngrediente(ing.id)}
                                        tabIndex={0}
                                    >
                                        <span className="ing-option-check" aria-hidden="true">{selected ? '✓' : ''}</span>
                                        <span className="ing-option-label">{ing.nombre}</span>
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    <div className="ing-dropdown-footer">
                        {totalSeleccionados > 0
                            ? `${totalSeleccionados} de ${ingredientes.length} seleccionados`
                            : `${ingredientes.length} ingredientes disponibles`
                        }
                    </div>
                </div>
            )}

            {/* Tags de seleccionados */}
            {totalSeleccionados > 0 && (
                <div className="ing-selected-tags" role="list" aria-label="Ingredientes seleccionados">
                    {filtroIngredientes.map(id => {
                        const ing = ingredientes.find(i => i.id === id);
                        if (!ing) return null;
                        return (
                            <span key={id} className="ing-tag" role="listitem">
                                {ing.nombre}
                                <button className="ing-tag-remove" onClick={() => toggleIngrediente(id)} aria-label={`Quitar ${ing.nombre}`}>✕</button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default IngredienteSelect;
