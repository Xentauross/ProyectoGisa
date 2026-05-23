import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Genera el username igual que el backend para mostrarlo en tiempo real
function generarUsername(nombre, apellido1, apellido2, dni) {
    const p1 = (nombre?.[0]        ?? '').toUpperCase();
    const p2 = (apellido1?.slice(0, 3) ?? '').toUpperCase();
    const p3 = (apellido2?.slice(0, 3) ?? '').toUpperCase();
    const p4 = (dni?.slice(-3)         ?? '').toUpperCase();
    return p1 + p2 + p3 + p4;
}

export default function Create({ auth, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:               '',
        apellido1:            '',
        apellido2:            '',
        dni:                  '',
        email:                '',
        num_seguridad_social: '',
        telefono:             '',
        fecha_nacimiento:     '',
        localidad:            '',
        role:                 '',
    });

    const usernamePreview = generarUsername(data.nombre, data.apellido1, data.apellido2, data.dni);

    function submit(e) {
        e.preventDefault();
        post(route('usuarios.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuevo usuario</h2>}
        >
            <Head title="Nuevo usuario" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Nuevo usuario</h1>
                        <Link href={route('usuarios.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    {/* Aviso */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-sm text-blue-700">
                        Se generará una contraseña temporal automáticamente y se enviará
                        al empleado por email junto con sus credenciales de acceso.
                    </div>

                    <form onSubmit={submit} className="space-y-5">

                        {/* Datos personales */}
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Datos personales
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Campo label="Nombre" error={errors.nombre}>
                                    <input type="text" value={data.nombre} maxLength={40}
                                        onChange={e => setData('nombre', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="Primer apellido" error={errors.apellido1}>
                                    <input type="text" value={data.apellido1} maxLength={40}
                                        onChange={e => setData('apellido1', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="Segundo apellido" error={errors.apellido2}>
                                    <input type="text" value={data.apellido2} maxLength={40}
                                        onChange={e => setData('apellido2', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="DNI" error={errors.dni}>
                                    <input type="text" value={data.dni} maxLength={9}
                                        onChange={e => setData('dni', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        placeholder="12345678A" />
                                </Campo>

                                <Campo label="Teléfono" error={errors.telefono}>
                                    <input type="text" value={data.telefono} maxLength={9}
                                        onChange={e => setData('telefono', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="Fecha de nacimiento" error={errors.fecha_nacimiento}>
                                    <input type="date" value={data.fecha_nacimiento}
                                        onChange={e => setData('fecha_nacimiento', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="Nº Seguridad Social" error={errors.num_seguridad_social}>
                                    <input type="text" value={data.num_seguridad_social} maxLength={12}
                                        onChange={e => setData('num_seguridad_social', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>

                                <Campo label="Localidad" error={errors.localidad}>
                                    <input type="text" value={data.localidad} maxLength={100}
                                        onChange={e => setData('localidad', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                            </div>
                        </div>

                        {/* Cuenta */}
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Cuenta de acceso
                            </h2>

                            {/* Preview del username generado */}
                            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                                        Nombre de usuario generado
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 font-mono">
                                        {usernamePreview || <span className="text-gray-400 font-normal">Rellena los datos personales</span>}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Auto</span>
                            </div>

                            <Campo label="Email" error={errors.email}>
                                <input type="email" value={data.email} maxLength={100}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    placeholder="correo@ejemplo.com" />
                            </Campo>

                            <Campo label="Rol" error={errors.role}>
                                <select value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">Seleccionar rol...</option>
                                    {Object.entries(roles).map(([valor, etiqueta]) => (
                                        <option key={valor} value={valor}>{etiqueta}</option>
                                    ))}
                                </select>
                            </Campo>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {processing ? 'Creando y enviando email...' : 'Crear usuario y enviar credenciales'}
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
