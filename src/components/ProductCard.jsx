import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import ProductModal from './ProductModal';

export default function ProductCard(props) {
  const { data } = props;
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const handleNavigateToDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.thumbnail,
      category: data.category
    }));
  };
  
  function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <>
      <div className="card h-100 border-opacity-25">
        <div 
          className="position-relative" 
          style={{ height: '280px', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          {imageLoading && (
            <div className={`position-absolute w-100 h-100 d-flex justify-content-center align-items-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-10">
            <img
              src={data.thumbnail}
              className={`${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              alt={data.title}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '1rem',
                transition: 'all 0.3s ease-in-out',
                transform: 'scale(0.95)'
              }}
              onLoad={() => setImageLoading(false)}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(0.95)'}
            />
          </div>
          {/* Stock Status Badge */}
          <div className="position-absolute top-0 end-0 m-2">
            <span className={`badge ${data.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {data.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate" title={data.title}>{data.title}</h5>
          <p className="card-text flex-grow-1 text-opacity-75" style={{
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{data.description}</p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span className="h5 mb-0 text-primary">${data.price}</span>
                {data.discountPercentage > 0 && (
                  <small className="text-muted ms-2">
                    <s>${(data.price / (1 - data.discountPercentage / 100)).toFixed(2)}</s>
                  </small>
                )}
              </div>
              <div>
                {renderStars(data.rating)}
                <small className="text-muted ms-1">({data.rating.toFixed(1)})</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary btn-sm flex-grow-1"
                onClick={() => handleNavigateToDetails(data.id)}
              >
                <i className="bi bi-eye me-1"></i>
                View Details
              </button>
              <button 
                className={`btn btn-primary btn-sm flex-grow-1 ${data.stock === 0 ? 'disabled' : ''}`}
                disabled={data.stock === 0}
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-1"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal 
        product={data}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
