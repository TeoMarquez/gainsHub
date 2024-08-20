// gestor de  WishList

const db = require('../config/db');

const addProductToWishlist = (req, res) => {
    const { usuarioID, descripcion } = req.body;
  
    if (!usuarioID || !descripcion) {
      return res.status(400).json({ message: 'El ID del usuario y la descripción del producto son requeridos' });
    }
  
    // Verificar si ya existe una wishlist para el usuario
    const getWishlistIDQuery = 'SELECT wishlistID FROM Wishlist WHERE usuarioID = ?';
    db.query(getWishlistIDQuery, [usuarioID], (err, results) => {
      if (err) {
        console.error('Error al verificar la wishlist:', err);
        return res.status(500).json({ message: 'Error al verificar la wishlist' });
      }
  
      let wishlistID;
  
      if (results.length === 0) {
        // Crear una nueva wishlist para el usuario si no existe
        const createWishlistQuery = 'INSERT INTO Wishlist (usuarioID) VALUES (?)';
        db.query(createWishlistQuery, [usuarioID], (err, results) => {
          if (err) {
            console.error('Error al crear la wishlist:', err);
            return res.status(500).json({ message: 'Error al crear la wishlist' });
          }
  
          wishlistID = results.insertId;  // Obtener el ID de la nueva wishlist
  
          // Continuar con el proceso de añadir el producto
          addProductToWishlistTable(wishlistID, descripcion, res);
        });
      } else {
        wishlistID = results[0].wishlistID;
  
        // Continuar con el proceso de añadir el producto
        addProductToWishlistTable(wishlistID, descripcion, res);
      }
    });
  };
  
const addProductToWishlistTable = (wishlistID, descripcion, res) => {
// Obtener el productoID basado en la descripción
const getProductIDQuery = 'SELECT productoID FROM Productos WHERE descripcion = ?';
db.query(getProductIDQuery, [descripcion], (err, results) => {
    if (err) {
    console.error('Error al buscar el producto:', err);
    return res.status(500).json({ message: 'Error al añadir el producto a la wishlist' });
    }

    if (results.length === 0) {
    return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productoID = results[0].productoID;

    // Verificar si el producto ya está en la wishlist
    const checkProductQuery = 'SELECT * FROM WishlistProductos WHERE wishlistID = ? AND productoID = ?';
    db.query(checkProductQuery, [wishlistID, productoID], (err, results) => {
    if (err) {
        console.error('Error al verificar el producto en la wishlist:', err);
        return res.status(500).json({ message: 'Error al añadir el producto a la wishlist' });
    }

    if (results.length > 0) {
        return res.status(400).json({ message: 'El producto ya está en la wishlist' });
    }

    // Añadir el producto a la wishlist
    const addProductQuery = `
        INSERT INTO WishlistProductos (wishlistID, productoID)
        VALUES (?, ?)
    `;

    db.query(addProductQuery, [wishlistID, productoID], (err) => {
        if (err) {
        console.error('Error al añadir el producto a la wishlist:', err);
        return res.status(500).json({ message: 'Error al añadir el producto a la wishlist' });
        }

        res.status(201).json({ message: 'Producto añadido a la wishlist exitosamente' });
    });
    });
});
};

const removeProductFromWishlist = (req, res) => {
  const { usuarioID, productoID } = req.body;

  if (!usuarioID || !productoID) {
    return res.status(400).json({ message: 'UsuarioID y productoID son requeridos' });
  }

  // Obtener wishlistID del usuario
  const getWishlistIDQuery = 'SELECT wishlistID FROM Wishlist WHERE usuarioID = ?';
  db.query(getWishlistIDQuery, [usuarioID], (err, results) => {
    if (err) {
      console.error('Error al buscar la wishlist del usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar el producto de la wishlist' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Wishlist no encontrada para el usuario' });
    }

    const wishlistID = results[0].wishlistID;

    // Verificar si el producto está en la wishlist antes de intentar eliminarlo
    const checkProductQuery = 'SELECT * FROM WishlistProductos WHERE wishlistID = ? AND productoID = ?';
    db.query(checkProductQuery, [wishlistID, productoID], (err, results) => {
      if (err) {
        console.error('Error al verificar el producto en la wishlist:', err);
        return res.status(500).json({ message: 'Error al verificar el producto en la wishlist' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado en la wishlist' });
      }

      // Eliminar el producto de la wishlist usando wishlistID y productoID
      const deleteQuery = `
        DELETE FROM WishlistProductos
        WHERE wishlistID = ? AND productoID = ?
      `;

      db.query(deleteQuery, [wishlistID, productoID], (err, results) => {
        if (err) {
          console.error('Error al eliminar el producto de la wishlist:', err);
          return res.status(500).json({ message: 'Error al eliminar el producto de la wishlist' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Producto no encontrado en la wishlist' });
        }

        res.status(200).json({ message: 'Producto eliminado de la wishlist exitosamente' });
      });
    });
  });
};

const viewWishlist = (req, res) => {
    const { usuarioID } = req.body;
  
    if (!usuarioID) {
      return res.status(400).json({ message: 'El ID del usuario es requerido' });
    }
  
    // Consulta base para obtener los productos en la wishlist, incluyendo la categoría
    let query = `
      SELECT 
        w.wishlistID,
        wp.productoID,
        p.descripcion AS productoDescripcion,
        p.img,
        p.precioUnitario AS price,
        c.nombre AS categoryName
      FROM Wishlist w
      JOIN WishlistProductos wp ON w.wishlistID = wp.wishlistID
      JOIN Productos p ON wp.productoID = p.productoID
      JOIN Categorias c ON p.categoriaID = c.categoriaID  -- Ajusta el nombre de la tabla y el campo según tu esquema
      WHERE w.usuarioID = ?
    `;
  
    // Ejecutar la consulta
    db.query(query, [usuarioID], (err, results) => {
      if (err) {
        console.error('Error al consultar la wishlist:', err);
        return res.status(500).json({ message: 'Error al consultar la wishlist' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos en la wishlist' });
      }
  
      res.status(200).json(results);
    });
  };

module.exports = {addProductToWishlist,removeProductFromWishlist,viewWishlist}