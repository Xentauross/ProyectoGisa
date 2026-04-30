import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, horario, users }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: horario.user_id,
        inicio_turno: horario.inicio_turno?.slice(0, 16) ?? '',
        fin_turno: horario.fin_turno?.slice(0, 16) ?? '',
        estado: horario.estado,
    });

    function submit(e) {
        e.preventDefault();
        put(route('horarios.update', horario.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar horario</h2>}
        >
            <Head title="Editar horario" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar horario</h1>
                        <Link href={route('horarios.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">

                            <Campo label="Empleado" error={errors.user_id}>
                                <select
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="">Seleccionar...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </Campo>

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

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
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

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}