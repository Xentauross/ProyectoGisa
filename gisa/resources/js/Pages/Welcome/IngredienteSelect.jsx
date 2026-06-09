import { useState, useRef, useEffect, memo } from 'react';

/**
 * Props:
 *   ingredientes       → array completo de ingredientes disponibles
 *                        (viene del servidor, ej: [{id:1, nombre:'Atún'}, ...])
 *   filtroIngredientes → array de IDs actualmente seleccionados
 *   toggleIngrediente  → función para añadir/quitar un ingrediente del filtro
 *   onClear            → función para vaciar todos los ingredientes de golpe
 */

const IngredienteSelect = memo(function IngredienteSelect({
    ingredientes,
    filtroIngredientes,
    toggleIngrediente,
    onClear,
}) {

    // ── ESTADO LOCAL DEL DROPDOWN ──────────────────────────────
    const [isOpen, setIsOpen] = useState(false);

    // Texto del buscador INTERNO del dropdown. Se resetea cada vez que se cierra el dropdown.
    const [busquedaIng, setBusquedaIng] = useState('');

    // useRef para referenciar el elemento raíz del componente
    // y detectar clics fuera de él
    const ref = useRef(null);

    // ── CERRAR AL HACER CLIC FUERA ─────────────────────────────
    useEffect(() => {
        function onClickOutside(e) {
            // ref.current.contains(e.target) devuelve true si el clic
            // ocurrió DENTRO del componente
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
                // limpiamos la búsqueda interna al cerrar
                setBusquedaIng('');
            }
        }
        // Escuchamos el evento en todo el documento
        document.addEventListener('mousedown', onClickOutside);
        // Limpieza: quitamos el listener cuando el componente se desmonta
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // ── CERRAR CON LA TECLA ESCAPE ─────────────────────────────
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') { setIsOpen(false); setBusquedaIng(''); }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);


    // ── LISTA FILTRADA POR BÚSQUEDA INTERNA ───────────────────
    // .filter() aquí es para el buscador del propio dropdown,
    // no para el filtro de productos. Solo busca por nombre.
    const ingredientesFiltrados = ingredientes.filter(ing =>
        ing.nombre.toLowerCase().includes(busquedaIng.toLowerCase())
    );

    // Cuántos ingredientes están seleccionados ahora mismo
    const totalSeleccionados = filtroIngredientes.length;

    return (
        // El div con ref es el "contenedor raíz" que usamos para detectar
        // si el clic fue dentro o fuera
        <div className="ing-select-wrapper" ref={ref}>

            {/* ── BOTÓN QUE ABRE/CIERRA EL DROPDOWN ── */}
            <button
                className={[
                    'ing-select-trigger',
                    isOpen ? 'ing-select-trigger--open' : '', // clase cuando está abierto
                    totalSeleccionados ? 'ing-select-trigger--active' : '', // clase cuando hay selección
                ].join(' ')}
                onClick={() => setIsOpen(prev => !prev)} // alterna entre true/false
                aria-haspopup="listbox" // accesibilidad: indica que abre una lista
                aria-expanded={isOpen} // accesibilidad: indica si está abierto
                aria-label="Filtrar por ingredientes"
            >
                {/* Texto del botón según cuántos están seleccionados */}
                <span className="ing-select-trigger-label">
                    {totalSeleccionados === 0
                        ? 'Todos los ingredientes'
                        : totalSeleccionados === 1
                            ? ingredientes.find(i => i.id === filtroIngredientes[0])?.nombre // exactamente uno: mostramos su nombre
                            : `${totalSeleccionados} ingredientes` // dos o más: mostramos el contador
                    }
                </span>

                {/* Icono: badge con número si hay selección, flecha si no */}
                {totalSeleccionados > 0
                    ? <span className="ing-select-badge" aria-label={`${totalSeleccionados} seleccionados`}>{totalSeleccionados}</span>
                    : <span className="ing-select-arrow" aria-hidden="true"><i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'}`} /></span>
                }
            </button>

            {/* ── DROPDOWN (solo se renderiza cuando isOpen = true) ── */}
            {isOpen && (
                <div className="ing-dropdown" role="listbox" aria-multiselectable="true" aria-label="Ingredientes disponibles">
                    <div className="ing-dropdown-search">

                        {/* Input de búsqueda dentro del dropdown */}
                        <input
                            type="text"
                            placeholder="Buscar ingrediente..."
                            value={busquedaIng}
                            onChange={e => setBusquedaIng(e.target.value)}
                            className="ing-search-input"
                            aria-label="Buscar ingrediente"
                            autoFocus // el cursor va aquí al abrir
                        />
                    </div>

                    {/* Botón "Quitar todos" (solo aparece si hay algo seleccionado) */}
                    {totalSeleccionados > 0 && (
                        <div className="ing-dropdown-actions">
                            <button className="ing-action-btn" onClick={() => { onClear(); setBusquedaIng(''); }}>
                                Quitar todos <i className="ti ti-x" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {/* Lista de opciones */}
                    <ul className="ing-options-list">
                        {ingredientesFiltrados.length === 0 ? (
                            <li className="ing-option-empty">Sin resultados</li> // Si la búsqueda no encontró nada
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
                                        // También funciona con teclado (Enter)
                                        onKeyDown={e => e.key === 'Enter' && toggleIngrediente(ing.id)}
                                        tabIndex={0} // hace el elemento enfocable con Tab
                                    >
                                        {/* Check si está seleccionado, vacío si no */}
                                        <span className="ing-option-check" aria-hidden="true">{selected ? <i className="ti ti-check" /> : ''}</span>
                                        <span className="ing-option-label">{ing.nombre}</span>
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {/* Pie del dropdown: contador de seleccionados */}
                    <div className="ing-dropdown-footer">
                        {totalSeleccionados > 0
                            ? `${totalSeleccionados} de ${ingredientes.length} seleccionados`
                            : `${ingredientes.length} ingredientes disponibles`
                        }
                    </div>
                </div>
            )}

            {/* ── TAGS DE SELECCIONADOS (debajo del botón) ── */}
            {/* Aparecen fuera del dropdown para que sean visibles aunque esté cerrado */}
            {totalSeleccionados > 0 && (
                <div className="ing-selected-tags" role="list" aria-label="Ingredientes seleccionados">
                    {filtroIngredientes.map(id => {
                        const ing = ingredientes.find(i => i.id === id);
                        if (!ing) return null; // protección: si no existe el ingrediente
                        return (
                            <span key={id} className="ing-tag" role="listitem">
                                {ing.nombre}
                                {/* Botón X para quitar este ingrediente individualmente */}
                                <button className="ing-tag-remove" onClick={() => toggleIngrediente(id)} aria-label={`Quitar ${ing.nombre}`}><i className="ti ti-x" aria-hidden="true" /></button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default IngredienteSelect;