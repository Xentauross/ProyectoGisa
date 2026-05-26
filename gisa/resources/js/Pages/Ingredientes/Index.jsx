import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

export default function Index({ auth, ingredientes, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este ingrediente?')) return;
        router.delete(route('ingredientes.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="ingredientes.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ingredientes</h2>}>
            <Head title="Ingredientes" />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Ingredientes</h1>
                        <Link href={route('ingredientes.create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            Nuevo ingrediente
                        </Link>
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                <tr>
                                    {sh('nombre', 'Nombre')}
                                    {sh('productos_count', 'Nº productos')}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredientes.data.map((ing) => (
                                    <tr key={ing.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-medium">{ing.nombre}</td>
                                        <td className="p-4 text-gray-500">{ing.productos_count}</td>
                                        <td className="p-4 flex gap-3">
                                            <Link href={route('ingredientes.edit', ing.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                            <button onClick={() => eliminar(ing.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                {ingredientes.data.length === 0 && (
                                    <tr><td colSpan={3} className="p-6 text-center text-gray-400 text-sm">No hay ingredientes todavía</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {ingredientes.links.map((link, i) => (
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