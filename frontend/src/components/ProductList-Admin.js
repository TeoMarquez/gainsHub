import React from 'react';
import './styles/ProductList.css';

const ProductList = ({ products = [] }) => {
  return (
    <div className="product-list">
      <h3>Productos en el Pedido</h3>
      <table>
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Cantidad</th>
            <th>Monto Unitario</th>
            <th>Color</th>
            <th>Talle</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.quantity}</td>
              <td>{product.unitPrice}</td>
              <td>{product.color}</td>
              <td>{product.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
