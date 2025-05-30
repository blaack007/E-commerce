import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../apis/config';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const limit = 20;

  // Get category from URL params
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip(prevSkip => prevSkip + limit);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const getCategoryTranslationKey = (category) => {
    return `category${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
  };

  const handleCategorySelect = (category) => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    
    // Update URL params
    const currentParams = new URLSearchParams(searchParams);
    if (category) {
      currentParams.set('category', category);
      currentParams.delete('search'); // Clear search when selecting category
    } else {
      currentParams.delete('category');
    }
    setSearchParams(currentParams);
  };

  const handleClearFilters = () => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    setSearchParams({}); // Clear all params
  };

  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products';
        
        if (selectedCategory) {
          url = `/products/category/${selectedCategory}`;
        } else if (searchQuery) {
          url = `/products/search?q=${searchQuery}`;
        }

        const params = !selectedCategory ? { limit, skip } : undefined;
        const response = await axiosInstance.get(url, { params });
        
        // Check if response.data and response.data.products exist
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(prev => {
            if (skip === 0) return response.data.products;
            const newProducts = response.data.products.filter(
              newProduct => !prev.some(p => p.id === newProduct.id)
            );
            return [...prev, ...newProducts];
          });

          setHasMore(
            selectedCategory 
              ? false 
              : response.data.products.length === limit
          );
        } else {
          console.error('Invalid response format:', response.data);
          setProducts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [skip, selectedCategory, searchQuery]);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <Sidebar 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              {selectedCategory 
                ? t(getCategoryTranslationKey(selectedCategory))
                : searchQuery
                  ? `${t('searchResultsFor')} "${searchQuery}"`
                  : t('allProducts')
              }
            </h4>
            {(selectedCategory || searchQuery) && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClearFilters}
              >
                <i className="bi bi-x-lg me-1"></i>
                {t('clearFilter')}
              </button>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <h3 className="mt-3">{t('noProductsFound')}</h3>
              <p className="text-muted">
                {t('noProductsFoundDesc')}
              </p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="col"
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <ProductCard data={product} />
                </div>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
