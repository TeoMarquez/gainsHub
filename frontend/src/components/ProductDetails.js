import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ProductDetails.css';
import Modal from './Modal'; 
import EditProduct from './EditProduct'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';

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
                <Table className="custom-table">
                    <TableBody>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableCell>{product.productoID}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Nombre</TableHeaderCell>
                            <TableCell>{product.descripcion}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Más Información</TableHeaderCell>
                            <TableCell>{product.masinfo || 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Precio</TableHeaderCell>
                            <TableCell>${Number(product.precioUnitario).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Categoría</TableHeaderCell>
                            <TableCell>{product.categoriaNombre || 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Talle</TableHeaderCell>
                            <TableCell>{product.talle || 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Color</TableHeaderCell>
                            <TableCell>{product.color || 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Colección</TableHeaderCell>
                            <TableCell>{product.coleccionNombre || 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Lo Mejor</TableHeaderCell>
                            <TableCell>{product.lo_mejor ? 'Sí' : 'No'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Novedad</TableHeaderCell>
                            <TableCell>{product.novedad ? 'Sí' : 'No'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Stock</TableHeaderCell>
                            <TableCell>{product.stock}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Fecha de Creación</TableHeaderCell>
                            <TableCell>{product.fechaCreacion ? new Date(product.fechaCreacion).toLocaleDateString() : 'No disponible'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHeaderCell>Activo</TableHeaderCell>
                            <TableCell>{product.activo ? 'Sí' : 'No'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="button-container">
                    <button className="edit-button" onClick={handleEditClick}>Editar</button>
                </div>
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
