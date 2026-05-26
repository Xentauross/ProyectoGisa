// resources/js/Components/SortableHeader.jsx
import { router, usePage } from '@inertiajs/react';

/**
 * Cabecera de columna ordenable.
 * Uso: <SortableHeader field="nombre" currentSort={sort} currentDir={dir} routeName="usuarios.index">Nombre</SortableHeader>
 */
export default function SortableHeader({ field, currentSort, currentDir, routeName, children, className = '' }) {
    const isActive = currentSort === field;
    const nextDir = isActive && currentDir === 'asc' ? 'desc' : 'asc';

    function handleClick() {
        router.get(route(routeName), { sort: field, dir: nextDir }, { preserveScroll: true, preserveState: true });
    }

    return (
        <th
            className={`p-4 cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap ${className}`}
            onClick={handleClick}
        >
            <span className="inline-flex items-center gap-1">
                {children}
                <span className="text-gray-400 text-xs">
                    {isActive ? (currentDir === 'asc' ? '▲' : '▼') : '⇅'}
                </span>
            </span>
        </th>
    );
}