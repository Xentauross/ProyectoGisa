import { memo } from 'react';
import MiniCard from './MiniCard';

// ── Datos del restaurante gaditano ──────────────────────
const INFO_RESTAURANTE = {
    nombre: 'Restaurante Gisa',
    slogan: 'Cocina gaditana de toda la vida con un toque de arte. Del Mercado Central a tu mesa: pescaíto, mariscos de la Bahía y los sabores que saben a Cádiz.',
    direccion: 'Calle Virgen de la Palma 8, La Viña · Cádiz',
    telefono: '956 22 18 45',
    horario: '13:00 — 23:30',
    capacidad: '52 comensales',
    fundacion: '1987 · 38 años',
    valoracion: '4.9 · Google Reviews',
    bio: 'Gisa abrió sus puertas en pleno barrio de La Viña con una misión clara: cocinar como se ha hecho siempre en Cádiz, pero sin miedo a darle una vuelta. Aquí el pescado viene directo de la lonja, las tortillitas las hacemos como las de tu abuela y el atún rojo de almadraba es el rey de la casa. Somos de Carnaval, de terraceo y de buenos caldos. Un pedacito de Cádiz donde los gaditanos se sienten como en casa y los forasteros se enamoran.',
    stats: [
        { valor: '38', label: 'Años al pie del cañón' },
        { valor: '+15k', label: 'Clientes al año' },
        { valor: '52', label: 'Platos en carta' },
        { valor: '2', label: 'Generaciones' },
    ],
    horarios: [
        { dia: 'Lunes', hora: 'Cerrado', cerrado: true },
        { dia: 'Martes', hora: '13:00 – 23:30', cerrado: false },
        { dia: 'Miércoles', hora: '13:00 – 23:30', cerrado: false },
        { dia: 'Jueves', hora: '13:00 – 23:30', cerrado: false },
        { dia: 'Viernes', hora: '13:00 – 00:30', cerrado: false },
        { dia: 'Sábado', hora: '12:00 – 01:00', cerrado: false },
        { dia: 'Domingo', hora: '12:00 – 23:00', cerrado: false },
    ],
};

// ── Sub-componentes ───────────────────────────────────────

const RankingList = memo(function RankingList({ titulo, subtitulo, productos, colorBarra }) {
    if (!productos?.length) return null;

    const valorEfectivo = (p, i) => p.pedidos ?? (100 - i * 12);
    const maxValor = Math.max(...productos.map((p, i) => valorEfectivo(p, i)), 1);

    return (
        <div className="ht-rank-card">
            <h3 className="ht-rank-title">{titulo}</h3>
            <p className="ht-rank-sub">{subtitulo}</p>
            <ol className="ht-rank-list" aria-label={titulo}>
                {productos.map((p, i) => (
                    <li key={p.id} className="ht-rank-item">
                        <span className={`ht-rank-pos ht-rank-pos--${i + 1}`} aria-hidden="true">
                            {i + 1}
                        </span>
                        <div className="ht-rank-info">
                            <span className="ht-rank-nombre">{p.nombre}</span>
                            <div className="ht-rank-bar-wrap" aria-hidden="true">
                                <div
                                    className="ht-rank-bar"
                                    style={{
                                        width: `${(valorEfectivo(p, i) / maxValor) * 100}%`,
                                        background: colorBarra,
                                    }}
                                />
                            </div>
                        </div>
                        {p.pedidos != null && (
                            <span className="ht-rank-meta" aria-label={`${p.pedidos} pedidos`}>
                                {p.pedidos}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
});

const InfoCard = memo(function InfoCard({ icono, label, valor }) {
    return (
        <div className="ht-info-card">
            <span className="ht-info-icon" aria-hidden="true">{icono}</span>
            <p className="ht-info-label">{label}</p>
            <p className="ht-info-valor">{valor}</p>
        </div>
    );
});

// ── Componente principal ──────────────────────────────────

const HomeTab = memo(function HomeTab({ recomendados = [], masVendidos = [] }) {
    const r = INFO_RESTAURANTE;

    // Día actual en español capitalizado
    const hoyRaw = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
    const hoy = hoyRaw.charAt(0).toUpperCase() + hoyRaw.slice(1);

    const horarioHoy = r.horarios.find(h => h.dia === hoy);
    const valorHorarioHoy = horarioHoy?.cerrado ? 'Cerrado hoy' : (horarioHoy?.hora ?? r.horario);

    return (
        <section className="ht-root" aria-label="Inicio — información del restaurante">

            {/* Hero */}
            <header className="ht-hero">
                <p className="ht-kicker">Con sabor a Cádiz desde 1987</p>
                <h2 className="ht-nombre">{r.nombre}</h2>
                <p className="ht-slogan">{r.slogan}</p>
                <div className="flex flex-wrap gap-2" aria-label="Datos rápidos">
                    <span className="text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1 text-white-800 border border-purple-200">
                        Barrio de La Viña
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1 text-white-800 border border-amber-200">
                        <i className="ti ti-star" aria-hidden="true" /> {r.valoracion}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1 text-white-800 border border-orange-200">
                        Casa oficial del Carnaval
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1  text-white-800 border border-teal-200">
                        Producto de la Bahía
                    </span>
                </div>
            </header>

            {/* Info rápida */}
            <div className="ht-info-grid" role="list" aria-label="Información del restaurante">
                <InfoCard icono={<i className="ti ti-clock" aria-hidden="true" />} label="Horario hoy" valor={valorHorarioHoy} />
                <InfoCard icono={<i className="ti ti-phone" aria-hidden="true" />} label="Reservas" valor={r.telefono} />
                <InfoCard icono={<i className="ti ti-users" aria-hidden="true" />} label="Aforo" valor={r.capacidad} />
                <InfoCard icono={<i className="ti ti-anchor" aria-hidden="true" />} label="Desde" valor={r.fundacion.split('·')[0].trim()} />
            </div>

            {/* Rankings en paralelo */}
            <div className="ht-rankings" aria-label="Rankings de platos">
                <RankingList
                    titulo="Del Mercado Central"
                    subtitulo="Lo mejor de la lonja hoy"
                    productos={recomendados.slice(0, 5)}
                    colorBarra="#1e7a9e"
                />
                <RankingList
                    titulo="Los de siempre"
                    subtitulo="Lo más pedido en La Viña"
                    productos={masVendidos.slice(0, 5)}
                    colorBarra="#d4911f"
                />
            </div>

            <div className="info-horarios">
                {/* Sobre el restaurante */}
                <article className="ht-about" aria-label="Sobre el restaurante">
                    <div className="ht-about-header">
                        <div>
                            <h3 className="ht-about-title">La historia de Gisa</h3>
                            <p className="ht-about-address"><i className="ti ti-map-pin" aria-hidden="true" /> {r.direccion}</p>
                        </div>
                        <span className="ht-badge-open" aria-label="Estado: abierto ahora">
                            Abierto ahora
                        </span>
                    </div>
                    <p className="ht-about-bio">{r.bio}</p>
                    <ul className="ht-stats" aria-label="Estadísticas del restaurante">
                        {r.stats.map(s => (
                            <li key={s.label} className="ht-stat">
                                <span className="ht-stat-val">{s.valor}</span>
                                <span className="ht-stat-label">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                {/* Horarios */}
                <section className="ht-horarios" aria-label="Horarios semanales">
                    <h3 className="ht-horarios-title">¿Cuándo estamos?</h3>
                    <ul className="ht-horarios-list">
                        {r.horarios.map(h => (
                            <li
                                key={h.dia}
                                className={`ht-horario-row ${h.dia === hoy ? 'ht-horario-row--hoy' : ''}`}
                            >
                                <span className="ht-horario-dia">
                                    {h.dia}
                                    {h.dia === hoy && <span className="ht-horario-hoy-badge">hoy</span>}
                                </span>
                                <span className={h.cerrado ? 'ht-horario-cerrado' : 'ht-horario-hora'}>
                                    {h.hora}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Footer informativo */}
            <footer className="ht-footer">
                <p className="ht-footer-text">
                    Nos encanta el Carnaval, la playa de La Caleta y las tardes de vino.
                    Si vienes en febrero, pregunta por nuestro menú especial chirigotero.
                </p>
                <p className="ht-footer-contacto">
                    <i className="ti ti-phone" aria-hidden="true" /> <strong>{r.telefono}</strong> · <i className="ti ti-mail" aria-hidden="true" /> reservas@restaurantegisa.es
                </p>
            </footer>

        </section>
    );
});

export default HomeTab;