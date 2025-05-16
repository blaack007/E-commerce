import React, { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow"
          style={{
            width: '45px',
            height: '45px',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            opacity: isVisible ? '1' : '0',
          }}
          title="Scroll to top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </>
  );
} 