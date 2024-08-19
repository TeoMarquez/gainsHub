// src/components/Login.js
import React, { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contraseña: password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        sessionStorage.setItem('rol', data.rol);
        sessionStorage.setItem('userId', data.id);
        console.log('Rol guardado:', sessionStorage.getItem('rol'));
        console.log('ID guardado:', sessionStorage.getItem('userId'));
        onLoginSuccess(); // Marcar el inicio de sesión como exitoso
        onClose(); // Cerrar el modal
        alert(data.message);
      } else {
        alert(data.message);
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="register-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
