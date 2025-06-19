import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../apis/config';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import { useLanguage } from '../context/LanguageContext';

// Loading skeleton component
const ProductSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-line" style={{ height: '24px', marginBottom: '1rem' }}></div>
    <div className="skeleton-line" style={{ height: '16px', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-line" style={{ height: '16px', width: '60%', marginBottom: '1rem' }}></div>
    <div className="skeleton-line" style={{ height: '32px', width: '40%' }}></div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalResults, setTotalResults] = useState(0);
  const { t } = useLanguage();
  const limit = 20;

  // Get parameters from URL
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const sortBy = searchParams.get('sort') || 'title';
  const sortOrder = searchParams.get('order') || 'asc';

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
    
    const currentParams = new URLSearchParams(searchParams);
    if (category) {
      currentParams.set('category', category);
      currentParams.delete('search');
    } else {
      currentParams.delete('category');
    }
    setSearchParams(currentParams);
  };

  const handleSortChange = (newSort, newOrder) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('sort', newSort);
    currentParams.set('order', newOrder);
    setSearchParams(currentParams);
    
    setProducts([]);
    setSkip(0);
    setHasMore(true);
  };

  const handleClearFilters = () => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    setSearchParams({});
  };

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCategory) {
      filters.push({
        type: 'category',
        value: selectedCategory,
        label: t(getCategoryTranslationKey(selectedCategory))
      });
    }
    if (searchQuery) {
      filters.push({
        type: 'search',
        value: searchQuery,
        label: `"${searchQuery}"`
      });
    }
    return filters;
  };

  const removeFilter = (filterType) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete(filterType);
    setSearchParams(currentParams);
    
    setProducts([]);
    setSkip(0);
    setHasMore(true);
  };

  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
  }, [selectedCategory, searchQuery, sortBy, sortOrder]);

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

        const params = {
          limit,
          skip,
          sortBy,
          order: sortOrder
        };

        const response = await axiosInstance.get(url, { params });
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(prev => {
            if (skip === 0) return response.data.products;
            const newProducts = response.data.products.filter(
              newProduct => !prev.some(p => p.id === newProduct.id)
            );
            return [...prev, ...newProducts];
          });

          setTotalResults(response.data.total || response.data.products.length);
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
  }, [skip, selectedCategory, searchQuery, sortBy, sortOrder]);

  const activeFilters = getActiveFilters();

  return (
    <div className="content-container products-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="page-title">
              {selectedCategory 
                ? t(getCategoryTranslationKey(selectedCategory))
                : searchQuery
                  ? t('searchResults')
                  : t('allProducts')
              }
            </h1>
            <p className="page-subtitle">
              {searchQuery 
                ? `${t('searchResultsFor')} "${searchQuery}"`
                : t('')
              }
            </p>
          </div>
          
          {/* Sort Controls */}
          <div className="d-flex gap-2 align-items-center">
            <select 
              className="eshop-form-select eshop-form-select-sm"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                handleSortChange(sort, order);
              }}
            >
              <option value="title-asc">{t('Name: A-Z')}</option>
              <option value="title-desc">{t('Name: Z-A')}</option>
              <option value="price-asc">{t('Price: Low-High')}</option>
              <option value="price-desc">{t('Price: High-Low')}</option>
              <option value="rating-desc">{t('Rating')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {(activeFilters.length > 0 || totalResults > 0) && (
        <div className="filter-bar">
          <div className="filter-info">
            {totalResults > 0 && (
              <span className="results-count">
                {totalResults} {t('productsFound')}
              </span>
            )}
            
            {activeFilters.length > 0 && (
              <div className="active-filters">
                <br></br>
                {activeFilters.map((filter, index) => (
                  <span key={index} className="filter-tag">
                    {filter.label}
                    <button 
                      onClick={() => removeFilter(filter.type)}
                      aria-label={`Remove ${filter.label} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {activeFilters.length > 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClearFilters}
            >
              <i className="bi bi-x-lg me-1"></i>
              {t('clearAllFilters')}
            </button>
          )}
        </div>
      )}

      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="products-sidebar">
            <Sidebar 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 products-main">
          {/* Products Grid */}
          {products.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="bi bi-inbox"></i>
              </div>
              <h3 className="empty-state-title">{t('noProductsFound')}</h3>
              <p className="empty-state-text">
                {t('noProductsFoundDesc')}
              </p>
              {activeFilters.length > 0 && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleClearFilters}
                >
                  {t('clearFiltersAndTryAgain')}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    ref={index === products.length - 1 ? lastProductRef : null}
                  >
                    <ProductCard data={product} />
                  </div>
                ))}
                
                {/* Loading skeletons */}
                {loading && skip === 0 && (
                  Array.from({ length: 6 }).map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                  ))
                )}
              </div>

              {/* Infinite scroll loading indicator */}
              {loading && skip > 0 && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                  </div>
                  <p className="mt-2 text-muted">{t('loadingMoreProducts')}</p>
                </div>
              )}

              {/* End of results indicator */}
              {!hasMore && products.length > 0 && (
                <div className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-check-circle me-2"></i>
                    {t('allProductsLoaded')}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}