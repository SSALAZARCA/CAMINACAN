# 🚀 Guía de Despliegue en VPS usando Coolify

Esta guía detalla paso a paso cómo desplegar **CaminaCan** utilizando Coolify. Debes crear dos "Aplicaciones" (Recursos) separadas: una para el Backend (API) y otra para el Frontend (Web).

---

## 🏗️ 1. Preparar Base de Datos (PostgreSQL)

1.  En tu dashboard de Coolify, ve a tu Proyecto.
2.  Clic en **+ New** -> **Database** -> **PostgreSQL**.
3.  Nombre sugerido: `caminacan-db`.
4.  Una vez creada, copia la **Connection String (Internal)** que empieza con `postgres://...`.
    *   *Nota: Necesitarás esta URL para la variable `DATABASE_URL` del backend.*

---

## ⚙️ 2. Desplegar el Backend (API)

Este servicio manejará la base de datos, autenticación y lógica.

1.  En Coolify, **+ New** -> **Git Repository** (o Public Repository si es público).
2.  Selecciona tu repositorio: `.../caminacan`.
3.  **Configuración Importante:**
    *   **Build Pack:** `Dockerfile`
    *   **Base Directory:** `/server`  *(Esto es CRÍTICO, indica que el código está en la carpeta `server`)*.
    *   **Docker File Location:** `/Dockerfile` (relativo al Base Directory, así que buscará en `/server/Dockerfile`).
    *   **Port:** `4000`.

4.  **Variables de Entorno (Environment Variables):**
    Agrega las siguientes variables:
    *   `PORT`: `4000`
    *   `DATABASE_URL`: Pegar la URL interna de Postgres que copiaste en el paso 1.
        *   *Tip: Asegúrate de agregarle `?schema=public` al final si no lo tiene.*
    *   `JWT_SECRET`: Invéntate una clave larga y segura.
    *   `STORAGE_PROVIDER`: `cloudinary` (Recomendado para producción).
    *   `CLOUDINARY_CLOUD_NAME`: (Tus credenciales...)
    *   `CLOUDINARY_API_KEY`: (Tus credenciales...)
    *   `CLOUDINARY_API_SECRET`: (Tus credenciales...)

5.  Clic en **Save** y luego **Deploy**.
6.  *Post-Despliegue:* Cuando termine, Coolify te dará una URL (ej: `https://api-xxx.tu-dominio.com`). ¡Cópiala!

7.  **Inicializar DB:**
    Puedes abrir la terminal (Console) dentro del contenedor en Coolify y correr:
    ```bash
    npx prisma migrate deploy
    npx prisma db seed
    ```

---

## 🎨 3. Desplegar el Frontend (Web)

Este servicio es la página web que verán los usuarios.

1.  En Coolify, crea otro recurso **+ New** -> **Git Repository**.
2.  Selecciona el **mismo repositorio**: `.../caminacan`.
3.  **Configuración Importante:**
    *   **Build Pack:** `Dockerfile`
    *   **Base Directory:** `/` (Raíz).
    *   **Docker File Location:** `/Dockerfile`.
    *   **Port:** `80`.

4.  **Variables de Entorno:**
    *   `VITE_API_URL`: Pega la URL de tu Backend que copiaste en el paso 2.6 (ej: `https://api-xxx.tu-dominio.com`).
        *   *Importante: Esta variable se "quema" en el código al momento de construir (Build). Si cambias la URL de la API, debes redesplegar el Frontend.*

5.  Clic en **Save** y luego **Deploy**.

---

## ✅ Verificación Final

1.  Entra a la URL de tu Frontend.
2.  Intenta registrarte o iniciar sesión.
3.  Si carga y conecta, ¡felicidades! 🚀

---

### 🆘 Solución de Problemas Comunes

*   **Error de CORS en la API:**
    *   Si el frontend no conecta, revisa los logs del backend.
    *   Puede que necesites ajustar la configuración de CORS en `server/src/index.ts` si tu dominio de frontend es diferente. (Por defecto está en `*` así que debería funcionar).

*   **Error "Client does not exist" en Prisma:**
    *   Asegúrate de haber ejecutado `npx prisma migrate deploy` en la consola del backend después del primer despliegue.

*   **Imágenes no cargan:**
    *   Verifica las credenciales de Cloudinary. El almacenamiento local (`local`) no persiste bien entre despliegues en contenedores estándar a menos que configures Volúmenes persistentes en Coolify (Mounts). Por eso recomendamos Cloudinary.
