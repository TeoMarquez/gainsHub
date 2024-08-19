// src/components/OrderDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = ({ orders, updateOrder }) => {
    const { orderId } = useParams();
    const order = orders.find(o => o.id === parseInt(orderId));
    
    const [selectedItems, setSelectedItems] = useState(order.items);

    const handleColorChange = (itemId, color) => {
        setSelectedItems(items =>
            items.map(item =>
                item.id === itemId ? { ...item, color } : item
            )
        );
    };

    const handleSizeChange = (itemId, size) => {
        setSelectedItems(items =>
            items.map(item =>
                item.id === itemId ? { ...item, size } : item
            )
        );
    };

    const handleSave = () => {
        updateOrder(order.id, selectedItems);
        alert('Pedido modificado correctamente.');
    };

    return (
        <div>
            <h2>Modificar Pedido</h2>
            {selectedItems.map(item => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <div>
                        <label>Color:</label>
                        {item.availableColors.map(color => (
                            <button key={color} onClick={() => handleColorChange(item.id, color)}>
                                {color}
                            </button>
                        ))}
                    </div>
                    <div>
                        <label>Talla:</label>
                        {item.availableSizes.map(size => (
                            <button key={size} onClick={() => handleSizeChange(item.id, size)}>
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <button onClick={handleSave}>Guardar Cambios</button>
        </div>
    );
};

export default OrderDetail;
