import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, mesa }) {
    const { data, setData, put, processing, errors } = useForm({
        numero: mesa.numero,
        estado: mesa.estado,
    });

    function submit(e) {
        e.preventDefault();
        put(route('mesas.update', mesa.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar mesa {mesa.numero}</h2>}
        >
            <Head title="Editar mesa" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar mesa {mesa.numero}</h1>
                        <Link href={route('mesas.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <Campo label="Número" error={errors.numero}>
                                <input type="number" value={data.numero}
                                    onChange={(e) => setData('numero', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm" />
                            </Campo>

                            <Campo label="Estado" error={errors.estado}>
                                <select value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    <option value="libre">Libre</option>
                                    <option value="ocupada">Ocupada</option>
                                </select>
                            </Campo>

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
