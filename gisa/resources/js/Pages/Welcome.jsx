import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, productos = [], recomendados = [], masVendidos = [], ingredientes = [] }) {
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroCategoria, setFiltroCategoria] = useState('todos');
    const [filtroIngredientes, setFiltroIngredientes] = useState([]); // ids seleccionados
    const [busqueda, setBusqueda] = useState('');

    const tipos = ['todos', ...new Set(productos.map(p => p.tipo).filter(Boolean))];

    const categorias = [
        { key: 'todos', label: 'Todo' },
        { key: 'plato', label: '🍽 Platos' },
        { key: 'bebida', label: '🥤 Bebidas' },
    ];

    function toggleIngrediente(id) {
        setFiltroIngredientes(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    const productosFiltrados = productos.filter(p => {
        const coincideTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
        const coincideCategoria = filtroCategoria === 'todos' || p.tipo === filtroCategoria;
        const coincideBusqueda = busqueda === '' ||
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideIngredientes = filtroIngredientes.length === 0 ||
            filtroIngredientes.every(id => p.ingredientes?.some(ing => ing.id === id));
        return coincideTipo && coincideCategoria && coincideBusqueda && coincideIngredientes;
    });

    const hayFiltros = filtroTipo !== 'todos' || filtroCategoria !== 'todos' ||
        busqueda !== '' || filtroIngredientes.length > 0;

    function limpiarFiltros() {
        setFiltroTipo('todos');
        setFiltroCategoria('todos');
        setBusqueda('');
        setFiltroIngredientes([]);
    }

    return (
        <>
            <Head title="Carta" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                * { box-sizing:border-box; margin:0; padding:0; }
                body { background:#0f0e0c; }

                .carta-root { font-family:'DM Sans',sans-serif; background:#0f0e0c; color:#f0ebe3; min-height:100vh; }

                .header { position:sticky; top:0; z-index:50; background:rgba(15,14,12,0.92); backdrop-filter:blur(12px); border-bottom:1px solid rgba(212,176,112,0.15); padding:14px 20px; display:flex; align-items:center; justify-content:space-between; }
                .header-logo { font-family:'Playfair Display',serif; font-size:1.4rem; color:#d4b070; letter-spacing:.04em; }
                .header-logo span { font-style:italic; color:#f0ebe3; }
                .btn-nav { font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500; letter-spacing:.06em; text-transform:uppercase; padding:7px 16px; border-radius:999px; border:1px solid rgba(212,176,112,0.4); color:#d4b070; background:transparent; cursor:pointer; text-decoration:none; transition:all .2s; }
                .btn-nav:hover, .btn-nav-solid { background:#d4b070; color:#0f0e0c; border-color:#d4b070; }

                .hero { padding:48px 20px 36px; text-align:center; position:relative; overflow:hidden; }
                .hero::before { content:''; position:absolute; top:-60px; left:50%; transform:translateX(-50%); width:400px; height:400px; background:radial-gradient(circle,rgba(212,176,112,.08) 0%,transparent 70%); pointer-events:none; }
                .hero-eyebrow { font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; color:#d4b070; margin-bottom:12px; }
                .hero-title { font-family:'Playfair Display',serif; font-size:clamp(2.2rem,8vw,3.8rem); font-weight:400; line-height:1.1; color:#f0ebe3; margin-bottom:12px; }
                .hero-title em { font-style:italic; color:#d4b070; }
                .hero-sub { font-size:.95rem; color:rgba(240,235,227,.5); font-weight:300; }

                .section { padding:0 16px 40px; max-width:640px; margin:0 auto; }
                .section-title { font-family:'Playfair Display',serif; font-size:1.25rem; font-weight:400; color:#f0ebe3; margin-bottom:4px; }
                .section-sub { font-size:.78rem; color:rgba(240,235,227,.4); letter-spacing:.05em; text-transform:uppercase; margin-bottom:16px; }

                .cards-scroll { display:flex; gap:12px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; }
                .cards-scroll::-webkit-scrollbar { display:none; }
                .card-dest { flex:0 0 160px; background:rgba(255,255,255,.04); border:1px solid rgba(212,176,112,.12); border-radius:14px; padding:16px; transition:transform .2s,border-color .2s; }
                .card-dest:hover { transform:translateY(-3px); border-color:rgba(212,176,112,.35); }
                .card-dest-emoji { font-size:2rem; margin-bottom:8px; display:block; }
                .card-dest-nombre { font-family:'Playfair Display',serif; font-size:.95rem; color:#f0ebe3; margin-bottom:4px; line-height:1.2; }
                .card-dest-precio { font-size:.9rem; color:#d4b070; font-weight:500; }
                .card-dest-desc { font-size:.72rem; color:rgba(240,235,227,.45); margin-top:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

                .divider { margin:8px auto 32px; height:1px; background:linear-gradient(to right,transparent,rgba(212,176,112,.2),transparent); max-width:640px; }

                /* ── Filtros ── */
                .filtros-wrap { max-width:640px; margin:0 auto; padding:0 16px 20px; }
                .filtros-titulo { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:400; color:#f0ebe3; margin-bottom:16px; }
                .filtros-busqueda { width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(212,176,112,.2); border-radius:999px; padding:10px 18px; color:#f0ebe3; font-family:'DM Sans',sans-serif; font-size:.9rem; outline:none; margin-bottom:12px; transition:border-color .2s; }
                .filtros-busqueda::placeholder { color:rgba(240,235,227,.3); }
                .filtros-busqueda:focus { border-color:rgba(212,176,112,.5); }

                .filtros-pills { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; margin-bottom:10px; }
                .filtros-pills::-webkit-scrollbar { display:none; }
                .pill { flex:0 0 auto; padding:6px 16px; border-radius:999px; border:1px solid rgba(212,176,112,.2); background:transparent; color:rgba(240,235,227,.6); font-family:'DM Sans',sans-serif; font-size:.8rem; cursor:pointer; transition:all .18s; white-space:nowrap; }
                .pill:hover { border-color:rgba(212,176,112,.5); color:#f0ebe3; }
                .pill-active { background:#d4b070; border-color:#d4b070; color:#0f0e0c; font-weight:500; }

                /* Ingredientes desplegable */
                .ing-titulo { font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(240,235,227,.4); margin-bottom:8px; }
                .ing-grid { display:flex; flex-wrap:wrap; gap:6px; }
                .ing-chip { padding:5px 12px; border-radius:999px; border:1px solid rgba(212,176,112,.15); background:transparent; color:rgba(240,235,227,.55); font-family:'DM Sans',sans-serif; font-size:.75rem; cursor:pointer; transition:all .18s; white-space:nowrap; }
                .ing-chip:hover { border-color:rgba(212,176,112,.4); color:#f0ebe3; }
                .ing-chip-active { background:rgba(212,176,112,.15); border-color:rgba(212,176,112,.5); color:#d4b070; }

                .limpiar-btn { font-size:.72rem; color:rgba(212,176,112,.6); background:transparent; border:none; cursor:pointer; text-decoration:underline; margin-top:8px; font-family:'DM Sans',sans-serif; }
                .limpiar-btn:hover { color:#d4b070; }

                .tabs { display:flex; gap:0; margin-bottom:20px; border-bottom:1px solid rgba(212,176,112,.15); }
                .tab { flex:1; padding:10px; text-align:center; font-size:.85rem; font-family:'DM Sans',sans-serif; background:transparent; border:none; color:rgba(240,235,227,.45); cursor:pointer; border-bottom:2px solid transparent; transition:all .18s; margin-bottom:-1px; }
                .tab-active { color:#d4b070; border-bottom-color:#d4b070; }

                .productos-lista { max-width:640px; margin:0 auto; padding:0 16px 80px; display:flex; flex-direction:column; gap:1px; }
                .producto-item { display:flex; align-items:center; gap:14px; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.06); }
                .producto-item:last-child { border-bottom:none; }
                .producto-emoji { font-size:2rem; flex:0 0 48px; text-align:center; }
                .producto-info { flex:1; min-width:0; }
                .producto-nombre { font-family:'Playfair Display',serif; font-size:1rem; color:#f0ebe3; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .producto-desc { font-size:.78rem; color:rgba(240,235,227,.4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .producto-tags { display:flex; gap:4px; flex-wrap:wrap; margin-top:5px; }
                .tag { font-size:.65rem; padding:2px 8px; border-radius:999px; background:rgba(212,176,112,.1); color:rgba(212,176,112,.8); border:1px solid rgba(212,176,112,.15); }
                .tag-match { background:rgba(212,176,112,.25); color:#d4b070; border-color:rgba(212,176,112,.4); }
                .producto-precio { font-size:1rem; font-weight:500; color:#d4b070; flex:0 0 auto; text-align:right; }
                .badge-rec { display:inline-block; font-size:.6rem; text-transform:uppercase; letter-spacing:.08em; padding:2px 7px; background:rgba(212,176,112,.15); color:#d4b070; border-radius:999px; margin-left:6px; vertical-align:middle; }
                .vacio { text-align:center; padding:48px 0; color:rgba(240,235,227,.3); font-size:.9rem; }
                .footer { text-align:center; padding:20px; font-size:.72rem; color:rgba(240,235,227,.2); letter-spacing:.05em; }
            `}</style>

            <div className="carta-root">
                {/* Header */}
                <header className="header">
                    <div className="header-logo">Gisa <span>Restaurante</span></div>
                    <nav>
                        {auth.user
                            ? <Link href={route('dashboard')} className="btn-nav btn-nav-solid">Panel</Link>
                            : <Link href={route('login')} className="btn-nav">Acceder</Link>
                        }
                    </nav>
                </header>

                {/* Hero */}
                <div className="hero">
                    <p className="hero-eyebrow">Bienvenido</p>
                    <h1 className="hero-title">Nuestra <em>carta</em></h1>
                    <p className="hero-sub">Cocina de temporada · Ingredientes locales</p>
                </div>

                {/* Recomendados */}
                {recomendados.length > 0 && (
                    <div className="section">
                        <p className="section-sub">Chef recomienda</p>
                        <h2 className="section-title">Platos recomendados</h2>
                        <div className="cards-scroll">
                            {recomendados.map(p => (
                                <div key={p.id} className="card-dest">
                                    <span className="card-dest-emoji">{emojiTipo(p.tipo)}</span>
                                    <div className="card-dest-nombre">{p.nombre}</div>
                                    <div className="card-dest-precio">{Number(p.precio).toFixed(2)} €</div>
                                    {p.descripcion && <div className="card-dest-desc">{p.descripcion}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="divider" />

                {/* Más vendidos */}
                {masVendidos.length > 0 && (
                    <div className="section">
                        <p className="section-sub">Los favoritos</p>
                        <h2 className="section-title">Más pedidos</h2>
                        <div className="cards-scroll">
                            {masVendidos.map(p => (
                                <div key={p.id} className="card-dest">
                                    <span className="card-dest-emoji">{emojiTipo(p.tipo)}</span>
                                    <div className="card-dest-nombre">{p.nombre}</div>
                                    <div className="card-dest-precio">{Number(p.precio).toFixed(2)} €</div>
                                    {p.descripcion && <div className="card-dest-desc">{p.descripcion}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="divider" />

                {/* Filtros */}
                <div className="filtros-wrap">
                    <h2 className="filtros-titulo">La carta completa</h2>

                    <input
                        type="search"
                        placeholder="Buscar plato o bebida..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="filtros-busqueda"
                    />

                    {/* Pills de tipo */}
                    <div className="filtros-pills">
                        {tipos.map(t => (
                            <button key={t} onClick={() => setFiltroTipo(t)}
                                className={`pill ${filtroTipo === t ? 'pill-active' : ''}`}>
                                {t === 'todos' ? 'Todos los tipos' : t}
                            </button>
                        ))}
                    </div>

                    {/* Filtro por ingredientes */}
                    {ingredientes.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                            <p className="ing-titulo">Filtrar por ingrediente</p>
                            <div className="ing-grid">
                                {ingredientes.map(ing => (
                                    <button
                                        key={ing.id}
                                        onClick={() => toggleIngrediente(ing.id)}
                                        className={`ing-chip ${filtroIngredientes.includes(ing.id) ? 'ing-chip-active' : ''}`}
                                    >
                                        {filtroIngredientes.includes(ing.id) ? '✓ ' : ''}{ing.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {hayFiltros && (
                        <button className="limpiar-btn" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Tabs plato/bebida */}
                <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
                    <div className="tabs">
                        {categorias.map(c => (
                            <button key={c.key} onClick={() => setFiltroCategoria(c.key)}
                                className={`tab ${filtroCategoria === c.key ? 'tab-active' : ''}`}>
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="productos-lista">
                    {productosFiltrados.length === 0 ? (
                        <div className="vacio">
                            No hay productos con esos filtros
                            {hayFiltros && <><br /><button className="limpiar-btn" onClick={limpiarFiltros} style={{ marginTop: 8 }}>Limpiar filtros</button></>}
                        </div>
                    ) : (
                        productosFiltrados.map(p => (
                            <div key={p.id} className="producto-item">
                                <div className="producto-emoji">{emojiTipo(p.tipo)}</div>
                                <div className="producto-info">
                                    <div className="producto-nombre">
                                        {p.nombre}
                                        {p.es_recomendado && <span className="badge-rec">✦ Chef</span>}
                                    </div>
                                    {p.descripcion && <div className="producto-desc">{p.descripcion}</div>}
                                    {p.ingredientes?.length > 0 && (
                                        <div className="producto-tags">
                                            {p.ingredientes.slice(0, 4).map(ing => (
                                                <span key={ing.id}
                                                    className={`tag ${filtroIngredientes.includes(ing.id) ? 'tag-match' : ''}`}>
                                                    {ing.nombre}
                                                </span>
                                            ))}
                                            {p.ingredientes.length > 4 && <span className="tag">+{p.ingredientes.length - 4}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="producto-precio">{Number(p.precio).toFixed(2)} €</div>
                            </div>
                        ))
                    )}
                </div>

                <footer className="footer">© Gisa Restaurante · Todos los derechos reservados</footer>
            </div>
        </>
    );
}

function emojiTipo(tipo) {
    if (!tipo) return '🍽';
    const t = tipo.toLowerCase();
    if (t === 'bebida') return '🥤';
    return '🍽';
}