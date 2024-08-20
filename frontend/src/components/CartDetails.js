import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentButton from './PaymentButton';
import './styles/CartDetails.css'; // Esta importación debe estar antes de cualquier otro código

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
        const response = await fetch(`${backendUrl}/api/checkStock`);
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
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } else {
      navigate('/checkout');
    }
  };

  const handlePaymentAttempt = () => {
    const isLoggedIn = !!sessionStorage.getItem('rol') || !!sessionStorage.getItem('userId');
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para realizar el pago.');
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } else {
      // Aquí podrías añadir la lógica para proceder con el pago
    }
  };

  const updateQuantity = (id, quantity) => {
    const availableStock = stock[id] || 0;
    if (quantity > availableStock) {
      alert('La cantidad solicitada excede el stock disponible.');
    } else if (availableStock === 0) {
      alert('Este producto no está disponible actualmente.');
    } else {
      updateItemQuantity(id, quantity);
    }
  };

  const total = calculateTotal();

  // Verifica si hay algún producto sin stock
  const hasNoStockItems = cartItems.some(item => stock[item.id] === 0);

  // Obtén los nombres de los productos sin stock
  const outOfStockItems = cartItems.filter(item => stock[item.id] === 0).map(item => item.name);

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
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={stock[item.id] === 0 || item.quantity >= stock[item.id]}>+</button>
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
              <button onClick={handleCheckout} disabled={hasNoStockItems}>
                Finalizar Compra
              </button>
            )}
            {loggedIn && !hasNoStockItems && total > 700 && (
              <PaymentButton cartItems={cartItems} onPaymentAttempt={handlePaymentAttempt} />
            )}
            <h2>Total: {formatPrice(total)}</h2>
            {total <= 700 && (
              <p className="warning-text">Advertencia: Solo se aceptan compras con un total mayor a $700.</p>
            )}
            {hasNoStockItems && (
              <p className="error-text">
                Algunos productos no están disponibles actualmente:
                {outOfStockItems.join(', ')}. Por favor, revisa tu carrito.
              </p>
            )}
          </div>
        </>
      ) : (
        <p>No hay artículos en el carrito.</p>
      )}
    </div>
  );
};

export default CartDetails;

