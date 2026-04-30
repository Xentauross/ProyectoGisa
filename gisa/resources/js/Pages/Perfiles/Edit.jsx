import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, perfil, users }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: perfil.user_id, nombre: perfil.nombre, apellido1: perfil.apellido1,
        apellido2: perfil.apellido2 ?? '', dni: perfil.dni,
        num_seguridad_social: perfil.num_seguridad_social, telefono: perfil.telefono,
        fecha_nacimiento: perfil.fecha_nacimiento, localidad: perfil.localidad,
    });

    function submit(e) {
        e.preventDefault();
        put(route('perfiles.update', perfil.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar perfil</h2>}
        >
            <Head title="Editar perfil" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar perfil</h1>
                        <Link href={route('perfiles.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <Campo label="Usuario" error={errors.user_id}>
                                <select value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </Campo>

                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Nombre" error={errors.nombre}>
                                    <input type="text" value={data.nombre} maxLength={20}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Primer apellido" error={errors.apellido1}>
                                    <input type="text" value={data.apellido1} maxLength={20}
                                        onChange={(e) => setData('apellido1', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Segundo apellido" error={errors.apellido2}>
                                    <input type="text" value={data.apellido2} maxLength={20}
                                        onChange={(e) => setData('apellido2', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="DNI" error={errors.dni}>
                                    <input type="text" value={data.dni} maxLength={9}
                                        onChange={(e) => setData('dni', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Nº Seguridad Social" error={errors.num_seguridad_social}>
                                    <input type="number" value={data.num_seguridad_social} maxLength={12}
                                        onChange={(e) => setData('num_seguridad_social', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Teléfono" error={errors.telefono}>
                                    <input type="text" value={data.telefono} maxLength={20}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Fecha de nacimiento" error={errors.fecha_nacimiento}>
                                    <input type="date" value={data.fecha_nacimiento}
                                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                                <Campo label="Localidad" error={errors.localidad}>
                                    <input type="text" value={data.localidad} maxLength={50}
                                        onChange={(e) => setData('localidad', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm" />
                                </Campo>
                            </div>

                            <button type="submit" disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                                Actualizar
                            </button>
                        </form>
                    </div>
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