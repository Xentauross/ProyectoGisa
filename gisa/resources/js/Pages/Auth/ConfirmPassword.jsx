import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmarContrasena() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <p className="mb-5 text-sm text-base-content/70 leading-relaxed">
                Esta es una zona segura de la aplicación. Por favor, confirma tu
                contraseña antes de continuar.
            </p>

            <form onSubmit={submit} className="space-y-4">
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
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary text-base-content mt-1"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1 text-error text-xs" />
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
                        Confirmar
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
