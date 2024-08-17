// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/styles/Main.css';
import '../components/styles/Register.css';
import logoGoogle from '../assets/images/RedesSociales/el-logo-g-de-google.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          email,
          contraseña: password,
          direccion: address,
          telefono: phone,
          rol: 'cliente', // Asegúrate de que esto se esté enviando
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccess(result.message);
        setError('');
        navigate('/');
      } else {
        setError(result.message);
        setSuccess('');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Error al registrar el usuario');
    }
  };
  

  return (
    <>
      <Header />
      <div className="register-container">
        <div className="register-form">
          <h2>Registrarse</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="address">Dirección:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone">Teléfono:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">Registrarse</button>
            </div>
          </form>
        </div>
        <div className="social-login">
          <h2><strong>Iniciar Sesión con Redes Sociales</strong></h2>
          <div className="social-buttons">
            <button className="social-btn" data-app="Google">
              <img src={logoGoogle} alt="Google" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
