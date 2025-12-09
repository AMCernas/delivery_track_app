# Guía de Desarrollo - Delivery Tracking App

Documentación técnica

## 🏗️ Arquitectura General

### Frontend - React + Vite

**Pattern: Context API + React Router + Axios**

```
App.jsx (Router principal)
  ↓
AuthProvider (Context)
  ├── Login.jsx
  ├── Register.jsx
  ├── Dashboard.jsx
  ├── OrdersPage.jsx (OrderForm + OrderList)
  │   └── OrderCard.jsx
  └── OrderDetails.jsx

useAuth() → accede a token, usuario, login, register, logout
Axios + interceptor → agrega token en headers automáticamente
```

### Backend - Express + Prisma

**Pattern: MVC (Model View Controller)**

```
index.js (Express app)
  ├── authRoutes
  │   ├── POST /register → auth.controller.register
  │   ├── POST /login → auth.controller.login
  │   └── GET /me → auth.controller.getMe
  └── orderRoutes (middleware: authMiddleware)
      ├── GET / → order.controller.getOrders
      ├── POST / → order.controller.createOrder
      ├── GET /:id → order.controller.getOrderById
      ├── PUT /:id → order.controller.updateOrder
      └── DELETE /:id → order.controller.deleteOrder

Prisma → PostgreSQL
```

## 🔐 Flujo de Autenticación

### Registro
```
1. User → Register.jsx (validación local)
2. POST /auth/register { email, password, name }
3. auth.controller.register:
   - Validar campos (requeridos, email regex, password >= 6)
   - Hash password con bcrypt
   - Guardar usuario en DB
   - Generar JWT (expiración 7d)
   - Retornar { token, user }
4. AuthContext.register:
   - Guardar token en localStorage
   - Setear usuario en state
   - Navegar a /dashboard
5. Axios interceptor + ProtectedRoute → rutas seguras
```

### Login
```
1. User → Login.jsx (validación local)
2. POST /auth/login { email, password }
3. auth.controller.login:
   - Buscar usuario por email
   - Comparar password con bcrypt
   - Generar JWT
   - Retornar { token, user }
4. Igual que registro paso 4-5
```

### Verificación (getMe)
```
1. Al cargar la app, AuthContext:
   - Busca token en localStorage
   - Si existe → GET /auth/me (incluye token en header)
2. auth.controller.getMe:
   - Middleware authMiddleware valida JWT
   - Retorna usuario actual
   - Si error o token inválido → setUser(null) y redirige a /login
```

## 🗄️ Modelos de Datos

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   // Nombre del usuario
  email     String   @unique // Email único
  password  String   // Hash bcrypt
  orders    Order[]  // Relación 1:N
}
```

### Order
```prisma
model Order {
  id        Int    @id @default(autoincrement())
  title     String // Título de la orden
  details   String // Descripción completa
  status    String // pending|preparing|delivering|delivered
  createdAt DateTime @default(now())
  userId    Int    // FK a User
  user      User   @relation(fields: [userId], references: [id])
}
```

## 🎨 Sistema de Estilos CSS

### Estructura
- **Variables CSS** (`:root`) - Colores, espacios, radios
- **Base styles** - Reset, body, inputs
- **Componentes** - Cards, botones, forms
- **Variantes** - primary, success, danger, ghost, small, large
- **Responsive** - Media query en 700px

### Arquitectura de Clases

```css
/* Componentes principales */
.order-card          /* Tarjeta de orden */
.order-form          /* Formulario de crear */
.dashboard-link      /* Card de dashboard */

/* Variantes de botón */
.btn-primary         /* Azul - login */
.btn-success         /* Verde - crear */
.btn-danger          /* Rojo - eliminar */
.btn-ghost           /* Transparente - logout */

/* Contextos especiales */
.login-form input    /* Inputs azules en login */
.order-form input    /* Inputs verdes en form */
```

### Propiedades Personalizables

**OrderCard**
```jsx
<OrderCard order={order} maxChars={100} />
// maxChars: número de caracteres a mostrar (default 100)
```

## 📝 Validaciones

### Cliente (UX)
- Validaciones regex y longitud en handlers
- Mensajes de error en estado local
- Previene envío si no cumple

### Servidor (Seguridad)
```javascript
// Ejemplo: Register
if (!email || !password || !name) 
  return 400 "Campos requeridos"
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  return 400 "Email inválido"
if (password.length < 6)
  return 400 "Contraseña muy corta"
if (await prisma.user.findUnique({ where: { email } }))
  return 400 "Email ya registrado"
```

## 🔄 Ciclo de Vida de una Orden

### Crear
```
1. User en OrdersPage → OrderForm
2. Input title, details → handleSubmit
3. POST /orders { title, details, status: 'pending' }
4. order.controller.createOrder:
   - Validar title, details no vacíos
   - Crear con userId = req.userId
   - Retornar { id, title, details, status, createdAt, userId }
5. OrderList.loadOrders → actualiza lista
```

### Ver Detalle
```
1. Click en OrderCard → navigate(/orders/:id)
2. OrderDetails.useEffect → GET /orders/:id
3. order.controller.getOrderById:
   - Valida userId = req.userId (solo propia orden)
   - Retorna orden completa
4. Renderiza con estado actual, botones para cambiar
```

### Cambiar Estado
```
1. User selecciona nuevo status en OrderDetails
2. updateStatus(newStatus) → PUT /orders/:id { status }
3. order.controller.updateOrder:
   - Valida que status esté en lista permitida
   - Actualiza orden
   - Retorna orden actualizada
4. setOrder(res.data) → UI re-renderiza
```

### Eliminar
```
1. User click "Eliminar Orden"
2. window.confirm() → si confirma
3. DELETE /orders/:id
4. order.controller.deleteOrder:
   - Valida userId = req.userId
   - Elimina orden
5. navigate(/orders) → vuelve a lista
```

## 🚀 Deployment

### Backend (Node.js)
```bash
# Producción
npm install --production
npm start

# Env vars (configurar en hosting):
- DATABASE_URL
- JWT_SECRET
- CLIENT_URL (para CORS)
- PORT (opcional)
```

### Frontend (Vite)
```bash
# Build
npm run build

# Outputs → dist/
# Deploy dist/ a hosting (Vercel, Netlify, etc)

# Env vars:
- VITE_API_URL (API endpoint)
```

## 🧪 Testing (Recomendaciones)

### Unit Tests (Backend)
```javascript
// auth.controller.test.js
describe('register', () => {
  it('debería crear usuario con email único', async () => {
    const res = await register(req, res, prisma)
    expect(res.status).toBe(201)
    expect(res.data.token).toBeDefined()
  })
})

// order.controller.test.js
describe('createOrder', () => {
  it('debería crear orden con userId del token', async () => {
    const res = await createOrder(req, res, prisma)
    expect(res.data.userId).toBe(req.userId)
  })
})
```

### E2E Tests (Frontend)
```javascript
// cypress/e2e/auth.cy.js
describe('Autenticación', () => {
  it('debería registrar usuario y ir a dashboard', () => {
    cy.visit('/register')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('123456')
    cy.get('button').contains('Ingresar').click()
    cy.url().should('include', '/dashboard')
  })
})
```

## 🔧 Troubleshooting Desarrollo

### "Cannot find module 'bcryptjs'"
```bash
cd server
npm install bcryptjs
```

### "EADDRINUSE :::3000" (Puerto ocupado)
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### "JWT token expired"
```javascript
// En client: logout y login nuevamente
// Token expira en 7 días (configurable en JWT_SECRET sign)
```

### "CORS error"
```bash
# Verificar que en server/.env está:
CLIENT_URL=http://localhost:5173  # desarrollo
# O tu dominio en producción
```

### Prisma out of sync
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## 📚 Referencias

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [JWT Docs](https://jwt.io)
- [Vite Docs](https://vitejs.dev)

---

**Última actualización:** Diciembre 2025
