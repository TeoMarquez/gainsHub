import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import './styles/Tables.css';
import OrderDetails from './OrderDetails'; // Importa el componente OrderDetails

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const OrdersTable = ({ estado }) => {
  const [orders, setOrders] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false); // Definir el estado para mostrar los detalles

const viewOrderDetails = async (orderId) => {
    try {
        const response = await fetch(`${backendUrl}/api/getOrderDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pedidoID: orderId }),
        });
        const data = await response.json();
        if (response.ok) {
            setSelectedOrder(data);
            setShowOrderDetails(true);
        } else {
            console.error('Error fetching order details:', data.message);
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
};


  useEffect(() => {
    const handleScroll = () => {
      setDropdownVisible(null);
      setStatusDropdownVisible(null);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchOrders(searchQuery);
  }, [searchQuery]);

  const toggleDropdown = (index, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === index ? null : index);

    if (dropdownVisible !== index && event) {
      const rect = event.target.getBoundingClientRect();
      const dropdown = document.querySelector(`.dropdown-menu[data-index='${index}']`);
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left}px`;
      }
    }
  };

  const toggleStatusDropdown = (index, event) => {
    event.stopPropagation();
    setStatusDropdownVisible(statusDropdownVisible === index ? null : index);
    setSelectedOrder(orders[index]);

    if (statusDropdownVisible !== index && event) {
      const rect = event.target.getBoundingClientRect();
      const statusDropdown = document.querySelector(`.status-dropdown[data-index='${index}']`);
      if (statusDropdown) {
        statusDropdown.style.top = `${rect.bottom + window.scrollY}px`;
        statusDropdown.style.left = `${rect.left}px`;
      }
    }
  };

  const renderStatusDropdown = (index) => (
    statusDropdownVisible === index && (
      <div className="status-dropdown" data-index={index}>
        <button onClick={() => handleStatusChange('entregado')}>Entregado</button>
        <button onClick={() => handleStatusChange('anulado')}>Anulado</button>
      </div>
    )
  );

  const renderDropdown = (index) => (
    dropdownVisible === index && (
      <div className="dropdown-menu" data-index={index}>
        <button onClick={() => viewOrderDetails(orders[index].pedidoID)}>Ver orden</button>
        <button onClick={(event) => toggleStatusDropdown(index, event)}>Cambiar estado</button>
        {renderStatusDropdown(index)}
      </div>
    )
  );

  const fetchOrders = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/viewOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...query, estado }),
      });
      const data = await response.json();
      console.log('Pedidos recibidos:', data);
      if (response.ok) {
        setOrders(data);
      } else {
        console.error('Error al obtener pedidos:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (nuevoEstado) => {
    if (selectedOrder) {
      try {
        const response = await fetch(`${backendUrl}/api/updateOrder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedidoID: selectedOrder.pedidoID,
            estado: nuevoEstado,
          }),
        });
        if (response.ok) {
          alert('Estado del pedido actualizado exitosamente');
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.pedidoID === selectedOrder.pedidoID
                ? { ...order, estado: nuevoEstado }
                : order
            )
          );
          setStatusDropdownVisible(null);
        } else {
          alert('Error al actualizar el estado del pedido');
        }
      } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        alert('Hubo un error al actualizar el estado del pedido');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(searchQuery);
  };

  return (
    <div className="orders-table-container">
      <h2>Órdenes</h2>
      <p>Ventas recientes de tu tienda.</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Búsqueda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Orden</TableHeaderCell>
              <TableHeaderCell>Usuario</TableHeaderCell>
              <TableHeaderCell>Estatus</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Monto</TableHeaderCell>
              <TableHeaderCell>Acción</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={`${order.pedidoID}-${order.pedidoProductoID}`}>
                <TableCell>{`#${order.pedidoID}`}</TableCell>
                <TableCell>{`Usuario ${order.usuarioID}`}</TableCell>
                <TableCell>
                  <span className={`status ${order.estado === 'Entregado' ? 'delivered' : 'pending'}`}>
                    {order.estado}
                  </span>
                </TableCell>
                <TableCell>{order.fechaPedido}</TableCell>
                <TableCell>{`$${order.total}`}</TableCell>
                <TableCell>
                  <div className="actions" onClick={(event) => toggleDropdown(index, event)}>↔</div>
                  {renderDropdown(index)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showOrderDetails && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setShowOrderDetails(false)}
        />
      )}
    </div>
  );
};
