// PaymentButton.js
import React from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PaymentButton = ({ cartItems }) => {
  const handlePayment = async () => {
    try {
      // Convertir los elementos del carrito a un formato compatible con Stripe
      const items = cartItems.map((item) => ({
        title: item.name,
        unit_price: item.price, // Convertir a centavos
        quantity: item.quantity,
      }));

      const response = await fetch(`${backendUrl}/api/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error: ${errorResponse.message}`);
      }

      const result = await response.json();
      if (result.url) {
        // Redirige al usuario a la página de pago de Stripe
        window.location.href = result.url;
      } else {
        console.error('Error en la respuesta del servidor:', result);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud de pago:', error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pagar con Stripe
    </button>
  );
};

export default PaymentButton;
