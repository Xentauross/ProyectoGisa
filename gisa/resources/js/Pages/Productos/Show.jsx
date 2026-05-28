import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, producto }) {
    function eliminar() {
        if (!confirm('¿Eliminar este producto?')) return;
        router.delete(route('productos.destroy', producto.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ver producto</h2>}
        >
            <Head title={producto.nombre} />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">{producto.nombre}</h1>
                        <Link href={route('productos.index')} className="text-gray-500 hover:underline text-sm">
                            ← Volver
                        </Link>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">

                        {/* Imagen */}
                        {producto.url_imagen && (
                            <div className="w-full h-56 bg-gray-100 overflow-hidden">
                                <img
                                    src={producto.url_imagen}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                    onError={e => e.target.closest('.bg-gray-100')?.classList.add('hidden')}
                                />
                            </div>
                        )}

                        <div className="p-6 space-y-5">

                            {/* Cabecera: tipo, precio y badge recomendado */}
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 uppercase tracking-wide">
                                        {producto.tipo}
                                    </span>
                                    {producto.es_recomendado && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                            ✦ Recomendado
                                        </span>
                                    )}
                                </div>
                                <span className="text-2xl font-semibold text-gray-800">
                                    {Number(producto.precio).toFixed(2)} €
                                </span>
                            </div>

                            {/* Descripción */}
                            {producto.descripcion && (
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Descripción</p>
                                    <p className="text-gray-700 text-sm leading-relaxed">{producto.descripcion}</p>
                                </div>
                            )}
                            {/* Alergeno */}
                            {producto.alergeno && (
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Alérgenos</p>
                                    <p className="text-gray-700 text-sm">{producto.alergeno}</p>
                                </div>
                            )}
                            {/* Ingredientes */}
                            {producto.ingredientes?.length > 0 && (
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Ingredientes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {producto.ingredientes.map(ing => (
                                            <span key={ing.id}
                                                className="px-3 py-1 rounded-full text-xs bg-gray-50 border border-gray-200 text-gray-600">
                                                {ing.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3 mt-4">
                        <Link
                            href={route('productos.edit', producto.id)}
                            className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
                        >
                            Editar
                        </Link>
                        <button
                            onClick={eliminar}
                            className="flex-1 text-center bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 text-sm font-medium"
                        >
                            Eliminar
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}