import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosInstance from '../apis/config';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.images[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) return <div className="container mt-5">Loading...</div>;

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    brand,
    category,
    images,
    stock,
    sku
  } = product;

  const discountedPrice = (price - (price * discountPercentage) / 100).toFixed(2);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }

    if (halfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }

    while (stars.length < 5) {
      stars.push(<i key={`empty-${stars.length}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Images */}
        <div className="col-md-6 mb-4">
          <img src={mainImage} alt={title} className="img-fluid rounded mb-3 product-image" />
          <div className="d-flex gap-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className={`thumbnail rounded ${mainImage === img ? 'border border-primary' : ''}`}
                style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2>{title}</h2>
          <p className="text-muted">SKU: {sku}</p>

          <div className="mb-3">
            <span className="h4 me-2 text-primary">${discountedPrice}</span>
            <span className="text-muted"><s>${price.toFixed(2)}</s></span>
          </div>

          <div className="mb-3">
            {renderStars()}
            <span className="ms-2">{rating.toFixed(1)} ({product.reviews?.length || 0} reviews)</span>
          </div>

          <p className="mb-4">{description}</p>

          <p><strong>Brand:</strong> {brand}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Stock:</strong> {stock}</p>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control"
              min="1"
              max={stock}
              style={{ width: '100px' }}
            />
          </div>

          <button className="btn btn-primary btn-lg me-2">
            <i className="bi bi-cart-plus"></i> Add to Cart
          </button>
          <button className="btn btn-outline-secondary btn-lg">
            <i className="bi bi-heart"></i> Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
