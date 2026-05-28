import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, pedido, mesas, camareros, productos }) {
    const { data, setData, put, processing, errors } = useForm({
        mesa_id: pedido.mesa_id,
        camarero_id: pedido.camarero_id,
        estado: pedido.estado,
    });

    const lineaForm = useForm({
        producto_id: '',
        cantidad: 1,
        notas: '',
    });

    function submitPedido(e) {
        e.preventDefault();
        put(route('pedidos.update', pedido.id));
    }

    function addLinea(e) {
        e.preventDefault();
        lineaForm.post(route('pedidos.addLinea', pedido.id), {
            onSuccess: () => lineaForm.reset(),
        });
    }

    function removeLinea(lineaId) {
        if (!confirm('¿Eliminar esta línea?')) return;
        router.delete(route('pedidos.removeLinea', [pedido.id, lineaId]));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pedido #{pedido.id}</h2>}
        >
            <Head title={`Pedido #${pedido.id}`} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Pedido #{pedido.id}</h1>
                        <Link href={route('pedidos.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    {/* Datos del pedido */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-base font-medium text-gray-700 mb-4">Datos del pedido</h2>
                        <form onSubmit={submitPedido} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Campo label="Mesa" error={errors.mesa_id}>
                                    <select value={data.mesa_id}
                                        onChange={(e) => setData('mesa_id', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm">
                                        {mesas.map((m) => (
                                            <option key={m.id} value={m.id}>Mesa {m.numero}</option>
                                        ))}
                                    </select>
                                </Campo>

                                <Campo label="Camarero" error={errors.camarero_id}>
                                    <select value={data.camarero_id}
                                        onChange={(e) => setData('camarero_id', e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm">
                                        {camareros.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
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
                            </div>

                            <button type="submit" disabled={processing}
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                                Actualizar pedido
                            </button>
                        </form>
                    </div>

                    {/* Líneas del pedido */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-base font-medium text-gray-700 mb-4">Productos del pedido</h2>

                        <table className="w-full border-collapse mb-6 text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Producto</th>
                                    <th className="p-3 text-left">Cant.</th>
                                    <th className="p-3 text-left">Precio u.</th>
                                    <th className="p-3 text-left">Subtotal</th>
                                    <th className="p-3 text-left">Notas</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.lineas.map((linea) => (
                                    <tr key={linea.id} className="border-t">
                                        <td className="p-3">{linea.producto?.nombre}</td>
                                        <td className="p-3">{linea.cantidad}</td>
                                        <td className="p-3">{linea.producto?.precio} €</td>
                                        <td className="p-3">{(linea.cantidad * linea.producto?.precio).toFixed(2)} €</td>
                                        <td className="p-3 text-gray-400">{linea.notas}</td>
                                        <td className="p-3">
                                            <button onClick={() => removeLinea(linea.id)}
                                                className="text-red-600 hover:underline text-xs">Quitar</button>
                                        </td>
                                    </tr>
                                ))}
                                {pedido.lineas.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400 text-sm">Sin productos todavía</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="border-t font-medium">
                                    <td colSpan={3} className="p-3 text-right text-gray-600">Total:</td>
                                    <td className="p-3">{pedido.precio_total} €</td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Añadir producto */}
                        <form onSubmit={addLinea} className="flex gap-3 items-end flex-wrap border-t pt-4">
                            <Campo label="Producto">
                                <select value={lineaForm.data.producto_id}
                                    onChange={(e) => lineaForm.setData('producto_id', e.target.value)}
                                    className="border rounded px-3 py-2 text-sm">
                                    <option value="">Seleccionar...</option>
                                    {productos.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre} — {p.precio} €</option>
                                    ))}
                                </select>
                            </Campo>

                            <Campo label="Cantidad">
                                <input type="number" min="1" value={lineaForm.data.cantidad}
                                    onChange={(e) => lineaForm.setData('cantidad', e.target.value)}
                                    className="border rounded px-3 py-2 text-sm w-20" />
                            </Campo>

                            <Campo label="Notas">
                                <input type="text" value={lineaForm.data.notas}
                                    onChange={(e) => lineaForm.setData('notas', e.target.value)}
                                    className="border rounded px-3 py-2 text-sm"
                                    placeholder="Sin gluten, etc." />
                            </Campo>

                            <button type="submit" disabled={lineaForm.processing}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm">
                                Añadir
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
