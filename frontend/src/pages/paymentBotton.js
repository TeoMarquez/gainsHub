import React from 'react';

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      // Define tus productos aquí
      const items = [
        {
          title: 'Laptop',
          unit_price: 2000, // Precio en centavos
          quantity: 1,
        },
        {
          title: 'TV',
          unit_price: 1000, // Precio en centavos
          quantity: 2,
        }
      ];

      const response = await fetch('http://localhost:5000/api/create-payment', {
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
