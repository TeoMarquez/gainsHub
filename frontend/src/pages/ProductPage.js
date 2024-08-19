import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductPage = () => {
  const { descripcion } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/viewAllProducts`, {
          params: { search: descripcion }
        });
        // Supongamos que el resultado es un array, y tomamos el primer producto
        if (response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          console.error('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();
  }, [descripcion]);

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div>
        <h1>Detalles del Producto</h1>
        <p>Descripción del producto: {product.descripcion}</p>
        <p>ID: {product.productoID}</p>
        <p>Categoría: {product.categoria}</p>
        <p>Precio: ${Number(product.precioUnitario).toFixed(2)}</p>
        <button>Editar</button>
      </div>
    </>
  );
};

export default ProductPage;
