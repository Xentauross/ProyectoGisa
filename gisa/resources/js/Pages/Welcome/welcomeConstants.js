// CATEGORÍAS del menú.
// Cada objeto tiene:
//   key   → valor interno que usamos para comparar con p.tipo
//   label → texto que le mostramos al usuario en pantalla
export const CATEGORIAS = [
    { key: 'todos', label: 'Menú Completo' },
    { key: 'plato', label: 'Platos', },
    { key: 'bebida', label: 'Bebidas', },
];


// ALÉRGENOS reconocidos por el Reglamento europeo (14 alérgenos obligatorios).
// Cada objeto tiene:
//   id     → cadena única que usamos internamente para comparar
//   nombre → texto legible para el usuario
//
// ¿Por qué los ponemos aquí y no en la base de datos?
// Porque son fijos por ley y no cambian. El controlador PHP
// también tiene esta misma lista duplicada; si se añade uno
// nuevo habría que actualizarlo en ambos sitios.
export const ALERGENOS_COMUNES = [
    { id: 'gluten', nombre: 'Gluten', },
    { id: 'lacteos', nombre: 'Lácteos', },
    { id: 'huevo', nombre: 'Huevo', },
    { id: 'pescado', nombre: 'Pescado', },
    { id: 'marisco', nombre: 'Marisco', },
    { id: 'frutos_secos', nombre: 'Frutos secos', },
    { id: 'soja', nombre: 'Soja', },
    { id: 'apio', nombre: 'Apio', },
    { id: 'mostaza', nombre: 'Mostaza', },
    { id: 'sesamo', nombre: 'Sésamo', },
    { id: 'sulfitos', nombre: 'Sulfitos', },
    { id: 'moluscos', nombre: 'Moluscos', },
    { id: 'altramuces', nombre: 'Altramuces', },
    { id: 'cacahuetes', nombre: 'Cacahuetes', },
];