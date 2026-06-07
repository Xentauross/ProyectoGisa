import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SortableHeader from '@/Components/SortableHeader';

const colores = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    confirmado: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
};

export default function Index({ auth, horarios, sort, dir }) {
    function eliminar(id) {
        if (!confirm('¿Eliminar este horario?')) return;
        router.delete(route('horarios.destroy', id));
    }

    const sh = (field, label) => (
        <SortableHeader field={field} currentSort={sort} currentDir={dir} routeName="horarios.index">
            {label}
        </SortableHeader>
    );

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Horarios</h2>
                    <Link href={route('horarios.create')} className="btn btn-primary btn-sm">
                        Nuevo horario
                    </Link>
                </div>
            }>
            <Head title="Horarios" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
                                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                    <tr>
                                        <th className="p-4">Empleado</th>
                                        {sh('inicio_turno', 'Inicio turno')}
                                        {sh('fin_turno', 'Fin turno')}
                                        {sh('estado', 'Estado')}
                                        <th className="p-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {horarios.data.map((horario) => (
                                        <tr key={horario.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 font-medium">
                                                {horario.user?.perfil
                                                    ? `${horario.user.perfil.dni} - ${horario.user.perfil.nombre} ${horario.user.perfil.apellido1}`
                                                    : horario.user?.name}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(horario.inicio_turno).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(horario.fin_turno).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${colores[horario.estado]}`}>
                                                    {horario.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3">
                                                <Link href={route('horarios.edit', horario.id)} className="text-blue-600 hover:underline text-sm">Editar</Link>
                                                <button onClick={() => eliminar(horario.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {horarios.data.length === 0 && (
                                        <tr><td colSpan={5} className="p-6 text-center text-gray-400 text-sm">No hay horarios registrados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {horarios.links.map((link, i) => (
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