import { memo } from 'react';
import { Link } from '@inertiajs/react';
import { CATEGORIAS } from './welcomeConstants';
import IngredienteSelect from './IngredienteSelect';
import AlergenoSelect from './AlergenoSelect';

const WelcomeSidebar = memo(function WelcomeSidebar({
    busqueda, setBusqueda,
    filtroCategoria, setFiltroCategoria,
    filtroIngredientes, toggleIngrediente, clearIngredientes,
    filtroAlergenos, toggleAlergeno, clearAlergenos,
    ingredientes,
    conteoCategoria,
    auth,
    pestañaActiva,
    setPestañaActiva,
}) {
    return (
        <aside className="sidebar" aria-label="Filtros y navegación">
            <div className="brand" role="banner">
                <span className="brand-name">Gisa</span>
                <span className="brand-sub">Restaurant</span>
            </div>

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

            {pestañaActiva === 'carta' && (
                <>
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
                            {busqueda && (
                                <button className="search-clear" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda"><i className="ti ti-x" aria-hidden="true" /></button>
                            )}
                        </div>
                    </section>

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
                                        <span className="filter-btn-count">{conteoCategoria[c.key] ?? 0}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {ingredientes.length > 0 && (
                        <section className="nav-section" aria-label="Filtrar por ingrediente">
                            <h2 className="nav-section-title">Ingredientes</h2>
                            <IngredienteSelect
                                ingredientes={ingredientes}
                                filtroIngredientes={filtroIngredientes}
                                toggleIngrediente={toggleIngrediente}
                                onClear={clearIngredientes}
                            />
                        </section>
                    )}

                    {/* ── ALÉRGENOS ── */}
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