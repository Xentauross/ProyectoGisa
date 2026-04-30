import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, perfiles }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este perfil?')) return;
        router.delete(route('perfiles.destroy', id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfiles</h2>}
        >
            <Head title="Perfiles" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Perfiles</h1>
                        <Link href={route('perfiles.create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            Nuevo perfil
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
                                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                    <tr>
                                        <th className="p-4 w-48">Nombre completo</th>
                                        <th className="p-4 w-28">DNI</th>
                                        <th className="p-4 w-28">Teléfono</th>
                                        <th className="p-4 w-32">Localidad</th>
                                        <th className="p-4 w-32">Usuario</th>
                                        <th className="p-4 w-32">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perfiles.data.map((perfil) => (
                                        <tr key={perfil.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 w-48 max-w-[12rem] truncate">
                                                {perfil.nombre} {perfil.apellido1} {perfil.apellido2}
                                            </td>
                                            <td className="p-4 w-28 max-w-[7rem] truncate text-gray-500">
                                                {perfil.dni}
                                            </td>
                                            <td className="p-4 w-28 max-w-[7rem] truncate">
                                                {perfil.telefono}
                                            </td>
                                            <td className="p-4 w-32 max-w-[8rem] truncate">
                                                {perfil.localidad}
                                            </td>
                                            <td className="p-4 w-32 max-w-[8rem] truncate">
                                                {perfil.user?.name}
                                            </td>
                                            <td className="p-4 w-32">
                                                <div className="flex gap-3">
                                                    <Link href={route('perfiles.show', perfil.id)} className="text-gray-500 hover:underline text-sm">Ver</Link>
                                                    <Link href={route('perfiles.edit', perfil.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                                    <button onClick={() => eliminar(perfil.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {perfiles.links.map((link, i) => (
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