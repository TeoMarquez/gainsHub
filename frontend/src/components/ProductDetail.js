import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/ProductDetail.css'; 
import categories from './categories';

const ProductDetail = ({ addToCart }) => {
  const { categoryName, productId } = useParams();
  const navigate = useNavigate(); // Para redirigir después de añadir al carrito

  const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  const product = category ? category.products.find(prod => prod.id === parseInt(productId)) : null;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return <p>Producto no disponible</p>;
  }

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart({
        ...product,
        selectedColor,
        selectedSize
      });
      navigate('/cart'); // Redirigir al carrito después de añadir el producto
    } else {
      alert('Por favor, selecciona un color y un tamaño.');
    }
  };

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>

        <p>{product.description}</p>
        <div className="product-options">
          <h3>Color</h3>
          <div className="color-options">
            {product.colors.map((color, index) => (
              <button
                key={index}
                className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color ? '✓' : ''}
              </button>
            ))}
          </div>
          <h3>Talles</h3>
          <div className="size-options">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <p className="product-price">${product.price}</p> {/* Agrega el signo de dólar aquí */}

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
