import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    setShowLoginModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-shop fs-4 me-2 text-primary"></i>
            <span className="fw-bold">E-Shop</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/') || isActive('/products') ? 'active' : ''}`}
                  to="/products"
                >
                  Products
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <form className="d-flex" role="search">
                <div className="input-group">
                  <input 
                    className="form-control border-end-0 rounded-end-0" 
                    type="search" 
                    placeholder="Search products..." 
                  />
                  <button className="btn btn-primary rounded-start-0 border-0" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              <div className="vr"></div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={toggleTheme}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  <i className={`bi bi-${darkMode ? 'sun' : 'moon-stars'}`}></i>
                </button>

                <Link 
                  to="/cart" 
                  className="btn btn-outline-primary position-relative"
                >
                  <i className="bi bi-cart3"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </Link>

                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setShowLoginModal(true)}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <div className={`modal fade ${showLoginModal ? 'show' : ''}`} 
           style={{ display: showLoginModal ? 'block' : 'none' }}
           tabIndex="-1"
           aria-labelledby="loginModalLabel"
           aria-hidden={!showLoginModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" 
                      className="btn-close" 
                      onClick={() => setShowLoginModal(false)}
                      aria-label="Close"></button>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" 
                         className="form-control" 
                         id="email" 
                         placeholder="name@example.com" 
                         required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" 
                         className="form-control" 
                         id="password" 
                         placeholder="Enter your password" 
                         required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowLoginModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal Backdrop */}
      {showLoginModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowLoginModal(false)}></div>
      )}
    </>
  );
}
