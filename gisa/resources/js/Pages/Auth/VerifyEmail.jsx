import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerificarEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de correo" />

            <p className="mb-5 text-sm text-base-content/70 leading-relaxed">
                ¡Gracias por registrarte! Antes de continuar, verifica tu dirección
                de correo haciendo clic en el enlace que te hemos enviado. Si no lo
                has recibido, podemos enviarte otro.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-success bg-success/10 border border-success/30 rounded-lg px-3 py-2">
                    Se ha enviado un nuevo enlace de verificación a tu dirección de
                    correo electrónico.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Reenviar correo de verificación
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-base-content/60 hover:text-error underline underline-offset-2 transition-colors"
                    >
                        Cerrar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
