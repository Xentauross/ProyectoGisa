import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Objeto vacío que representa un turno sin rellenar.
// Lo separamos como función para que cada llamada genere
// un objeto nuevo (no se compartan referencias en memoria).
const turnoVacio = () => ({ inicio_turno: '', fin_turno: '' });

// ── Componente principal ─────────────────────────────────────
// Props que llegan desde HorarioController@create:
//   · auth  → usuario logueado
//   · users → todos los usuarios con su perfil
export default function Create({ auth, users }) {

    // useState guarda valores que, cuando cambian, provocan que
    // React vuelva a dibujar el componente con los nuevos datos.
    const [userId, setUserId] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const [turnos, setTurnos] = useState([turnoVacio()]);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Estado para el texto que escribe el usuario en el buscador
    const [busqueda, setBusqueda] = useState('');

    // ── Funciones para gestionar el array de turnos ──────────

    // Añade un nuevo turno vacío al array
    function addTurno() {
        setTurnos(prev => [...prev, turnoVacio()]);
    }

    // Elimina el turno en la posición i del array.
    // filter() devuelve un nuevo array sin el elemento eliminado.
    function removeTurno(i) {
        setTurnos(prev => prev.filter((_, idx) => idx !== i));
    }

    // Actualiza un campo (inicio_turno o fin_turno) de un turno concreto.
    // map() recorre el array y solo modifica el elemento en la posición i.
    function updateTurno(i, campo, valor) {
        setTurnos(prev => prev.map((t, idx) => idx === i ? { ...t, [campo]: valor } : t));
    }

    // ── Buscador de empleados ─────────────────────────────────
    // Filtramos la lista de usuarios en tiempo real según lo que
    // el usuario escribe en el input de búsqueda.
    // Buscamos tanto por DNI como por nombre completo.
    const usuariosFiltrados = users.filter(u => {
        const dni = u.perfil?.dni?.toLowerCase() || '';
        const nombreCompleto = u.perfil
            ? `${u.perfil.nombre} ${u.perfil.apellido1}`.toLowerCase()
            : u.name.toLowerCase();

        const termino = busqueda.toLowerCase();

        // includes() devuelve true si el término aparece en alguno de los campos
        return dni.includes(termino) || nombreCompleto.includes(termino);
    });

    // ── Envío del formulario ──────────────────────────────────
    // En vez de un solo POST, hacemos un POST por cada turno del array.
    // Todos comparten el mismo empleado y estado.
    function submitSimple(e) {
        // evitamos que el formulario recargue la página
        e.preventDefault();
        setProcessing(true);

        // Contador para saber cuándo han terminado todas las peticiones
        let completados = 0;
        const total = turnos.length;

        turnos.forEach((t) => {
            // router.post() de Inertia envía una petición POST sin recargar.
            router.post(route('horarios.store'), {
                user_id: userId,
                inicio_turno: t.inicio_turno,
                fin_turno: t.fin_turno,
                estado,
            }, {
                // conserva el estado del formulario si hay error
                preserveState: true,
                // guardamos los errores en el estado
                onError: (errs) => setErrors(errs),

                // onFinish se ejecuta cuando la petición termina (con éxito o con error).
                // Cuando todas han terminado, redirigimos al listado.
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

                            {/* Campo de búsqueda + select de empleado.
                                Usamos el componente Campo (definido al final del archivo)
                                para envolver el label, el input y el mensaje de error. */}
                            <Campo label="Buscar y Seleccionar Empleado" error={errors.user_id}>

                                {/* Input de búsqueda: al escribir actualiza 'busqueda',
                                    lo que filtra los options del select en tiempo real. */}
                                <input
                                    type="text"
                                    placeholder="Buscar por DNI o nombre..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                                />
                                {/* Select: solo muestra los usuarios que pasan el filtro */}
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

                                    {/* Mensaje cuando el buscador no encuentra nada */}
                                </select>
                                {usuariosFiltrados.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">No se encontraron resultados.</p>
                                )}
                            </Campo>

                            {/* Select de estado: pendiente / confirmado / cancelado */}
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

                        {/* ── Bloque 2: Lista de turnos (inicio/fin) ── */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                                    Turnos ({turnos.length})
                                </h2>
                                {/* Botón para añadir otro bloque de turno */}
                                <button
                                    type="button"
                                    onClick={addTurno}
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    + Añadir turno
                                </button>
                            </div>

                            {/* Dibujamos un bloque por cada turno del array */}
                            {turnos.map((t, i) => (
                                <div key={i} className="bg-white shadow rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-600">
                                            Turno {i + 1}
                                        </span>
                                        {/* Solo mostramos "Eliminar" si hay más de un turno */}
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
                                        {/* Input de fecha/hora de inicio */}
                                        <Campo label="Inicio del turno" error={errors[`turnos.${i}.inicio_turno`]}>
                                            <input
                                                type="datetime-local"
                                                value={t.inicio_turno}
                                                onChange={e => updateTurno(i, 'inicio_turno', e.target.value)}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                required
                                            />
                                        </Campo>

                                        {/* Input de fecha/hora de fin */}
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

                        {/* Mensajes de error globales del servidor */}
                        {errors.inicio_turno && (
                            <p className="text-red-500 text-sm">{errors.inicio_turno}</p>
                        )}
                        {errors.fin_turno && (
                            <p className="text-red-500 text-sm">{errors.fin_turno}</p>
                        )}

                        {/* Botón de envío: se desactiva mientras se procesa */}
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

// ── Componente auxiliar Campo ─────────────────────────────────
// Evita repetir el mismo HTML (label + children + mensaje error)
// en cada campo del formulario. Es un componente "contenedor":
// acepta children (lo que se ponga entre sus etiquetas) y lo renderiza.
function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {/* Solo mostramos el error si existe */}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}