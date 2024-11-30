import React from 'react';
import './styles/OrderDetails.css';
import ProductList from './ProductList-Admin';

const OrderDetails = ({ order, onClose }) => {
  return (
    <div className="overlay">
      <div className="order-details">
        <button className="close-button" onClick={onClose}>Cerrar</button>
        <h2>Detalles de la Orden</h2>

        <ProductList products={order.products} />

        <div className="order-columns">
          <div className="user-info">
            <h3>Datos del Usuario</h3>
            <p><strong>Cliente:</strong> {order.customer}</p>
            <p><strong>DNI:</strong> {order.dni}</p>
            <p><strong>Calle:</strong> {order.street}</p>
            <p><strong>Correo:</strong> {order.email}</p>
            <p><strong>Teléfono:</strong> {order.phone}</p>
          </div>
          <div className="order-info">
            <h3>Datos del Pedido</h3>
            <p><strong>ID de la Orden:</strong> {order.id}</p>
            <p><strong>Fecha:</strong> {order.date}</p>
            <p><strong>Monto:</strong> {order.amount}</p>
            <p><strong>Estado:</strong> {order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
