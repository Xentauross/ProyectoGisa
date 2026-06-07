import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-error">
                    Eliminar cuenta
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                    Una vez eliminada tu cuenta, todos los datos serán borrados permanentemente.
                    Descarga cualquier información que quieras conservar antes de continuar.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="btn btn-error btn-outline"
            >
                Eliminar cuenta
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-base-200 rounded-2xl">
                    <h2 className="text-lg font-bold text-base-content">
                        ¿Estás seguro de que quieres eliminar tu cuenta?
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        Esta acción es irreversible. Todos tus datos serán eliminados
                        permanentemente. Introduce tu contraseña para confirmar.
                    </p>

                    <div className="mt-6 form-control">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="label-text text-base-content font-semibold sr-only"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="input input-bordered w-full bg-base-100 border-error/30 focus:border-error text-base-content"
                            isFocused
                            placeholder="Introduce tu contraseña"
                        />
                        <InputError message={errors.password} className="mt-1 text-error text-xs" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="btn btn-ghost"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-error"
                        >
                            {processing ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : null}
                            Eliminar cuenta
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}