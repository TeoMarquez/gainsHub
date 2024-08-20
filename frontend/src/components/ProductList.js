import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './styles/ProductList.css';

const ProductList = ({ categories, isInWishList }) => {
  const { categoryName } = useParams();

  // Filtrar la categoría según el nombre de la ruta
  let category;
  if (categoryName === 'novedades') {
    category = {
      name: 'Novedades',
      products: categories.flatMap(cat => cat.products.filter(product => product.novedad))
    };
  } else if (categoryName === 'lo-mejor') {
    category = {
      name: 'Lo Mejor',
      products: categories.flatMap(cat => cat.products.filter(product => product.lo_mejor))
    };
  } else if (categoryName === 'colecciones') {
    category = {
      name: 'Colecciones',
      products: categories.flatMap(cat => cat.products.filter(product => product.collection))
    };
  } else {
    category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  }

  if (!category || category.products.length === 0) {
    return <p>Categoría no encontrada o no hay productos disponibles.</p>;
  }

  return (
    <div className="product-list">
      <h1>{`Productos de ${category.name}`}</h1>
      <div className="product-grid">
        {category.products.map(product => {
          // Busca la categoría real del producto
          const actualCategory = categories.find(cat => cat.products.some(p => p.id === product.id));
          const actualCategoryName = actualCategory ? actualCategory.name : categoryName;

          return (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={actualCategoryName} // Aquí se pasa la categoría real
              isInWishList={isInWishList}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
