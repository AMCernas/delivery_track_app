# Delivery Tracking App

Una aplicación web moderna de seguimiento de pedidos con autenticación segura, gestión de órdenes y UI minimalista.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API](#api)
- [Validaciones](#validaciones)
- [Temas y Colores](#temas-y-colores)

## 🎯 Descripción General

Delivery Tracking App es una plataforma completa para gestionar pedidos de entrega. Permite a los usuarios:
- Registrarse y autenticarse de forma segura
- Crear, ver, actualizar y eliminar pedidos
- Cambiar el estado de pedidos (pending, preparing, delivering, delivered)
- Ver detalles completos de cada pedido
- Interfaz responsiva y accesible

## ✨ Características

### Autenticación y Seguridad
- Registro de usuarios con validación
- Login con JWT (JSON Web Tokens)
- Contraseñas hasheadas con bcryptjs
- Tokens con expiración (7 días)
- Rutas protegidas en frontend y backend

### Gestión de Pedidos
- CRUD completo de pedidos
- Estados configurables (pending, preparing, delivering, delivered)
- Timestamps automáticos (createdAt)
- Truncado automático de descripciones largas en cards
- Salto de línea para descripciones muy largas

### Interfaz de Usuario
- Diseño minimalista con paleta de colores neutral
- Botones con variantes semánticas (primary, success, danger, ghost)
- Inputs con focus/hover coordinados con acciones
- Cards con efecto isla (shadow + border)
- Responsive design (breakpoint en 700px)

## 🔧 Tecnologías

### Frontend
- **React 18** - Librería UI
- **Vite** - Bundler rápido
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones
- **CSS3** - Estilos (sin frameworks)

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **Prisma ORM** - ORM y migraciones
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **CORS** - Seguridad entre dominios

## 📥 Instalación

### Requisitos Previos
- Node.js 16+ 
- npm o yarn
- PostgreSQL 12+ (base de datos remota disponible)

### Cliente (Frontend)

```bash
cd client/delivery-tracking

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar dev server
npm run dev
```

El cliente se ejecutará en `http://localhost:5173`

### Servidor (Backend)

```bash
cd server

# Instalar dependencias
npm install

# Las migraciones de Prisma ya están aplicadas
# La BD está precargada en Supabase

# Iniciar dev server
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## ⚙️ Configuración

### Variables de Entorno

**Cliente** (`client/delivery-tracking/.env`)
```env
VITE_API_URL=http://localhost:3000
```

**Servidor** (`server/.env`)
```env
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

### Base de Datos

La BD está alojada en Supabase PostgreSQL. Schema incluye:

- **users** - Usuarios con email, contraseña hasheada y nombre
- **orders** - Pedidos con título, detalles, estado y timestamps

Las migraciones están en `server/prisma/migrations/`.

## 🚀 Uso

### Flujo de Usuario

1. **Registro**: `/register` - Crear cuenta con email, nombre y contraseña (mín. 6 caracteres)
2. **Login**: `/login` - Iniciar sesión con credenciales
3. **Dashboard**: `/dashboard` - Pantalla principal con enlace a órdenes
4. **Órdenes**: `/orders` - Ver lista de órdenes y crear nuevas
5. **Detalles**: `/orders/:id` - Ver, editar estado y eliminar pedido

### Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/dashboard`
- `/orders`
- `/orders/:id`

Intentar acceder sin token redirige a `/login`.

## 📁 Estructura del Proyecto

```
proyecto delivery tracking/
├── client/delivery-tracking/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Página de login
│   │   │   ├── Register.jsx       # Página de registro
│   │   │   ├── Dashboard.jsx      # Panel principal
│   │   │   ├── OrdersPage.jsx     # Lista de órdenes
│   │   │   └── OrderDetails.jsx   # Detalles de orden
│   │   ├── components/
│   │   │   ├── OrderList.jsx      # Listado de tarjetas
│   │   │   ├── OrderCard.jsx      # Tarjeta individual
│   │   │   ├── OrderForm.jsx      # Formulario crear
│   │   │   ├── Navbar.jsx         # Barra de navegación
│   │   │   └── ProtectedRoute.jsx # Middleware de rutas
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Estado global de auth
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Hook para acceder a auth
│   │   ├── api/
│   │   │   └── axios.js           # Cliente HTTP configurado
│   │   ├── App.jsx                # Router principal
│   │   ├── App.css                # Estilos globales
│   │   └── main.jsx               # Punto de entrada
│   ├── .env                       # Variables de entorno
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── index.js               # Servidor Express
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Lógica de autenticación
│   │   │   └── order.controller.js# CRUD de órdenes
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Rutas /auth
│   │   │   └── order.routes.js    # Rutas /orders
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # Validación JWT
│   │   └── config/
│   │       ├── env.js             # Validación de vars
│   │       └── prismaClient.js    # Instancia Prisma
│   ├── prisma/
│   │   ├── schema.prisma          # Definición de modelos
│   │   └── migrations/            # Historial de cambios BD
│   ├── .env                       # Variables de entorno
│   └── package.json
│
└── README.md                      # Este archivo
```

## 🔌 API

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Crear usuario | `{email, password, name}` |
| POST | `/auth/login` | Iniciar sesión | `{email, password}` |
| GET | `/auth/me` | Perfil actual | Header: `Authorization: Bearer <token>` |

### Endpoints de Órdenes

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/orders` | Listar órdenes del usuario | ✅ |
| POST | `/orders` | Crear orden | ✅ |
| GET | `/orders/:id` | Obtener orden por ID | ✅ |
| PUT | `/orders/:id` | Actualizar orden | ✅ |
| DELETE | `/orders/:id` | Eliminar orden | ✅ |

### Ejemplo de Petición

```javascript
// Crear orden
const res = await axios.post('/orders', {
  title: 'Mi Pedido',
  details: 'Descripción detallada',
  status: 'pending'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## ✅ Validaciones

### Registro
- Email es requerido y debe ser válido (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- Contraseña mínimo 6 caracteres
- Nombre es requerido y no puede estar vacío
- Email debe ser único (sin duplicados)

### Login
- Email y contraseña son requeridos
- Contraseña debe coincidir con el hash almacenado

### Órdenes
- Título y detalles son requeridos al crear
- Orden solo se puede actualizar/eliminar por su propietario
- Status válidos: `pending`, `preparing`, `delivering`, `delivered`

## 🎨 Temas y Colores

### Paleta de Colores

```css
--bg: #f3f4f6                  /* Fondo principal */
--surface: #ffffff             /* Superficie de cards */
--text: #071026                /* Texto principal */
--muted-text: #475569          /* Texto secundario */

--accent-red: #c81e1e          /* Rojo destructivo */
--accent-green: #16a34a        /* Verde éxito/crear */
--accent-blue: #2563eb         /* Azul autenticación */
```

### Variantes de Botones

- `.btn-primary` - Azul (login, acciones principales)
- `.btn-success` - Verde (crear, confirmar)
- `.btn-danger` - Rojo (eliminar)
- `.btn-ghost` - Transparente (logout, volver)
- `.btn-sm` / `.btn-lg` - Tamaños

### Inputs con Colores Coordinados

- `.login-form` inputs → Focus azul (coordina con botón primary)
- `.order-form` inputs → Focus verde (coordina con botón success)

### Estados de Órdenes

- `pending` - Amarillo (#facc15)
- `preparing` - Azul (#60a5fa)
- `delivering` - Naranja (#fb923c)
- `delivered` - Verde (#4ade80)

## 🧹 Limpieza del Código Realizada

Se removieron:
- Clases CSS no utilizadas: `.container`, `.center`, `.nav-cta`
- Referencias a clases DOM vacías: `.skeleton-card`, `.order-details-loading`, `.order-details-error`
- Archivo `index.css` vacío (removido del proyecto)
- Loading state simplificado en `OrderList.jsx` y `OrderDetails.jsx`

## 📝 Scripts Disponibles

### Cliente
```bash
npm run dev    # Iniciar dev server (Vite)
npm run build  # Build para producción
npm run lint   # Ejecutar ESLint
```

### Servidor
```bash
npm run dev                # Iniciar con nodemon
npm start                  # Iniciar en producción
npm run prisma:generate    # Regenerar cliente Prisma
npm run prisma:migrate     # Ejecutar migraciones
npm run prisma:dbpush      # Push schema a BD
```

## 🐛 Troubleshooting

### "Unauthorized" al acceder a `/orders`
- Verifica que el token esté guardado en localStorage
- Comprueba que el token no ha expirado (7 días)
- Reinicia sesión: logout → login

### Inputs no tienen color en hover
- Recarga sin cache: Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)
- Verifica que Vite está corriendo y pickea los cambios de `.env`

### Error "CORS" en consola
- Asegúrate que `CLIENT_URL` en server `.env` coincide con tu dominio frontend
- En desarrollo, debe ser `http://localhost:5173`

### Contraseña rechazada en registro
- Mínimo 6 caracteres
- Sin espacios al inicio/final

## 📞 Contacto y Soporte

Para reportes de bugs o sugerencias, crea un issue en el repositorio.

---

**Última actualización:** Diciembre 2025
