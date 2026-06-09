// resources/js/Pages/Welcome/useProductosFiltrados.js
import { useState, useMemo, useCallback } from 'react';
import { CATEGORIAS } from './welcomeConstants';

export function useProductosFiltrados(productos = []) {

    // ── ESTADO: cada filtro es una variable independiente ──────
    // useState(valor_inicial) devuelve [valorActual, funcionParaCambiarlo]

    // 'todos' | 'plato' | 'bebida'
    const [filtroCategoria, setFiltroCategoria] = useState('todos');

    // Array de IDs: e.g. [3, 7]
    // Semántica INCLUSIVA: mostrar productos que tengan TODOS estos ingredientes
    const [filtroIngredientes, setFiltroIngredientes] = useState([]);

    // Array de IDs: e.g. ['gluten', 'lacteos']
    // Semántica EXCLUSIVA: OCULTAR productos que tengan ALGUNO de estos alérgenos
    const [filtroAlergenos, setFiltroAlergenos] = useState([]);

    // Texto libre que escribe el usuario en el buscador
    const [busqueda, setBusqueda] = useState('');


    // ── PRODUCTOS FILTRADOS ────────────────────────────────────
    // useMemo solo recalcula cuando cambia alguna de las dependencias
    // del array final [...]. Si el usuario mueve el ratón pero no
    // toca ningún filtro, esta función NO se vuelve a ejecutar.
    const productosFiltrados = useMemo(() => {

        // Normalizamos la búsqueda: minúsculas y sin espacios al principio/final
        const termino = busqueda.toLowerCase().trim();

        // .filter() recorre el array y se queda solo con los que devuelven true
        return productos.filter(p => {

            // FILTRO 1 — Categoría
            // Si el filtro es 'todos' siempre pasa. Si no, el tipo del producto
            // debe coincidir exactamente con el filtro seleccionado.
            const coincideCategoria =
                filtroCategoria === 'todos' || p.tipo === filtroCategoria;

            // FILTRO 2 — Búsqueda por texto
            // Si el campo está vacío, todos pasan.
            // Si hay texto, buscamos en nombre Y en descripción.
            const coincideBusqueda =
                termino === '' ||
                p.nombre.toLowerCase().includes(termino) ||
                p.descripcion?.toLowerCase().includes(termino);
            // El ?. es "optional chaining": si descripcion es null/undefined
            // no da error, simplemente devuelve undefined

            // FILTRO 3 — Ingredientes
            // Si no hay ningún ingrediente seleccionado, todos pasan.
            // Si hay ingredientes, el producto debe tenerlos TODOS.
            // .every() devuelve true solo si la función es true para CADA elemento.
            const coincideIngredientes =
                filtroIngredientes.length === 0 ||
                filtroIngredientes.every(id =>
                    p.ingredientes?.some(ing => ing.id === id)
                    // .some() devuelve true si AL MENOS UN ingrediente del producto
                    // coincide con el id que estamos buscando
                );

            // FILTRO 4 — Alérgenos
            // Si no hay alérgenos marcados, todos pasan.
            // Si hay alérgenos, EXCLUIMOS el producto si contiene ALGUNO de ellos.
            // .some() aquí actúa como "¿tiene alguno de estos alérgenos?"
            // Con el ! delante: "pasa si NO tiene ninguno de estos alérgenos"
            const sinAlergenos =
                filtroAlergenos.length === 0 ||
                !filtroAlergenos.some(aid =>
                    p.alergenos?.includes(aid)
                );

            // El producto pasa el filtro solo si cumple LAS CUATRO condiciones
            return coincideCategoria && coincideBusqueda && coincideIngredientes && sinAlergenos;
        });
    }, [productos, filtroCategoria, busqueda, filtroIngredientes, filtroAlergenos]);
    // ↑ dependencias: si cambia cualquiera de estas, useMemo recalcula

    // ── CONTEO POR CATEGORÍA ───────────────────────────────────
    // Calcula cuántos productos hay en cada categoría para mostrar
    // el número al lado del botón en el sidebar. Ej: "Platos (12)"
    const conteoCategoria = useMemo(() => {
        // Empezamos con 'todos' que tiene el total completo
        const counts = { todos: productos.length };
        // Recorremos cada producto y sumamos 1 a su categoría
        productos.forEach(p => { counts[p.tipo] = (counts[p.tipo] ?? 0) + 1; });
        return counts;
    }, [productos]);



    // ── FLAGS Y TEXTOS DERIVADOS ───────────────────────────────

    // ¿Hay algún filtro activo? Lo usamos para mostrar/ocultar el botón "Limpiar filtros"
    const hayFiltros =
        filtroCategoria !== 'todos' ||
        busqueda !== '' ||
        filtroIngredientes.length > 0 ||
        filtroAlergenos.length > 0;

    // Título dinámico de la sección principal
    const tituloActual = busqueda !== ''
        ? `Resultados para "${busqueda}"`
        : CATEGORIAS.find(c => c.key === filtroCategoria)?.label ?? 'Menú Completo';


    // ── FUNCIONES PARA MODIFICAR FILTROS ──────────────────────
    // useCallback memoriza la función para que no se recree en cada render.
    // Esto optimiza el rendimiento cuando se pasan como props a componentes hijos.

    // Añade o quita un ingrediente del array de filtros
    const toggleIngrediente = useCallback((id) => {
        setFiltroIngredientes(prev =>
            // Si ya está en el array, lo quitamos con .filter()
            // Si no está, lo añademos con el spread ...prev
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    // Vacía el array de ingredientes de golpe
    const clearIngredientes = useCallback(() => setFiltroIngredientes([]), []);

    // Igual pero para alérgenos
    const toggleAlergeno = useCallback((id) => {
        setFiltroAlergenos(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const clearAlergenos = useCallback(() => setFiltroAlergenos([]), []);

    // Resetea TODOS los filtros a su valor inicial
    const limpiarFiltros = useCallback(() => {
        setFiltroCategoria('todos');
        setBusqueda('');
        setFiltroIngredientes([]);
        setFiltroAlergenos([]);
    }, []);

    // ── RETORNO DEL HOOK ───────────────────────────────────────
    // Todo lo que devolvemos aquí estará disponible en Welcome.jsx
    // al hacer: const { productosFiltrados, toggleAlergeno, ... } = useProductosFiltrados(productos)
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