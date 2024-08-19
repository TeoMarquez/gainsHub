# GainsHub

Una plataforma de comercio electrónico que permite a los usuarios gestionar productos, realizar pedidos y procesar pagos con integración de Stripe. Presentada en las olimpiadas de programación 2024

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Integrantes](#Integrantes)


## Descripción

Este proyecto es una aplicación de comercio electrónico que permite a los usuarios registrarse, iniciar sesión, añadir productos a un carrito de compras, y proceder al pago utilizando Stripe. La aplicación cuenta con un panel de administración para gestionar productos y pedidos, y una interfaz intuitiva para los usuarios.

## Características

- **Autenticación de Usuarios**: Registro e inicio de sesión.
- **Gestión del Carrito**: Añadir, modificar y eliminar productos en el carrito.
- **Procesamiento de Pagos**: Integración con Stripe para finalizar la compra.
- **Panel de Administración**: Gestión de productos y pedidos.
- **Wishlist**: Opcional, para guardar productos favoritos.

## Tecnologías Utilizadas

- **Frontend**: React, React Router
- **Backend**: Express.js, Node.js
- **Base de Datos**: MySQL
- **Otros**: Stripe API, dotenv

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:

1. Clonar el Repositorio

   Clona el repositorio desde GitHub:
   
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
```

Instalar Dependencias

   Navega al directorio del proyecto y luego al frontend:

```bash
cd tu-repositorio
cd frontend
npm install
```

Luego, navega al directorio del backend:

```bash
cd ../backend
npm install
```

Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto para el frontend y otro para el backend. Aquí están los contenidos necesarios:

Para el Backend

```bash
PORT=Puerto de tu app
DB_HOST=Direccion de tu DB
DB_USER=Usuario de tu DBM
DB_PASSWORD=Contraseña de tu DB
DB_NAME=Nombre de tu DB
EMAIL_USER=Correo que utilizaras para mandar los codigos de verificación
EMAIL_PASS=Tu contraseña pass de tu email
STRIPE_PRIVATE_KEY=Tu key de stripe
FRONTEND_URL=direccion donde se ejecuta tu app frontend
```

Para el Frontend

```bash
REACT_APP_BACKEND_URL=direccion donde se ejecuta tu app backend
```

Ejecutar el Proyecto
Inicia el servidor backend:

```bash
cd backend
npm start
```

En otro terminal, inicia el servidor frontend:

```bash
cd frontend
npm start
```

o tambien puedes iniciar el ambas al mismo tiempo usando en la carpeta que contiene ambas carpetas

```bash
npm start
```

## Uso
Registro e Inicio de Sesión: Los usuarios pueden registrarse e iniciar sesión desde la página principal.
Añadir Productos al Carrito: Los productos pueden añadirse al carrito desde la página de productos.
Finalizar Compra: Los usuarios pueden proceder al pago desde la página del carrito, utilizando Stripe para el procesamiento de pagos.
Administración: Los administradores pueden gestionar productos y pedidos desde el panel de administración.

## Integrantes

- **Mateo Santiago Marquez** - Programador Backend
- **Alejandra Kiara Justiniano Olmos** - Programadora Frontend
- **Facundo Nahuel Rodriguez** - Programador Frontend 
- **Camila Michelle Vera** - Diseñadora UX/UI
