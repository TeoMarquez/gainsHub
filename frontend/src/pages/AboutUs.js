import React from 'react';
import '../components/styles/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us">
            <h2>Acerca de GainsHub </h2>
            <p>GainsHub es un ecommerce dedicado a la comercialización de productos deportivos al aire libre. Nuestra misión es proporcionar a nuestros clientes los mejores productos para disfrutar de sus actividades al aire libre, promoviendo un estilo de vida saludable y activo. 🌟</p>
            
            <section className="trayectoria">
                <h3>Nuestra Trayectoria 🚀</h3>
                <p>Somos líderes en el mercado y contamos con una gran trayectoria en el mercado de productos deportivos. Desde nuestros inicios, hemos trabajado arduamente para ofrecer productos de alta calidad y un servicio excepcional a nuestros clientes. Nuestra pasión por el deporte y el aire libre nos impulsa a mejorar continuamente y a expandir nuestra oferta de productos. 💪</p>
            </section>

            <section className="dudas-frecuentes">
                <h3>Dudas Frecuentes ❓</h3>
                <div className="faq-item">
                    <h4>¿Qué tipos de productos ofrecen? 🏃‍♂️</h4>
                    <p>Ofrecemos una amplia gama de productos deportivos al aire libre, incluyendo ropa, calzado, equipos y accesorios para diversas actividades como running, ciclismo, senderismo y más. 🏞️</p>
                </div>
                <div className="faq-item">
                    <h4>¿Cómo puedo realizar un pedido? 🛒</h4>
                    <p>Para realizar un pedido, simplemente navega por nuestro catálogo de productos, añade los artículos que deseas a tu carrito y sigue el proceso de pago. Aceptamos varios métodos de pago para tu conveniencia. 💳</p>
                </div>
                <div className="faq-item">
                    <h4>¿Cuál es su política de devoluciones? 🔄</h4>
                    <p>Nuestra política de devoluciones permite a los clientes devolver productos dentro de los 30 días posteriores a la compra, siempre que los artículos estén en su estado original. Para más detalles, visita nuestra página de devoluciones. 📅</p>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
