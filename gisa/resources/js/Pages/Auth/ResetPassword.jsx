import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function RestablecerContrasena({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <form onSubmit={submit} className="space-y-4">
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
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1 text-error text-xs" />
                </div>

                <div className="form-control">
                    <InputLabel
                        htmlFor="password"
                        value="Nueva contraseña"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1 text-error text-xs" />
                </div>

                <div className="form-control">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar nueva contraseña"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} className="mt-1 text-error text-xs" />
                </div>

                <div className="flex items-center justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Restablecer contraseña
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
