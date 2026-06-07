# Manual de Usuario — GISA

> Sistema de gestión interna para restaurantes. Este manual describe las funcionalidades disponibles según el rol del usuario.

---

## Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Roles y permisos](#2-roles-y-permisos)
3. [Gestión de usuarios](#3-gestión-de-usuarios)
4. [Perfiles de empleado](#4-perfiles-de-empleado)
5. [Pedidos y mesas](#5-pedidos-y-mesas)
6. [Productos e ingredientes](#6-productos-e-ingredientes)
7. [Horarios y turnos](#7-horarios-y-turnos)

---

## 1. Acceso al sistema

Para acceder a GISA, introduce tu nombre de usuario y contraseña en la pantalla de inicio de sesión. El registro de nuevos usuarios está deshabilitado; solo un administrador o gerente puede crear cuentas.

Una vez autenticado serás redirigido al **Dashboard**, que muestra:

- Tus datos de perfil.
- Tus próximos turnos y un calendario mensual.

---

## 2. Roles y permisos

GISA define siete roles. Cada rol tiene acceso a un conjunto específico de funcionalidades.

| Rol | Etiqueta |
|-----|----------|
| `admin` | Administrador |
| `gerente` | Gerente |
| `metre` | Metre |
| `camarero` | Camarero |
| `jefe_cocina` | Jefe de cocina |
| `cocinero` | Cocinero |
| `aux_administrativo` | Aux. Administrativo |

### Tabla de permisos por módulo

| Módulo | admin | gerente | metre | camarero | jefe_cocina | cocinero | aux_admin |
|--------|:-----:|:-------:|:-----:|:--------:|:-----------:|:--------:|:---------:|
| Usuarios (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Editar propio perfil | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mesas (CRUD) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pedidos (CRUD) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Productos (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ingredientes (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Horarios (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver horarios propios | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Confirmar turno propio | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Gestión de usuarios

**Acceso:** Administrador y Gerente.

Desde el menú **Usuarios** puedes:

- **Listar** todos los usuarios registrados, con filtros y ordenación por email, nombre completo y rol.
- **Crear** un nuevo usuario introduciendo nombre de usuario, email, contraseña y rol.
- **Editar** los datos de un usuario existente.
- **Eliminar** un usuario. No es posible eliminar tu propia cuenta desde este panel.

> Un usuario no puede eliminarse a sí mismo desde la lista de usuarios.

### Crear un usuario

1. Accede a **Usuarios → Nuevo usuario**.
2. Rellena el formulario: nombre de usuario, email, contraseña y rol.
3. Pulsa **Guardar**.

El nuevo usuario podrá iniciar sesión de inmediato. Se recomienda crear también su perfil de empleado (ver sección 4).

---

## 4. Perfiles de empleado

**Acceso completo:** Administrador, Gerente y Aux. Administrativo.
**Editar propio perfil:** Todos los roles.

El perfil almacena los datos personales y laborales del empleado:

- Nombre completo (nombre, primer y segundo apellido)
- DNI
- Número de Seguridad Social
- Teléfono
- Fecha de nacimiento
- Localidad
- Cuenta bancaria

### Ver y editar tu propio perfil

1. En el **Dashboard**, sección *Mis datos*, pulsa **Editar**.
2. Modifica los campos necesarios y pulsa **Guardar**.

> Si aún no tienes perfil asignado y tu rol lo permite, aparecerá el botón **Crear perfil**.

### Gestión de perfiles (admin / gerente / aux. administrativo)

Desde **Perfiles** puedes listar, crear, editar y eliminar perfiles de cualquier empleado. Al crear un perfil debes seleccionar el usuario al que se asocia; solo aparecen usuarios que aún no tienen perfil.

---

## 5. Pedidos y mesas

### Mesas

**Acceso:** Administrador, Gerente, Metre y Camarero.

Las mesas se identifican por número. Desde **Mesas** puedes crear, editar y eliminar mesas del establecimiento.

### Pedidos

**Acceso:** Administrador, Gerente, Metre, Camarero, Jefe de cocina y Cocinero.

Un pedido representa el consumo de una mesa. Cada pedido tiene:

- **Mesa** asignada.
- **Camarero** responsable.
- **Estado:** `Pendiente` → `Listo` → `Servido` → `Pagado`.
- **Líneas de pedido:** productos con cantidad, precio unitario, subtotal y notas.

#### Crear un pedido

1. Accede a **Pedidos → Nuevo pedido**.
2. Selecciona la mesa, el camarero y el estado inicial.
3. Pulsa **Crear pedido**.

#### Añadir productos a un pedido

1. Abre el pedido y pulsa **Editar pedido**.
2. En la sección *Productos del pedido*, selecciona el producto, la cantidad y las notas opcionales.
3. Pulsa **Añadir**.

#### Eliminar una línea

En la tabla de productos, pulsa **Quitar** en la línea correspondiente.

#### Cambiar el estado

En la pantalla de edición, cambia el desplegable *Estado* y pulsa **Actualizar pedido**.

> Solo los roles con permiso de eliminación (Administrador, Gerente y Metre) pueden borrar un pedido completo.

---

## 6. Productos e ingredientes

**Acceso:** Administrador y Gerente.

### Productos

Los productos son los artículos que se pueden añadir a un pedido (platos, bebidas, etc.). Cada producto tiene nombre y precio.

Desde **Productos** puedes crear, editar y eliminar productos.

### Ingredientes

Los ingredientes permiten registrar los componentes del inventario. Desde **Ingredientes** puedes crear, editar y eliminar ingredientes.

> La vista de detalle de un ingrediente no está disponible en el listado; accede a la edición directamente.

---

## 7. Horarios y turnos

### Gestión de horarios (admin y gerente)

Desde **Horarios** los administradores y gerentes pueden:

- **Listar** todos los horarios de todos los empleados.
- **Crear** un turno asignando usuario, fecha/hora de inicio y fin, y estado.
- **Editar** o **eliminar** cualquier turno.

Al crear o modificar un turno, el sistema envía automáticamente un email de notificación al empleado afectado.

### Ver mis turnos (todos los roles)

Todos los usuarios pueden ver sus propios turnos desde:

- El **Dashboard** → sección *Mis turnos* y calendario mensual.
- El menú **Horarios** → muestra únicamente los turnos propios.

### Confirmar o modificar un turno propio

1. En el Dashboard, pulsa sobre un turno de la lista *Mis turnos*.
2. Se abre un modal donde puedes cambiar el **estado** (`Pendiente`, `Confirmado`, `Cancelado`) y ajustar las horas reales de inicio y fin.
3. Pulsa **Guardar**.

> Los cambios de hora se interpretan siempre en horario de Madrid (Europe/Madrid).

---

*Manual generado para la versión actual de GISA — DAW 2025.*
