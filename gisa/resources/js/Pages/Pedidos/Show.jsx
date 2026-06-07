import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const colores = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    listo: 'bg-blue-100 text-blue-700',
    servido: 'bg-green-100 text-green-700',
    pagado: 'bg-gray-100 text-gray-600',
};

export default function Show({ auth, pedido }) {
    const nombreCamarero = pedido.camarero?.perfil
        ? `${pedido.camarero.perfil.nombre} ${pedido.camarero.perfil.apellido1}`
        : pedido.camarero?.name ?? '—';

    function eliminar() {
        if (!confirm('¿Eliminar este pedido?')) return;
        router.delete(route('pedidos.destroy', pedido.id));
    }

    const roles = auth.user.role;
    const puedeEditar = ['admin', 'gerente', 'metre', 'jefe_cocina', 'cocinero'].includes(roles);
    const puedeEliminar = ['admin', 'gerente', 'metre'].includes(roles);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pedido #{pedido.id}</h2>}
        >
            <Head title={`Pedido #${pedido.id}`} />

            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Cabecera */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Pedido #{pedido.id}</h1>
                        <Link href={route('pedidos.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    {/* Resumen */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                            Información del pedido
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Dato label="Mesa" valor={`Mesa ${pedido.mesa?.numero ?? '—'}`} />
                            <Dato label="Camarero" valor={nombreCamarero} />
                            <Dato label="Estado">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${colores[pedido.estado]}`}>
                                    {pedido.estado}
                                </span>
                            </Dato>
                            <Dato label="Total" valor={`${Number(pedido.precio_total).toFixed(2)} €`} />
                        </div>
                    </div>

                    {/* Líneas */}
                    <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                            Productos
                        </h2>

                        {pedido.lineas?.length > 0 ? (
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left">Producto</th>
                                        <th className="p-3 text-left">Cant.</th>
                                        <th className="p-3 text-left">Precio u.</th>
                                        <th className="p-3 text-left">Subtotal</th>
                                        <th className="p-3 text-left">Notas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedido.lineas.map((linea) => (
                                        <tr key={linea.id} className="border-t">
                                            <td className="p-3">{linea.producto?.nombre ?? '—'}</td>
                                            <td className="p-3">{linea.cantidad}</td>
                                            <td className="p-3">{Number(linea.precio_unitario).toFixed(2)} €</td>
                                            <td className="p-3 font-medium">
                                                {(linea.cantidad * linea.precio_unitario).toFixed(2)} €
                                            </td>
                                            <td className="p-3 text-gray-400">{linea.notas ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td colSpan={3} className="p-3 text-right text-gray-600 font-medium">Total:</td>
                                        <td className="p-3 font-semibold">{Number(pedido.precio_total).toFixed(2)} €</td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">Sin productos en este pedido.</p>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3">
                        {puedeEditar && (
                            <Link
                                href={route('pedidos.edit', pedido.id)}
                                className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
                            >
                                Editar pedido
                            </Link>
                        )}
                        {puedeEliminar && (
                            <button
                                onClick={eliminar}
                                className="flex-1 text-center bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 text-sm font-medium"
                            >
                                Eliminar pedido
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Dato({ label, valor, children }) {
    return (
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            {children ?? <p className="text-sm font-medium text-gray-800">{valor}</p>}
        </div>
    );
}