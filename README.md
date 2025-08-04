# Backend API - Proyecto Final Coderhouse

Este proyecto corresponde al backend de un sistema e-commerce, desarrollado con **Node.js** y **Express** como parte del curso de Backend en Coderhouse.

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- JavaScript (ES Modules)
- File System (fs)

## 📁 Estructura del proyecto

src/
├── data/ 
├── managers/ 
├── routes/ 
└── app.js


## 📌 Cómo ejecutar el proyecto

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Iniciar el servidor con `npm start`
4. Acceder a `http://localhost:8080`

## 📮 Endpoints principales

### Productos

- `GET /api/products`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`

### Carritos

- `POST /api/carts`
- `GET /api/carts/:cid`
- `POST /api/carts/:cid/product/:pid`

## 🎯 Próximo paso

Este backend será conectado a una interfaz visual desarrollada con React, disponible en el siguiente repositorio:

👉 [Frontend Skincare Shop (GitHub)](https://github.com/constanzaramos/skincare-shop)

---

**Desarrollado por Constanza Ramos** 
