# Tu Ciudad Limpia

Base inicial para una plataforma ciudadana de reportes ambientales, encuestas territoriales y visualizacion de incidencias en mapa.

## Stack

- Backend: Laravel API REST
- Frontend: React + Vite
- Base de datos: PostgreSQL
- Mapas: OpenStreetMap + Leaflet + React Leaflet
- Servidor web: Nginx
- Administracion BD: pgAdmin
- Contenedores: Docker y Docker Compose
- Despliegue futuro: VPS dockerizada

## Estructura

```text
tu-ciudad-limpia/
├── backend/
├── frontend/
├── docker/nginx/default.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## Levantar Docker

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build -d
```

## Instalar dependencias

```bash
cd backend && composer install
cd ../frontend && npm install
```

Si prefieres hacerlo dentro de contenedores:

```bash
docker compose exec backend composer install
docker compose exec frontend npm install
```

## Ejecutar migraciones

```bash
cd backend
php artisan migrate
```

O con Docker:

```bash
docker compose exec backend php artisan migrate
```

## Crear storage link

```bash
cd backend
php artisan storage:link
```

O con Docker:

```bash
docker compose exec backend php artisan storage:link
```

## Accesos

- Frontend: `http://localhost:8080`
- API health: `http://localhost:8080/api/health`
- pgAdmin: `http://localhost:5050`
- PostgreSQL desde pgAdmin:
  - Host: `db`
  - Port: `5432`
  - User: `postgres`
  - Password: `postgres`

## Probar `/api/health`

```bash
curl http://localhost:8080/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "app": "Tu Ciudad Limpia"
}
```

## Seguridad base incluida

- Validacion obligatoria en backend.
- CORS configurable con `CORS_ALLOWED_ORIGINS`.
- Variables de entorno para servicios.
- Errores API en formato JSON sin exponer trazas tecnicas.
- Imagenes restringidas a `jpg`, `jpeg`, `png`, `webp`.
- Limite de `5 MB` por imagen.
- `TODO` pendiente para proteger endpoints admin futuros.

## Despliegue futuro en VPS

- Mantener `.env` fuera del repositorio.
- Provisionar una VPS Linux con Docker Engine y Docker Compose plugin.
- Montar volumen persistente para PostgreSQL y `backend/storage`.
- Publicar Nginx detras de HTTPS.
- Agregar autenticacion y autorizacion para paneles o endpoints admin antes de exponerlos.
