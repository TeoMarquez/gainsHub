import React from 'react';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>PRODUCTOS</h4>
          <ul>
            <li><a href="#">Calzados</a></li>
            <li><a href="#">Zapatillas</a></li>
            <li><a href="#">Ropa</a></li>
            <li><a href="#">Accesorios</a></li>
            <li><a href="#">Botines</a></li>
            <li><a href="#">Conjuntos</a></li>
            <li><a href="#">Novedades</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>DEPORTES</h4>
          <ul>
            <li><a href="#">Selección Argentina</a></li>
            <li><a href="#">Boca Junior</a></li>
            <li><a href="#">River Plate</a></li>
            <li><a href="#">Fútbol</a></li>
            <li><a href="#">Básquet</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>ASISTENCIA</h4>
          <ul>
            <li><a href="#">Pagos</a></li>
            <li><a href="#">Envíos</a></li>
            <li><a href="#">Devoluciones</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>INFORMACIÓN DE LA EMPRESA</h4>
          <ul>
            <li><a href="#">Acerca de la tienda</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>SÍGUENOS</h4>
          <ul className="social-media">
            <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="#"><i className="fab fa-facebook-f"></i> Facebook</a></li>
            <li><a href="#"><i className="fab fa-tiktok"></i> TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GainsHub Argentina. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
