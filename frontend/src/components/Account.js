import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Account.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Account = () => {  
    const [activeTab, setActiveTab] = useState('account');
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    const userId = sessionStorage.getItem('userId');
    
    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }
        
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserInfo(data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al recuperar la información del usuario:', error);
                alert('Error al recuperar la información del usuario. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getPendingOrders/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al recuperar los pedidos pendientes:', error);
                alert('Error al recuperar los pedidos pendientes. Inténtalo de nuevo más tarde.');
            }
        };

        fetchUserInfo();
        fetchOrders();
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    address: userInfo.address,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Información guardada correctamente.');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al guardar la información del usuario:', error);
            alert('Error al guardar la información del usuario. Inténtalo de nuevo más tarde.');
        }
    };

    const handleModifyOrder = (orderId) => {
        navigate(`/edit-order/${orderId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="account-container">
            <div className="account-sidebar">
                <h3>Bienvenido</h3>
                <h2>{userInfo.name}</h2>
                <p>{userInfo.email}</p>
                <p>{userInfo.address}</p>
            </div>
            <div className="account-content">
                <div className="tabs">
                    <button 
                        className={activeTab === 'account' ? 'active' : ''} 
                        onClick={() => setActiveTab('account')}
                    >
                        Cuenta
                    </button>
                    <button 
                        className={activeTab === 'orders' ? 'active' : ''} 
                        onClick={() => setActiveTab('orders')}
                    >
                        Pedidos Pendientes
                    </button>
                </div>
                {activeTab === 'account' && (
                    <div className="account-details">
                        <div>
                            <label>Nombre:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={userInfo.name} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div>
                            <label>Correo electrónico:</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={userInfo.email} 
                                readOnly 
                            />
                        </div>
                        <div>
                            <label>Dirección:</label>
                            <input 
                                type="text" 
                                name="address" 
                                value={userInfo.address} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <button onClick={handleSave}>Modificar</button>
                    </div>
                )}
              {activeTab === 'orders' && (
    <div className="orders-details">
        {orders.length === 0 ? (
            <p>No tienes pedidos pendientes.</p>
        ) : (
            orders.map(order => (
                <div className="order" key={order.orderId}>
                    <div className="order-info">
                        <h4>Detalles del Pedido</h4>
                        <p>ID: {order.orderId}</p>
                        <p>Fecha: {order.orderDate}</p>
                        <p>Monto: ${order.totalAmount}</p>
                        <p>Estado: 
                            <span className={order.status === 'entregado' ? 'status-delivered' : 'status-pending'}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                    <div className="order-products">
                        <h5>Productos:</h5>
                        {order.products.length === 0 ? (
                            <p>No hay productos en este pedido.</p>
                        ) : (
                            <ul>
                                {order.products.map(product => (
                                    <li key={product.orderProductId}>
                                        <p>ID Producto: {product.productId}</p>
                                        <p>Descripción: {product.productDescription}</p>
                                        <p>Cantidad: {product.quantity}</p>
                                        <p>Precio Unitario: ${product.unitPrice}</p>
                                        <p>Talle: {product.size}</p>
                                        <p>Color: {product.color}</p>
                                        <img src={`${backendUrl}/uploads/${product.img}`}  alt={product.productDescription} />
                                    </li>
                                ))}
                            </ul>
                        )}
                        </div>
                    </div>
                ))
            )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
