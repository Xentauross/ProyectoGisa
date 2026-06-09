// NOTA: todos los datos del restaurante están hardcodeados
// en este componente (INFO_RESTAURANTE). No vienen de la BD.
// Solo los rankings (recomendados y masVendidos) llegan como props.
import { memo } from 'react';
import MiniCard from './MiniCard';

// ── Datos estáticos del restaurante ──────────────────────────
// Están aquí y no en la BD porque no cambian frecuentemente
// y no necesitan gestión desde el panel de administración.
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

// ── Sub-componente: lista de ranking ─────────────────────────
/**
 * Muestra un ranking con barras de progreso proporcionales.
 * Props:
 *   titulo     → "Del Mercado Central"
 *   subtitulo  → "Lo mejor de la lonja hoy"
 *   productos  → array de productos a rankear
 *   colorBarra → color CSS para las barras de progreso
 */
const RankingList = memo(function RankingList({ titulo, subtitulo, productos, colorBarra }) {
    if (!productos?.length) return null;

    // Calcula el valor de cada producto para dimensionar su barra.
    // Si el producto tiene campo 'pedidos' (viene de masVendidos), lo usamos.
    // Si no (recomendados no tienen pedidos), usamos un valor decreciente artificial.
    const valorEfectivo = (p, i) => p.pedidos ?? (100 - i * 12);

    // El producto con más pedidos/valor será la barra al 100%.
    // Los demás serán proporcionales a él.
    const maxValor = Math.max(...productos.map((p, i) => valorEfectivo(p, i)), 1);
    // El segundo argumento ,1 evita división por cero si todos tienen 0 pedidos


    return (
        <div className="ht-rank-card">
            <h3 className="ht-rank-title">{titulo}</h3>
            <p className="ht-rank-sub">{subtitulo}</p>
            <ol className="ht-rank-list" aria-label={titulo}>
                {productos.map((p, i) => (
                    <li key={p.id} className="ht-rank-item">
                        {/* Número de posición con estilos especiales para top 3 */}
                        <span className={`ht-rank-pos ht-rank-pos--${i + 1}`} aria-hidden="true">
                            {i + 1}
                        </span>
                        <div className="ht-rank-info">
                            <span className="ht-rank-nombre">{p.nombre}</span>
                            {/* Barra de progreso: ancho proporcional al máximo */}
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
                        {/* Solo mostramos el número si es un dato real de pedidos */}
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


// ── Sub-componente: tarjeta de info rápida ───────────────────
/**
 * Pequeña tarjeta con icono, etiqueta y valor.
 * Usada para: horario hoy, teléfono, aforo, fundación.
 */
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

    // Detectamos el día actual para resaltarlo en la tabla de horarios.
    // toLocaleDateString con 'es-ES' y { weekday: 'long' } devuelve "lunes", "martes"...
    // Lo capitalizamos para que coincida con el objeto INFO_RESTAURANTE.
    const hoyRaw = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
    const hoy = hoyRaw.charAt(0).toUpperCase() + hoyRaw.slice(1);

    // Buscamos el horario de hoy para mostrarlo en la InfoCard
    const horarioHoy = r.horarios.find(h => h.dia === hoy);
    // si no encuentra el día, usa el horario genérico
    const valorHorarioHoy = horarioHoy?.cerrado ? 'Cerrado hoy' : (horarioHoy?.hora ?? r.horario);

    return (
        <section className="ht-root" aria-label="Inicio — información del restaurante">

            {/* ── Hero: nombre y descripción principal ── */}
            <header className="ht-hero">
                <p className="ht-kicker">Con sabor a Cádiz desde 1987</p>
                <h2 className="ht-nombre">{r.nombre}</h2>
                <p className="ht-slogan">{r.slogan}</p>
                {/* Badges decorativos con características del restaurante */}
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

            {/* ── Info rápida: 4 tarjetas pequeñas ── */}
            <div className="ht-info-grid" role="list" aria-label="Información del restaurante">
                <InfoCard icono={<i className="ti ti-clock" aria-hidden="true" />} label="Horario hoy" valor={valorHorarioHoy} />
                <InfoCard icono={<i className="ti ti-phone" aria-hidden="true" />} label="Reservas" valor={r.telefono} />
                <InfoCard icono={<i className="ti ti-users" aria-hidden="true" />} label="Aforo" valor={r.capacidad} />
                <InfoCard icono={<i className="ti ti-anchor" aria-hidden="true" />} label="Desde" valor={r.fundacion.split('·')[0].trim()} />
            </div>

            {/* ── Rankings en dos columnas ── */}
            <div className="ht-rankings" aria-label="Rankings de platos">
                {/* .slice(0, 5) → máximo 5 elementos aunque haya más */}
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

            {/* ── Historia y horarios en dos columnas ── */}
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

                    {/* Estadísticas numéricas */}
                    <ul className="ht-stats" aria-label="Estadísticas del restaurante">
                        {r.stats.map(s => (
                            <li key={s.label} className="ht-stat">
                                <span className="ht-stat-val">{s.valor}</span>
                                <span className="ht-stat-label">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                {/* Tabla de horarios */}
                <section className="ht-horarios" aria-label="Horarios semanales">
                    <h3 className="ht-horarios-title">¿Cuándo estamos?</h3>
                    <ul className="ht-horarios-list">
                        {r.horarios.map(h => (
                            <li
                                key={h.dia}
                                // Si es el día de hoy, añadimos clase especial para resaltarlo
                                className={`ht-horario-row ${h.dia === hoy ? 'ht-horario-row--hoy' : ''}`}
                            >
                                <span className="ht-horario-dia">
                                    {h.dia}
                                    {/* Badge "hoy" solo en el día actual */}
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

            {/* ── Pie de página informativo ── */}
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