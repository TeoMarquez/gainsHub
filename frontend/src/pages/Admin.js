import React, { useState } from 'react';
import Sidebar from '../components/sidebar'; 
import '../components/styles/Admin.css';
import '../components/styles/Main.css';
import { OrdersTable } from '../components/OrderTable';
import { ProductsTable } from '../components/ProductTable';
import AddProducts from '../components/AddProducts';
import ProductDetails from '../components/ProductDetails';
import remera from '../assets/images/camiseta-algodon.png'

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [product, setProduct] = useState(null);

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setShowAddProduct(false);
    setProduct(null);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setProduct({
      id: '001',
      name: 'Camiseta de entrenamiento',
      description: 'Camiseta de algodón y transpirable',
      price: '$30.000',
      category: 'Ropa deportiva',
      stock: 100,
      size: 'M',
      color: 'Negro',
      image: 'remera' // Ruta de la imagen
    });
  };

  const renderContent = () => {
    if (showAddProduct) {
      return (
        <>
          <AddProducts />
          {product && <ProductDetails product={product} />}
        </>
      );
    }
    switch (selectedSection) {
      case 'orders':
        return <OrdersTable />;
      case 'products':
        return <ProductsTable onAddProduct={handleAddProduct} />;
      default:
        return <p>Selecciona una sección</p>;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar onSectionSelect={handleSectionSelect} />
      <div className="content-container">
        <div className="top-bar">
          <h2>Administrador</h2>
        </div>
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
