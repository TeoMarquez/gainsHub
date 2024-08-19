import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentButton from './PaymentButton';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CartDetails = ({ cartItems, updateItemQuantity, removeItem }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [stock, setStock] = useState({}); // Para almacenar el stock de cada producto

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = !!sessionStorage.getItem('rol') || !!sessionStorage.getItem('userId');
      setLoggedIn(isLoggedIn);
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000); // Poll for login status every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/checkStock`)
        const data = await response.json();
        setStock(data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    fetchStock();
  }, []);

  const formatPrice = (price) => `$${price.toLocaleString()}`;

  const calculateSubtotal = (item) => item.price * item.quantity;

  const calculateTotal = () => cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);

  const handleCheckout = () => {
    const isLoggedIn = !!sessionStorage.getItem('rol') || !!sessionStorage.getItem('userId');
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para finalizar la compra.');
    } else {
    }
  };

  const handlePaymentAttempt = () => {
    const isLoggedIn = !!sessionStorage.getItem('rol') || !!sessionStorage.getItem('userId');
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para realizar el pago.');
    } else {
    }
  };

  const updateQuantity = (id, quantity) => {
    const availableStock = stock[id] || 0;
    if (quantity > availableStock) {
      alert('La cantidad solicitada excede el stock disponible.');
    } else {
      updateItemQuantity(id, quantity);
    }
  };

  return (
    <div className="cart-details">
      <h1>Carrito</h1>
      {cartItems.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Productos</th>
                <th>Precio</th>
                <th>Cantidades</th>
                <th>Subtotales</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '50px' }} />
                    {item.name}
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td>{formatPrice(calculateSubtotal(item))}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-actions">
            <Link to="/">Seguir Comprando</Link>
            {!loggedIn && (
              <button onClick={handleCheckout}>
                Finalizar Compra
              </button>
            )}
            {loggedIn && (
              <PaymentButton cartItems={cartItems} onPaymentAttempt={handlePaymentAttempt} />
            )}
            <h2>Total: {formatPrice(calculateTotal())}</h2>
          </div>
        </>
      ) : (
        <p>No hay artículos en el carrito.</p>
      )}
    </div>
  );
};

export default CartDetails;
