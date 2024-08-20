import React, { useEffect, useState, memo } from 'react';
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
      const product = {
        id: item.productoID,
        name: item.productoDescripcion,
        imageUrl: `${backendUrl}/uploads/${item.img}`,
        price: item.price,
        quantity: 1,
      };

      addToCart(product);
      navigate('/cart');
    } else {
      console.error("addToCart is not a function");
    }
  };

  const handleRemoveFromWishlist = async (productoID) => {
    const usuarioID = sessionStorage.getItem('userId');
    if (!usuarioID) {
        console.error('Usuario no autenticado');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/removeProductFromWishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuarioID, productoID }),
        });

        if (response.ok) {
            setWishlistItems(prevItems => prevItems.filter(item => item.productoID !== productoID));
            console.log('Producto removido de la lista de deseos');
        } else {
            const errorData = await response.json();
            console.error('Error al remover el producto:', errorData.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
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
              <p>{item.categoryName}</p>
              <div className="wishlist-item-price">${item.price}</div>
            </div>
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
              <button
                className="wishlist-item-button remove-button"
                onClick={() => handleRemoveFromWishlist(item.productoID)}
              >
                Remover
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos en tu lista de deseos.</p>
      )}
    </div>
  );
};

export default memo(Wishlist);