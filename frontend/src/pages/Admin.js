import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'; 
import '../components/styles/Admin.css';
import '../components/styles/Main.css';
import { OrdersTable } from '../components/OrderTable';
import { ProductsTable } from '../components/ProductTable';
import AddProducts from '../components/AddProducts';
import ProductDetails from '../components/ProductDetails';

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('rol');
    if (role !== 'jefeVentas') {
      alert('No dispone de permisos de administrador');
      navigate('/');
    }
  }, [navigate]);

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setShowAddProduct(false);
    setProduct(null);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
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
    
    // Utiliza la sección seleccionada como parte de la clave para forzar el remonte
    switch (selectedSection) {
      case 'orders':
        return <OrdersTable key={`orders-${selectedSection}`} estado="pendiente" />;
      case 'products':
        return <ProductsTable onAddProduct={handleAddProduct} />;
      default:
        return <OrdersTable key={`orders-${selectedSection}`} estado="entregado" />;
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
