import React, { memo } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Muestra los datos del perfil del empleado o una CTA para crearlo.
 *
 * @param {{ miPerfil: object|null, perfilId: number|null }} props
 */
const ProfileCard = memo(function ProfileCard({ miPerfil, perfilId }) {
    return (
        <div className="card" aria-label="Mis datos de perfil">
            <div className="card-header">
                <span className="card-label" style={{ marginBottom: 0 }}>Mis datos</span>
                {perfilId
                    ? <Link href={route('perfiles.edit', perfilId)} className="btn-sm">Editar</Link>
                    : <Link href={route('perfiles.create')} className="btn-sm">Crear perfil</Link>
                }
            </div>

            {miPerfil ? (
                <div className="perfil-grid">
                    <div className="perfil-campo perfil-full">
                        <label>Nombre completo</label>
                        <span>{miPerfil.nombre} {miPerfil.apellido1} {miPerfil.apellido2 ?? ''}</span>
                    </div>
                    <div className="perfil-campo">
                        <label>DNI</label>
                        <span>{miPerfil.dni}</span>
                    </div>
                    <div className="perfil-campo">
                        <label>Teléfono</label>
                        <span>{miPerfil.telefono}</span>
                    </div>
                    <div className="perfil-campo">
                        <label>Localidad</label>
                        <span>{miPerfil.localidad}</span>
                    </div>
                    <div className="perfil-campo">
                        <label>Fecha nacimiento</label>
                        <span>{new Date(miPerfil.fecha_nacimiento).toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
            ) : (
                <div className="perfil-vacio" role="status">
                    <p>Sin perfil asignado</p>
                    <Link href={route('perfiles.create')}>+ Crear perfil</Link>
                </div>
            )}
        </div>
    );
});

export default ProfileCard;
