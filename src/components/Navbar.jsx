import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import { useLanguage } from '../context/LanguageContext';
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
  const { language, toggleLanguage, t } = useLanguage();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
      if (!event.target.closest('.lang-dropdown')) {
        setShowLangDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg shadow-sm sticky-top ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'}`}>
        <div className="container">
          <Link className={`navbar-brand d-flex align-items-center ${darkMode ? 'text-light' : ''}`} to="/">
            <i className="bi bi-shop fs-4 me-2 text-primary"></i>
            <span className="fw-bold">E-Shop</span>
          </Link>
          
          <button 
            className={`navbar-toggler ${darkMode ? 'border-light' : ''}`}
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
                  {t('products')}
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <form className="d-flex" role="search" onSubmit={handleSearch}>
                <div className="input-group">
                  <input 
                    className={`form-control ${darkMode ? 'bg-dark text-light border-dark' : ''}`}
                    type="search" 
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              <div className="vr"></div>

              <div className="d-flex gap-2">
                <div className="lang-dropdown position-relative">
                  <button
                    className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                  >
                    <i className="bi bi-globe"></i>
                    <span className="text-uppercase">{language}</span>
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  {showLangDropdown && (
                    <div className={`position-absolute top-100 end-0 mt-1 py-2 rounded-3 shadow ${darkMode ? 'bg-dark' : 'bg-white'}`} style={{ minWidth: '120px', zIndex: 1000 }}>
                      <button
                        className={`dropdown-item d-flex align-items-center gap-2 px-3 py-2 ${language === 'en' ? 'active' : ''}`}
                        onClick={() => {
                          toggleLanguage('en');
                          setShowLangDropdown(false);
                        }}
                      >
                        <span className="text-uppercase">EN</span>
                        {language === 'en' && <i className="bi bi-check2 ms-auto"></i>}
                      </button>
                      <button
                        className={`dropdown-item d-flex align-items-center gap-2 px-3 py-2 ${language === 'ar' ? 'active' : ''}`}
                        onClick={() => {
                          toggleLanguage('ar');
                          setShowLangDropdown(false);
                        }}
                      >
                        <span className="text-uppercase">AR</span>
                        {language === 'ar' && <i className="bi bi-check2 ms-auto"></i>}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                  onClick={toggleTheme}
                  title={darkMode ? t('lightMode') : t('darkMode')}
                >
                  <i className={`bi bi-${darkMode ? 'sun' : 'moon-stars'}`}></i>
                </button>

                <Link 
                  to="/cart" 
                  className={`btn position-relative ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                  title={t('cart')}
                >
                  <i className="bi bi-cart3"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalQuantity || 0}
                  </span>
                </Link>

                {currentUser ? (
                  <div className="user-dropdown position-relative">
                    <button 
                      className={`btn d-flex align-items-center gap-2 ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>{currentUser.name}</span>
                      <i className="bi bi-chevron-down"></i>
                    </button>
                    {showDropdown && (
                      <div className={`position-absolute top-100 end-0 mt-1 py-2 rounded-3 shadow ${darkMode ? 'bg-dark' : 'bg-white'}`} style={{ minWidth: '200px', zIndex: 1000 }}>
                        <div className={`px-3 py-2 border-bottom ${darkMode ? 'text-light border-secondary' : 'text-muted'} small`}>
                          {t('signedInAs')}<br />
                          <strong>{currentUser.email}</strong>
                        </div>
                        <button 
                          className="dropdown-item d-flex align-items-center gap-2 text-danger px-3 py-2"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button 
                      className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                      onClick={() => setShowLoginModal(true)}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {t('login')}
                    </button>

                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-person-plus me-1"></i>
                      {t('register')}
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
          <div className={`modal-content ${darkMode ? 'bg-dark text-light' : ''}`}>
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">{t('login')}</h5>
              <button type="button" 
                      className={`btn-close ${darkMode ? 'btn-close-white' : ''}`}
                      onClick={() => setShowLoginModal(false)}
                      aria-label={t('close')}></button>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-body">
                {errors.general && (
                  <div className="alert alert-danger" role="alert">
                    {t('invalidCredentials')}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">{t('username')}</label>
                  <input type="text" 
                         className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.username ? 'is-invalid' : ''}`}
                         id="username"
                         name="username"
                         value={formData.username}
                         onChange={handleChange}
                         placeholder={t('enterUsername')}
                         required />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{t('password')}</label>
                  <input type="password" 
                         className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.password ? 'is-invalid' : ''}`}
                         id="password"
                         name="password"
                         value={formData.password}
                         onChange={handleChange}
                         placeholder={t('enterPassword')}
                         required />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" 
                        className={`btn ${darkMode ? 'btn-outline-light' : 'btn-secondary'}`}
                        onClick={() => setShowLoginModal(false)}>
                  {t('close')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('login')}
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
