import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductModal({ product, show, onClose }) {
  const dispatch = useDispatch();

  if (!show || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('modal-backdrop')) {
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

  return (
    <>
      <div className="modal fade show" 
           style={{ display: 'block' }}
           tabIndex="-1"
           onClick={handleBackdropClick}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Product Images */}
                <div className="col-md-6 mb-3">
                  <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {images.map((image, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
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
                        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <span className="h3 text-primary me-2">${discountedPrice}</span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-muted text-decoration-line-through">${price.toFixed(2)}</span>
                        <span className="badge bg-danger ms-2">-{discountPercentage}%</span>
                      </>
                    )}
                  </div>

                  <div className="mb-3">
                    {renderStars()}
                    <span className="ms-2 text-muted">({rating.toFixed(1)})</span>
                  </div>

                  <p className="text-muted mb-3">{description}</p>

                  <div className="row mb-3">
                    <div className="col-6">
                      <p className="mb-1"><strong>Brand:</strong></p>
                      <p className="text-muted">{brand}</p>
                    </div>
                    <div className="col-6">
                      <p className="mb-1"><strong>Category:</strong></p>
                      <p className="text-muted">{category}</p>
                    </div>
                    <div className="col-12">
                      <p className="mb-1"><strong>Availability:</strong></p>
                      <p>
                        <span className={`badge ${stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
} 