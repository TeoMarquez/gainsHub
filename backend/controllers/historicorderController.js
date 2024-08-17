// gestor de tabla historica

const db = require('../config/db');

const updateHistoricOrders = (req, res) => {
    // Consulta para obtener todos los pedidos con estado 'entregado'
    const getDeliveredOrdersQuery = 'SELECT pedidoID FROM Pedidos WHERE estado = "entregado"';
    db.query(getDeliveredOrdersQuery, (err, results) => {
      if (err) {
        console.error('Error al consultar los pedidos entregados:', err);
        return res.status(500).json({ message: 'Error al consultar los pedidos entregados' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No hay pedidos entregados para registrar en Historica' });
      }
  
      // Extraer los IDs de los pedidos entregados
      const pedidoIDs = results.map(row => row.pedidoID);
  
      // Verificar si los pedidos ya están en la tabla Historica
      const checkHistoricaQuery = 'SELECT pedidoID FROM Historica WHERE pedidoID IN (?)';
      db.query(checkHistoricaQuery, [pedidoIDs], (err, existingRecords) => {
        if (err) {
          console.error('Error al consultar la tabla Historica:', err);
          return res.status(500).json({ message: 'Error al consultar la tabla Historica' });
        }
  
        // Extraer los IDs de los pedidos ya existentes en Historica
        const existingPedidoIDs = existingRecords.map(row => row.pedidoID);
  
        // Filtrar los pedidos que no están en Historica
        const newPedidoIDs = pedidoIDs.filter(id => !existingPedidoIDs.includes(id));
  
        if (newPedidoIDs.length === 0) {
          return res.status(200).json({ message: 'Todos los pedidos ya están registrados en Historica' });
        }
  
        // Preparar los valores para la inserción
        // Asegúrate de que cada fila tenga dos valores: [pedidoID, NOW()]
        const values = newPedidoIDs.map(id => [id, new Date()]);
  
        // Insertar los nuevos pedidos en la tabla Historica
        const insertHistoricaQuery = 'INSERT INTO Historica (pedidoID, fechaPago) VALUES ?';
        db.query(insertHistoricaQuery, [values], (err) => {
          if (err) {
            console.error('Error al insertar en la tabla Historica:', err);
            return res.status(500).json({ message: 'Error al registrar en la tabla Historica', error: err.message });
          }
  
          res.status(200).json({ message: `Pedidos registrados en Historica exitosamente. Total añadidos: ${newPedidoIDs.length}` });
        });
      });
    });
  };
  
  const viewHistoricorders = (req, res) => {
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
          GROUP BY p.usuarioID, p.fechaPedido
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

  
  module.exports = {updateHistoricOrders,viewHistoricorders}