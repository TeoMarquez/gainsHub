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
                        <Link to="/productos/novedades">
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
                <section className="renueva-estilo">
                    <div className="renueva-text">
                        <h2>RENUEVA TU ESTILO DEPORTIVO</h2>
                        <p>Descubre nuestra colección de prendas y accesorios deportivos de alta calidad.</p>
                        <Link to="/productos/novedades">
                            <button className="banner-button white">Comprar Ahora</button>
                        </Link>
                    </div>
                    <div className="video-container">
                        <iframe 
                            className="youtube-video" 
                            src="https://www.youtube.com/embed/gj-KN3Nz24I" 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
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
