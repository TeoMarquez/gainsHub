import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ProductCard.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductCard = ({ product, categoryName, isInWishList }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(product.imageUrl);
  const [inWishlist, setInWishlist] = useState(isInWishList);

  // Navegar a la página de detalles del producto
  const handleClick = () => {
    navigate(`/productos/${categoryName}/${product.id}`, { state: { product } });
  };

  // Manejar errores en la carga de la imagen
  const handleError = () => {
    setImageSrc('default-image.jpg');
  };

  // Añadir producto a la lista de deseos
  const handleAddToWishList = async (e) => {
    e.stopPropagation(); // Evita que el clic en el corazón dispare otros clics
    const usuarioID = sessionStorage.getItem('userId');
    if (!usuarioID) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/addProductToWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioID,
          descripcion: product.name,
        }),
      });

      if (response.ok) {
        console.log('Producto añadido a la lista de deseos');
        setInWishlist(true);
      } else {
        const errorData = await response.json();
        console.error('Error al añadir el producto:', errorData.message);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div className="product-card">
      <div className="image-container" onClick={handleClick}>
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="product-image" 
          onError={handleError} 
        />
        <div className="wishlist-icon-container">
          <button
            className={`wishlist-button ${inWishlist ? 'in-wishlist' : ''}`} 
            onClick={handleAddToWishList}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">Categoría: {categoryName}</p>
        {product.collection && (
          <p className="product-collection">Colección: {product.collection}</p>
        )}
        {product.novedad && (
          <span className="product-label new">Novedad</span>
        )}
        {product.lo_mejor && (
          <span className="product-label best">Lo Mejor</span>
        )}
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart-button" onClick={handleClick}>
          Leer más
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
