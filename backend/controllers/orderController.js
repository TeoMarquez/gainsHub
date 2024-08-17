const db = require('../config/db.js');

const createOrder = (req, res) => {
    const { usuarioID, estado, metodoPago, productos } = req.body;
  
    if (!usuarioID || !estado || !metodoPago || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos o inválidos' });
    }
  
    // Iniciar la transacción
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar la transacción:', err);
        return res.status(500).json({ message: 'Error al crear el pedido' });
      }
  
      // Insertar el pedido en la tabla Pedidos
      const insertPedidoQuery = 
        `INSERT INTO Pedidos (usuarioID, estado, metodoPago, total)
        VALUES (?, ?, ?, ?)`;
      const total = productos.reduce((sum, producto) => sum + (producto.precioUnitario * producto.cantidad), 0);
      const pedidoValues = [usuarioID, estado, metodoPago, total];
  
      db.query(insertPedidoQuery, pedidoValues, (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error al insertar el pedido:', err);
            res.status(500).json({ message: 'Error al crear el pedido' });
          });
        }
  
        const pedidoID = results.insertId;
  
        // Insertar productos en la tabla PedidosProductos
        const insertProductosQuery = 
          `INSERT INTO PedidosProductos (pedidoID, productoID, cantidad, precioUnitario)
          VALUES ?`;
        const productosValues = productos.map(prod => [pedidoID, prod.productoID, prod.cantidad, prod.precioUnitario]);
  
        db.query(insertProductosQuery, [productosValues], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al insertar productos en el pedido:', err);
              res.status(500).json({ message: 'Error al crear el pedido' });
            });
          }
  
          // Confirmar la transacción
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al confirmar la transacción:', err);
                res.status(500).json({ message: 'Error al crear el pedido' });
              });
            }
  
            res.status(201).json({ message: 'Pedido creado exitosamente', pedidoID });
          });
        });
      });
    });
  };

// Función para ver los detalles de un pedido
const viewOrders = (req, res) => {
    const { pedidoID, byUser, groupBy } = req.body;
  
    // Consulta base para obtener los pedidos
    let query = `
      SELECT 
        p.pedidoID,
        p.usuarioID,
        p.estado,
        p.metodoPago,
        p.fechaPedido,
        p.total,
        pp.pedidoProductoID,
        pp.productoID,
        pr.descripcion AS productoDescripcion,
        pp.cantidad,
        pp.precioUnitario
      FROM Pedidos p
      JOIN PedidosProductos pp ON p.pedidoID = pp.pedidoID
      JOIN Productos pr ON pp.productoID = pr.productoID
      WHERE p.estado != 'anulado'
    `;
  
    // Condiciones para filtrar por usuario o mostrar todos los pedidos
    if (byUser === 'Yes' && pedidoID) {
      query += ' AND p.usuarioID = ?';
    } else if (byUser === 'No') {
      if (groupBy) {
        // Agrupar los resultados por usuario y fecha si se especifica en el body
        query += `
          GROUP BY p.pedidoID, p.usuarioID, p.estado, p.metodoPago, p.fechaPedido, p.total, 
          pp.pedidoProductoID, pp.productoID, pr.descripcion, pp.cantidad, pp.precioUnitario
        `;
      }
    } else {
      return res.status(400).json({ message: 'Parámetros inválidos' });
    }
  
    // Ordenar por fecha del pedido por defecto
    query += ' ORDER BY p.fechaPedido DESC;';
  
    // Preparar los valores para la consulta
    const values = byUser === 'Yes' ? [pedidoID] : [];
  
    // Ejecutar la consulta
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error al consultar los pedidos:', err);
        return res.status(500).json({ message: 'Error al consultar los pedidos' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No se encontraron pedidos' });
      }
  
      res.status(200).json(results);
    });
  };
  
  const updateOrder = (req, res) => {
    const { pedidoID, estado, metodoPago, total } = req.body;
  
    if (!pedidoID) {
      return res.status(400).json({ message: 'El ID del pedido es requerido' });
    }
  
    const checkOrderIDQuery = 'SELECT pedidoID FROM Pedidos WHERE pedidoID = ?';
    db.query(checkOrderIDQuery, [pedidoID], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        return res.status(500).json({ message: 'Error al actualizar el pedido' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
  
      // Construir la consulta de actualización dinámicamente
      let updateFields = [];
      let values = [];
  
      if (estado) {
        updateFields.push('estado = ?');
        values.push(estado);
      }
      if (metodoPago) {
        updateFields.push('metodoPago = ?');
        values.push(metodoPago);
      }
      if (total) {
        updateFields.push('total = ?');
        values.push(total);
      }
  
      // Agregar pedidoID para la condición WHERE
      values.push(pedidoID);
  
      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
      }
  
      const updateQuery = `
        UPDATE Pedidos 
        SET ${updateFields.join(', ')}
        WHERE pedidoID = ?
      `;
  
      db.query(updateQuery, values, (err, results) => {
        if (err) {
          console.error('Error al actualizar en la base de datos:', err);
          return res.status(500).json({ message: 'Error al actualizar el pedido' });
        }
        res.status(200).json({ message: 'Pedido actualizado exitosamente' });
      });
    });
};

module.exports = { viewOrders, createOrder, updateOrder};

