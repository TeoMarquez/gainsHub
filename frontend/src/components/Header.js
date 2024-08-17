// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import user from '../assets/images/User.jpg'; 
import heart from '../assets/images/heartr.png';
import shopping from '../assets/images/shopping.svg';
import './styles/Header.css';
import Modal from './Modal';
import Login from './Login';
import { TextInput } from '@tremor/react';
import { SearchBar } from './SearchBar';

export const TextInputHero = () => <TextInput className="search-bar" />;

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está logueado al cargar el componente
    const role = sessionStorage.getItem('rol');
    if (role) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleProductsDropdownToggle = () => {
    setIsProductsDropdownOpen(prevState => !prevState);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/miperfil');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rol'); // Eliminar el rol de sessionStorage al cerrar sesión
    setIsLoggedIn(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className="header">
      <div className="logo">
        <h2>GainsHub</h2>
      </div>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li onMouseEnter={handleProductsDropdownToggle} onMouseLeave={handleProductsDropdownToggle}>
            <Link to="/productos">Productos</Link>
            {isProductsDropdownOpen && (
              <div className="dropdown-products">
                <ul>
                  <li><Link to="/productos/calzados">Calzados</Link></li>
                  <li><Link to="/productos/pantalones">Pantalones</Link></li>
                  <li><Link to="/productos/camisetas">Camisetas</Link></li>
                  <li><Link to="/productos/novedades">Novedades</Link></li>
                  <li><Link to="/productos/accesorios">Accesorios</Link></li>
                </ul>
              </div>
            )}
          </li>
          <li><Link to="/">Contacto</Link></li>
          <li className="search-bar"><SearchBar /></li>
        </ul>
      </nav>
      <div className="user-options">
        <img
          className="user-icon icon"
          src={user}
          alt="User Icon"
          onClick={handleDropdownToggle}
        />
        {isDropdownOpen && (
          <div className="dropdown-user">
            <ul>
              {isLoggedIn ? (
                <>
                  <li><Link to="/miperfil">Mi Perfil</Link></li>
                  <li><Link to="/micarrito">Ver Carrito</Link></li>
                  <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/Register">Registrarse</Link></li>
                  <li><button onClick={openModal}>Iniciar Sesion</button></li>
                </>
              )}
            </ul>
          </div>
        )}
        <div className='wishlist-icon'>
          <img
          className="heart-icon icon"
          src={heart}
          alt="Wishlist Icon"
          />
        </div>
        <div className='carrito-icon'>
          <img
          className="bag-icon icon"
          src={shopping}
          alt="Shopping Icon"
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Login onLoginSuccess={handleLoginSuccess} onClose={closeModal} />
        </Modal>
      )}
    </header>
  );
};

export default Header;
