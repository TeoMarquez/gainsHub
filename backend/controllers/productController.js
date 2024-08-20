const db = require('../config/db');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

// Verificar si el directorio existe, y si no, crearlo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const createProduct = (descripcion, precioUnitario, stock, categoriaID, talle, color, coleccionID, lo_mejor, novedad, img, masinfo, res) => {
  if (!descripcion || !precioUnitario || !stock || !categoriaID) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const insertQuery = `
    INSERT INTO productos (descripcion, precioUnitario, stock, categoriaID, talle, color, coleccionID, lo_mejor, novedad, img, masinfo, fechaCreacion, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 1)
  `;
  const values = [
    descripcion,
    precioUnitario,
    stock,
    categoriaID,
    talle || null,
    color || null,
    coleccionID || null,
    lo_mejor === 'Sí' ? 1 : 0,
    novedad === 'Sí' ? 1 : 0,
    img || null,
    masinfo || null
  ];

  db.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).json({ message: 'Error al registrar el producto', error: err.message });
    }
    res.status(201).json({ message: 'Producto registrado exitosamente', productoID: results.insertId });
  });
};

const addNewProduct = (req, res) => {
  const { descripcion, precioUnitario, stock, categoriaID, talle, color, coleccionID, lo_mejor, novedad, masinfo } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
  }

  createProduct(
    descripcion,
    precioUnitario,
    stock,
    categoriaID,
    talle,
    color,
    coleccionID,
    lo_mejor,
    novedad,
    req.file.filename,  // Nombre del archivo de imagen
    masinfo,  // Añadido aquí
    res
  );
};

// Actualizar producto
const updateProduct = (req, res) => {
  const { productoID, descripcion, precioUnitario, stock, categoriaID, talle, color, coleccionID, lo_mejor, novedad, masinfo } = req.body;

  if (!productoID) {
    return res.status(400).json({ message: 'El ID del producto es requerido' });
  }

  console.log('Datos recibidos:', { productoID, descripcion, precioUnitario, stock, categoriaID, talle, color, coleccionID, lo_mejor, novedad, masinfo });

  const checkProductIDQuery = 'SELECT productoID FROM productos WHERE productoID = ?';
  db.query(checkProductIDQuery, [productoID], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al actualizar el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

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
    if (categoriaID) {
      updateFields.push('categoriaID = ?');
      values.push(categoriaID);
    }
    if (talle) {
      updateFields.push('talle = ?');
      values.push(talle);
    }
    if (color) {
      updateFields.push('color = ?');
      values.push(color);
    }
    if (coleccionID) {
      updateFields.push('coleccionID = ?');
      values.push(coleccionID);
    }
    if (lo_mejor !== undefined) {
      updateFields.push('lo_mejor = ?');
      values.push(lo_mejor);
    }
    if (novedad !== undefined) {
      updateFields.push('novedad = ?');
      values.push(novedad);
    }    
    if (masinfo) {
      updateFields.push('masinfo = ?');
      values.push(masinfo);
    }
    if (req.file) {
      updateFields.push('img = ?');
      values.push(req.file.filename);
    }

    values.push(productoID);

    const updateQuery = `
      UPDATE productos 
      SET ${updateFields.join(', ')}
      WHERE productoID = ?
    `;

    db.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error('Error al actualizar en la base de datos:', err);
        return res.status(500).json({ message: 'Error al actualizar el producto' });
      }
      res.status(200).json({ message: 'Producto actualizado exitosamente', data: req.body });
    });
  });
};

// Ver productos según filtros
const viewProducts = (req, res) => {
  const { fechaCreacion, categoriaID, coleccionID, color, talle, precioMin, precioMax, descripcion, orderBy } = req.query;

  let query = `
  SELECT p.*, c.nombre AS categoriaNombre, co.nombre AS coleccionNombre
  FROM productos p
  LEFT JOIN categorias c ON p.categoriaID = c.categoriaID
  LEFT JOIN colecciones co ON p.coleccionID = co.coleccionID
  WHERE p.activo = 1
`;

  let values = [];

  if (fechaCreacion) {
    query += ' AND p.fechaCreacion = ?';
    values.push(fechaCreacion);
  }
  if (categoriaID) {
    query += ' AND p.categoriaID = ?';
    values.push(categoriaID);
  }
  if (coleccionID) {
    query += ' AND p.coleccionID = ?';
    values.push(coleccionID);
  }
  if (color) {
    query += ' AND p.color = ?';
    values.push(color);
  }
  if (talle) {
    query += ' AND p.talle = ?';
    values.push(talle);
  }
  if (precioMin || precioMax) {
    query += ' AND p.precioUnitario BETWEEN ? AND ?';
    values.push(precioMin || 0);
    values.push(precioMax || Number.MAX_VALUE);
  }
  if (descripcion) {
    query += ' AND p.descripcion LIKE ?';
    values.push(`%${descripcion}%`);
  }

  // Manejar el ordenamiento
  if (orderBy) {
    switch (orderBy) {
      case 'precioAsc':
        query += ' ORDER BY p.precioUnitario ASC';
        break;
      case 'precioDesc':
        query += ' ORDER BY p.precioUnitario DESC';
        break;
      case 'fechaAsc':
        query += ' ORDER BY p.fechaCreacion ASC';
        break;
      case 'fechaDesc':
        query += ' ORDER BY p.fechaCreacion DESC';
        break;
      default:
        query += ' ORDER BY p.productoID ASC';
    }
  }

  console.log('Constructed query:', query); // Log para ver la consulta construida
  console.log('Query values:', values); // Log para ver los valores de la consulta

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al obtener los productos' });
    }
    console.log('Query results:', results); // Log para ver los resultados de la consulta
    res.status(200).json(results);
  });
};

const viewAllProducts = (req, res) => {
  const query = 'SELECT * FROM productos WHERE activo = 1'; 

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al obtener los productos' });
    }
    res.status(200).json(results);
  });
};

const viewAllCategorias = (req, res) => {
  const query = 'SELECT * FROM categorias';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al obtener las categorías' });
    }
    res.status(200).json(results);
  });
};

const viewAllColecciones = (req, res) => {
  const query = 'SELECT * FROM colecciones';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al obtener las colecciones' });
    }
    res.status(200).json(results);
  });
};

const getCategoriesAndCollections = (req, res) => {
  const query = `
      SELECT c.categoriaID, c.nombre AS categoriaNombre, co.coleccionID, co.nombre AS coleccionNombre, p.productoID, p.descripcion, p.precioUnitario, p.stock, p.talle, p.color, p.img, p.lo_mejor, p.novedad
      FROM productos p
      LEFT JOIN categorias c ON p.categoriaID = c.categoriaID
      LEFT JOIN colecciones co ON p.coleccionID = co.coleccionID
      WHERE p.activo = 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error al obtener los datos' });
    }

    const categories = [];
    const products = [];

    results.forEach(row => {
      // Agrupamos los productos por categoría
      let category = categories.find(cat => cat.categoriaID === row.categoriaID);
      if (!category) {
        category = {
          categoriaID: row.categoriaID,
          categoriaNombre: row.categoriaNombre,
          colecciones: [],
          productos: []
        };
        categories.push(category);
      }

      // Agregamos las colecciones si no existen
      if (row.coleccionID) {
        let collection = category.colecciones.find(col => col.coleccionID === row.coleccionID);
        if (!collection) {
          collection = {
            coleccionID: row.coleccionID,
            coleccionNombre: row.coleccionNombre,
            productos: []
          };
          category.colecciones.push(collection);
        }
        collection.productos.push({
          productoID: row.productoID,
          descripcion: row.descripcion,
          precioUnitario: row.precioUnitario,
          stock: row.stock,
          talle: row.talle,
          color: row.color,
          img: row.img,
          lo_mejor: row.lo_mejor,
          novedad: row.novedad
        });
      } else {
        category.productos.push({
          productoID: row.productoID,
          descripcion: row.descripcion,
          precioUnitario: row.precioUnitario,
          stock: row.stock,
          talle: row.talle,
          color: row.color,
          img: row.img,
          lo_mejor: row.lo_mejor,
          novedad: row.novedad
        });
      }
    });

    res.status(200).json(categories);
  });
};

const checkStock = (req, res) => {
  const query = 'SELECT productoID, stock FROM productos';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el stock:', err);
      return res.status(500).json({ message: 'Error al obtener el stock' });
    }

    // Mapear los resultados para facilitar el acceso
    const stock = results.reduce((acc, row) => {
      acc[row.productoID] = row.stock;
      return acc;
    }, {});

    res.json(stock);
  });
};

module.exports = {
  addNewProduct,
  updateProduct,
  viewProducts,
  viewAllProducts,
  viewAllCategorias,
  viewAllColecciones,
  getCategoriesAndCollections,
  checkStock
};
