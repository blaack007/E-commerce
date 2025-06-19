import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import '../styles/ProductModal.css';

export default function ProductModal({ product, show, onClose }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const cartSound = new Audio('/cart-sound.mp3');

  if (!show || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('eshop-modal-container') || e.target.classList.contains('eshop-modal-backdrop')) {
      onClose();
    }
  };

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    brand,
    category,
    stock,
    images
  } = product;

  const discountedPrice = (price - (price * discountPercentage) / 100).toFixed(2);

  const handleAddToCart = () => {
    cartSound.play();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      quantity: 1
    }));
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill eshop-text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half eshop-text-warning"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star eshop-text-warning"></i>);
    }

    return stars;
  };

  const getCategoryTranslationKey = (category) => {
    return `category${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
  };

  const modalContent = (
    <>
      <div className="eshop-modal-container fade show" 
           tabIndex="-1"
           onClick={handleBackdropClick}>
        <div className="eshop-modal-dialog modal-dialog modal-lg">
          <div className="eshop-modal-content">
            <div className="eshop-modal-header">
              <h5 className="eshop-modal-title">{title}</h5>
              <button 
                type="button" 
                className="eshop-btn-close" 
                onClick={onClose}
                aria-label={t('close')}
              ></button>
            </div>
            <div className="eshop-modal-body">
              <div className="row">
                {/* Product Images */}
                <div className="col-md-6 mb-3">
                  <div id="productCarousel" className="eshop-carousel carousel slide" data-bs-ride="carousel">
                    <div className="eshop-carousel-inner carousel-inner">
                      {images.map((image, index) => (
                        <div key={index} className={`eshop-carousel-item carousel-item ${index === 0 ? 'active' : ''}`}>
                          <img 
                            src={image} 
                            className="d-block w-100 rounded" 
                            alt={`${title} - ${index + 1}`}
                            style={{ 
                              height: '300px', 
                              objectFit: 'contain',
                              transition: 'transform 0.3s ease-in-out',
                              transform: 'scale(0.95)',
                              cursor: 'zoom-in'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(0.95)'}
                          />
                        </div>
                      ))}
                    </div>
                    {images.length > 1 && (
                      <>
                        <button className="eshop-carousel-control-prev carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                          <span className="eshop-carousel-control-prev-icon carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">{t('previous')}</span>
                        </button>
                        <button className="eshop-carousel-control-next carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                          <span className="eshop-carousel-control-next-icon carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">{t('next')}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <span className="h3 eshop-text-primary me-2">${discountedPrice}</span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="eshop-text-muted text-decoration-line-through">${price.toFixed(2)}</span>
                        <span className="eshop-badge eshop-badge-error ms-2">-{discountPercentage}%</span>
                      </>
                    )}
                  </div>

                  <div className="mb-3">
                    {renderStars()}
                    <span className="ms-2 eshop-text-muted">({rating.toFixed(1)})</span>
                  </div>

                  <p className="eshop-text-muted mb-3">{description}</p>

                  <div className="row mb-3">
                    <div className="col-6">
                      <p className="mb-1"><strong>{t('brand')}:</strong></p>
                      <p className="eshop-text-muted">{brand}</p>
                    </div>
                    <div className="col-6">
                      <p className="mb-1"><strong>{t('category')}:</strong></p>
                      <p className="eshop-text-muted">{t(getCategoryTranslationKey(category))}</p>
                    </div>
                    <div className="col-12">
                      <p className="mb-1"><strong>{t('availability')}:</strong></p>
                      <p>
                        <span className={`eshop-badge ${stock > 0 ? 'eshop-badge-success' : 'eshop-badge-error'}`}>
                          {stock > 0 ? `${t('inStock')} (${stock})` : t('outOfStock')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="eshop-modal-footer">
              <button 
                type="button" 
                className="eshop-btn eshop-btn-secondary" 
                onClick={onClose}
              >
                {t('close')}
              </button>
              <button 
                type="button" 
                className="eshop-btn eshop-btn-primary"
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {t('addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="eshop-modal-backdrop fade show" onClick={onClose}></div>
    </>
  );

  const modalRoot = document.getElementById('modal-root') || document.body;

  return ReactDOM.createPortal(modalContent, modalRoot);
}