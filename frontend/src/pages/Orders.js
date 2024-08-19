import React from 'react';
import TableHero from '../components/ProductTable'; // Asegúrate de que la ruta sea correcta

const Orders = () => {
  return (
    <div className="main-content">
      <h1>Órdenes</h1>
      <TableHero /> {/* Muestra la tabla aquí */}
    </div>
  );
}

export default Orders;
