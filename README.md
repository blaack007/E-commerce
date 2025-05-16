# E-Shop - Modern E-commerce Platform

A modern, responsive e-commerce platform built with React and Bootstrap 5. This project provides a seamless shopping experience with features like product browsing, cart management, user authentication, and dark mode support.

## Features

- 🛍️ Browse products with detailed information
- 🌓 Dark/Light mode toggle
- 🏷️ Real-time stock status display
- ⭐ Dynamic product rating system
- 🔍 Search functionality with category filters
- 📱 Fully responsive design
- 🛒 Advanced shopping cart with persistent storage
- 👤 User authentication and registration
- 💾 Local storage for cart and user data
- 🔄 Quantity management in cart
- 🏷️ Discount price calculations
- 🖼️ Image gallery with thumbnails
- 🍞 Breadcrumb navigation
- 📊 Order summary with tax and shipping

## Technologies Used

- React 19
- Redux Toolkit for state management
- Bootstrap 5.3
- React Router DOM 7
- Axios for API calls
- Bootstrap Icons
- Vite
- Local Storage API

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
e-commerce/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx    # Navigation and user menu
│   │   ├── ProductCard.jsx # Product display card
│   │   ├── ProductModal.jsx # Quick view modal
│   │   ├── ScrollToTop.jsx # Scroll to top button
│   │   └── Sidebar.jsx    # Category filters
│   ├── pages/         # Page components
│   │   ├── Cart.jsx      # Shopping cart page
│   │   ├── Login.jsx     # User login
│   │   ├── Register.jsx  # User registration
│   │   ├── Products.jsx  # Product listing
│   │   └── ProductDetails.jsx # Detailed product view
│   ├── store/         # Redux store
│   │   └── slices/    # Redux slices
│   │       └── cartSlice.js # Cart state management
│   ├── context/       # React context providers
│   │   └── ThemeContext.jsx # Dark/Light mode
│   ├── apis/          # API configuration
│   └── assets/        # Static assets
├── public/            # Public assets
└── index.html         # Entry HTML file
```

## Recent Updates

### Features Added
- Enhanced user registration with field validation
- Improved cart persistence with localStorage
- Added breadcrumb navigation for better UX
- Implemented product image gallery with thumbnails
- Added quantity management in product details

### Code Improvements
- Optimized cart state management
- Removed unused components and functions
- Enhanced code organization and maintainability
- Improved form validation logic
- Added proper error handling

### UI Enhancements
- Improved product details layout
- Enhanced cart summary display
- Added loading states and spinners
- Implemented responsive image gallery
- Enhanced form validation feedback


