import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Ajusta la ruta si es necesario
import categories from '../components/categories';
import '../components/styles/Main.css';
import messicartel from '../assets/images/messicartel.png'; // Importa la imagen del banner

const Home = ({ addToCart }) => {
    // Filtra productos destacados, novedades, y colecciones
    const destacados = categories.flatMap(category =>
        category.products.filter(product => product.lo_mejor).map(product => ({
            ...product,
            categoryName: category.name
        }))
    );

    const novedades = categories.flatMap(category =>
        category.products.filter(product => product.novedad).map(product => ({
            ...product,
            categoryName: category.name
        }))
    );

    return (
        <>
           <div className="main-content">
            {/* Banner superior */}
            <div className="banner">
                <img src={messicartel} alt="Banner" className="banner-image" />
                <div className="banner-text">
                    <Link to="/productos">
                        <button className="banner-button">Comprar Ahora</button>
                    </Link>
                </div>
            </div>
                {/* Productos destacados */}
                <section className="productos-destacados">
                    <h2>Productos Destacados</h2>
                    <div className="product-grid">
                        {destacados.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                addToCart={addToCart} 
                                categoryName={product.categoryName} 
                            />
                        ))}
                    </div>
                </section>

                {/* Nueva sección bajo productos destacados */}
                <section className="renueva-estilo" style={{ backgroundColor: '#000', color: '#fff', padding: '40px 20px' }}>
                    <div className="renueva-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>RENUEVA TU ESTILO DEPORTIVO</h2>
                            <p>Descubre nuestra colección de prendas y accesorios deportivos de alta calidad.</p>
                            <Link to="/productos">
                                <button className="banner-button" style={{ backgroundColor: '#fff', color: '#000' }}>Comprar Ahora</button>
                            </Link>
                        </div>
                        <div style={{ width: '40%', height: '200px', backgroundColor: '#ccc' }}>
                            {/* Aquí puedes agregar una imagen o un banner relacionado si es necesario */}
                        </div>
                    </div>
                </section>

                {/* Novedades y Colecciones */}
                <section className="novedades-colecciones">
                    <div className="novedades-section">
                        <h2>Novedades</h2>
                        <div className="product-grid">
                            {novedades.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    addToCart={addToCart} 
                                    categoryName={product.categoryName} 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="colecciones-section">
                        <h2>Colecciones</h2>
                        <div className="product-grid">
                            {destacados.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    addToCart={addToCart} 
                                    categoryName={product.categoryName} 
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
