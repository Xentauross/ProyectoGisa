import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, mesas, camareros }) {
    const { data, setData, post, processing, errors } = useForm({
        mesa_id:     '',
        camarero_id: '',
        estado:      'pendiente',
    });

    function submit(e) {
        e.preventDefault();
        post(route('pedidos.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuevo pedido</h2>}
        >
            <Head title="Nuevo pedido" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Nuevo pedido</h1>
                        <Link href={route('pedidos.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <Campo label="Mesa" error={errors.mesa_id}>
                                <select value={data.mesa_id}
                                    onChange={(e) => setData('mesa_id', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">Seleccionar mesa libre...</option>
                                    {mesas.map((m) => (
                                        <option key={m.id} value={m.id}>Mesa {m.numero}</option>
                                    ))}
                                </select>
                            </Campo>

                            <Campo label="Camarero" error={errors.camarero_id}>
                                <select value={data.camarero_id}
                                    onChange={(e) => setData('camarero_id', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">Seleccionar camarero...</option>
                                    {camareros.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </Campo>

                            <Campo label="Estado" error={errors.estado}>
                                <select value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm">
                                    <option value="pendiente">Pendiente</option>
                                    <option value="listo">Listo</option>
                                    <option value="servido">Servido</option>
                                    <option value="pagado">Pagado</option>
                                </select>
                            </Campo>

                            <button type="submit" disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                                Crear pedido
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
