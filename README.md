# 🐶 CaminaCan - Plataforma de Paseo de Perros

Bienvenido al repositorio oficial de **CaminaCan**, una plataforma moderna y completa para conectar dueños de mascotas con paseadores certificados. Este proyecto incluye una aplicación web progresiva (PWA) para clientes y paseadores, y un potente panel de administración.

## 🚀 Tecnologías Principales

### Frontend
- **React 18** + **Vite**: Rendimiento y experiencia de desarrollo ultrarrápida.
- **TypeScript**: Seguridad de tipos y escalabilidad.
- **TailwindCSS**: Diseño responsivo y estilizado moderno ("Wow effect").
- **Framer Motion**: Animaciones fluidas y transiciones de página.
- **Context API**: Gestión de estado global (Auth, Carrito, Reservas).
- **Socket.io-client**: Comunicación en tiempo real para chat y rastreo.
- **React Helmet Async**: SEO dinámico.

### Backend
- **Node.js** + **Express**: API RESTful robusta.
- **Prisma ORM**: Gestión de base de datos segura y tipada.
- **PostgreSQL**: Base de datos relacional.
- **Socket.io**: WebSockets para eventos en vivo (GPS, Chat).
- **JWT**: Autenticación segura basada en tokens.
- **Multer** + **Cloudinary**: Gestión de archivos (Local o Nube).

---

## ✨ Funcionalidades Clave

1.  **📍 Live Tracking (Rastreo en Vivo)**
    *   Visualización de paseos en tiempo real sobre mapa interactivo.
    *   **GPS en Segundo Plano:** Implementación avanzada usando *Screen Wake Lock API* y *Silent Audio Loop* para mantener el rastreo activo en navegadores móviles.
    *   Reportes de eventos (Pipí, Popó, Hidratación, Fotos).

2.  **📅 Sistema de Reservas**
    *   Wizard paso a paso para agendar paseos.
    *   Soporte para **Reservas Recurrentes** (Generación automática de fechas futuras).
    *   Validación de disponibilidad de paseadores.

3.  **👥 Gestión de Usuarios y Roles**
    *   **Dueños:** Perfil, Mis Mascotas, Historial de Paseos.
    *   **Paseadores:** Dashboard de ganancias, Gestión de disponibilidad, Perfil público.
    *   **Administrador:** Métricas globales, Gestión de usuarios.

4.  **🛒 Tienda Integrada**
    *   Catálogo de productos (Planes, Accesorios).
    *   Carrito de compras funcional.

---

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (Instancia local o remota)

### 1. Clonar y Preparar Entorno

```bash
git clone <url-del-repositorio>
cd caminacan
```

### 2. Configuración del Backend

```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server` basado en el siguiente ejemplo:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:password@localhost:5432/caminacan_db?schema=public"
JWT_SECRET="tu_super_secreto_seguro"

# Configuración de Correo (Opcional para desarrollo)
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASS="tu_contraseña_de_aplicacion"

# Almacenamiento de Imágenes (Opcional: 'local' o 'cloudinary')
STORAGE_PROVIDER="local" 
# CLOUDINARY_CLOUD_NAME=xxx
# CLOUDINARY_API_KEY=xxx
# CLOUDINARY_API_SECRET=xxx
```

Inicializa la base de datos:

```bash
npm run build # Genera cliente Prisma
npx prisma migrate dev --name init # Crea tablas
npx prisma db seed # (Opcional) Carga datos de prueba
```

Inicia el servidor:

```bash
npm run dev
```

### 3. Configuración del Frontend

En una **nueva terminal**:

```bash
# Desde la raíz del proyecto
npm install
```

Crea un archivo `.env` en la raíz (si es necesario cambiar la URL de la API):

```env
VITE_API_URL=http://localhost:4000/api
```

Inicia la aplicación:

```bash
npm run dev
```

Visita `http://localhost:5173` para ver la aplicación.

---

## 🧪 Notas Técnicas Importantes

### GPS en Navegadores Móviles
Debido a las restricciones de los sistemas operativos móviles para ahorrar batería, los navegadores suelen detener la ejecución de JavaScript en pestañas inactivas.

**Nuestra Solución:**
En el `WalkerDashboard`, al iniciar un paseo, activamos:
1.  **Screen Wake Lock:** Solicita al dispositivo no apagar la pantalla.
2.  **Silent Audio Hack:** Reproduce un audio imperceptible en bucle. Esto "engaña" al SO para que categorice la pestaña como "reproducción de medios activa", permitiendo la ejecución continua del geolocalizador en segundo plano.

### Recurrencia
Al seleccionar "Recurrente" en una reserva, el backend recibe el patrón de días y automáticamente genera registros individuales para los próximos 28 días, permitiendo un calendario real y manejable.

---

## 🔮 Roadmap (Mejoras Futuras)

- [ ] Integración con pasarela de pagos real (Stripe/MercadoPago SDK).
- [ ] Notificaciones Push (PWA Service Workers).
- [ ] Chat persistente con historial en base de datos.
- [ ] Aplicación móvil nativa (React Native) para mejor control de hardware.

---

Hecho con ❤️ por el equipo de **CaminaCan**.
