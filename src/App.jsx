import { Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import './App.css'
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

// Lazy load route components
const Products = lazy(() => import("./pages/products"));
const Notfound = lazy(() => import("./pages/notfound"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Navbar />
        <div className="container my-5">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<Notfound />} />
            </Routes>
          </Suspense>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
