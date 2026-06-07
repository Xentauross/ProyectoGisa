import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

export default function Index({ auth, perfiles, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este perfil?')) return;
        router.delete(route('perfiles.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="perfiles.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Empleados</h2>}>
            <Head title="Empleados" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
                                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                    <tr>
                                        {sh('nombre', 'Nombre completo')}
                                        {sh('dni', 'DNI')}
                                        {sh('telefono', 'Teléfono')}
                                        {sh('num_seguridad_social', 'Nº Seg. Social')}
                                        <th className="p-4">Cuenta Bancaria</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {perfiles.data.map((perfil) => (
                                        <tr key={perfil.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-900">
                                                {perfil.nombre} {perfil.apellido1} {perfil.apellido2}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-gray-500">{perfil.dni}</td>
                                            <td className="p-4 whitespace-nowrap">{perfil.telefono}</td>
                                            <td className="p-4 whitespace-nowrap">{perfil.num_seguridad_social}</td>
                                            <td className="p-4 whitespace-nowrap">{perfil.cuenta_bancaria}</td>
                                            <td className="p-4 text-gray-500">{perfil.user?.email}</td>
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-3">
                                                    <Link href={route('perfiles.show', perfil.id)} className="text-gray-500 hover:underline">Ver</Link>
                                                    <Link href={route('perfiles.edit', perfil.id)} className="text-blue-600 hover:underline">Editar</Link>
                                                    {['admin', 'gerente'].includes(auth.user.role) && (
                                                        <button onClick={() => eliminar(perfil.id)} className="text-red-600 hover:underline">Eliminar</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {perfiles.data.length === 0 && (
                                        <tr><td colSpan={7} className="p-6 text-center text-gray-400 text-sm">No hay empleados registrados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {perfiles.links.map((link, i) => (
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