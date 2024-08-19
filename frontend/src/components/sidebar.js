import React from 'react';
import { FaHome, FaClipboardList, FaBox, FaFileInvoice } from 'react-icons/fa';
import './styles/sidebar.css'; 
import { Link } from 'react-router-dom';

const Sidebar = ({ onSectionSelect }) => {
  return (
    <div className="sidebar">
      {/* Sección Admin sin icono */}
      <div className="item adminItem">Admin</div>

      {/* Sección Inicio con icono, usa Link */}
      <div className="item">
        <Link to="/" className="item-link">
          <FaHome className="icon" /> Inicio
        </Link>
      </div>
      
      {/* Sección Órdenes con icono */}
      <div className="item" onClick={() => onSectionSelect('orders')}>
        <div className="item-link">
          <FaClipboardList className="icon" /> Órdenes
        </div>
      </div>
      
      {/* Sección Productos con icono */}
      <div className="item" onClick={() => onSectionSelect('products')}>
        <div className="item-link">
          <FaBox className="icon" /> Productos
        </div>
      </div>
      
      {/* Sección Facturas con icono */}
      <div className="item" onClick={() => onSectionSelect('invoices')}>
        <div className="item-link">
          <FaFileInvoice className="icon" /> Facturas
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
