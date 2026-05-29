import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

const colores = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    listo: 'bg-blue-100 text-blue-700',
    servido: 'bg-green-100 text-green-700',
    pagado: 'bg-gray-100 text-gray-600',
};

export default function Index({ auth, pedidos, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este pedido?')) return;
        router.delete(route('pedidos.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="pedidos.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Pedidos</h2>
                    <Link href={route('pedidos.create')}
                        className="btn btn-primary btn-sm">
                        Nuevo pedido
                    </Link>
                </div>
            }>
            <Head title="Pedidos" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                <tr>
                                    {sh('id', '#')}
                                    {sh('mesa_id', 'Mesa')}
                                    {sh('camarero_id', 'Camarero')}
                                    {sh('estado', 'Estado')}
                                    {sh('precio_total', 'Total')}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.data.map((pedido) => (
                                    <tr key={pedido.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-gray-500">#{pedido.id}</td>
                                        <td className="p-4">Mesa {pedido.mesa?.numero}</td>
                                        <td className="p-4">
                                            {pedido.camarero?.perfil
                                                ? `${pedido.camarero.perfil.nombre} ${pedido.camarero.perfil.apellido1}`
                                                : pedido.camarero?.name ?? '—'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${colores[pedido.estado]}`}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td className="p-4">{pedido.precio_total} €</td>
                                        <td className="p-4 flex gap-3">
                                            <Link href={route('pedidos.show', pedido.id)} className="text-gray-500 hover:underline text-sm">Ver</Link>
                                            <Link href={route('pedidos.edit', pedido.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                            <button onClick={() => eliminar(pedido.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {pedidos.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}