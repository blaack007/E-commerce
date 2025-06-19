import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import axiosInstance from '../apis/config';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const cartSound = new Audio('/cart-sound.mp3');

  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.thumbnail);
      })
      .catch((err) => {
        console.log(err);
        navigate('/404');
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    cartSound.play();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      quantity: parseInt(quantity)
    }));
  };

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    brand,
    category,
    images,
    stock
  } = product;

  const discountedPrice = (price - (price * discountPercentage) / 100).toFixed(2);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

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

  const getCategoryTranslationKey = (category) => {
    return `category${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
  };

  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">{t('allProducts')}</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">{t('products')}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{title}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6 mb-4">
          <div className="card border-0">
            <div className="card-body">
              <img 
                src={mainImage} 
                alt={title} 
                className="img-fluid rounded mb-3" 
                style={{ width: '100%', height: '400px', objectFit: 'contain' }}
              />
              <div className="d-flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${title} - Image ${idx + 1}`}
                    className={`thumbnail rounded cursor-pointer ${mainImage === img ? 'border border-primary' : 'border'}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="card border-0">
            <div className="card-body">
              <h2 className="mb-3">{title}</h2>
              
              <div className="mb-3">
                <span className="h3 text-primary me-2">${discountedPrice}</span>
                {discountPercentage > 0 && (
                  <>
                    <span className="text-muted text-decoration-line-through">${price.toFixed(2)}</span>
                    <span className="badge bg-danger ms-2">-{discountPercentage}%</span>
                  </>
                )}
              </div>

              <div className="mb-4">
                {renderStars()}
                <span className="ms-2 text-muted">({rating.toFixed(1)} {t('rating')})</span>
              </div>

              <p className="mb-4">{description}</p>

              <div className="row mb-4">
                <div className="col-6">
                  <p className="mb-1"><strong>{t('brand')}:</strong></p>
                  <p className="text-muted">{brand}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1"><strong>{t('category')}:</strong></p>
                  <p className="text-muted">{t(getCategoryTranslationKey(category))}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1"><strong>{t('availability')}:</strong></p>
                  <p>
                    <span className={`badge ${stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {stock > 0 ? `${t('inStock')} (${stock})` : t('outOfStock')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="form-label">{t('quantity')}:</label>
                <div className="input-group" style={{ width: '140px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= stock) {
                        setQuantity(value);
                      }
                    }}
                    className="form-control text-center"
                    min="1"
                    max={stock}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => quantity < stock && setQuantity(q => q + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
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
      </div>
    </div>
  );
}
