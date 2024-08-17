const db = require('../config/db.js');

// Función general para realizar la activación o baja lógica en cualquier tabla
const modifyItemStatus = (tableName, id, activo, res) => {
  // Derivar el nombre del campo de ID a partir del nombre de la tabla
  const idName = `${tableName.slice(0, -1)}ID`;
  const modifyQuery = `UPDATE ${tableName} SET activo = ? WHERE ${idName} = ?`;

  db.query(modifyQuery, [activo, id], (err, results) => {
    if (err) {
      console.error(`Error al modificar el estado en la tabla ${tableName}:`, err);
      return res.status(500).json({ message: `Error al modificar el estado en la tabla ${tableName}` });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `${tableName} no encontrado` });
    }

    res.status(200).json({ message: `${tableName} estado modificado exitosamente` });
  });
};

// Ruta para modificar el estado de un registro
const handleDelete = (req, res) => {
  const { tableName, id, activo } = req.body;

  if (!tableName || !id || (activo !== 0 && activo !== 1)) {
    return res.status(400).json({ message: 'Nombre de la tabla, ID y estado (activo) son requeridos' });
  }

  modifyItemStatus(tableName, id, activo, res);
};

module.exports = { handleDelete };
