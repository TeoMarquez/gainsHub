import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createOrder = async () => {
      const session_id = new URLSearchParams(window.location.search).get('session_id');
      const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

      if (!cartItems || cartItems.length === 0) {
        console.error('No cart items found.');
        alert('No se encontraron artículos en el carrito. Redirigiendo al carrito.');
        navigate('/cart');
        return;
      }

      if (session_id) {
        try {
          const response = await fetch(`${backendUrl}/api/createOrder`,{
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
              }))
            })
          });

          if (response.ok) {
            alert('Pedido creado exitosamente');
            sessionStorage.removeItem('cartItems'); // Clear cart items after order is placed
          } else {
            alert('Error al crear el pedido');
          }
        } catch (error) {
          console.error('Error creating order:', error);
          alert('Hubo un problema al procesar su pedido. Por favor, intente nuevamente.');
        }
      }
    };

    createOrder();
  }, [navigate]);

  return (
    <div>
      <h1>Confirmación de Pedido</h1>
      <p>Procesando su pedido, por favor espere...</p>
    </div>
  );
};

export default OrderConfirmation;
