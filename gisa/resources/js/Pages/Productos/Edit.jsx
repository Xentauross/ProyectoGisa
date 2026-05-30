import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export const ALERGENOS_COMUNES = [
    { id: 'gluten', nombre: 'Gluten', },
    { id: 'lacteos', nombre: 'Lácteos', },
    { id: 'huevo', nombre: 'Huevo', },
    { id: 'pescado', nombre: 'Pescado', },
    { id: 'marisco', nombre: 'Marisco', },
    { id: 'frutos_secos', nombre: 'Frutos secos', },
    { id: 'soja', nombre: 'Soja', },
    { id: 'apio', nombre: 'Apio', },
    { id: 'mostaza', nombre: 'Mostaza', },
    { id: 'sesamo', nombre: 'Sésamo', },
    { id: 'sulfitos', nombre: 'Sulfitos', },
    { id: 'moluscos', nombre: 'Moluscos', },
    { id: 'altramuces', nombre: 'Altramuces', },
    { id: 'cacahuetes', nombre: 'Cacahuetes', },
];

export default function Edit({ auth, producto, ingredientes }) {
    const { data, setData, put, processing, errors } = useForm({
        tipo: producto.tipo,
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        precio: producto.precio,
        url_imagen: producto.url_imagen ?? '',
        alergeno: Array.isArray(producto.alergeno) ? producto.alergeno : [],
        es_recomendado: producto.es_recomendado,
        ingredientes: producto.ingredientes.map((i) => i.id),
    });

    function submit(e) {
        e.preventDefault();
        put(route('productos.update', producto.id));
    }

    function toggleIngrediente(id) {
        setData('ingredientes',
            data.ingredientes.includes(id)
                ? data.ingredientes.filter((i) => i !== id)
                : [...data.ingredientes, id]
        );
    }

    function toggleAlergeno(id) {
        setData('alergeno',
            data.alergeno.includes(id)
                ? data.alergeno.filter((a) => a !== id)
                : [...data.alergeno, id]
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar producto</h2>}
        >
            <Head title="Editar producto" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Editar producto</h1>
                        <Link href={route('productos.index')} className="text-gray-500 hover:underline text-sm">← Volver</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-5">

                            <Campo label="Tipo" error={errors.tipo}>
                                <div className="flex gap-6 mt-1">
                                    {['plato', 'bebida'].map((opcion) => (
                                        <label key={opcion} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipo"
                                                value={opcion}
                                                checked={data.tipo === opcion}
                                                onChange={() => setData('tipo', opcion)}
                                                className="accent-blue-600"
                                            />
                                            {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </Campo>

                            <Campo label="Nombre" error={errors.nombre}>
                                <input type="text" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    maxLength={40}
                                    className="w-full border rounded px-3 py-2 text-sm" />
                            </Campo>

                            <Campo label="Descripción" error={errors.descripcion}>
                                <textarea value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm" rows={3} />
                            </Campo>

                            <Campo label="Precio (€)" error={errors.precio}>
                                <input type="number" step="0.01" min="0" value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm" />
                            </Campo>

                            <Campo label="URL imagen" error={errors.url_imagen}>
                                <input type="text" value={data.url_imagen}
                                    onChange={(e) => setData('url_imagen', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm" />
                            </Campo>

                            <Campo label="Alérgenos" error={errors.alergeno}>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    {ALERGENOS_COMUNES.map((alg) => (
                                        <label key={alg.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={data.alergeno.includes(alg.id)}
                                                onChange={() => toggleAlergeno(alg.id)}
                                                className="accent-red-600"
                                            />
                                            <span>{alg.icono} {alg.nombre}</span>
                                        </label>
                                    ))}
                                </div>
                                {data.alergeno.length > 0 && (
                                    <p className="text-xs text-red-500 mt-2">
                                        {data.alergeno.length} alérgeno{data.alergeno.length > 1 ? 's' : ''} marcado{data.alergeno.length > 1 ? 's' : ''}
                                    </p>
                                )}
                            </Campo>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="es_recomendado"
                                    checked={data.es_recomendado}
                                    onChange={(e) => setData('es_recomendado', e.target.checked)} />
                                <label htmlFor="es_recomendado" className="text-sm">Producto recomendado</label>
                            </div>

                            {ingredientes.length > 0 && (
                                <Campo label="Ingredientes">
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        {ingredientes.map((ing) => (
                                            <label key={ing.id} className="flex items-center gap-2 text-sm">
                                                <input type="checkbox"
                                                    checked={data.ingredientes.includes(ing.id)}
                                                    onChange={() => toggleIngrediente(ing.id)} />
                                                {ing.nombre}
                                            </label>
                                        ))}
                                    </div>
                                </Campo>
                            )}

                            <div className="pt-2">
                                <button type="submit" disabled={processing}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}