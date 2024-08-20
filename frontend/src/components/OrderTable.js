import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import './styles/Tables.css';
import OrderDetails from './OrderDetails';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const OrdersTable = ({ estado }) => {
  const [orders, setOrders] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [callout, setCallout] = useState({ show: false, title: '', message: '', styleClass: '' });

  const actionDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Estados para los filtros
  const [orderSort, setOrderSort] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateSort, setDateSort] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionDropdownRef.current && !actionDropdownRef.current.contains(event.target) &&
        statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(null);
        setStatusDropdownVisible(null);
      }
    };
  
    document.addEventListener('mouseup', handleClickOutside); // Cambiado a 'mouseup' para cerrar el menú después del clic.
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);
  

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
        setDropdownVisible(null); // Oculta el menú desplegable después de ver la orden.
      } else {
        console.error('Error fetching order details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleDropdown = (orderId, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === orderId ? null : orderId);

    if (dropdownVisible !== orderId && event) {
      const rect = event.target.getBoundingClientRect();
      const dropdown = document.querySelector(`.dropdown-menu[data-id='${orderId}']`);
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left}px`;
      }
    }
  };

  const toggleStatusDropdown = (orderId, event) => {
    event.stopPropagation();
    setStatusDropdownVisible(statusDropdownVisible === orderId ? null : orderId);
    const selected = orders.find(order => order.pedidoID === orderId);
    setSelectedOrder(selected);

    if (statusDropdownVisible !== orderId && event) {
      const rect = event.target.getBoundingClientRect();
      const statusDropdown = document.querySelector(`.status-dropdown[data-id='${orderId}']`);
      if (statusDropdown) {
        statusDropdown.style.top = `${rect.bottom + window.scrollY}px`;
        statusDropdown.style.left = `${rect.left}px`;
      }
    }
  };

  const renderStatusDropdown = (orderId) => (
    statusDropdownVisible === orderId && (
      <div ref={statusDropdownRef} className="status-dropdown" data-id={orderId}>
        <button onClick={() => handleStatusChange('entregado')}>Entregado</button>
        <button onClick={() => handleStatusChange('anulado')}>Anulado</button>
        <button onClick={() => handleStatusChange('pendiente')}>Pendiente</button>
      </div>
    )
  );

  const renderDropdown = (orderId) => (
    dropdownVisible === orderId && (
      <div ref={actionDropdownRef} className="dropdown-menu" data-id={orderId}>
        <button onClick={() => viewOrderDetails(orderId)}>Ver orden</button>
        <button onClick={(event) => toggleStatusDropdown(orderId, event)}>Cambiar estado</button>
        {renderStatusDropdown(orderId)}
      </div>
    )
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/viewOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
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
          setCallout({
            show: true,
            title: 'Éxito',
            message: 'Estado del pedido actualizado exitosamente',
            styleClass: 'callout-success', // Clase para éxito
          });
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.pedidoID === selectedOrder.pedidoID
                ? { ...order, estado: nuevoEstado }
                : order
            )
          );
        } else {
          setCallout({
            show: true,
            title: 'Error',
            message: 'Error al actualizar el estado del pedido',
            styleClass: 'callout-error', // Clase para error
          });
        }
      } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        setCallout({
          show: true,
          title: 'Error',
          message: 'Hubo un error al actualizar el estado del pedido',
          styleClass: 'callout-error', // Clase para error
        });
      }
      setStatusDropdownVisible(null); // Cierra el menú desplegable después de cambiar el estado.
      setDropdownVisible(null); // Cierra cualquier otro menú desplegable abierto.
      setTimeout(() => {
        setCallout({ show: false, title: '', message: '', styleClass: '' });
      }, 3000); // Oculta el Callout después de 3 segundos
    }
  };
  

  // Aplicar filtros
  const filteredOrders = orders
    .filter((order) =>
      statusFilter === '' || order.estado.toLowerCase() === statusFilter.toLowerCase()
    )
    .sort((a, b) => {
      if (orderSort === 'asc') {
        return a.pedidoID - b.pedidoID;
      } else if (orderSort === 'desc') {
        return b.pedidoID - a.pedidoID;
      } else if (dateSort === 'asc') {
        return new Date(a.fechaPedido) - new Date(b.fechaPedido);
      } else if (dateSort === 'desc') {
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      }
      return 0;
    });

  return (
    <div className="orders-table-container">
      <h2>Órdenes</h2>
      <p>Ventas recientes de tu tienda.</p>

      <div className="filters">
        <select onChange={(e) => setOrderSort(e.target.value)}>
          <option value="">Ordenar por ID</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Filtrar por estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="anulado">Anulado</option>
        </select>

        <select onChange={(e) => setDateSort(e.target.value)}>
          <option value="">Ordenar por fecha</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
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
            {filteredOrders.map((order) => (
              <TableRow key={order.pedidoID}>
                <TableCell>{`#${order.pedidoID}`}</TableCell>
                <TableCell>{`Usuario ${order.usuarioID}`}</TableCell>
                <TableCell>
                  <span className={`status ${order.estado}`}>
                    {order.estado}
                  </span>
                </TableCell>
                <TableCell>{order.fechaPedido}</TableCell>
                <TableCell>{`$${order.total}`}</TableCell>
                <TableCell>
                  <div className="actions" onClick={(event) => toggleDropdown(order.pedidoID, event)}>↔</div>
                  {renderDropdown(order.pedidoID)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {callout.show && (
        <div className={`fixed-callout ${callout.styleClass}`}>
          <div className="callout-title">{callout.title}</div>
          <div className="callout-message">{callout.message}</div>
        </div>
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
