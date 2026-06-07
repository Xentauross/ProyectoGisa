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
                    <Link href={route('productos.create')} className="btn btn-primary btn-sm">
                        Nuevo producto
                    </Link>
                </div>
            }>
            <Head title="Productos" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ minWidth: '550px' }}>
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
                                    {productos.data.length === 0 && (
                                        <tr><td colSpan={5} className="p-6 text-center text-gray-400 text-sm">No hay productos registrados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {productos.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1 rounded border text-sm transition-colors
                                    ${link.active
                                        ? 'bg-primary text-primary-content border-primary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-primary-content hover:border-primary'}
                                    ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label
                                        .replace('Previous', 'Anterior')
                                        .replace('Next', 'Siguiente')
                                }} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}