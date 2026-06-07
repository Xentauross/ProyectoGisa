import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, ingrediente }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: ingrediente.nombre,
    });

    function submit(e) {
        e.preventDefault();
        put(route('ingredientes.update', ingrediente.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar ingrediente</h2>}
        >
            <Head title="Editar ingrediente" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar ingrediente</h1>
                        <Link href={route('ingredientes.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    maxLength={255}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    autoFocus
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary ms-auto"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
