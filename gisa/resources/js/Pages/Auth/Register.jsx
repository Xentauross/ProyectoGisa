import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CrearUsuario({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'camarero',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register.store'), {
            onSuccess: () => reset(),
        });
    };

    const roles = ['admin', 'gerente', 'metre', 'camarero', 'cocinero'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold text-base-content tracking-wide">
                    Crear Usuario
                </h2>
            }
        >
            <Head title="Crear Usuario" />

            <div className="max-w-xl mx-auto mt-8">
                <div className="bg-base-200 rounded-2xl shadow-lg p-8 border border-primary/10">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Nombre */}
                        <div className="form-control">
                            <InputLabel
                                htmlFor="name"
                                value="Nombre de usuario"
                                className="label-text text-base-content font-semibold"
                            />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1 text-error text-xs" />
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <InputLabel
                                htmlFor="email"
                                value="Correo electrónico"
                                className="label-text text-base-content font-semibold"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-1 text-error text-xs" />
                        </div>

                        {/* Rol */}
                        <div className="form-control">
                            <InputLabel
                                htmlFor="role"
                                value="Rol"
                                className="label-text text-base-content font-semibold"
                            />
                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="select select-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1 capitalize"
                                required
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r} className="capitalize">
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.role} className="mt-1 text-error text-xs" />
                        </div>

                        {/* Contraseña */}
                        <div className="form-control">
                            <InputLabel
                                htmlFor="password"
                                value="Contraseña"
                                className="label-text text-base-content font-semibold"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-1 text-error text-xs" />
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="form-control">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmar contraseña"
                                className="label-text text-base-content font-semibold"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1 text-error text-xs" />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary px-8"
                            >
                                {processing ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : null}
                                Crear Usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
