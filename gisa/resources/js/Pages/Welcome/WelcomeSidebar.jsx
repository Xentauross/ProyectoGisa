import { memo } from 'react';
import { Link } from '@inertiajs/react';
import { CATEGORIAS } from './welcomeConstants';
import IngredienteSelect from './IngredienteSelect';
import AlergenoSelect from './AlergenoSelect';

const WelcomeSidebar = memo(function WelcomeSidebar({
    // Filtro de búsqueda global
    busqueda, setBusqueda,
    // Filtro de categoría (platos / bebidas / todos)
    filtroCategoria, setFiltroCategoria,
    // Filtros de ingredientes
    filtroIngredientes, toggleIngrediente, clearIngredientes,
    // Filtros de alérgenos
    filtroAlergenos, toggleAlergeno, clearAlergenos,
    // Lista de ingredientes disponibles (viene del servidor)
    ingredientes,
    // Cuántos productos hay en cada categoría (para mostrar el número)
    conteoCategoria,
    // Datos del usuario logueado (o null si no hay sesión)
    auth,
    // Pestaña activa: 'inicio' | 'carta'
    pestañaActiva,
    setPestañaActiva,
}) {
    return (
        <aside className="sidebar" aria-label="Filtros y navegación">

            {/* ── MARCA / LOGO ── */}
            <div className="brand" role="banner">
                <span className="brand-name">Gisa</span>
                <span className="brand-sub">Restaurant</span>
            </div>

            {/* ── NAVEGACIÓN PRINCIPAL (Inicio / Carta) ── */}
            <nav className="nav-section" aria-label="Secciones principales">
                <ul className="filter-list" role="list">
                    <li>
                        <button
                            onClick={() => setPestañaActiva('inicio')}
                            className={`filter-btn ${pestañaActiva === 'inicio' ? 'active' : ''}`}
                            aria-pressed={pestañaActiva === 'inicio'}
                        >
                            <span className="filter-btn-label">Inicio</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setPestañaActiva('carta')}
                            className={`filter-btn ${pestañaActiva === 'carta' ? 'active' : ''}`}
                            aria-pressed={pestañaActiva === 'carta'}
                        >
                            <span className="filter-btn-label">Carta completa</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* ── FILTROS: solo visibles en la pestaña 'carta' ── */}
            {/* Renderizado condicional: si pestañaActiva !== 'carta', todo esto desaparece */}
            {pestañaActiva === 'carta' && (
                <>
                    {/* Buscador de texto libre */}
                    <section className="nav-section">
                        <h2 className="nav-section-title">Buscar en carta</h2>
                        <div className="search-wrapper">
                            <span className="search-icon" aria-hidden="true"><i className="ti ti-search" /></span>
                            <input
                                type="search"
                                placeholder="Plato, ingrediente, bebida..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                className="search-input"
                                aria-label="Buscar productos"
                                autoComplete="off"
                            />
                            {/* Botón X para borrar: solo aparece si hay texto escrito */}
                            {busqueda && (
                                <button className="search-clear" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda"><i className="ti ti-x" aria-hidden="true" /></button>
                            )}
                        </div>
                    </section>

                    {/* Filtro por categoría */}
                    <nav className="nav-section" aria-label="Categorías">
                        <h2 className="nav-section-title">Categorías</h2>
                        <ul className="filter-list" role="list">
                            {CATEGORIAS.map(c => (
                                <li key={c.key}>
                                    <button
                                        onClick={() => setFiltroCategoria(c.key)}
                                        className={`filter-btn ${filtroCategoria === c.key ? 'active' : ''}`}
                                        aria-pressed={filtroCategoria === c.key}
                                    >
                                        <span className="filter-btn-icon" aria-hidden="true">{c.icon}</span>
                                        <span className="filter-btn-label">{c.label}</span>
                                        {/* Número de productos en esta categoría */}
                                        <span className="filter-btn-count">{conteoCategoria[c.key] ?? 0}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Filtro por ingredientes (solo si existen ingredientes en BD) */}
                    {ingredientes.length > 0 && (
                        <section className="nav-section" aria-label="Filtrar por ingrediente">
                            <h2 className="nav-section-title">Ingredientes</h2>
                            {/* Pasamos todas las props necesarias al componente hijo */}
                            <IngredienteSelect
                                ingredientes={ingredientes}
                                filtroIngredientes={filtroIngredientes}
                                toggleIngrediente={toggleIngrediente}
                                onClear={clearIngredientes}
                            />
                        </section>
                    )}

                    {/* Filtro de alérgenos a evitar */}
                    <section className="nav-section" aria-label="Filtrar por alérgenos">
                        <h2 className="nav-section-title">Alérgenos a evitar</h2>
                        <AlergenoSelect
                            filtroAlergenos={filtroAlergenos}
                            toggleAlergeno={toggleAlergeno}
                            onClear={clearAlergenos}
                        />
                    </section>
                </>
            )}

            {/* ── AUTENTICACIÓN ── */}
            {/* Muestra enlace al panel si hay sesión, o al login si no */}
            <div className="auth-links">
                {auth.user ? (
                    <>
                        <span className="auth-welcome">Hola, {auth.user.name}</span>
                        <Link href={route('dashboard')} className="btn-auth btn-panel">Panel de Control</Link>
                    </>
                ) : (
                    <Link href={route('login')} className="btn-auth btn-login">Acceso Empleados</Link>
                )}
            </div>
        </aside>
    );
});

export default WelcomeSidebar;