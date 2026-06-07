import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-base-content">
                    Información del perfil
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                    Actualiza el nombre y la dirección de correo electrónico de tu cuenta.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="form-control">
                    <InputLabel
                        htmlFor="name"
                        value="Nombre de usuario"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        id="name"
                        className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-1 text-error text-xs" message={errors.name} />
                </div>

                <div className="form-control">
                    <InputLabel
                        htmlFor="email"
                        value="Correo electrónico"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1 text-error text-xs" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg bg-warning/10 border border-warning/30 px-4 py-3">
                        <p className="text-sm text-base-content/80">
                            Tu correo electrónico no está verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-primary underline underline-offset-2 hover:text-primary-focus transition-colors"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-success">
                                Se ha enviado un nuevo enlace de verificación a tu correo.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Guardar cambios
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success font-medium">
                            ✓ Guardado correctamente
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}