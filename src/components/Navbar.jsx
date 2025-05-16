import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserCart } from '../store/slices/cartSlice';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleTheme } = useTheme();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      dispatch(loadUserCart(userData.username));
    }
  }, [dispatch]);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    dispatch(loadUserCart(null)); // Clear cart in Redux state
    navigate('/products');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user by username
    const user = users.find(u => u.username === formData.username);
    
    if (!user) {
      setErrors(prev => ({
        ...prev,
        general: 'Invalid username or password'
      }));
      return;
    }

    // Validate password
    if (user.password !== formData.password) {
      setErrors(prev => ({
        ...prev,
        general: 'Invalid username or password'
      }));
      return;
    }

    // Login successful
    const userData = {
      email: user.email,
      name: user.name,
      username: user.username
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    
    // Load user's cart
    dispatch(loadUserCart(userData.username));
    
    // Clear form and close modal
    setFormData({ username: '', password: '' });
    setErrors({ username: '', password: '', general: '' });
    setShowLoginModal(false);
    
    // Show success message and redirect
    alert('Login successful!');
    navigate('/products');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-white">
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
              <form className="d-flex" role="search" onSubmit={handleSearch}>
                <div className="input-group">
                  <input 
                    className="form-control border-end-0 rounded-end-0" 
                    type="search" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-start-0" type="submit">
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
                    {totalQuantity || 0}
                  </span>
                </Link>

                {currentUser ? (
                  <div className="user-dropdown position-relative">
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center gap-2"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>{currentUser.name}</span>
                      <i className="bi bi-chevron-down"></i>
                    </button>
                    {showDropdown && (
                      <div className="position-absolute top-100 end-0 mt-1 py-2 bg-white rounded-3 shadow" style={{ minWidth: '200px', zIndex: 1000 }}>
                        <div className="px-3 py-2 text-muted small border-bottom">
                          Signed in as<br />
                          <strong>{currentUser.email}</strong>
                        </div>
                        <button 
                          className="dropdown-item d-flex align-items-center gap-2 text-danger px-3 py-2"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setShowLoginModal(true)}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      Login
                    </button>

                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-person-plus me-1"></i>
                      Register
                    </Link>
                  </>
                )}
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
                {errors.general && (
                  <div className="alert alert-danger" role="alert">
                    {errors.general}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" 
                         className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                         id="username"
                         name="username"
                         value={formData.username}
                         onChange={handleChange}
                         placeholder="Enter your username"
                         required />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" 
                         className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                         id="password"
                         name="password"
                         value={formData.password}
                         onChange={handleChange}
                         placeholder="Enter your password"
                         required />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
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
