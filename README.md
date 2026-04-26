# Clean Steps - Backend API 👟

Servidor centralizado y API REST para el sistema de punto de venta (POS) de Clean Steps. Este motor gestiona el inventario de servicios, clientes y la lógica de validación de fechas de entrega.

**Backend URL:** [https://api.cleansteps.mooo.com](https://api.cleansteps.mooo.com)

---

## 🚀 Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MongoDB (vía Mongoose)
- **Seguridad:** JSON Web Tokens (JWT) y bcryptjs para encriptación de contraseñas.
- **Validación:** Lógica personalizada para cálculo de fechas (Suede/Normal).

🛣️ Endpoints Principales (API)
Autenticación
POST /signup: Registra un nuevo usuario o empleado en el sistema.
POST /signin: Inicia sesión y devuelve un token JWT para acceso seguro.

Órdenes
GET /orders: Obtiene la lista completa de todas las notas generadas.
POST /orders: Crea una nueva nota de servicio, validando automáticamente las fechas y el total.
PATCH /orders/:id: Actualiza el estado de una orden (por ejemplo, de "Recibido" a "Entregado").

Instalación y ejecición

### 1. Clonar el repositorio

git clone https://github.com/ginamier/CleanSteps-backend.git
cd cleansteps-backend

### 2. Instalar dependencias

npm install

### 3. Configurar variables de entorno

# Crea un archivo .env en la raíz y añade tu MONGO_URI y JWT_SECRET

touch .env

### 4. Ejecutar el servidor

# Modo desarrollo (con recarga automática)

npm run dev

# Modo producción

npm start
