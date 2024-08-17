-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gainshub;
USE gainshub;

-- Crear la tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuarioID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseÃ±a VARCHAR(255) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('cliente', 'jefeVentas') NOT NULL,
    activo TINYINT(1),
    verificado TINYINT(1),
    verificationToken VARCHAR(255),
    PRIMARY KEY (usuarioID)
);

-- Crear la tabla productos
CREATE TABLE IF NOT EXISTS productos (
    productoID INT NOT NULL AUTO_INCREMENT,
    descripcion TEXT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(100),
    talle VARCHAR(50),
    color VARCHAR(50),
    collecion VARCHAR(100),
    lo_mejor TINYINT(1),
    novedad TINYINT(1),
    img VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT(1),
    masinfo TEXT NULL,
    PRIMARY KEY (productoID)
);

-- Crear la tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    pedidoID INT NOT NULL AUTO_INCREMENT,
    usuarioID INT,
    estado ENUM('pendiente', 'entregado', 'anulado') NOT NULL,
    metodoPago VARCHAR(100),
    fechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (pedidoID),
    FOREIGN KEY (usuarioID) REFERENCES usuarios(usuarioID)
);

-- Crear la tabla pedidosproductos
CREATE TABLE IF NOT EXISTS pedidosproductos (
    pedidoProductoID INT NOT NULL AUTO_INCREMENT,
    pedidoID INT,
    productoID INT,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (pedidoProductoID),
    FOREIGN KEY (pedidoID) REFERENCES pedidos(pedidoID),
    FOREIGN KEY (productoID) REFERENCES productos(productoID)
);

-- Crear la tabla historica
CREATE TABLE IF NOT EXISTS historica (
    historicaID INT NOT NULL AUTO_INCREMENT,
    pedidoID INT,
    fechaPago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (historicaID),
    FOREIGN KEY (pedidoID) REFERENCES pedidos(pedidoID)
);

-- Crear la tabla wishlist
CREATE TABLE IF NOT EXISTS wishlist (
    wishlistID INT NOT NULL AUTO_INCREMENT,
    usuarioID INT NOT NULL,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlistID),
    FOREIGN KEY (usuarioID) REFERENCES usuarios(usuarioID)
);

-- Crear la tabla wishlistproductos
CREATE TABLE IF NOT EXISTS wishlistproductos (
    wishlistProductoID INT NOT NULL AUTO_INCREMENT,
    wishlistID INT NOT NULL,
    productoID INT NOT NULL,
    fechaAgregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlistProductoID),
    FOREIGN KEY (wishlistID) REFERENCES wishlist(wishlistID),
    FOREIGN KEY (productoID) REFERENCES productos(productoID)
);