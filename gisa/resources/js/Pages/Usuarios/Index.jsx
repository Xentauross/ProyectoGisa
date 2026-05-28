import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

const ROLES = {
    admin: 'Administrador', gerente: 'Gerente', metre: 'Metre',
    camarero: 'Camarero', jefe_cocina: 'Jefe de cocina',
    cocinero: 'Cocinero', aux_administrativo: 'Aux. Administrativo',
};
const BADGE = {
    admin: 'bg-red-100 text-red-700', gerente: 'bg-purple-100 text-purple-700',
    metre: 'bg-blue-100 text-blue-700', camarero: 'bg-sky-100 text-sky-700',
    jefe_cocina: 'bg-orange-100 text-orange-700', cocinero: 'bg-amber-100 text-amber-700',
    aux_administrativo: 'bg-gray-100 text-gray-600',
};

export default function Index({ auth, usuarios, sort, dir }) {
    function eliminar(id, nombre) {
        if (!confirm(`¿Eliminar al usuario ${nombre}?`)) return;
        router.delete(route('usuarios.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="usuarios.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}>
            <Head title="Usuarios" />
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Usuarios</h1>
                        {['admin', 'gerente'].includes(auth.user.role) && (
                            <Link href={route('usuarios.create')}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
                                Nuevo usuario
                            </Link>
                        )}
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                <tr>
                                    <th className="p-4">Usario</th>
                                    {sh('email', 'Email')}
                                    {sh('nombre', 'Nombre Completo')}
                                    {sh('role', 'Rol')}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.data.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No hay usuarios registrados.</td></tr>
                                )}
                                {usuarios.data.map((usuario) => {
                                    const perfil = usuario.perfil;
                                    const nombreCompleto = perfil
                                        ? [perfil.nombre, perfil.apellido1, perfil.apellido2].filter(Boolean).join(' ')
                                        : '—';
                                    return (
                                        <tr key={usuario.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 font-mono text-sm font-medium text-gray-800">{usuario.name}</td>
                                            <td className="p-4 text-sm text-gray-600">{usuario.email}</td>
                                            <td className="p-4 text-sm text-gray-700">{nombreCompleto}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${BADGE[usuario.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {ROLES[usuario.role] ?? usuario.role}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3">
                                                <Link href={route('usuarios.show', usuario.id)} className="text-gray-500 hover:underline text-sm">Ver</Link>
                                                {['admin', 'gerente'].includes(auth.user.role) && (
                                                    <>
                                                        <Link href={route('usuarios.edit', usuario.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                                        {usuario.id !== auth.user.id && (
                                                            <button onClick={() => eliminar(usuario.id, usuario.name)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {usuarios.links?.length > 3 && (
                        <div className="mt-4 flex gap-2">
                            {usuarios.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'}
                                    className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}