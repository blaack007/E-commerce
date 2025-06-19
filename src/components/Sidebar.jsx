import React, { useState, useEffect } from 'react';
import axiosInstance from '../apis/config';
import { useTheme } from '../context/useTheme';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Sidebar.css';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    axiosInstance
      .get('/products/category-list')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="sidebar-content-wrapper-ltr card shadow-sm border-0">
      <div className={`card-header py-3`}>
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i>
          {t('categories')}
        </h5>
      </div>
      <div className="sidebar-list-group list-group list-group-flush">
        <button
          className={`list-group-item d-flex align-items-center gap-2 ${!selectedCategory ? 'active fw-bold' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <i className="bi bi-collection"></i>
          {t('allProducts')}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`list-group-item d-flex align-items-center gap-2 ${selectedCategory === category ? 'active fw-bold' : ''}`}
            onClick={() => onCategorySelect(category)}
          >
            <i className={`bi bi-${getCategoryIcon(category)}`}></i>
            {t(`category${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`)}
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