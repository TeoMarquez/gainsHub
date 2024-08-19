import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine } from '@remixicon/react';
import categories from '../components/categories'; // Asegúrate de tener la ruta correcta a tus categorías
import './styles/SearchBar.css'; // Asegúrate de crear un archivo CSS para estilizar el buscador

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value) {
      const results = categories.flatMap(category =>
        category.products.filter(product => 
          product.name.toLowerCase().includes(value)
        ).map(product => ({
          ...product,
          categorySlug: category.slug // Asumiendo que tienes un slug o identificador para las categorías
        }))
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/productos/${product.categorySlug}/${product.id}`, { state: { product } });
    setQuery('');
    setFilteredProducts([]);
  };

  return (
    <div className="search-bar">
      <RiSearchLine className="search-icon" />
      <input 
        type="text" 
        placeholder="Buscar productos..." 
        value={query}
        onChange={handleInputChange}
      />
      {filteredProducts.length > 0 && (
        <div className="search-results">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="search-result-item" 
              onClick={() => handleProductClick(product)}
            >
              <img src={product.imageUrl} alt={product.name} className="search-result-image" />
              <div className="search-result-name">{product.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
