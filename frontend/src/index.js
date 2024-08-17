import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './components/styles/Main.css'; // Importa el archivo CSS global aquí


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);