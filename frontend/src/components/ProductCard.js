import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ProductCard.css'; // Asegúrate de que la ruta del CSS sea correcta
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductCard = ({ product, categoryName, isInWishList }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(product.imageUrl);

  // Navegar a la página de detalles del producto
  const handleClick = () => {
    navigate(`/productos/${categoryName}/${product.id}`, { state: { product } });
  };

  // Manejar errores en la carga de la imagen
  const handleError = () => {
    setImageSrc('default-image.jpg');
  };

  // Añadir producto a la lista de deseos
  const handleAddToWishList = async () => {
    const usuarioID = sessionStorage.getItem('userId'); // Obtener el usuarioID del sessionStorage
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
          descripcion: product.name, // Enviar la descripción del producto
        }),
      });

      if (response.ok) {
        console.log('Producto añadido a la lista de deseos');
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
      <img 
        src={imageSrc} 
        alt={product.name} 
        className="product-image" 
        onError={handleError} 
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart-button" onClick={handleClick}>
          Leer más
        </button>
        
        {/* Botón de añadir a la lista de deseos */}
        <button 
          className={`wishlist-button ${isInWishList ? 'in-wishlist' : ''}`} 
          onClick={handleAddToWishList}
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
