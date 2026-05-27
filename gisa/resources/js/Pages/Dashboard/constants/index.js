// ── Calendario ────────────────────────────────────────────
export const NOMBRES_MES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ── Estados de turno ──────────────────────────────────────
export const ESTADO_COLORES = {
    confirmado: '#22c55e',
    cancelado:  '#ef4444',
    pendiente:  '#f59e0b',
};

export const ESTADOS_TURNO = [
    { value: 'pendiente',   label: 'Pendiente' },
    { value: 'confirmado',  label: 'Confirmado' },
    { value: 'cancelado',   label: 'Cancelado' },
];

export const LEYENDA_ESTADOS = [
    { color: ESTADO_COLORES.confirmado, label: 'Confirmado' },
    { color: ESTADO_COLORES.pendiente,  label: 'Pendiente' },
    { color: ESTADO_COLORES.cancelado,  label: 'Cancelado' },
];

// ── Límite de próximos turnos visibles ────────────────────
export const MAX_PROXIMOS_TURNOS = 6;
