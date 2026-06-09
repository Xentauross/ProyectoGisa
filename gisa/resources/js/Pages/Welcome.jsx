import { useState } from 'react';
import { Head } from '@inertiajs/react';

import WelcomeSidebar from './Welcome/WelcomeSidebar';
import HorizontalSection from './Welcome/HorizontalSection';
import ProductCard from './Welcome/ProductCard';
import HomeTab from './Welcome/HomeTab';
import { useProductosFiltrados } from './Welcome/useProductosFiltrados';

// ── CSS ──
import '/resources/css/welcome/variables.css';
import '/resources/css/welcome/layout.css';
import '/resources/css/welcome/sidebar.css';
import '/resources/css/welcome/ingredients.css';
import '/resources/css/welcome/cards.css';
import '/resources/css/welcome/responsive.css';
import '/resources/css/welcome/homeTab.css';
import '/resources/css/welcome/alergenos.css';

/**
 * Props que llegan desde WelcomeController.php vía Inertia:
 *   auth         → { user: {...} } o { user: null } si no hay sesión
 *   productos    → array con todos los productos de la BD (con ingredientes)
 *   recomendados → array de productos marcados como es_recomendado = true
 *   masVendidos  → array de los 5 productos más pedidos (con campo 'pedidos')
 *   ingredientes → array de todos los ingredientes disponibles
 */
export default function Welcome({
    auth,
    productos = [],
    recomendados = [],
    masVendidos = [],
    ingredientes = [],
}) {

    // ── ESTADO: qué pestaña está activa ───────────────────────
    // 'inicio' muestra HomeTab (info del restaurante + rankings)
    // 'carta'  muestra los filtros y el grid de productos
    const [pestañaActiva, setPestañaActiva] = useState('inicio');

    // ── HOOK DE FILTROS ────────────────────────────────────────
    // Desestructuramos todo lo que necesitamos del hook.
    // El hook recibe el array completo de productos y devuelve
    // los filtros, las funciones para cambiarlos y los productos filtrados.
    const {
        filtroCategoria, setFiltroCategoria,
        filtroIngredientes, toggleIngrediente, clearIngredientes,
        filtroAlergenos, toggleAlergeno, clearAlergenos,
        busqueda, setBusqueda,
        productosFiltrados,
        conteoCategoria,
        hayFiltros,
        tituloActual,
        limpiarFiltros,
    } = useProductosFiltrados(productos);

    // ── HANDLERS "ENVOLVENTES" ─────────────────────────────────
    // Estos handlers añaden un comportamiento extra a las funciones
    // del hook: además de cambiar el filtro, también cambian la pestaña
    // activa a 'carta' para que el usuario vea los resultados.

    // Cuando se selecciona una categoría → ir a 'carta'
    const handleSetFiltroCategoria = (cat) => {
        setFiltroCategoria(cat);
        setPestañaActiva('carta');
    };

    // Cuando se escribe en el buscador → ir a 'carta' (si hay texto)
    const handleSetBusqueda = (q) => {
        setBusqueda(q);
        if (q) setPestañaActiva('carta');
    };

    // Cuando se toglea un ingrediente → ir a 'carta'
    const handleToggleIngrediente = (id) => {
        toggleIngrediente(id);
        setPestañaActiva('carta');
    };

    // Cuando se toglea un alérgeno → ir a 'carta'
    const handleToggleAlergeno = (id) => {
        toggleAlergeno(id);
        setPestañaActiva('carta');
    };

    return (
        <>
            {/* Cambia el título de la pestaña del navegador */}
            <Head title="Carta — Gisa Restaurante" />

            {/* Contenedor principal: sidebar izquierda + contenido derecho */}
            <div className="layout-wrapper">

                {/* ── SIDEBAR ── */}
                {/* Pasamos los handlers envolventes (no las funciones del hook directamente)
                    para que cambiar un filtro también cambie la pestaña */}
                <WelcomeSidebar
                    busqueda={busqueda} setBusqueda={handleSetBusqueda}
                    filtroCategoria={filtroCategoria} setFiltroCategoria={handleSetFiltroCategoria}
                    filtroIngredientes={filtroIngredientes}
                    toggleIngrediente={handleToggleIngrediente}
                    clearIngredientes={clearIngredientes}
                    filtroAlergenos={filtroAlergenos}
                    toggleAlergeno={handleToggleAlergeno}
                    clearAlergenos={clearAlergenos}
                    ingredientes={ingredientes}
                    conteoCategoria={conteoCategoria}
                    auth={auth}
                    pestañaActiva={pestañaActiva}
                    setPestañaActiva={setPestañaActiva}
                />

                {/* ── CONTENIDO PRINCIPAL ── */}
                <main className="main-content">

                    {/* PESTAÑA INICIO: información del restaurante */}
                    {pestañaActiva === 'inicio' && (
                        <HomeTab
                            recomendados={recomendados}
                            masVendidos={masVendidos}
                        />
                    )}

                    {/* PESTAÑA CARTA: filtros + grid de productos */}
                    {pestañaActiva === 'carta' && (
                        <>
                            {/* Cabecera con título dinámico y botón de limpiar */}
                            <header className="top-header">
                                <div className="header-title-group">
                                    {/* tituloActual cambia según el filtro activo:
                                        "Platos", "Resultados para 'atún'", etc. */}
                                    <h1 className="section-title">{tituloActual}</h1>
                                    <p className="section-subtitle">
                                        {productosFiltrados.length === 0
                                            ? 'Sin resultados'
                                            : `${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto' : 'productos'}`
                                        }
                                    </p>
                                </div>
                                {/* El botón "Limpiar filtros" solo aparece si hay algún filtro activo */}
                                {hayFiltros && (
                                    <button className="limpiar-btn" onClick={limpiarFiltros}>
                                        Limpiar filtros <i className="ti ti-x" aria-hidden="true" />
                                    </button>
                                )}
                            </header>


                            {/* Secciones de scroll horizontal: solo se muestran sin filtros activos
                                para no confundir al usuario (mostrarían productos que podrían
                                no estar en los resultados filtrados) */}
                            {!hayFiltros && (
                                <>
                                    <HorizontalSection titulo="Sugerencias del Chef" productos={recomendados} />
                                    <HorizontalSection titulo="Los más solicitados" productos={masVendidos} divider />
                                    {(recomendados.length > 0 || masVendidos.length > 0) && (
                                        <h3 className="horizontal-title horizontal-title--full">Selección Completa</h3>
                                    )}
                                </>
                            )}

                            {/* Grid principal de productos */}
                            <section
                                className="products-grid"
                                aria-label="Lista de productos"
                                aria-live="polite"
                            >
                                {productosFiltrados.length === 0 ? (
                                    // Estado vacío: cuando los filtros no devuelven nada
                                    <div className="vacio" role="status">
                                        <i className="ti ti-search" aria-hidden="true" style={{ fontSize: '2rem' }} />
                                        <p>No encontramos platos con esas preferencias.</p>
                                        <button className="limpiar-btn" onClick={limpiarFiltros}>
                                            Limpiar filtros
                                        </button>
                                    </div>
                                ) : (
                                    // Estado normal: renderizamos una ProductCard por cada producto
                                    productosFiltrados.map(p => (
                                        <ProductCard
                                            key={p.id}
                                            producto={p}
                                            filtroIngredientes={filtroIngredientes}
                                            filtroAlergenos={filtroAlergenos}
                                            toggleAlergeno={handleToggleAlergeno}
                                            clearAlergenos={clearAlergenos}
                                        />
                                    ))
                                )}
                            </section>
                        </>
                    )}

                </main>
            </div>
        </>
    );
}