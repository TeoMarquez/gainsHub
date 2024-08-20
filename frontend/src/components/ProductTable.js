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
import { useNavigate } from 'react-router-dom';
import './styles/ProductsTable.css'; 

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const ProductsTable = ({ onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('descripcion');
  const [callout, setCallout] = useState({ show: false, title: '', message: '', styleClass: '' });
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/viewAllProducts`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProducts();
  }, []);

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
    navigate(`/product/${encodeURIComponent(product.descripcion)}`);
  };

  const handleDelete = async (product) => {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (confirmation) {
      try {
        const response = await axios.post(`${backendUrl}/api/softDelete`, {
          tableName: 'productos',
          id: product.productoID,
          activo: 0,
        });

        if (response.status === 200) {
          setCallout({
            show: true,
            title: 'Éxito',
            message: 'Producto eliminado con éxito.',
            styleClass: 'callout-success',
          });
          setProducts((prevProducts) =>
            prevProducts.filter((item) => item.productoID !== product.productoID)
          );
        } else {
          setCallout({
            show: true,
            title: 'Error',
            message: 'Error al eliminar el producto.',
            styleClass: 'callout-error',
          });
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        setCallout({
          show: true,
          title: 'Error',
          message: 'Hubo un error al eliminar el producto.',
          styleClass: 'callout-error',
        });
      }
      setTimeout(() => {
        setCallout({ show: false, title: '', message: '', styleClass: '' });
      }, 3000); // Oculta el Callout después de 3 segundos
    }
  };

  const handleSortChange = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

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

      <div>
        <button className="add-product" onClick={onAddProduct}>Añadir producto</button>
      </div>

      <div className="filters">
        <label>
          Ordenar por:
          <select onChange={(e) => handleSortChange(e.target.value)} value={sortField}>
            <option value="descripcion">Nombre</option>
            <option value="stock">Stock</option>
          </select>
        </label>
      </div>

      {callout.show && (
        <div className={`fixed-callout ${callout.styleClass}`}>
          <div className="callout-title">{callout.title}</div>
          <div className="callout-message">{callout.message}</div>
        </div>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Imagen</TableHeaderCell>
            <TableHeaderCell onClick={() => handleSortChange('descripcion')}>
              Producto {sortField === 'descripcion' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHeaderCell>
            <TableHeaderCell onClick={() => handleSortChange('stock')}>
              Stock {sortField === 'stock' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHeaderCell>
            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Acción</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedProducts.length > 0 ? sortedProducts.map((product, index) => (
            <TableRow key={product.productoID}>
              <TableCell>
                <img
                  src={`${backendUrl}/uploads/${product.img}`}
                  alt={product.descripcion}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </TableCell>
              <TableCell>{product.descripcion}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>${Number(product.precioUnitario).toFixed(2)}</TableCell>
              <TableCell>
                <div className="actions" onClick={(event) => toggleDropdown(index, event)}>↔</div>
                {renderDropdown(index, product)}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan="5">No se encontraron productos</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
