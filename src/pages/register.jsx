import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    name: false,
    username: false,
    password: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*@%$#])[A-Za-z\d*@%$#]{8,}$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;

      case 'name':
        if (!value.trim()) return 'Name is required';
        break;

      case 'username':
        if (!value) return 'Username is required';
        if (value.includes(' ')) return 'Username cannot contain spaces';
        break;

      case 'password':
        if (!value) return 'Password is required';
        if (!passwordRegex.test(value)) {
          return 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (*@%$#)';
        }
        break;

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;

      default:
        return '';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      name: true,
      username: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Create user object (excluding confirmPassword)
      const userData = {
        email: formData.email,
        name: formData.name,
        username: formData.username,
        password: formData.password
      };

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email or username already exists
      const emailExists = existingUsers.some(user => user.email === userData.email);
      const usernameExists = existingUsers.some(user => user.username === userData.username);
      
      if (emailExists) {
        setErrors(prev => ({
          ...prev,
          email: 'Email already registered'
        }));
        return;
      }
      
      if (usernameExists) {
        setErrors(prev => ({
          ...prev,
          username: 'Username already taken'
        }));
        return;
      }

      // Add new user
      existingUsers.push(userData);
      
      // Store updated users array
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Show success alert
      alert('Registration successful! Please login.');
      
      // Redirect to login page
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If field has been touched, validate on change
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));

      // Special case for confirm password
      if (name === 'password' && formData.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Create Account</h2>
              
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="eshop-form-label">Email address</label>
                  <input
                    type="email"
                    className={`eshop-form-control ${touched.email && errors.email ? 'is-invalid' : touched.email && !errors.email ? 'is-valid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.email && errors.email && (
                    <div className="eshop-invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="eshop-form-label">Full Name</label>
                  <input
                    type="text"
                    className={`eshop-form-control ${touched.name && errors.name ? 'is-invalid' : touched.name && !errors.name ? 'is-valid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.name && errors.name && (
                    <div className="eshop-invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="eshop-form-label">Username</label>
                  <input
                    type="text"
                    className={`eshop-form-control ${touched.username && errors.username ? 'is-invalid' : touched.username && !errors.username ? 'is-valid' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.username && errors.username && (
                    <div className="eshop-invalid-feedback">{errors.username}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="eshop-form-label">Password</label>
                  <input
                    type="password"
                    className={`eshop-form-control ${touched.password && errors.password ? 'is-invalid' : touched.password && !errors.password ? 'is-valid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.password && errors.password && (
                    <div className="eshop-invalid-feedback">{errors.password}</div>
                  )}
                  {touched.password && !errors.password && passwordRegex.test(formData.password) && (
                    <div className="eshop-valid-feedback">Password strength is good.</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="eshop-form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`eshop-form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? 'is-valid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="eshop-invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <button type="submit" className="eshop-btn eshop-btn-primary w-100">
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
