// resources/js/Pages/Welcome/useProductosFiltrados.js
import { useState, useMemo, useCallback } from 'react';
import { CATEGORIAS } from './welcomeConstants';

export function useProductosFiltrados(productos = []) {
    const [filtroCategoria, setFiltroCategoria] = useState('todos');
    const [filtroIngredientes, setFiltroIngredientes] = useState([]);
    const [filtroAlergenos, setFiltroAlergenos] = useState([]);
    const [busqueda, setBusqueda] = useState('');

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

            // Excluir productos que contengan algún alérgeno marcado
            const sinAlergenos =
                filtroAlergenos.length === 0 ||
                !filtroAlergenos.some(aid =>
                    p.alergenos?.includes(aid)
                );

            return coincideCategoria && coincideBusqueda && coincideIngredientes && sinAlergenos;
        });
    }, [productos, filtroCategoria, busqueda, filtroIngredientes, filtroAlergenos]);

    const conteoCategoria = useMemo(() => {
        const counts = { todos: productos.length };
        productos.forEach(p => { counts[p.tipo] = (counts[p.tipo] ?? 0) + 1; });
        return counts;
    }, [productos]);

    const hayFiltros =
        filtroCategoria !== 'todos' ||
        busqueda !== '' ||
        filtroIngredientes.length > 0 ||
        filtroAlergenos.length > 0;

    const tituloActual = busqueda !== ''
        ? `Resultados para "${busqueda}"`
        : CATEGORIAS.find(c => c.key === filtroCategoria)?.label ?? 'Menú Completo';

    const toggleIngrediente = useCallback((id) => {
        setFiltroIngredientes(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const clearIngredientes = useCallback(() => setFiltroIngredientes([]), []);

    const toggleAlergeno = useCallback((id) => {
        setFiltroAlergenos(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const clearAlergenos = useCallback(() => setFiltroAlergenos([]), []);

    const limpiarFiltros = useCallback(() => {
        setFiltroCategoria('todos');
        setBusqueda('');
        setFiltroIngredientes([]);
        setFiltroAlergenos([]);
    }, []);

    return {
        filtroCategoria, setFiltroCategoria,
        filtroIngredientes,
        filtroAlergenos,
        busqueda, setBusqueda,
        productosFiltrados,
        conteoCategoria,
        hayFiltros,
        tituloActual,
        toggleIngrediente,
        clearIngredientes,
        toggleAlergeno,
        clearAlergenos,
        limpiarFiltros,
    };
}