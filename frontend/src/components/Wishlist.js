import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/WishList.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Wishlist = ({ addToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const usuarioID = sessionStorage.getItem('userId'); // Obtener el usuarioID del sessionStorage
      if (!usuarioID) {
        console.error('Usuario no autenticado');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/viewWishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuarioID }),
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data);
        } else {
          const errorData = await response.json();
          console.error('Error al obtener la wishlist:', errorData.message);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (item) => {
    if (typeof addToCart === 'function') {
      // Asegúrate de que el objeto que envías tiene las propiedades necesarias
      const product = {
        id: item.productoID,
        name: item.productoDescripcion,
        imageUrl: `${backendUrl}/uploads/${item.img}`,
        price: item.price,
        quantity: 1, // Inicializa la cantidad en 1
      };

      addToCart(product); // Pasa el producto con la estructura correcta al carrito
      navigate('/cart');  // Redirigir al carrito después de agregar
    } else {
      console.error("addToCart is not a function");
    }
  };

  return (
    <div className="wishlist">
      <h1>Favoritos</h1>
      {wishlistItems.length > 0 ? (
        wishlistItems.map(item => (
          <div key={item.productoID} className="wishlist-item">
            <img 
              src={`${backendUrl}/uploads/${item.img}`} 
              alt={item.productoDescripcion} 
            />
            <div className="wishlist-item-details">
              <h2>{item.productoDescripcion}</h2>
              <div className="wishlist-item-price">${item.price}</div>
              <div className="wishlist-item-buttons">
                <Link to={`/productos/${item.categoryName}/${item.productoID}`}>
                  <button className="wishlist-item-button">Ver más</button>
                </Link>
                <button
                  className="wishlist-item-button carrito-button"
                  onClick={() => handleAddToCart(item)}
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos en tu lista de deseos.</p>
      )}
    </div>
  );
};

export default Wishlist;
