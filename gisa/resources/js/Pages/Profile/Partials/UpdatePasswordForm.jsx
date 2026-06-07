import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-base-content">
                    Cambiar contraseña
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                    Asegúrate de usar una contraseña larga y segura para proteger tu cuenta.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div className="form-control">
                    <InputLabel
                        htmlFor="current_password"
                        value="Contraseña actual"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1 text-error text-xs" />
                </div>

                <div className="form-control">
                    <InputLabel
                        htmlFor="password"
                        value="Nueva contraseña"
                        className="label-text text-base-content font-semibold"
                    />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="new-password"
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
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="input input-bordered w-full bg-base-100 border-primary/30 focus:border-primary text-base-content mt-1"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1 text-error text-xs" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : null}
                        Guardar contraseña
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success font-medium">
                            ✓ Contraseña actualizada
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}