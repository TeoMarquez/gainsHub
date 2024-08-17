import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/styles/Main.css';

const Home = () => {
  return (
    <>
      <Header />
      <div className="main-content">
        
        <h1>Bienvenido al Carrito de Compras</h1>
      </div>
      <Footer />
    </>
  );
}

export default Home;
