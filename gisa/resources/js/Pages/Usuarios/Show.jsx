// resources/js/Pages/Usuarios/Show.jsx
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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

export default function Show({ auth, usuario }) {
    const perfil = usuario.perfil ?? {};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ver usuario</h2>}
        >
            <Head title={`Usuario — ${usuario.name}`} />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">{usuario.name}</h1>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${BADGE[usuario.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                {ROLES[usuario.role] ?? usuario.role}
                            </span>
                        </div>
                        <Link href={route('usuarios.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    {/* Cuenta */}
                    <div className="bg-white shadow rounded-lg p-6 mb-4">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Cuenta de acceso</h2>
                        <Fila label="Usuario" valor={usuario.name} mono />
                        <Fila label="Email" valor={usuario.email} />
                        <Fila label="Rol" valor={ROLES[usuario.role] ?? usuario.role} />
                    </div>

                    {/* Datos personales */}
                    {usuario.perfil && (
                        <div className="bg-white shadow rounded-lg p-6 mb-4">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Datos personales</h2>
                            <Fila label="Nombre completo" valor={[perfil.nombre, perfil.apellido1, perfil.apellido2].filter(Boolean).join(' ')} />
                            <Fila label="DNI" valor={perfil.dni} />
                            <Fila label="Nº Seg. Social" valor={perfil.num_seguridad_social} />
                            <Fila label="Teléfono" valor={perfil.telefono} />
                            <Fila label="Fecha nacimiento" valor={
                                perfil.fecha_nacimiento
                                    ? new Date(perfil.fecha_nacimiento + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                    : null
                            } />
                            <Fila label="Localidad" valor={perfil.localidad} />
                            <Fila label="Cuenta bancaria" valor={perfil.cuenta_bancaria} />
                        </div>
                    )}

                    {/* Horarios */}
                    {usuario.horarios?.length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6 mb-4">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Próximos turnos</h2>
                            <div className="space-y-2">
                                {usuario.horarios.slice(0, 5).map(h => (
                                    <div key={h.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
                                        <span className="text-gray-600">
                                            {new Date(h.inicio_turno).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            {' → '}
                                            {new Date(h.fin_turno).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${h.estado === 'confirmado' ? 'bg-green-100 text-green-700'
                                                : h.estado === 'cancelado' ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>{h.estado}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Acciones */}
                    {auth.user.role === 'admin' && (
                        <div className="flex gap-3 mt-2">
                            <Link
                                href={route('usuarios.edit', usuario.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                            >
                                Editar usuario
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Fila({ label, valor, mono = false }) {
    return (
        <div className="flex gap-4 py-1.5 border-b border-gray-50 last:border-0">
            <span className="w-44 text-sm text-gray-500 flex-shrink-0">{label}</span>
            <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
                {valor ?? '—'}
            </span>
        </div>
    );
}