import React, { useState } from 'react';
import { FaHome, FaClipboardList, FaBox, FaFileInvoice } from 'react-icons/fa';
import './styles/sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ onSectionSelect }) => {
  const [activeSection, setActiveSection] = useState('home'); // Estado inicial en "home"

  const handleSectionSelect = (section) => {
    setActiveSection(section); // Cambia el estado activo
    onSectionSelect(section);  // Llama a la función onSectionSelect
  };

  return (
    <div className="sidebar">
      {/* Sección Admin sin icono */}
      <div className="item adminItem">GainsHub</div>

      {/* Sección Inicio con icono y redirección con Link */}
      <div className={`item ${activeSection === 'home' ? 'active' : ''}`}>
        <Link to="/" className="item-link" onClick={() => handleSectionSelect('home')}>
          <FaHome className="icon" /> Inicio
        </Link>
      </div>
      
      {/* Sección Órdenes con icono */}
      <div className={`item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => handleSectionSelect('orders')}>
        <div className="item-link">
          <FaClipboardList className="icon" /> Órdenes
        </div>
      </div>
      
      {/* Sección Productos con icono */}
      <div className={`item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => handleSectionSelect('products')}>
        <div className="item-link">
          <FaBox className="icon" /> Productos
        </div>
      </div>
      
      {/* Sección Órdenes entregadas con icono */}
      <div className={`item ${activeSection === 'invoices' ? 'active' : ''}`} onClick={() => handleSectionSelect('invoices')}>
        <div className="item-link">
          <FaFileInvoice className="icon" /> Órdenes entregadas
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
