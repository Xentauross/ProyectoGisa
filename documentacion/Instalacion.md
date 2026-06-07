# Manual de Instalación — GISA

## Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu máquina:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18 o superior)
- [ngrok](https://ngrok.com/) *(opcional, solo si quieres exponer la app al exterior)*

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Xentauross/ProyectoGisa.git
cd ProyectoGisa
```

---

## 2. Configurar las variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores:

```bash
cp gisa/.env.example gisa/.env
```

Abre `gisa/.env` y configura como mínimo:

```env
APP_NAME=GISA
APP_ENV=local
APP_KEY=                        # se genera en el paso 5
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=gisa
DB_USERNAME=root
DB_PASSWORD=root
```

---

## 3. Compilar los assets de frontend

Desde la carpeta `gisa/`, instala las dependencias de Node y compila:

```bash
cd gisa
npm install
npm run build
cd ..
```

> **Importante:** este paso debe hacerse **antes** de levantar Docker, ya que los assets compilados se comparten con el contenedor a través del bind mount.

---

## 4. Levantar los contenedores

Desde la raíz del proyecto (donde está el `docker-compose.yml`):

```bash
docker compose up --build -d
```

Esto levanta tres servicios:
- `db` — MySQL 8.0
- `app` — PHP 8.4-FPM con Laravel
- `nginx` — servidor web en el puerto `8080`

Puedes verificar que todo está corriendo con:

```bash
docker compose ps
```

---

## 5. Generar la clave de la aplicación

```bash
docker compose exec app php artisan key:generate
```

---

## 6. Ejecutar migraciones y seeders

```bash
docker compose exec app php artisan migrate --seed
```

Esto crea todas las tablas en la base de datos y las puebla con datos iniciales.

---

## 7. Acceder a la aplicación

Abre el navegador y ve a:

```
http://localhost:8080
```

---

## 8. Exponer con ngrok *(opcional)*

Si necesitas acceder desde fuera de tu red local:

```bash
ngrok http 8080
```

Ngrok te dará una URL pública del tipo `https://xxxx.ngrok-free.app`.

Actualiza `APP_URL` en `gisa/.env` con esa URL y reinicia el contenedor de la app:

```bash
docker compose restart app
```

---

## Comandos útiles

| Acción | Comando |
|--------|---------|
| Parar los contenedores | `docker compose down` |
| Parar y eliminar volúmenes (reset BD) | `docker compose down -v` |
| Ver logs en tiempo real | `docker compose logs -f` |
| Ver logs de un servicio | `docker compose logs -f app` |
| Acceder al contenedor de la app | `docker compose exec app sh` |
| Limpiar caché de Laravel | `docker compose exec app php artisan cache:clear` |
| Recompilar assets | `cd gisa && npm run build` |

---

## Solución de problemas frecuentes

### `Could not open input file: artisan`
El bind mount no apunta a la carpeta correcta. Verifica que en `docker-compose.yml` los volúmenes usen `./gisa:/var/www/html` (con barra: `./gisa`, no `.gisa`).

### `Vite manifest not found`
No se han compilado los assets. Ejecuta dentro de la carpeta `gisa/`:
```bash
npm install && npm run build
```
Luego reinicia: `docker compose restart app`

### `403 Forbidden` en nginx
Comprueba que la carpeta `gisa/public/` tiene permisos de lectura y que el volumen `public/build` no está declarado como volumen anónimo en el `docker-compose.yml` (eso oculta los archivos compilados).

### La base de datos no arranca
Espera unos segundos a que el healthcheck de MySQL pase y vuelve a ejecutar las migraciones:
```bash
docker compose exec app php artisan migrate --seed
```
