import React, { memo } from 'react';
import { Link } from '@inertiajs/react';

const ProfileCard = memo(function ProfileCard({ miPerfil, perfilId, role }) {
    const puedeCrear = ['admin', 'gerente', 'aux_administrativo'].includes(role);

    return (
        <div className="dashb-card" aria-label="Mis datos de perfil">
            <div className="dashb-card-header">
                <span className="dashb-card-label" style={{ marginBottom: 0 }}>Mis datos</span>
                {perfilId
                    ? <Link href={route('perfiles.edit', perfilId)} className="dashb-btn-sm">Editar</Link>
                    : puedeCrear && <Link href={route('perfiles.create')} className="dashb-btn-sm">Crear perfil</Link>
                }
            </div>

            {miPerfil ? (
                <div className="dashb-perfil-grid">
                    <div className="dashb-perfil-campo dashb-perfil-full">
                        <label>Nombre completo</label>
                        <span>{miPerfil.nombre} {miPerfil.apellido1} {miPerfil.apellido2 ?? ''}</span>
                    </div>
                    <div className="dashb-perfil-campo">
                        <label>DNI</label>
                        <span>{miPerfil.dni}</span>
                    </div>
                    <div className="dashb-perfil-campo">
                        <label>Teléfono</label>
                        <span>{miPerfil.telefono}</span>
                    </div>
                    <div className="dashb-perfil-campo">
                        <label>Localidad</label>
                        <span>{miPerfil.localidad}</span>
                    </div>
                    <div className="dashb-perfil-campo">
                        <label>Fecha nacimiento</label>
                        <span>{new Date(miPerfil.fecha_nacimiento).toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
            ) : (
                <div className="dashb-perfil-vacio" role="status">
                    <p>Sin empleado asignado</p>
                    {puedeCrear && <Link href={route('perfiles.create')}>+ Crear perfil</Link>}
                </div>
            )}
        </div>
    );
});

export default ProfileCard;
