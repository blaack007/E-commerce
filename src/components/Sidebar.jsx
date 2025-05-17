import React, { useState, useEffect } from 'react';
import axiosInstance from '../apis/config';
import { useTheme } from '../context/useTheme';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    axiosInstance
      .get('/products/category-list')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCategoryName = (category) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="placeholder-glow">
            <div className="placeholder col-12 mb-2" style={{ height: '2rem' }}></div>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="placeholder col-12 mb-2" style={{ height: '1.5rem' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className={`card-header border-bottom border-2 py-3 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i>
          Categories
        </h5>
      </div>
      <div className="list-group list-group-flush">
        <button
          className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${!selectedCategory ? 'active fw-bold' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <i className="bi bi-collection"></i>
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${selectedCategory === category ? 'active fw-bold' : ''}`}
            onClick={() => onCategorySelect(category)}
          >
            <i className={`bi bi-${getCategoryIcon(category)}`}></i>
            {formatCategoryName(category)}
          </button>
        ))}
      </div>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'smartphones': 'phone',
    'laptops': 'laptop',
    'fragrances': 'droplet',
    'skincare': 'moisture',
    'groceries': 'cart4',
    'home-decoration': 'house-heart',
    'furniture': 'lamp',
    'tops': 'tshirt',
    'womens-dresses': 'gender-female',
    'womens-shoes': 'boot',
    'mens-shirts': 'gender-male',
    'mens-shoes': 'boot',
    'mens-watches': 'watch',
    'womens-watches': 'watch',
    'womens-bags': 'handbag',
    'womens-jewellery': 'gem',
    'sunglasses': 'sunglasses',
    'automotive': 'car-front',
    'motorcycle': 'bicycle',
    'lighting': 'lightbulb'
  };

  return icons[category] || 'tag';
} 