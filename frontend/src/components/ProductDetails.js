import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ProductDetails.css';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta
import EditProduct from './EditProduct'; // Asegúrate de que la ruta sea correcta

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductDetails = () => {
    const { descripcion } = useParams(); // Obtener la descripción desde la URL
    const [product, setProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            console.log('Fetching product with description:', descripcion); // Log para ver la descripción que se está usando

            try {
                const response = await axios.get(`${backendUrl}/api/viewProducts`, {
                    params: { descripcion }
                });
                console.log('Response data:', response.data); // Log para ver la respuesta del servidor
                
                
                if (response.data.length > 0) {
                    setProduct(response.data[0]); // Tomar el primer producto del resultado
                } else {
                    console.error('Producto no encontrado');
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        fetchProduct();
    }, [descripcion]);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (!product) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="product-details">
          <div className="product-details" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <img 
                    src={`${backendUrl}/uploads/${product.img}`} 
                    alt={product.descripcion} 
                    style={{ 
                        width: '450px', 
                        height: '450px', 
                        objectFit: 'cover', 
                        display: 'block' 
                    }} 
                />
            </div>
            <h3>{product.descripcion}</h3>
            <p>ID: {product.productoID}</p>
            <p>Nombre: {product.descripcion}</p>
            <p>Más Información: {product.masinfo || 'No disponible'}</p>
            <p>Precio: ${Number(product.precioUnitario).toFixed(2)}</p>
            <p>Categoría: {product.categoriaNombre || 'No disponible'}</p>
            <p>Talle: {product.talle || 'No disponible'}</p>
            <p>Color: {product.color || 'No disponible'}</p>
            <p>Colección: {product.coleccionNombre || 'No disponible'}</p>
            <p>Lo Mejor: {product.lo_mejor ? 'Sí' : 'No'}</p>
            <p>Novedad: {product.novedad ? 'Sí' : 'No'}</p>
            <p>Stock: {product.stock}</p>
            <p>Fecha de Creación: {product.fechaCreacion ? new Date(product.fechaCreacion).toLocaleDateString() : 'No disponible'}</p>
            <p>Activo: {product.activo ? 'Sí' : 'No'}</p>
            <button className="edit-button" onClick={handleEditClick}>Editar</button>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <EditProduct product={product} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};

export default ProductDetails;
