import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

export default function Index({ auth, mesas, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar esta mesa?')) return;
        router.delete(route('mesas.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="mesas.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Mesas</h2>
                    <Link href={route('mesas.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                        Nueva mesa
                    </Link>
                </div>
            }>
            <Head title="Mesas" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                <tr>
                                    {sh('numero', 'Número')}
                                    {sh('estado', 'Estado')}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mesas.data.map((mesa) => (
                                    <tr key={mesa.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">Mesa {mesa.numero}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${mesa.estado === 'libre' ? 'bg-green-100 text-green-700' :
                                                mesa.estado === 'reservada' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {mesa.estado}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-3">
                                            <Link href={route('mesas.edit', mesa.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                            <button onClick={() => eliminar(mesa.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {mesas.links.map((link, i) => (
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