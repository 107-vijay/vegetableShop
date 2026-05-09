import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customer, setCustomer] = useState({ name: '', address: '' });

  useEffect(() => {
    // Fetch products from backend
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleOrder = (e) => {
    e.preventDefault();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    const orderData = {
      items: cart,
      total: total,
      customerName: customer.name,
      address: customer.address
    };

    axios.post('http://localhost:5000/api/orders', orderData)
      .then(() => {
        alert("Order Placed Successfully!");
        setCart([]);
        setShowCheckout(false);
      })
      .catch(err => alert("Error placing order"));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>GreenBasket</h1>
        <div className="cart-status" onClick={() => setShowCheckout(!showCheckout)}>
          🛒 Cart ({cart.length})
        </div>
      </nav>

      {!showCheckout ? (
        <div className="product-container">
          <h2>Fresh Vegetables</h2>
          <div className="product-grid">
            {products.length > 0 ? products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">{product.image}</div>
                <h3>{product.name}</h3>
                <p>₹{product.price} / {product.unit}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            )) : <p>Loading products... (Make sure to add some to your MongoDB collection)</p>}
          </div>
        </div>
      ) : (
        <div className="checkout-container">
          <h2>Checkout</h2>
          <div className="checkout-flex">
            <div className="cart-summary">
              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">{item.name} - ₹{item.price}</div>
              ))}
              <hr />
              <strong>Total: ₹{cart.reduce((s, i) => s + i.price, 0)}</strong>
            </div>
            <form onSubmit={handleOrder} className="checkout-form">
              <input 
                type="text" placeholder="Your Name" required 
                onChange={e => setCustomer({...customer, name: e.target.value})} 
              />
              <textarea 
                placeholder="Delivery Address" required 
                onChange={e => setCustomer({...customer, address: e.target.value})}
              />
              <button type="submit">Confirm Order</button>
              <button type="button" className="secondary" onClick={() => setShowCheckout(false)}>Back to Shop</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
