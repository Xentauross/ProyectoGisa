import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

// Props que llegan desde HorarioController@edit:
//   · auth    → usuario logueado
//   · horario → el registro que vamos a editar (con sus datos actuales)
//   · users   → lista de empleados para el selector
export default function Edit({ auth, horario, users }) {

    // ── Conversión de fecha UTC → formato local para el input ─
    // Los inputs type="datetime-local" esperan el formato "YYYY-MM-DDTHH:mm".
    // Las fechas en BD están en UTC, así que las convertimos a hora local
    // restando el offset del navegador antes de mostrarlas.
    const toLocalInput = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d - offset).toISOString().slice(0, 16);
    };

    // ── useForm de Inertia ────────────────────────────────────
    // useForm es como un useState especializado para formularios:
    // · data      → objeto con los valores actuales del formulario
    // · setData   → función para actualizar un campo (setData('campo', valor))
    // · put       → envía una petición PUT (para actualizar)
    // · processing→ true mientras se está enviando la petición
    // · errors    → errores de validación que devuelve el servidor
    const { data, setData, put, processing, errors } = useForm({
        user_id: horario.user_id,
        inicio_turno: toLocalInput(horario.inicio_turno),
        fin_turno: toLocalInput(horario.fin_turno),
        estado: horario.estado,
    });

    // Estado para el texto del buscador de empleados
    const [busqueda, setBusqueda] = useState('');

    // Función que se llama al enviar el formulario.
    // put() de Inertia envía una petición PUT a la ruta indicada.
    function submit(e) {
        e.preventDefault();
        put(route('horarios.update', horario.id));
    }

    // Filtramos la lista de usuarios según lo que se escribe en el buscador.
    // Buscamos por DNI o por nombre completo (igual que en Create.jsx).
    const usuariosFiltrados = users.filter(u => {
        const dni = u.perfil?.dni?.toLowerCase() || '';
        const nombreCompleto = u.perfil
            ? `${u.perfil.nombre} ${u.perfil.apellido1}`.toLowerCase()
            : u.name.toLowerCase();

        const termino = busqueda.toLowerCase();

        return dni.includes(termino) || nombreCompleto.includes(termino);
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar horario</h2>}
        >
            <Head title="Editar horario" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar horario</h1>
                        <Link href={route('horarios.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">

                            {/* Selector de empleado con buscador */}
                            <Campo label="Buscar y Seleccionar Empleado" error={errors.user_id}>
                                {/* Buscador: actualiza el estado 'busqueda' que filtra el select */}
                                <input
                                    type="text"
                                    placeholder="Buscar por DNI o nombre..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                                />

                                {/* Select: value viene de useForm (data.user_id).
                                    Al cambiar, setData actualiza el objeto data de useForm. */}
                                <select
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
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

                            {/* Inputs de fecha/hora en grid de 2 columnas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Campo label="Inicio del turno" error={errors.inicio_turno}>
                                    <input
                                        type="datetime-local"
                                        value={data.inicio_turno}
                                        onChange={e => setData('inicio_turno', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </Campo>

                                <Campo label="Fin del turno" error={errors.fin_turno}>
                                    <input
                                        type="datetime-local"
                                        value={data.fin_turno}
                                        onChange={e => setData('fin_turno', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </Campo>
                            </div>

                            {/* Select de estado */}
                            <Campo label="Estado" error={errors.estado}>
                                <select
                                    value={data.estado}
                                    onChange={e => setData('estado', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </Campo>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary ms-auto"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Componente auxiliar reutilizable (igual que en Create.jsx)
function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}