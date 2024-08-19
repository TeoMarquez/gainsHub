import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const ProductsTable = ({ onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Usa useNavigate para redirigir

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/viewAllProducts`, {
          params: {
            search: searchQuery,
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const toggleDropdown = (index, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === index ? null : index);

    if (dropdownVisible !== index && event) {
      const rect = event.target.getBoundingClientRect();
      const dropdown = document.querySelector(`.dropdown-menu[data-index='${index}']`);
      if (dropdown) {
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
      }
    }
  };

  const handleViewClick = (product) => {
    // Redirige a la página de detalles del producto
    navigate(`/product/${encodeURIComponent(product.descripcion)}`);
  };

  const handleDelete = async (product) => {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (confirmation) {
      try {
        const response = await axios.post(`${backendUrl}/api/softDelete`, {
          tableName: 'productos', // Nombre de la tabla según tu esquema
          id: product.productoID,
          activo: 0, // Marcar como inactivo
        });

        if (response.status === 200) {
          alert('Producto eliminado con éxito');
          setProducts((prevProducts) =>
            prevProducts.filter((item) => item.productoID !== product.productoID)
          );
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al eliminar el producto');
      }
    }
  };

  const renderDropdown = (index, product) => (
    dropdownVisible === index && (
      <div className="dropdown-menu" data-index={index}>
        <button onClick={() => handleViewClick(product)}>Ver Producto</button>
        <button onClick={() => handleDelete(product)}>Eliminar</button>
      </div>
    )
  );

  return (
    <div className="orders-table-container">
      <h2>Productos</h2>
      <p>Gestiona tu catálogo de productos.</p>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Búsqueda..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div>
        <button className="add-product" onClick={onAddProduct}>Añadir producto</button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Imagen</TableHeaderCell>
            <TableHeaderCell>Producto</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Acción</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.length > 0 ? products.map((product, index) => (
            <TableRow key={product.productoID}>
              <TableCell>
                <img 
                  src={`${backendUrl}/uploads/${product.img}`} 
                  alt={product.descripcion} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
              </TableCell>
              <TableCell>{product.descripcion}</TableCell>
              <TableCell>{product.categoria}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>${Number(product.precioUnitario).toFixed(2)}</TableCell>
              <TableCell>
                <div className="actions" onClick={(event) => toggleDropdown(index, event)}>↔</div>
                {renderDropdown(index, product)}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan="6">No se encontraron productos</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
