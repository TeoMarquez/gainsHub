import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/OrderConfirmation.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      const session_id = new URLSearchParams(window.location.search).get('session_id');
      const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

      if (!cartItems || cartItems.length === 0) {
        setError('No se encontraron artículos en el carrito.');
        return;
      }

      if (session_id) {
        try {
          const response = await fetch(`${backendUrl}/api/createOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuarioID: sessionStorage.getItem('userId'),
              estado: 'pendiente',
              metodoPago: 'stripe',
              productos: cartItems.map(item => ({
                productoID: item.id,
                cantidad: item.quantity,
                precioUnitario: item.price,
              })),
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setOrderDetails({
              productos: cartItems,
              total: cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
            });
            sessionStorage.removeItem('cartItems'); // Limpia el carrito después de que se realiza el pedido
          } else {
            setError('Error al crear el pedido.');
            sessionStorage.removeItem('cartItems'); // Limpia el carrito si ocurre un error
          }
        } catch (error) {
          console.error('Error creating order:', error);
          setError('Hubo un problema al procesar su pedido. Por favor, intente nuevamente.');
          sessionStorage.removeItem('cartItems'); // Limpia el carrito si ocurre un error
        }
      }
    };

    createOrder();
  }, [navigate]);

  return (
    <div className="order-confirmation-container">
      {error ? (
        <>
          <div className="error-icon">⚠️</div>
          <h2>Error en el pedido</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Volver a la página principal</button>
        </>
      ) : (
        <>
          <div className="success-icon">✔</div>
          <h2>¡Pedido completado!</h2>
          <p>Gracias por tu compra. Tu pedido está en camino.</p>
          {orderDetails && (
            <div className="order-summary">
              <h3>Resumen del pedido</h3>
              {orderDetails.productos.map((producto, index) => (
                <p key={index}>{producto.name} x{producto.quantity} - ${producto.price * producto.quantity}</p>
              ))}
              <div className="total">Total: ${orderDetails.total}</div>
            </div>
          )}
          <button onClick={() => navigate('/')}>Volver a la página principal</button>
        </>
      )}
    </div>
  );
};

export default OrderConfirmation;
