# Backend API - Proyecto Final Coderhouse

Este proyecto corresponde al backend de un sistema e-commerce, desarrollado con **Node.js** y **Express** como parte del curso de Backend en Coderhouse.

## 🚀 Características Implementadas

- ✅ **Sistema completo de validaciones** con express-validator
- ✅ **Manejo de errores personalizado** con clases de error específicas
- ✅ **Sistema de logging** configurable por entorno
- ✅ **Validación de UUIDs** para todos los IDs
- ✅ **Paginación y filtros avanzados** en productos
- ✅ **Middleware de manejo de errores global**
- ✅ **Configuración por entorno** (development, production, test)
- ✅ **Documentación completa** de la API

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- JavaScript (ES Modules)
- Express-validator (validaciones)
- File System (fs)

## 📁 Estructura del proyecto

```
src/
├── app.js                 # Aplicación principal
├── config/
│   └── config.js         # Configuración de la aplicación
├── data/                  # Archivos JSON de datos
├── managers/ 
│   ├── ProductManager.js # Gestión de productos con validaciones
│   └── CartManager.js    # Gestión de carritos con validaciones
├── middleware/
│   └── errorHandler.js   # Manejo de errores global
├── routes/ 
│   ├── products.router.js # Rutas de productos con validaciones
│   └── carts.router.js    # Rutas de carritos con validaciones
├── utils/
│   ├── errors.js         # Clases de errores personalizadas
│   └── logger.js         # Sistema de logging
└── validations/
    ├── productValidations.js # Validaciones de productos
    └── cartValidations.js    # Validaciones de carritos
```

## 📌 Cómo ejecutar el proyecto

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Iniciar el servidor con `npm start`
4. Acceder a `http://localhost:8080`

### Variables de Entorno Opcionales

```bash
PORT=3000 NODE_ENV=development LOG_LEVEL=debug npm start
```

## 📮 Endpoints principales

### Productos

- `GET /api/products` - Obtener productos con filtros y paginación
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto

### Carritos

- `POST /api/carts` - Crear nuevo carrito
- `GET /api/carts/:cid` - Obtener carrito por ID
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito
- `PUT /api/carts/:cid/product/:pid` - Actualizar cantidad de producto
- `DELETE /api/carts/:cid/product/:pid` - Eliminar producto del carrito
- `DELETE /api/carts/:cid` - Vaciar carrito

## 🛡️ Validaciones Implementadas

### Productos
- ✅ Título: 3-100 caracteres, requerido
- ✅ Descripción: 10-500 caracteres, requerido
- ✅ Precio: número positivo, requerido
- ✅ Stock: entero positivo, requerido
- ✅ Categoría: 2-50 caracteres, requerido
- ✅ Código: 3-20 caracteres, único, requerido
- ✅ Status: booleano, opcional
- ✅ Thumbnails: array, opcional

### Carritos
- ✅ ID de carrito: UUID válido
- ✅ ID de producto: UUID válido
- ✅ Cantidad: entero positivo

## 🚨 Manejo de Errores

### Códigos de Estado HTTP
- `400`: Errores de validación
- `404`: Recurso no encontrado
- `409`: Conflicto de datos
- `500`: Error interno del servidor

### Respuestas de Error
```json
{
  "error": "Mensaje descriptivo del error",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Crema Hidratante",
    "description": "Crema hidratante para piel seca",
    "price": 25.99,
    "stock": 50,
    "category": "skincare",
    "code": "CREMA001"
  }'
```

### Obtener productos con filtros
```bash
curl "http://localhost:8080/api/products?limit=5&sort=asc&category=skincare"
```

## 📚 Documentación Completa

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentación detallada de todos los endpoints y validaciones.

## 🎯 Próximo paso

Este backend será conectado a una interfaz visual desarrollada con React, disponible en el siguiente repositorio:

👉 [Frontend Skincare Shop (GitHub)](https://github.com/constanzaramos/skincare-shop)

---

**Desarrollado por Constanza Ramos** 
