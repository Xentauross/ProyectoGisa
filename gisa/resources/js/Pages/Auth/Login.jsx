import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="form-control">
                    <InputLabel htmlFor="name" value="Usuario" className="label-text text-base-content font-semibold" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary focus:ring-primary text-base-content mt-1"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-1 text-error text-xs" />
                </div>

                <div className="form-control">
                    <InputLabel htmlFor="password" value="Contraseña" className="label-text text-base-content font-semibold" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary focus:ring-primary text-base-content mt-1"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1 text-error text-xs" />
                </div>

                <div className="form-control">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className="text-sm text-base-content/70">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-primary hover:text-primary-focus underline underline-offset-2 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary ms-auto"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Entrar
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
