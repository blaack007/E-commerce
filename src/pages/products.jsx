import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../apis/config';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 20;

  // Get category from URL params
  const selectedCategory = searchParams.get('category');

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

  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
  }, [selectedCategory, searchParams.get('search')]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products';
        const searchQuery = searchParams.get('search');
        
        if (selectedCategory) {
          url = `/products/category/${selectedCategory}`;
        } else if (searchQuery) {
          url = `/products/search?q=${searchQuery}`;
        }

        const params = !selectedCategory ? { limit, skip } : undefined;
        const response = await axiosInstance.get(url, { params });
        
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
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [skip, selectedCategory, searchParams]);

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
                ? formatCategoryName(selectedCategory)
                : searchParams.get('search')
                  ? `Search Results for "${searchParams.get('search')}"`
                  : 'All Products'
              }
            </h4>
            {(selectedCategory || searchParams.get('search')) && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClearFilters}
              >
                <i className="bi bi-x-lg me-1"></i>
                Clear Filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <h3 className="mt-3">No Products Found</h3>
              <p className="text-muted">
                We couldn't find any products matching your criteria.
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
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
