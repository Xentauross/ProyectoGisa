// resources/js/Pages/Welcome/useProductosFiltrados.js
import { useState, useMemo, useCallback } from 'react';
import { CATEGORIAS } from './welcomeConstants';

/**
 * Custom hook que centraliza toda la lógica de filtrado de productos.
 * Separa el estado y los cálculos del árbol de renderizado.
 */
export function useProductosFiltrados(productos = []) {
    const [filtroCategoria, setFiltroCategoria]     = useState('todos');
    const [filtroIngredientes, setFiltroIngredientes] = useState([]);
    const [busqueda, setBusqueda]                   = useState('');

    // ── Derivados memoizados ──────────────────────────────────────────
    const productosFiltrados = useMemo(() => {
        const termino = busqueda.toLowerCase().trim();
        return productos.filter(p => {
            const coincideCategoria =
                filtroCategoria === 'todos' || p.tipo === filtroCategoria;
            const coincideBusqueda =
                termino === '' ||
                p.nombre.toLowerCase().includes(termino) ||
                p.descripcion?.toLowerCase().includes(termino);
            const coincideIngredientes =
                filtroIngredientes.length === 0 ||
                filtroIngredientes.every(id =>
                    p.ingredientes?.some(ing => ing.id === id)
                );
            return coincideCategoria && coincideBusqueda && coincideIngredientes;
        });
    }, [productos, filtroCategoria, busqueda, filtroIngredientes]);

    const conteoCategoria = useMemo(() => {
        const counts = { todos: productos.length };
        productos.forEach(p => { counts[p.tipo] = (counts[p.tipo] ?? 0) + 1; });
        return counts;
    }, [productos]);

    const hayFiltros = filtroCategoria !== 'todos'
        || busqueda !== ''
        || filtroIngredientes.length > 0;

    const tituloActual = busqueda !== ''
        ? `Resultados para "${busqueda}"`
        : CATEGORIAS.find(c => c.key === filtroCategoria)?.label ?? 'Menú Completo';

    // ── Callbacks estables ────────────────────────────────────────────
    const toggleIngrediente = useCallback((id) => {
        setFiltroIngredientes(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const clearIngredientes = useCallback(() => setFiltroIngredientes([]), []);

    const limpiarFiltros = useCallback(() => {
        setFiltroCategoria('todos');
        setBusqueda('');
        setFiltroIngredientes([]);
    }, []);

    return {
        // Estado
        filtroCategoria, setFiltroCategoria,
        filtroIngredientes,
        busqueda, setBusqueda,
        // Derivados
        productosFiltrados,
        conteoCategoria,
        hayFiltros,
        tituloActual,
        // Acciones
        toggleIngrediente,
        clearIngredientes,
        limpiarFiltros,
    };
}
