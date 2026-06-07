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
                    <Link href={route('mesas.create')} className="btn btn-primary btn-sm">
                        Nueva mesa
                    </Link>
                </div>
            }>
            <Head title="Mesas" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ minWidth: '400px' }}>
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
                                    {mesas.data.length === 0 && (
                                        <tr><td colSpan={3} className="p-6 text-center text-gray-400 text-sm">No hay mesas registradas</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {mesas.links.map((link, i) => (
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