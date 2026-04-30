import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        numero: '',
        estado: 'libre',
    });

    function submit(e) {
        e.preventDefault();
        post(route('mesas.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nueva mesa</h2>}
        >
            <Head title="Nueva mesa" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Nueva mesa</h1>
                        <Link href={route('mesas.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6 space-y-5">
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
                                Guardar
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
