# 🌐 Configuración de Dominio Personalizado en Coolify

Esta guía te ayudará a conectar tu dominio `www.caminacan.com` (y `caminacan.com`) a tu aplicación desplegada en Coolify.

## 📋 Requisitos Previos

1.  **Acceso a tu Registrador de Dominios:** (Donde compraste el dominio, ej: GoDaddy, Namecheap, Cloudflare, etc.).
2.  **Dirección IP de tu Servidor VPS:** La IP pública de tu servidor Coolify.

---

## 🚀 Pasos de Configuración

### Paso 1: Configurar DNS en tu Registrador

Debes apuntar tu dominio a la IP de tu servidor VPS. Entra al panel de gestión de DNS de tu dominio y crea (o edita) los siguientes registros:

| Tipo | Host / Nombre | Valor / Destino | TTL | Nota |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (o dejar vacío) | `TU_IP_DEL_VPS` | Automático / 3600 | Apunta `caminacan.com` a tu servidor. |
| **CNAME** | `www` | `caminacan.com` | Automático / 3600 | Apunta `www.caminacan.com` al registro principal. |

> **Nota:** Reemplaza `TU_IP_DEL_VPS` con la IP real de tu servidor (ej: `123.45.67.89`).

### Paso 2: Configurar Dominio en Coolify

Una vez configurados los DNS (pueden tardar unos minutos en propagarse), ve a tu panel de Coolify:

1.  **Selecciona tu Recurso Frontend:** Entra al proyecto y selecciona la aplicación "Frontend" (la que acabamos de arreglar).
2.  Ve a la pestaña **Settings** (Configuración) o en la sección **General**.
3.  Busca el campo **Domains** (o "URL de la aplicación").
4.  Ingresa tus dominios separados por coma. Ejemplo:
    ```csv
    https://caminacan.com,https://www.caminacan.com
    ```
5.  **Guarda los cambios (Save).**
6.  Coolify configurará automáticamente el proxy inverso (Traefik) y generará los certificados SSL (HTTPS) con Let's Encrypt.

### Paso 3: Verificar y Redesplegar

1.  Espera unos segundos/minutos a que Coolify aplique la configuración.
2.  Si no ves cambios inmediatos, haz clic en **Redeploy** para forzar la actualización de la configuración del proxy.
3.  Visita `https://www.caminacan.com`. ¡Debería cargar tu nueva página de inicio segura y rápida!

---

## 🔧 Solución de Problemas

*   **Error SSL / No Seguro:** Si ves una advertencia de seguridad, espera unos minutos. La generación del certificado SSL puede tardar un poco. Asegúrate de que los puertos **80** y **443** estén abiertos en el firewall de tu VPS (en AWS/DigitalOcean/Hetzner).
*   **Página en Blanco / Error 502:** Significa que el dominio llega al servidor, pero la aplicación no responde. Revisa los logs de despliegue en Coolify.
*   **Redirección infinita:** Asegúrate de que en Coolify hayas puesto `https://` y no `http://`. Coolify fuerza HTTPS por defecto.
