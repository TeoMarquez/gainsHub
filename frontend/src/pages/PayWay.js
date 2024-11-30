import React from 'react';
import '../components/styles/PayWay.css';

const PayWay = () => {
    return (
        <div className="payway">
            <h2>PayWay - Pagos Seguros con Stripe 💳</h2>
            <section className="stripe-api">
                <h3>¿Cómo Funciona la API de Stripe? 🔍</h3>
                <p>La API de Stripe está organizada alrededor de REST y utiliza URLs orientadas a recursos, acepta cuerpos de solicitud codificados en formularios, devuelve respuestas codificadas en JSON y utiliza códigos de respuesta HTTP estándar. Puedes usar la API de Stripe en modo de prueba, lo que no afecta tus datos en vivo ni interactúa con las redes bancarias. La clave de API que uses para autenticar la solicitud determina si la solicitud está en modo de prueba o en modo en vivo. 🌐</p>
                <p>Stripe ofrece una amplia gama de bibliotecas cliente para lenguajes como Python, Java, PHP, Node.js, Go, Ruby y .NET, lo que facilita la integración en diversas plataformas. 🚀</p>
            </section>

            <section className="customer-security">
                <h3>Seguridad para Nuestros Clientes 🔒</h3>
                <p>En GainsHub, la seguridad de nuestros clientes es una prioridad. Utilizamos la API de Stripe para procesar pagos de manera segura y eficiente. Aquí hay algunas formas en que aseguramos la seguridad de tus transacciones:</p>
                <ul>
                    <li><strong>Autenticación Reforzada de Clientes (SCA):</strong> Stripe cumple con las normativas de SCA, lo que añade una capa adicional de seguridad para autenticar a los clientes durante el proceso de pago. 🔐</li>
                    <li><strong>Gestión Automática de la Autenticación:</strong> Stripe maneja automáticamente los pasos de autenticación adicionales cuando son necesarios, asegurando que los pagos se procesen de manera segura. 🔄</li>
                    <li><strong>Sin Cargos Duplicados:</strong> Stripe utiliza claves de idempotencia para evitar la creación de cargos duplicados, garantizando que cada transacción se procese una sola vez. ✅</li>
                    <li><strong>Compatibilidad Global:</strong> Stripe permite aceptar pagos de todo el mundo, cumpliendo con las normativas locales y ofreciendo métodos de pago regionales. 🌍</li>
                </ul>
            </section>
        </div>
    );
};

export default PayWay;
