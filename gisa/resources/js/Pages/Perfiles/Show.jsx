import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, perfil }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ver perfil</h2>}
        >
            <Head title="Ver perfil" />

            <div className="py-8">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {perfil.nombre} {perfil.apellido1} {perfil.apellido2}
                        </h1>
                        <Link href={route('perfiles.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6 space-y-3">
                        <Fila label="Usuario" valor={perfil.user?.name} />
                        <Fila label="DNI" valor={perfil.dni} />
                        <Fila label="Nº Seguridad Social" valor={perfil.num_seguridad_social} />
                        <Fila label="Teléfono" valor={perfil.telefono} />
                        <Fila label="Fecha de nacimiento" valor={perfil.fecha_nacimiento} />
                        <Fila label="Localidad" valor={perfil.localidad} />
                    </div>

                    <div className="mt-4">
                        <Link href={route('perfiles.edit', perfil.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            Editar
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Fila({ label, valor }) {
    return (
        <div className="flex gap-4 py-1 border-b border-gray-50 last:border-0">
            <span className="w-48 text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800">{valor ?? '—'}</span>
        </div>
    );
}
