import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

export default function Index({ auth, productos, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este producto?')) return;
        router.delete(route('productos.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="productos.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Productos</h2>
                    <Link href={route('productos.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Nuevo producto
                    </Link>
                </div>
            }>
            <Head title="Productos" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                <tr>
                                    {sh('nombre', 'Nombre')}
                                    {sh('tipo', 'Tipo')}
                                    {sh('precio', 'Precio')}
                                    {sh('es_recomendado', 'Recomendado')}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.data.map((producto) => (
                                    <tr key={producto.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">{producto.nombre}</td>
                                        <td className="p-4 text-gray-500">{producto.tipo}</td>
                                        <td className="p-4">{producto.precio} €</td>
                                        <td className="p-4">{producto.es_recomendado ? 'Sí' : 'No'}</td>
                                        <td className="p-4 flex gap-3">
                                            <Link href={route('productos.show', producto.id)} className="text-gray-500 hover:underline text-sm">Ver</Link>
                                            <Link href={route('productos.edit', producto.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                            <button onClick={() => eliminar(producto.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {productos.links.map((link, i) => (
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