import React, { useState } from 'react';  // 
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/ProductCard.css';

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return <p>Producto no disponible</p>;
  }

  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="product-page">
      <Header />
      <div className="container product-card-wrapper">
        <div className="image-section">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <div className="details-section">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-options">
            <h3>Color</h3>
            <div className="colors-list">
              {colors.length > 0 ? (
                colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </button>
                ))
              ) : (
                <p>No hay colores disponibles</p>
              )}
            </div>
            <h3>Talles</h3>
            <div className="sizes-list">
              {sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p>No hay talles disponibles</p>
              )}
            </div>
          </div>
          <p className="product-price">{product.price}</p>
          <button className="add-to-cart-button">Añadir al carrito</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default ProductPage;
