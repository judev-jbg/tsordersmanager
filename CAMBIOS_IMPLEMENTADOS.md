# Cambios Implementados

## Problemas Corregidos

### 1. Interceptor de API causando recarga infinita en /login
**Archivo:** `src/services/api.js`
**Cambio:** Verificar si ya está en `/login` antes de redirigir
```javascript
// ANTES:
window.location.href = "/login";

// AHORA:
if (!window.location.hash.includes("login")) {
  window.location.href = "/#/login";
}
```

### 2. Endpoint con mayúscula incorrecta
**Archivo:** `src/TsOrdersApp.jsx` línea 95
**Cambio:** `/ordersoutofStock/delayed` → `/ordersoutofstock/delayed`

## Mejoras Implementadas

### 1. Contador de órdenes seleccionadas en botón "Preparar envíos"

**Archivos modificados:**
- `src/TsOrdersApp.jsx`: Agregado `shipSwitchCount` y pasado como prop
- `src/components/Header.jsx`: Recibe y pasa `shipCount` a Button
- `src/components/Button.jsx`: Muestra badge con contador
- `src/main.css`: Estilos para `.badge`

**Funcionalidad:**
- Cuenta solo switches con id que empiezan con "ship-"
- Muestra badge rojo con número cuando hay selecciones
- Badge se oculta cuando el contador es 0

### 2. Contador de registros en OrdersToShip

**Archivo:** `src/OrdersToShip.jsx` línea 163
**Cambio:** Agregado badge al título con `orders.length`
```jsx
<h1>Pedidos listos para Enviar {orders.length > 0 && <span className="badge">{orders.length}</span>}</h1>
```

### 3. Toggle de tema (Dark/Light)

**Archivos creados:**
- `src/hooks/useTheme.js`: Hook para manejar tema
- `src/components/ThemeToggle.jsx`: Componente botón de toggle
- `src/theme.css`: Variables CSS para temas
- `src/config/sessionConfig.js`: Configuración centralizada

**Archivos modificados:**
- `src/components/Header.jsx`: Importa y usa ThemeToggle
- `src/main.jsx`: Importa theme.css
- `index.html`: Atributo `data-theme="dark"` por defecto
- `src/main.css`: Estilos para botón de tema

**Funcionalidad:**
- Tema oscuro por defecto
- Toggle con iconos ☀️ (dark) / 🌙 (light)
- Persiste en localStorage
- Variables CSS para toda la app

### 4. Session Timeout (30 minutos)

**Archivos creados:**
- `src/hooks/useSessionTimeout.js`: Hook para timeout de sesión
- `src/config/sessionConfig.js`: Configuración del timeout

**Archivos modificados:**
- `src/TsOrdersApp.jsx`: Implementa useSessionTimeout

**Funcionalidad:**
- Timeout configurable (30 min por defecto)
- Se reinicia con cualquier actividad del usuario:
  - mousedown, mousemove, keypress, scroll, touchstart, click
- Al expirar: logout automático y redirección a /login
- Configurable en `src/config/sessionConfig.js`

## Configuración

### Cambiar Session Timeout
Editar `src/config/sessionConfig.js`:
```javascript
export const SESSION_CONFIG = {
  TIMEOUT: 30 * 60 * 1000, // Cambiar aquí (en milisegundos)
};
```

Ejemplos:
- 15 minutos: `15 * 60 * 1000`
- 30 minutos: `30 * 60 * 1000` (defecto)
- 1 hora: `60 * 60 * 1000`

### CSS del Badge
En `src/main.css`:
```css
.badge {
  background-color: #ff4444;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
}
```

### Variables de Tema
En `src/theme.css` - personalizar colores:
```css
:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent: #4a9eff;
}
```

## Pendiente de Investigación

### POST /ordersreadytoship retorna 422
- Requiere revisar el schema `ShipmentData` en backend
- Verificar qué datos envía el frontend
- Comparar con lo que espera el backend
