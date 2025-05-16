import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* 404 Illustration */}
          <img 
            src="https://illustrations.popsy.co/white/resistance-band.svg" 
            alt="404 Not Found"
            className="img-fluid mb-4"
            style={{ maxHeight: '300px' }}
          />
          
          {/* Error Message */}
          <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
          <h2 className="h3 mb-4">Oops! Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>

          {/* Navigation Options */}
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-house-door me-2"></i>
              Go Home
            </Link>
            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-shop me-2"></i>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
