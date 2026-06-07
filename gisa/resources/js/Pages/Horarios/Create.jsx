import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Turno vacío por defecto
const turnoVacio = () => ({ inicio_turno: '', fin_turno: '' });

export default function Create({ auth, users }) {
    const [userId, setUserId] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const [turnos, setTurnos] = useState([turnoVacio()]);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // 1. Nuevo estado para el buscador
    const [busqueda, setBusqueda] = useState('');

    function addTurno() {
        setTurnos(prev => [...prev, turnoVacio()]);
    }

    function removeTurno(i) {
        setTurnos(prev => prev.filter((_, idx) => idx !== i));
    }

    function updateTurno(i, campo, valor) {
        setTurnos(prev => prev.map((t, idx) => idx === i ? { ...t, [campo]: valor } : t));
    }

    // 2. Filtrar los usuarios en tiempo real
    const usuariosFiltrados = users.filter(u => {
        const dni = u.perfil?.dni?.toLowerCase() || '';
        const nombreCompleto = u.perfil
            ? `${u.perfil.nombre} ${u.perfil.apellido1}`.toLowerCase()
            : u.name.toLowerCase();

        const termino = busqueda.toLowerCase();

        return dni.includes(termino) || nombreCompleto.includes(termino);
    });

    function submitSimple(e) {
        e.preventDefault();
        setProcessing(true);

        let completados = 0;
        const total = turnos.length;

        turnos.forEach((t) => {
            router.post(route('horarios.store'), {
                user_id: userId,
                inicio_turno: t.inicio_turno,
                fin_turno: t.fin_turno,
                estado,
            }, {
                preserveState: true,
                onError: (errs) => setErrors(errs),
                onFinish: () => {
                    completados++;
                    if (completados === total) {
                        setProcessing(false);
                        router.visit(route('horarios.index'));
                    }
                },
            });
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuevo horario</h2>}
        >
            <Head title="Nuevo horario" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Nuevo horario</h1>
                        <Link href={route('horarios.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    <form onSubmit={submitSimple} className="space-y-5">

                        {/* Empleado y estado — comunes a todos los turnos */}
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                                Datos generales
                            </h2>

                            {/* 3. Adaptación del campo con buscador e input */}
                            <Campo label="Buscar y Seleccionar Empleado" error={errors.user_id}>
                                <input
                                    type="text"
                                    placeholder="Buscar por DNI o nombre..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                                />
                                <select
                                    value={userId}
                                    onChange={e => setUserId(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="">Seleccionar empleado...</option>
                                    {usuariosFiltrados.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.perfil
                                                ? `${u.perfil.dni} - ${u.perfil.nombre} ${u.perfil.apellido1}`
                                                : u.name
                                            }
                                        </option>
                                    ))}
                                </select>
                                {usuariosFiltrados.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">No se encontraron resultados.</p>
                                )}
                            </Campo>

                            <Campo label="Estado" error={errors.estado}>
                                <select
                                    value={estado}
                                    onChange={e => setEstado(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </Campo>
                        </div>

                        {/* Turnos */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                                    Turnos ({turnos.length})
                                </h2>
                                <button
                                    type="button"
                                    onClick={addTurno}
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    + Añadir turno
                                </button>
                            </div>

                            {turnos.map((t, i) => (
                                <div key={i} className="bg-white shadow rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-600">
                                            Turno {i + 1}
                                        </span>
                                        {turnos.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTurno(i)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Campo label="Inicio del turno" error={errors[`turnos.${i}.inicio_turno`]}>
                                            <input
                                                type="datetime-local"
                                                value={t.inicio_turno}
                                                onChange={e => updateTurno(i, 'inicio_turno', e.target.value)}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                required
                                            />
                                        </Campo>

                                        <Campo label="Fin del turno" error={errors[`turnos.${i}.fin_turno`]}>
                                            <input
                                                type="datetime-local"
                                                value={t.fin_turno}
                                                onChange={e => updateTurno(i, 'fin_turno', e.target.value)}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                required
                                            />
                                        </Campo>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error global */}
                        {errors.inicio_turno && (
                            <p className="text-red-500 text-sm">{errors.inicio_turno}</p>
                        )}
                        {errors.fin_turno && (
                            <p className="text-red-500 text-sm">{errors.fin_turno}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-primary ms-auto"
                        >
                            {processing
                                ? 'Guardando...'
                                : `Guardar ${turnos.length > 1 ? `${turnos.length} turnos` : 'turno'}`}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}