# Plan de Implementación: Disponibilidad, Recurrencia y Cancelaciones

Este plan detalla la evolución del sistema de reservas para incluir validación de disponibilidad, suscripciones recurrentes y gestión de políticas de cancelación.

## 1. Calendario Dinámico y Slots de Disponibilidad
**Objetivo:** Evitar sobre-reservas y permitir que los paseadores definan su horario.

### Cambios en Contexto:
- **WalkerContext.tsx:** 
    - Extender `ActiveWalker` con un objeto `availability`.
    - Ejemplo: `{ "2026-01-05": ["08:00", "09:00", "16:00"] }`.
- **BookingContext.tsx:**
    - Crear una función helper para verificar si un slot está libre comparando con las reservas existentes.

### Cambios en UI (`Booking.tsx`):
- Al seleccionar una fecha, filtrar el dropdown de horas basado en la disponibilidad del paseador seleccionado y las reservas ya existentes para ese día.

## 2. Reservas Recurrentes y Paquetes
**Objetivo:** Permitir suscripciones (ej. Lun-Mie-Vie).

### Cambios en Data:
- **Booking Interface:** Añadir `type: 'single' | 'recurring'`, `daysOfWeek: number[]`, `endDate: string`.
- **ConfigContext.tsx:** Añadir descuentos por paquetes (ej. 10% de descuento si reservas 5+ paseos).

### Cambios en UI (`Booking.tsx`):
- En el paso "Fecha", añadir un switch entre "Paseo Único" y "Plan Recurrente".
- Si es recurrente, permitir seleccionar múltiples días de la semana.

## 3. Política de Cancelación y Créditos
**Objetivo:** Gestionar devoluciones automáticas basadas en el tiempo de antelación.

### Reglas:
- > 24 horas: Reembolso 100% (Crédito CaminaCan).
- 12-24 horas: Reembolso 50%.
- < 12 horas: Sin reembolso.

### Cambios en Contexto:
- **AuthContext.tsx:** Añadir campo `credits` al perfil de usuario para gestionar saldos a favor.
- **BookingContext.tsx:** Función `cancelBooking(id)`.

---

## Próximos Pasos (Orden de ejecución):
1. **Fase 1:** Slots de disponibilidad (Back-end mock + Validaciones).
2. **Fase 2:** UI de selección de slots dinámicos.
3. **Fase 3:** Sistema de recurrencia y descuentos.
4. **Fase 4:** Lógica de cancelación y monedero virtual.
