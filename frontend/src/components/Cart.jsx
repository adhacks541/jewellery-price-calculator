import React, { useState, useEffect } from 'react';
import '../App.css';

const Cart = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setItems(cart);
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    const clearCart = () => {
        localStorage.removeItem('cart');
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price.totalPrice, 0);

    return (
        <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {items.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} />
                                <div className="cart-details">
                                    <h3>{item.product.name}</h3>
                                    <p>{item.product.type === 'gold' ? `${item.details.weight}g | ${item.details.purity}K` : `${item.details.weight} Carat`}</p>
                                    <p className="price">{formatCurrency(item.price.totalPrice)}</p>
                                    <small className="breakdown-link" onClick={() => alert(JSON.stringify(item.price, null, 2))}>View Breakdown</small>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: {formatCurrency(total)}</h3>
                        <button className="checkout-btn" onClick={clearCart}>Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
