import { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Custom hooks
import { useCalendario } from './Dashboard/hooks/useCalendario';
import { useTurnos } from './Dashboard/hooks/useTurnos';

// Componentes
import WelcomeCard from './Dashboard/components/WelcomeCard';
import ProfileCard from './Dashboard/components/ProfileCard';
import CalendarCard from './Dashboard/components/CalendarCard';
import TurnosCard from './Dashboard/components/TurnosCard';
import TurnoModal from './Dashboard/components/TurnoModal';

// Utils
import { getIniciales } from './Dashboard/utils';

/**
 * Dashboard principal del empleado.
 *
 * @param {{
 *   auth:        { user: { name: string, role?: string } },
 *   miPerfil:    object|null,
 *   misHorarios: Array,
 * }} props
 */
export default function Dashboard({ auth, miPerfil, misHorarios = [] }) {
    // ── Hooks ──────────────────────────────────────────────
    const calendario = useCalendario(misHorarios);
    const turnos = useTurnos(misHorarios);
    console.log('turnoActivo:', turnos.turnoActivo); // ← añade esto

    // ── Datos derivados (sólo cálculos de presentación) ───
    const iniciales = useMemo(() => getIniciales(auth.user.name), [auth.user.name]);
    const perfilId = miPerfil?.id ?? null;
    const rol = auth.user.role ?? 'empleado';

    const fechaHoy = calendario.hoy.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    // ── Render ─────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="db-root">
                <div className="db-grid">

                    <WelcomeCard
                        iniciales={iniciales}
                        nombre={miPerfil?.nombre ?? auth.user.name}
                        fecha={fechaHoy}
                        rol={rol}
                    />

                    <ProfileCard
                        miPerfil={miPerfil}
                        perfilId={perfilId}
                        role={auth.user.role} />

                    <CalendarCard
                        mesVista={calendario.mesVista}
                        diasEnMes={calendario.diasEnMes}
                        offset={calendario.offset}
                        hoy={calendario.hoy}
                        prevMes={calendario.prevMes}
                        nextMes={calendario.nextMes}
                        getTurnosDia={calendario.getTurnosDia}
                    />

                    <TurnosCard
                        turnos={turnos.proximosTurnos}
                        onGestionar={turnos.abrirTurno}
                    />

                </div>
            </div>

            <TurnoModal
                turno={turnos.turnoActivo}
                onClose={turnos.cerrarTurno}
                onGuardar={turnos.guardarTurno}
            />
        </AuthenticatedLayout>
    );
}
