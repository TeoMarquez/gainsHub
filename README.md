# GainsHub

Una plataforma de comercio electrónico que permite a los usuarios gestionar productos, realizar pedidos y procesar pagos con integración de Stripe.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)


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
- **Otros**: Stripe API, dotenv, MercadoPago API (opcional)

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
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=gainsHub
EMAIL_USER=noesporahi.dataclub@gmail.com
EMAIL_PASS=rcxo kolo bbmh bgob
MERCADO_PAGO_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
STRIPE_PRIVATE_KEY=sk_test_51PoEIpP7QSVpLRj0qIoOHden4cRiccMvERENGiyqV6P7lcZZQx0CLpPyPhtydX2SZQOVaQr7Mro3RgLZcTjvg5aC00BEeURQJ7
FRONTEND_URL=http://localhost:3000
```

Para el Frontend

```bash
REACT_APP_BACKEND_URL=http://localhost:5000
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
