import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const role = user.role;
    const can = (roles) => roles.includes(role);

    return (
        <div className="min-h-screen bg-base-100 text-base-content ">
            {/* Barra de navegación principal */}
            <nav className="navbar bg-base-300 shadow-md px-4 sm:px-8 font-bold">
                <div className="navbar-start">
                    {/* Menú Móvil */}
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52 border border-slate-700">
                            {can(['admin', 'gerente', 'metre', 'camarero', 'jefe_cocina', 'cocinero', 'aux_administrativo']) && <li><Link href={route('dashboard')}>Dashboard</Link></li>}
                            {can(['admin', 'gerente']) && <li><Link href={route('usuarios.index')}>Usuarios</Link></li>}
                            {can(['admin', 'gerente', 'aux_administrativo']) && <li><Link href={route('perfiles.index')}>Empleados</Link></li>}
                            {can(['admin', 'gerente', 'metre']) && <li><Link href={route('horarios.index')}>Horarios</Link></li>}
                            {can(['admin', 'gerente', 'metre', 'camarero', 'jefe_cocina', 'cocinero']) && <li><Link href={route('pedidos.index')}>Pedidos</Link></li>}
                            {can(['admin', 'gerente', 'metre', 'camarero', 'jefe_cocina']) && <li><Link href={route('mesas.index')}>Mesas</Link></li>}
                            {can(['admin', 'gerente', 'metre']) && <li><Link href={route('productos.index')}>Productos</Link></li>}
                            {can(['admin', 'gerente']) && <li><Link href={route('ingredientes.index')}>Ingredientes</Link></li>}
                        </ul>
                    </div>
                    {/* Logo y Nombre */}
                    <Link href="/" className="btn btn-ghost text-xl text-accent font-bold">
                        <ApplicationLogo className="block h-6 w-auto fill-current mr-2" />
                        Sistema
                    </Link>
                </div>

                {/* Menú Escritorio */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-1">
                        {can(['admin', 'gerente', 'metre', 'camarero', 'jefe_cocina', 'cocinero', 'aux_administrativo']) && <li><Link href={route('dashboard')} className="text-slate-200 hover:text-accent">Dashboard</Link></li>}
                        {can(['admin', 'gerente']) && <li><Link href={route('usuarios.index')} className="hover:text-primary">Usuarios</Link></li>}
                        {can(['admin', 'gerente', 'aux_administrativo']) && <li><Link href={route('perfiles.index')} className="hover:text-primary">Empleados</Link></li>}
                        {can(['admin', 'gerente', 'metre']) && <li><Link href={route('horarios.index')} className="hover:text-primary">Horarios</Link></li>}
                        {can(['admin', 'gerente', 'metre', 'camarero', 'jefe_cocina', 'cocinero']) && <li><Link href={route('pedidos.index')} className="hover:text-primary">Pedidos</Link></li>}
                        {can(['admin', 'gerente', 'metre', 'camarero']) && <li><Link href={route('mesas.index')} className="hover:text-primary">Mesas</Link></li>}
                        {can(['admin', 'gerente', 'metre']) && <li><Link href={route('productos.index')} className="hover:text-primary">Productos</Link></li>}
                        {can(['admin', 'gerente']) && <li><Link href={route('ingredientes.index')} className="hover:text-primary">Ingredientes</Link></li>}
                    </ul>
                </div>

                {/* Zona de Perfil */}
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            {user.name}
                            <svg className="h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-lg bg-base-200 rounded-box w-56 border border-neutral">
                            <li className="mb-2 border-b border-neutral pb-2 text-primary font-medium px-2">{user.email}</li>
                            <li><Link href={route('profile.edit')}>Mi Perfil</Link></li>
                            <li><Link href={route('logout')} method="post" as="button" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">Cerrar Sesión</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Sub-header */}
            {header && (
                <header className="bg-base-200 border-b border-neutral shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}