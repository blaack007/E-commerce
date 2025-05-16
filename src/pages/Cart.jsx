import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const shipping = 10.00;
  const tax = totalAmount * 0.1; // 10% tax

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="container py-5">
      <h1 className="mb-5">Your Shopping Cart</h1>
      <div className="row">
        <div className="col-lg-8">
          <div className="card-body">
            {items.length === 0 ? (
              <div className="text-center py-4">
                <h5>Your cart is empty</h5>
                <p className="text-muted">Add items to your cart to see them here.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id}>
                  <div className="row cart-item mb-3">
                    <div className="col-md-3">
                      <img src={item.image} alt={item.title} className="img-fluid rounded" />
                    </div>
                    <div className="col-md-5">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="text-muted">Category: {item.category}</p>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <button 
                          className="btn btn-outline-secondary btn-sm" 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          style={{maxWidth: "100px"}}
                          type="text" 
                          className="form-control form-control-sm text-center quantity-input" 
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm" 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <p className="fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
          <div className="text-start mb-4">
            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>${(totalAmount + shipping + tax).toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary w-100" disabled={items.length === 0}>
                Proceed to Checkout
              </button>
            </div>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Apply Promo Code</h5>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Enter promo code" />
                <button className="btn btn-outline-secondary" type="button">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 