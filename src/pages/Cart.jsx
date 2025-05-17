import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Cart = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
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

  const getCategoryTranslationKey = (category) => {
    return `category${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
  };

  return (
    <div className="container py-5">
      <h1 className="mb-5">{t('cart')}</h1>
      <div className="row">
        <div className="col-lg-8">
          <div className="card-body">
            {items.length === 0 ? (
              <div className="text-center py-4">
                <h5>{t('emptyCart')}</h5>
                <p className="text-muted">{t('emptyCart')}</p>
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
                      <p className="text-muted">{t('category')}: {t(getCategoryTranslationKey(item.category))}</p>
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
                        <i className="bi bi-trash"></i> {t('remove')}
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
              <i className="bi bi-arrow-left me-2"></i>{t('allProducts')}
            </Link>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">{t('checkout')}</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>{t('subtotal')}</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>{t('shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>{t('tax')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>{t('total')}</strong>
                <strong>${(totalAmount + shipping + tax).toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary w-100" disabled={items.length === 0}>
                {t('checkout')}
              </button>
            </div>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">{t('promoCode')}</h5>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder={t('enterPromoCode')} />
                <button className="btn btn-outline-secondary" type="button">{t('apply')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 