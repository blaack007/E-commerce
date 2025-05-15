import React, { useState, useEffect } from 'react';
import axiosInstance from '../apis/config';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const limit = 12;

  const fetchProducts = async (skipValue) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = selectedCategory 
        ? `/products/category/${selectedCategory}`
        : '/products';

      const params = !selectedCategory ? { limit, skip: skipValue } : undefined;
      const response = await axiosInstance.get(endpoint, { params });
      
      setProducts((prev) => {
        if (skipValue === 0) return response.data.products;
        
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = response.data.products.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });

      // For category endpoints, we get all products at once
      // For the main endpoint, we check if we received a full page
      setHasMore(
        selectedCategory 
          ? false 
          : response.data.products.length === limit
      );
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
    fetchProducts(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (skip > 0 && !selectedCategory) {
      fetchProducts(skip);
    }
  }, [skip, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore || selectedCategory) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        setSkip((prevSkip) => prevSkip + limit);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, selectedCategory, loading]);

  const handleCategorySelect = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3 mb-4">
          <Sidebar 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="col-md-9">
          <h2>
            {selectedCategory 
              ? selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
              : 'All Products'
            }
          </h2>
          <hr />
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard data={product} />
              </div>
            ))}
          </div>
          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!hasMore && !loading && products.length > 0 && (
            <p className="text-center mt-4">No more products to load</p>
          )}
          {!loading && products.length === 0 && !error && (
            <p className="text-center mt-4">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
