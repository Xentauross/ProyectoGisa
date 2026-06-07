import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function OlvidasteContrasena({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Olvidé mi contraseña" />

            <p className="mb-5 text-sm text-base-content/70 leading-relaxed">
                ¿Olvidaste tu contraseña? Sin problema. Indícanos tu dirección de
                correo electrónico y te enviaremos un enlace para restablecerla.
            </p>

            {status && (
                <div className="mb-4 text-sm font-medium text-success bg-success/10 border border-success/30 rounded-lg px-3 py-2">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="form-control">
                    <label className="label pb-1">
                        <span className="label-text text-base-content font-semibold">
                            Correo electrónico
                        </span>
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="input input-bordered w-full bg-base-200 border-primary/30 focus:border-primary text-base-content"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@correo.com"
                    />
                    <InputError message={errors.email} className="mt-1 text-error text-xs" />
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
                        Enviar enlace de recuperación
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
