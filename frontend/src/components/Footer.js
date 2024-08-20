import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate y Link
import './styles/Footer.css';
import Modal from './Modal';
import Login from './Login'; // Asegúrate de que la ruta sea correcta

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleAdminClick = (e) => {
    e.preventDefault();
    const userRole = sessionStorage.getItem('rol');

    if (userRole === 'jefeVentas') {
      navigate('/Admin');
    } else {
      alert('Debes ser un administrador para entrar a estas opciones');
      setIsModalOpen(true); // Mostrar el modal de inicio de sesión si el rol no es adecuado
    }
  };

  const handleLoginSuccess = () => {
    const userRole = sessionStorage.getItem('rol');
    if (userRole === 'jefeVentas') {
      navigate('/Admin'); // Navegar a la ruta protegida si el rol es 'jefeVentas'
    }
    setIsLoggedIn(true);
    setIsModalOpen(false); // Cerrar el modal después de un inicio de sesión exitoso
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>PRODUCTOS</h4>
          <ul>
            <li><Link to="/productos/calzados">Calzados</Link></li>
            <li><Link to="/productos/pantalones">Pantalones</Link></li>
            <li><Link to="/productos/camisetas">Camisetas</Link></li>
            <li><Link to="/productos/novedades">Novedades</Link></li>
            <li><Link to="/productos/loMejor">Lo Mejor</Link></li>
            <li><Link to="/productos/Colleciones">Colecciones</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>ASISTENCIA</h4>
          <ul>
          <li><Link to="/formas-de-pago">Pagos</Link></li>
            <li><a href="#" onClick={handleAdminClick}>Administrador</a></li> {/* Enlace a la página Admin con modal si no está logueado */}
          </ul>
        </div>
        <div className="footer-column">
          <h4>INFORMACIÓN DE LA EMPRESA</h4>
          <ul>
          <li><Link to="/about-us">Acerca de la tienda</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>SÍGUENOS</h4>
          <ul className="social-media">
            <li><a href="https://www.instagram.com/ecae_24/"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><i className="fab fa-facebook-f"></i> Facebook</a></li>
            <li><a href="https://www.youtube.com/watch?v=1Jkx79hz9jU"><i className="fab fa-tiktok"></i> TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GainsHub Argentina. Todos los derechos reservados.</p>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Login onLoginSuccess={handleLoginSuccess} onClose={closeModal} />
        </Modal>
      )}
    </footer>
  );
};

export default Footer;
