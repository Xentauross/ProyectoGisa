import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ auth, miPerfil, misHorarios = [] }) {
    const hoy = new Date();
    const [mesVista, setMesVista] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
    const [turnoActivo, setTurnoActivo] = useState(null); // turno seleccionado para editar

    const diasEnMes = new Date(mesVista.year, mesVista.month + 1, 0).getDate();
    const primerDia = new Date(mesVista.year, mesVista.month, 1).getDay();
    const offset = (primerDia + 6) % 7;

    const nombresMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    function turnosDia(dia) {
        return misHorarios.filter(h => {
            const d = new Date(h.inicio_turno);
            return d.getFullYear() === mesVista.year &&
                d.getMonth() === mesVista.month &&
                d.getDate() === dia;
        });
    }

    function colorEstado(estado) {
        return estado === 'confirmado' ? '#22c55e'
            : estado === 'cancelado' ? '#ef4444'
                : '#f59e0b';
    }

    const prevMes = () => setMesVista(v => {
        const d = new Date(v.year, v.month - 1, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
    });
    const nextMes = () => setMesVista(v => {
        const d = new Date(v.year, v.month + 1, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const proximosTurnos = [...misHorarios]
        .sort((a, b) => new Date(a.inicio_turno) - new Date(b.inicio_turno))
        .slice(0, 6);

    const iniciales = auth.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const perfilId = miPerfil?.id;

    // ── Actualizar turno ─────────────────────────────────────
    function guardarTurno(e) {
        e.preventDefault();
        const form = e.target;
        router.patch(route('mis-turnos.update', turnoActivo.id), {
            estado: form.estado.value,
            inicio_turno: form.inicio_turno.value || null,
            fin_turno: form.fin_turno.value || null,
        }, {
            preserveScroll: true,
            onSuccess: () => setTurnoActivo(null),
        });
    }

    function fmtDatetimeLocal(iso) {
        if (!iso) return '';
        return iso.slice(0, 16);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

                .db-root { font-family:'Sora',sans-serif; background:#f5f4f0; min-height:100vh; padding:24px 16px 48px; }
                @media(min-width:640px){.db-root{padding:32px 24px 64px;}}

                .db-grid { max-width:960px; margin:0 auto; display:grid; gap:20px; grid-template-columns:1fr; }
                @media(min-width:768px){ .db-grid{ grid-template-columns:300px 1fr; } }

                .card-bienvenida {
                    background:#1a1917; border-radius:20px; padding:28px 24px;
                    display:flex; align-items:center; gap:18px; grid-column:1/-1;
                    position:relative; overflow:hidden;
                }
                .card-bienvenida::before {
                    content:''; position:absolute; top:-40px; right:-40px;
                    width:180px; height:180px;
                    background:radial-gradient(circle,rgba(251,191,36,.18) 0%,transparent 70%);
                    pointer-events:none;
                }
                .avatar { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#fbbf24,#f59e0b); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:600; color:#1a1917; flex-shrink:0; }
                .bienvenida-texto h3 { font-family:'Instrument Serif',serif; font-size:1.35rem; font-weight:400; color:#fafaf9; margin-bottom:2px; }
                .bienvenida-texto p  { font-size:.78rem; color:rgba(250,250,249,.45); text-transform:uppercase; letter-spacing:.07em; }
                .badge-rol { margin-left:auto; padding:5px 14px; border-radius:999px; background:rgba(251,191,36,.12); border:1px solid rgba(251,191,36,.25); color:#fbbf24; font-size:.72rem; letter-spacing:.06em; text-transform:uppercase; white-space:nowrap; }

                .card { background:#fff; border-radius:20px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04); }
                .card-label { font-size:.68rem; text-transform:uppercase; letter-spacing:.1em; color:#a8a29e; margin-bottom:16px; display:block; }
                .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
                .btn-sm { font-size:.72rem; font-family:'Sora',sans-serif; padding:5px 12px; border-radius:999px; border:1px solid #e7e5e4; color:#78716c; text-decoration:none; transition:all .15s; background:transparent; cursor:pointer; }
                .btn-sm:hover { background:#1a1917; color:#fff; border-color:#1a1917; }

                .perfil-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
                .perfil-campo label { display:block; font-size:.67rem; text-transform:uppercase; letter-spacing:.08em; color:#a8a29e; margin-bottom:3px; }
                .perfil-campo span  { font-size:.9rem; color:#1c1917; font-weight:500; }
                .perfil-full { grid-column:1/-1; }
                .perfil-vacio { text-align:center; padding:24px 0; color:#a8a29e; font-size:.85rem; }
                .perfil-vacio a { display:inline-block; margin-top:10px; padding:6px 16px; border-radius:999px; background:#1a1917; color:#fff; font-size:.78rem; text-decoration:none; }

                .cal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
                .cal-mes { font-family:'Instrument Serif',serif; font-size:1.15rem; font-weight:400; color:#1c1917; }
                .cal-nav { display:flex; gap:6px; }
                .cal-btn { width:30px; height:30px; border-radius:50%; border:1px solid #e7e5e4; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.8rem; color:#78716c; transition:all .15s; }
                .cal-btn:hover { background:#1a1917; color:#fff; border-color:#1a1917; }
                .cal-dias-semana { display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:6px; }
                .cal-ds { text-align:center; font-size:.65rem; text-transform:uppercase; letter-spacing:.07em; color:#a8a29e; padding:4px 0; }
                .cal-celdas { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
                .cal-celda { aspect-ratio:1; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:.78rem; color:#44403c; }
                .cal-celda-hoy { background:#1a1917; color:#fff !important; font-weight:600; }
                .cal-celda-turno { background:rgba(251,191,36,.1); }
                .cal-dot { width:5px; height:5px; border-radius:50%; margin-top:2px; }
                .leyenda { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }
                .leyenda-item { display:flex; align-items:center; gap:5px; }
                .leyenda-dot { width:7px; height:7px; border-radius:50%; }
                .leyenda-label { font-size:.68rem; color:#a8a29e; text-transform:uppercase; letter-spacing:.06em; }

                .turno-item { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid #f5f5f4; }
                .turno-item:last-child { border-bottom:none; }
                .turno-fecha { width:44px; height:44px; border-radius:12px; background:#f5f4f0; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; }
                .turno-fecha-dia { font-size:1rem; font-weight:600; color:#1c1917; line-height:1; }
                .turno-fecha-mes { font-size:.6rem; text-transform:uppercase; color:#a8a29e; letter-spacing:.05em; }
                .turno-info { flex:1; min-width:0; }
                .turno-hora { font-size:.88rem; font-weight:500; color:#1c1917; }
                .turno-estado { display:inline-flex; align-items:center; gap:5px; font-size:.7rem; text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }
                .turno-dot { width:6px; height:6px; border-radius:50%; }
                .turnos-vacio { text-align:center; padding:28px 0; color:#a8a29e; font-size:.85rem; }

                /* Modal de turno */
                .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; z-index:100; padding:16px; }
                .modal { background:#fff; border-radius:20px; padding:28px; width:100%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
                .modal h3 { font-family:'Instrument Serif',serif; font-size:1.2rem; font-weight:400; color:#1c1917; margin-bottom:20px; }
                .modal-campo label { display:block; font-size:.72rem; text-transform:uppercase; letter-spacing:.07em; color:#a8a29e; margin-bottom:5px; }
                .modal-campo input, .modal-campo select { width:100%; border:1px solid #e7e5e4; border-radius:8px; padding:9px 12px; font-size:.88rem; font-family:'Sora',sans-serif; color:#1c1917; outline:none; transition:border-color .15s; }
                .modal-campo input:focus, .modal-campo select:focus { border-color:#1a1917; }
                .modal-acciones { display:flex; gap:10px; margin-top:20px; }
                .btn-primary { flex:1; padding:10px; border-radius:999px; background:#1a1917; color:#fff; border:none; font-family:'Sora',sans-serif; font-size:.85rem; cursor:pointer; transition:opacity .15s; }
                .btn-primary:hover { opacity:.85; }
                .btn-secondary { flex:1; padding:10px; border-radius:999px; background:transparent; color:#78716c; border:1px solid #e7e5e4; font-family:'Sora',sans-serif; font-size:.85rem; cursor:pointer; }
            `}</style>

            <div className="db-root">
                <div className="db-grid">

                    {/* Bienvenida */}
                    <div className="card-bienvenida">
                        <div className="avatar">{iniciales}</div>
                        <div className="bienvenida-texto">
                            <h3>Hola, {auth.user.name.split(' ')[0]}</h3>
                            <p>{hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>
                        <span className="badge-rol">{auth.user.role ?? 'empleado'}</span>
                    </div>

                    {/* Perfil */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-label" style={{ marginBottom: 0 }}>Mis datos</span>
                            {perfilId
                                ? <Link href={route('perfiles.edit', perfilId)} className="btn-sm">Editar</Link>
                                : <Link href={route('perfiles.create')} className="btn-sm">Crear perfil</Link>
                            }
                        </div>
                        {miPerfil ? (
                            <div className="perfil-grid">
                                <div className="perfil-campo perfil-full">
                                    <label>Nombre completo</label>
                                    <span>{miPerfil.nombre} {miPerfil.apellido1} {miPerfil.apellido2 ?? ''}</span>
                                </div>
                                <div className="perfil-campo">
                                    <label>DNI</label>
                                    <span>{miPerfil.dni}</span>
                                </div>
                                <div className="perfil-campo">
                                    <label>Teléfono</label>
                                    <span>{miPerfil.telefono}</span>
                                </div>
                                <div className="perfil-campo">
                                    <label>Localidad</label>
                                    <span>{miPerfil.localidad}</span>
                                </div>
                                <div className="perfil-campo">
                                    <label>Fecha nacimiento</label>
                                    <span>{new Date(miPerfil.fecha_nacimiento).toLocaleDateString('es-ES')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="perfil-vacio">
                                <p>Sin perfil asignado</p>
                                <Link href={route('perfiles.create')}>+ Crear perfil</Link>
                            </div>
                        )}
                    </div>

                    {/* Calendario */}
                    <div className="card" style={{ gridRow: 'span 2' }}>
                        <p className="card-label">Mis turnos</p>
                        <div className="cal-header">
                            <span className="cal-mes">{nombresMes[mesVista.month]} {mesVista.year}</span>
                            <div className="cal-nav">
                                <button className="cal-btn" onClick={prevMes}>‹</button>
                                <button className="cal-btn" onClick={nextMes}>›</button>
                            </div>
                        </div>
                        <div className="cal-dias-semana">
                            {diasSemana.map(d => <div key={d} className="cal-ds">{d}</div>)}
                        </div>
                        <div className="cal-celdas">
                            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
                            {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                                const turnos = turnosDia(dia);
                                const esHoy = hoy.getDate() === dia && hoy.getMonth() === mesVista.month && hoy.getFullYear() === mesVista.year;
                                return (
                                    <div key={dia} className={`cal-celda ${esHoy ? 'cal-celda-hoy' : turnos.length > 0 ? 'cal-celda-turno' : ''}`}>
                                        {dia}
                                        {turnos.length > 0 && !esHoy && (
                                            <div className="cal-dot" style={{ background: colorEstado(turnos[0].estado) }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="leyenda">
                            {[['#22c55e', 'Confirmado'], ['#f59e0b', 'Pendiente'], ['#ef4444', 'Cancelado']].map(([c, l]) => (
                                <div key={l} className="leyenda-item">
                                    <div className="leyenda-dot" style={{ background: c }} />
                                    <span className="leyenda-label">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Turnos con botón de gestionar */}
                    <div className="card">
                        <p className="card-label">Mis turnos</p>
                        {proximosTurnos.length > 0 ? (
                            proximosTurnos.map(h => {
                                const inicio = new Date(h.inicio_turno);
                                const fin = h.fin_turno ? new Date(h.fin_turno) : null;
                                return (
                                    <div key={h.id} className="turno-item">
                                        <div className="turno-fecha">
                                            <span className="turno-fecha-dia">{inicio.getDate()}</span>
                                            <span className="turno-fecha-mes">{nombresMes[inicio.getMonth()].slice(0, 3)}</span>
                                        </div>
                                        <div className="turno-info">
                                            <div className="turno-hora">
                                                {inicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                {fin && ` — ${fin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                                            </div>
                                            <div className="turno-estado" style={{ color: colorEstado(h.estado) }}>
                                                <div className="turno-dot" style={{ background: colorEstado(h.estado) }} />
                                                {h.estado}
                                            </div>
                                        </div>
                                        <button className="btn-sm" onClick={() => setTurnoActivo(h)}>
                                            Gestionar
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="turnos-vacio">No tienes turnos asignados</div>
                        )}
                    </div>

                </div>
            </div>

            {/* Modal gestionar turno */}
            {turnoActivo && (
                <div className="modal-overlay" onClick={() => setTurnoActivo(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Gestionar turno</h3>
                        <form onSubmit={guardarTurno} className="space-y-4">
                            <div className="modal-campo">
                                <label>Estado</label>
                                <select name="estado" defaultValue={turnoActivo.estado}>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="modal-campo">
                                <label>Inicio real del turno</label>
                                <input
                                    type="datetime-local"
                                    name="inicio_turno"
                                    defaultValue={fmtDatetimeLocal(turnoActivo.inicio_turno)}
                                />
                            </div>
                            <div className="modal-campo">
                                <label>Fin real del turno</label>
                                <input
                                    type="datetime-local"
                                    name="fin_turno"
                                    defaultValue={fmtDatetimeLocal(turnoActivo.fin_turno)}
                                />
                            </div>
                            <div className="modal-acciones">
                                <button type="button" className="btn-secondary" onClick={() => setTurnoActivo(null)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}