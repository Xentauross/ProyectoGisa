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


export default function Welcome({
    auth,
    productos = [],
    recomendados = [],
    masVendidos = [],
    ingredientes = [],
}) {
    const [pestañaActiva, setPestañaActiva] = useState('inicio');

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

    const handleSetFiltroCategoria = (cat) => {
        setFiltroCategoria(cat);
        setPestañaActiva('carta');
    };
    const handleSetBusqueda = (q) => {
        setBusqueda(q);
        if (q) setPestañaActiva('carta');
    };
    const handleToggleIngrediente = (id) => {
        toggleIngrediente(id);
        setPestañaActiva('carta');
    };
    const handleToggleAlergeno = (id) => {
        toggleAlergeno(id);
        setPestañaActiva('carta');
    };

    return (
        <>
            <Head title="Carta — Gisa Restaurante" />

            <div className="layout-wrapper">
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

                <main className="main-content">

                    {pestañaActiva === 'inicio' && (
                        <HomeTab
                            recomendados={recomendados}
                            masVendidos={masVendidos}
                        />
                    )}

                    {pestañaActiva === 'carta' && (
                        <>
                            <header className="top-header">
                                <div className="header-title-group">
                                    <h1 className="section-title">{tituloActual}</h1>
                                    <p className="section-subtitle">
                                        {productosFiltrados.length === 0
                                            ? 'Sin resultados'
                                            : `${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto' : 'productos'}`
                                        }
                                    </p>
                                </div>
                                {hayFiltros && (
                                    <button className="limpiar-btn" onClick={limpiarFiltros}>
                                        Limpiar filtros <i className="ti ti-x" aria-hidden="true" />
                                    </button>
                                )}
                            </header>

                            {!hayFiltros && (
                                <>
                                    <HorizontalSection titulo="Sugerencias del Chef" productos={recomendados} />
                                    <HorizontalSection titulo="Los más solicitados" productos={masVendidos} divider />
                                    {(recomendados.length > 0 || masVendidos.length > 0) && (
                                        <h3 className="horizontal-title horizontal-title--full">Selección Completa</h3>
                                    )}
                                </>
                            )}

                            <section
                                className="products-grid"
                                aria-label="Lista de productos"
                                aria-live="polite"
                            >
                                {productosFiltrados.length === 0 ? (
                                    <div className="vacio" role="status">
                                        <i className="ti ti-search" aria-hidden="true" style={{ fontSize: '2rem' }} />
                                        <p>No encontramos platos con esas preferencias.</p>
                                        <button className="limpiar-btn" onClick={limpiarFiltros}>
                                            Limpiar filtros
                                        </button>
                                    </div>
                                ) : (
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