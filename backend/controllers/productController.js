const db = require('../config/db');

// Crear un nuevo producto
const createProduct = (productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor, novedad, img, res) => {
  const checkProductIDQuery = 'SELECT productoID FROM Productos WHERE productoID = ?';
  db.query(checkProductIDQuery, [productoID], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al consultar la base de datos' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'El producto con ese ID ya está registrado' });
    }
    
    const insertQuery = `
      INSERT INTO Productos (productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor, novedad, img, fechaCreacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    `;
    const values = [productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor === 'Sí' ? 1 : 0, novedad === 'Sí' ? 1 : 0, img];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        return res.status(500).json({ message: 'Error al registrar el producto' });
      }
      res.status(201).json({ message: 'Producto registrado exitosamente' });
    });
  });
};

// Registrar un nuevo producto
const addNewProduct = (req, res) => {
  const { productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor, novedad, img } = req.body;

  if (!productoID || !descripcion || !precioUnitario || !stock || !categoria) {
    return res.status(400).json({ message: 'Todos los campos obligatorios son requeridos' });
  }

  createProduct(productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor, novedad, img, res);
};

// Actualizar Producto
const updateProduct = (req, res) => {
  const { productoID, descripcion, precioUnitario, stock, categoria, talle, color, collecion, lo_mejor, novedad, img } = req.body;

  if (!productoID) {
    return res.status(400).json({ message: 'El ID del producto es requerido' });
  }

  const checkProductIDQuery = 'SELECT productoID FROM Productos WHERE productoID = ?';
  db.query(checkProductIDQuery, [productoID], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al actualizar el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Construir la consulta de actualización dinámicamente
    let updateFields = [];
    let values = [];

    if (descripcion) {
      updateFields.push('descripcion = ?');
      values.push(descripcion);
    }
    if (precioUnitario) {
      updateFields.push('precioUnitario = ?');
      values.push(precioUnitario);
    }
    if (stock) {
      updateFields.push('stock = ?');
      values.push(stock);
    }
    if (categoria) {
      updateFields.push('categoria = ?');
      values.push(categoria);
    }
    if (talle) {
      updateFields.push('talle = ?');
      values.push(talle);
    }
    if (color) {
      updateFields.push('color = ?');
      values.push(color);
    }
    if (collecion) {
      updateFields.push('collecion = ?');
      values.push(collecion);
    }
    if (lo_mejor) {
      updateFields.push('lo_mejor = ?');
      values.push(lo_mejor === 'Sí' ? 1 : 0);
    }
    if (novedad) {
      updateFields.push('novedad = ?');
      values.push(novedad === 'Sí' ? 1 : 0);
    }
    if (img) {
      updateFields.push('img = ?');
      values.push(img);
    }

    // Agregar productoID para la condición WHERE
    values.push(productoID);

    const updateQuery = `
      UPDATE Productos 
      SET ${updateFields.join(', ')}
      WHERE productoID = ?
    `;

    db.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error('Error al actualizar en la base de datos:', err);
        return res.status(500).json({ message: 'Error al actualizar el producto' });
      }
      res.status(200).json({ message: 'Producto actualizado exitosamente' });
    });
  });
};

module.exports = { addNewProduct, updateProduct };