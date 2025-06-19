import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import ProductModal from './ProductModal';
import '../styles/ProductCard.css'; // Import the CSS file

// Loading component for modal
const ModalLoadingSpinner = () => {
  const { t } = useLanguage();
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductCard(props) {
  const { data } = props;
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const cartSound = new Audio('/cart-sound.mp3');

  const handleNavigateToDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    cartSound.play();
    dispatch(addToCart({
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.thumbnail,
      category: data.category
    }));
    
    const button = e.currentTarget;
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-circle me-1"></i>' + t('added');
    // Temporarily change classes for feedback, assuming btn-success is defined elsewhere or via Bootstrap
    button.classList.remove('product-card-add-btn'); 
    button.classList.add('btn-success');
    
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.classList.remove('btn-success');
      button.classList.add('product-card-add-btn');
    }, 1500);
  };
  
  function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    return stars;
  };

  // Construct class names dynamically
  const cardClassName = `product-card card h-100 ${isHovered ? 'hovered' : ''} ${darkMode ? 'dark-mode-card' : ''}`;
  const imageClassName = `product-card-image ${imageLoading ? 'image-loading' : ''}`;
  const stockBadgeClassName = `product-card-stock-badge ${data.stock > 0 ? 'stock-badge-in-stock' : 'stock-badge-out-of-stock'}`;
  const viewButtonClassName = `btn btn-outline-primary flex-fill product-card-btn product-card-view-btn`;
  const addButtonClassName = `btn flex-fill product-card-btn product-card-add-btn`;

  return (
    <>
      <div 
        className={cardClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="product-card-image-container"
          onClick={() => setShowModal(true)}
        >
          {imageLoading && (
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </div>
            </div>
          )}
          
          <div className="product-card-category-badge">
            {data.category}
          </div>
          
          <div className={stockBadgeClassName}>
            {data.stock > 0 ? t('inStock') : t('outOfStock')}
          </div>
          
          <img
            src={data.thumbnail}
            alt={data.title}
            className={imageClassName}
            onLoad={() => setImageLoading(false)}
          />
          
          {isHovered && (
             <div className="product-card-image-overlay">
                <div className="text-white text-center">
                <i className="bi bi-zoom-in fs-1 mb-2"></i>
                <p className="mb-0 fw-semibold">{t('quickView')}</p>
                </div>
            </div>
          )}
        </div>
        
        <div className="product-card-body">
          <h5 className="product-card-title" title={data.title}>
            {data.title}
          </h5>
          
          <p className="product-card-description">
            {data.description}
          </p>
          
          <div className="product-card-rating">
            <div className="d-flex">
              {renderStars(data.rating)}
            </div>
            <span className="text-muted small">({data.rating.toFixed(1)})</span>
          </div>
          
          <div className="product-card-price-section">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="product-card-price">${data.price}</span>
                {data.discountPercentage > 0 && (
                  <div>
                    <small className="product-card-original-price">
                      ${(data.price / (1 - data.discountPercentage / 100)).toFixed(2)}
                    </small>
                    <span className="badge bg-accent ms-2">
                      -{Math.round(data.discountPercentage)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="product-card-button-group">
            <button 
              className={viewButtonClassName}
              onClick={() => handleNavigateToDetails(data.id)}
            >
              <i className="bi bi-eye me-2"></i>
              {t('viewDetails')}
            </button>
            
            <button 
              className={addButtonClassName}
              disabled={data.stock === 0}
              onClick={handleAddToCart}
            >
              <i className={`bi ${data.stock === 0 ? 'bi-x-circle' : 'bi-cart-plus'} me-2`}></i>
              {data.stock === 0 ? t('outOfStock') : t('addToCart')}
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={<ModalLoadingSpinner />}>
        <ProductModal 
          product={data}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </Suspense>
    </>
  );
}
