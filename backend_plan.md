# Plan de Implementación: Backend CaminaCan (v1.0)

Este plan detalla la creación de un backend robusto basado en **Node.js + Express + Prisma ORM + PostgreSQL**, optimizado para despliegue en **Coolify**.

## 1. Arquitectura Técnica
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **ORM:** Prisma (ideal para PostgreSQL)
- **Seguridad:** JWT (JSON Web Tokens) para sesiones y Bcrypt para encriptar contraseñas.
- **Base de Datos:** PostgreSQL (alojada vía Coolify).

## 2. Estructura de la Base de Datos (Tablas)
- **Users:** `id, name, email, password, role (OWNER, WALKER, ADMIN), credits, avatar`.
- **Pets:** `id, name, breed, age, notes, image, ownerId`.
- **WalkerProfiles:** `id, userId, bio, pricePerHour, experience, city, neighborhood, badges (array)`.
- **Bookings:** `id, serviceType, date, time, status, totalPrice, ownerId, walkerId, petIds (relación)`.
- **LiveTracking:** `bookingId, path (jsonb), events (jsonb), photos (jsonb)`.
- **Reviews:** `id, rating, comment, bookingId, walkerId, ownerId`.

## 3. Fases de Desarrollo
1.  **Fase 1: Setup & Prisma Schema:** Configurar el proyecto y definir los modelos de datos.
2.  **Fase 2: Autenticación:** Registro/Login real con JWT y middleware de protección de rutas.
3.  **Fase 3: CRUD de Mascotas y Perfiles:** Endpoints para gestionar perros y perfiles de paseadores.
4.  **Fase 4: Motor de Reservas & Live Tracking:** Lógica para crear paseos y actualizar coordenadas en vivo.
5.  **Fase 5: Preparación para Coolify:** Creación de `Dockerfile` y configuración de variables de entorno.

---

## Próximos Pasos (Inmediato):
1. Crear carpeta `server`.
2. Inicializar `package.json` y dependencias.
3. Configurar Prisma e instanciar PostgreSQL localmente para desarrollo.
