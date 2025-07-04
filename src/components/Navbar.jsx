import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserCart } from '../store/slices/cartSlice';
import '../styles/Navbar.css'; // Import the Navbar CSS file

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    dispatch(loadUserCart(null)); // Clear cart in Redux state
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
      if (!event.target.closest('.eshop-user-dropdown')) {
        setShowDropdown(false);
      }
      if (!event.target.closest('.eshop-lang-dropdown')) {
        setShowLangDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`navbar main-header navbar-expand-lg shadow-sm sticky-top`}>
        <div className="container">
          <Link className={`navbar-brand d-flex align-items-center`} to="/">
            <i className="bi bi-shop fs-4 me-2 eshop-text-primary"></i>
            <span className="fw-bold">E-Shop</span>
          </Link>
          
          <button 
            className={`eshop-navbar-toggler navbar-toggler`}
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="eshop-navbar-toggler-icon navbar-toggler-icon"></span>
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
                    className={`eshop-form-control eshop-navbar-search-input`}
                    type="search" 
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="eshop-btn eshop-btn-primary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              <div className="vr"></div>

              <div className="d-flex gap-2">
                <div className="eshop-lang-dropdown lang-dropdown position-relative">
                  <button
                    className={`eshop-btn eshop-btn-navbar-action`}
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                  >
                    <i className="bi bi-globe"></i>
                    <span className="text-uppercase">{language}</span>
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  {showLangDropdown && (
                    <div className={`eshop-dropdown-menu eshop-navbar-dropdown-menu lang-dropdown-menu position-absolute top-100 end-0 mt-1 py-2 rounded-3 shadow`} style={{ minWidth: '120px', zIndex: 1000 }}>
                      <button
                        className={`eshop-dropdown-item d-flex align-items-center gap-2 px-3 py-2 ${language === 'en' ? 'active' : ''}`}
                        onClick={() => {
                          toggleLanguage('en');
                          setShowLangDropdown(false);
                        }}
                      >
                        <span className="text-uppercase">EN</span>
                        {language === 'en' && <i className="bi bi-check2 ms-auto"></i>}
                      </button>
                      <button
                        className={`eshop-dropdown-item d-flex align-items-center gap-2 px-3 py-2 ${language === 'ar' ? 'active' : ''}`}
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
                  className={`eshop-btn eshop-btn-navbar-action`}
                  onClick={toggleTheme}
                  title={darkMode ? t('lightMode') : t('darkMode')}
                >
                  <i className={`bi bi-${darkMode ? 'sun' : 'moon-stars'}`}></i>
                </button>

                <Link 
                  to="/cart" 
                  className={`eshop-btn eshop-btn-navbar-action position-relative`}
                  title={t('cart')}
                >
                  <i className="bi bi-cart3"></i>
                  <span className="position-absolute top-0 start-100 translate-middle eshop-badge eshop-badge-error rounded-pill">
                    {totalQuantity || 0}
                  </span>
                </Link>

                {currentUser ? (
                  <div className="eshop-user-dropdown user-dropdown position-relative">
                    <button 
                      className={`eshop-btn eshop-btn-navbar-action`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>{currentUser.name}</span>
                      <i className="bi bi-chevron-down"></i>
                    </button>
                    {showDropdown && (
                      <div className={`eshop-dropdown-menu eshop-navbar-dropdown-menu user-dropdown-menu position-absolute top-100 end-0 mt-1 py-2 rounded-3 shadow`} style={{ minWidth: '200px', zIndex: 1000 }}>
                        <div className={`px-3 py-2 small-text-muted`} >
                          {t('signedInAs')}<br />
                          <strong>{currentUser.email}</strong>
                        </div>
                        <button 
                          className="eshop-dropdown-item eshop-text-error d-flex align-items-center gap-2 px-3 py-2"
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
                      className={`eshop-btn eshop-btn-navbar-action`}
                      onClick={() => navigate('/login')}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {t('login')}
                    </button>

                    <Link 
                      to="/register" 
                      className="eshop-btn eshop-btn-primary"
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
    </>
  );
}
