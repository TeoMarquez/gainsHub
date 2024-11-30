import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ProductDetails.css';
import Modal from './Modal'; 
import EditProduct from './EditProduct'; 

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductDetails = () => {
    const { descripcion } = useParams(); 
    const [product, setProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/viewProducts`, {
                    params: { descripcion }
                });
                
                if (response.data.length > 0) {
                    setProduct(response.data[0]); 
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
        <div className="product-details-container">
            <div className="image-container">
                <img 
                    src={`${backendUrl}/uploads/${product.img}`} 
                    alt={product.descripcion} 
                    className="product-image" 
                />
            </div>
            <div className="details-container">
                <div className="section-box">
                    <h3>Información del Producto</h3>
                    <p><strong>ID:</strong> {product.productoID}</p>
                    <p><strong>Nombre:</strong> {product.descripcion}</p>
                    <p><strong>Precio:</strong> ${Number(product.precioUnitario).toFixed(2)}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                </div>
                <div className="section-box">
                    <h3>Detalles Adicionales</h3>
                    <p><strong>Categoría:</strong> {product.categoriaNombre || 'No disponible'}</p>
                    <p><strong>Talle:</strong> {product.talle || 'No disponible'}</p>
                    <p><strong>Color:</strong> {product.color || 'No disponible'}</p>
                    <p><strong>Colección:</strong> {product.coleccionNombre || 'No disponible'}</p>
                </div>
                <div className="section-box centered">
                    <h3>Características</h3>
                    <p><strong>Lo Mejor:</strong> {product.lo_mejor ? 'Sí' : 'No'}</p>
                    <p><strong>Novedad:</strong> {product.novedad ? 'Sí' : 'No'}</p>
                    <p><strong>Activo:</strong> {product.activo ? 'Sí' : 'No'}</p>
                </div>
            </div>
            <div className="button-container">
                <button className="edit-button" onClick={handleEditClick}>Editar</button>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <EditProduct product={product} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};

export default ProductDetails;
