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
      `INSERT INTO pedidos (usuarioID, estado, metodoPago, total)
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
        `INSERT INTO pedidosproductos (pedidoID, productoID, cantidad, precioUnitario)
        VALUES ?`;
      const productosValues = productos.map(prod => [pedidoID, prod.productoID, prod.cantidad, prod.precioUnitario]);

      db.query(insertProductosQuery, [productosValues], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error al insertar productos en el pedido:', err);
            res.status(500).json({ message: 'Error al crear el pedido' });
          });
        }

        // Actualizar el stock de los productos
        const updateStockQueries = productos.map(prod => {
          return new Promise((resolve, reject) => {
            const updateStockQuery = 
              `UPDATE productos SET stock = stock - ? WHERE productoID = ? AND stock >= ?`;
            db.query(updateStockQuery, [prod.cantidad, prod.productoID, prod.cantidad], (err, result) => {
              if (err) {
                return reject(err);
              }
              if (result.affectedRows === 0) {
                return reject(new Error(`No se pudo actualizar el stock para el producto ID ${prod.productoID}`));
              }
              resolve();
            });
          });
        });

        Promise.all(updateStockQueries)
          .then(() => {
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
          })
          .catch((err) => {
            db.rollback(() => {
              console.error('Error al actualizar el stock:', err);
              res.status(500).json({ message: 'Error al crear el pedido' });
            });
          });
      });
    });
  });
};

const viewOrders = (req, res) => {
  const { pedidoID, usuarioID, estado, groupBy } = req.body;

  // Consulta base para obtener los pedidos
  let query = `
    SELECT 
      p.pedidoID,
      p.usuarioID,
      p.estado,
      p.metodoPago,
      p.fechaPedido,
      p.total
    FROM pedidos p
    WHERE 1=1
  `;

  // Agregar condiciones basadas en los parámetros recibidos
  const params = [];

  if (pedidoID) {
    query += ` AND p.pedidoID = ?`;
    params.push(pedidoID);
  }

  if (usuarioID) {
    query += ` AND p.usuarioID = ?`;
    params.push(usuarioID);
  }

  if (estado) {
    query += ` AND p.estado = ?`;
    params.push(estado);
  }

  // Opcional: Agregar agrupamiento si se proporciona el parámetro groupBy
  if (groupBy) {
    query += ` GROUP BY p.${groupBy}`;
  }

  // Ordenar por fecha del pedido por defecto
  query += ' ORDER BY p.fechaPedido DESC;';

  // Ejecutar la consulta
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al consultar los pedidos:', err);
      return res.status(500).json({ message: 'Error al consultar los pedidos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pedidos' });
    }

    // Enviar la respuesta con los resultados
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

const getOrderDetails = (req, res) => {
  const { pedidoID } = req.body;

  const query = `
      SELECT 
          u.nombre AS customer,
          u.email,
          u.telefono AS phone,
          u.direccion AS street,
          u.usuarioID AS dni,
          p.pedidoID AS id,
          p.fechaPedido AS date,
          p.total AS amount,
          p.estado AS status,
          pp.pedidoProductoID,
          pr.productoID AS productID,
          pr.descripcion AS productDescription,
          pp.cantidad AS quantity,
          pp.precioUnitario AS unitPrice,
          pr.color,
          pr.talle AS size
      FROM pedidos p
      JOIN usuarios u ON p.usuarioID = u.usuarioID
      JOIN pedidosproductos pp ON p.pedidoID = pp.pedidoID
      JOIN productos pr ON pp.productoID = pr.productoID
      WHERE p.pedidoID = ?
  `;

  db.query(query, [pedidoID], (err, results) => {
      if (err) {
          console.error('Error fetching order details:', err);
          return res.status(500).json({ message: 'Error fetching order details' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
      }

      const order = {
          customer: results[0].customer,
          dni: results[0].dni,
          street: results[0].street,
          email: results[0].email,
          phone: results[0].phone,
          id: results[0].id,
          date: results[0].date,
          amount: results[0].amount,
          status: results[0].status,
          products: results.map(result => ({
              id: result.productID,
              description: result.productDescription,
              quantity: result.quantity,
              unitPrice: result.unitPrice,
              color: result.color,
              size: result.size
          }))
      };

      res.status(200).json(order);
  });
};

const getPendingOrders = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      p.pedidoID AS orderId,
      p.estado AS status,
      p.metodoPago AS paymentMethod,
      p.fechaPedido AS orderDate,
      p.total AS totalAmount,
      pp.pedidoProductoID AS orderProductId,
      pp.productoID AS productId,
      pp.cantidad AS quantity,
      pp.precioUnitario AS unitPrice,
      pr.descripcion AS productDescription,
      pr.precioUnitario AS productUnitPrice,
      pr.stock,
      pr.talle,
      pr.color,
      pr.img
    FROM 
      pedidos p
    JOIN 
      pedidosproductos pp ON p.pedidoID = pp.pedidoID
    JOIN 
      productos pr ON pp.productoID = pr.productoID
    WHERE 
      p.usuarioID = ? AND p.estado = 'pendiente';
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error al recuperar los pedidos pendientes:', err);
      return res.status(500).json({ message: 'Error al recuperar los pedidos pendientes' });
    }

    // Procesar los resultados para estructurarlos adecuadamente
    const orders = rows.reduce((acc, row) => {
      let order = acc.find(o => o.orderId === row.orderId);
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          paymentMethod: row.paymentMethod,
          orderDate: row.orderDate,
          totalAmount: row.totalAmount,
          products: []
        };
        acc.push(order);
      }
      order.products.push({
        orderProductId: row.orderProductId,
        productId: row.productId,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        productDescription: row.productDescription,
        productUnitPrice: row.productUnitPrice,
        stock: row.stock,
        talle: row.talle,
        color: row.color,
        img: row.img
      });
      return acc;
    }, []);

    res.json(orders);
  });
};


module.exports = { viewOrders, createOrder, updateOrder, getOrderDetails, getPendingOrders};

