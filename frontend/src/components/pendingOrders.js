import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PendingOrders.css';
import OrderDetails from './OrderDetails'; // Importa el componente OrderDetails

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPendingOrders/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const contentType = response.headers.get('Content-Type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Expected JSON response');
                }
        
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error al recuperar los pedidos pendientes:', error);
                alert('Error al recuperar los pedidos pendientes. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, navigate]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="pending-orders">
            <h2>Pedidos Pendientes</h2>
            {orders.length === 0 ? (
                <p>No tienes pedidos pendientes.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.orderId} onClick={() => handleOrderClick(order)}>
                            <p>ID: {order.orderId}</p>
                            <p>Fecha: {order.orderDate}</p>
                            <p>Monto: ${order.totalAmount}</p>
                            <p>Estado: {order.status}</p>
                        </li>
                    ))}
                </ul>
            )}
            {selectedOrder && (
                <OrderDetails order={selectedOrder} onClose={handleCloseOrderDetails} />
            )}
        </div>
    );
};

export default PendingOrders;
