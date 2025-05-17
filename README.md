# E-Shop - Modern E-commerce Platform

A modern, responsive e-commerce platform built with React and Bootstrap 5. This project provides a seamless shopping experience with features like product browsing, cart management, user authentication, dark mode support, and internationalization (i18n).

## Features

- 🛍️ Browse products with detailed information
- 🌓 Dark/Light mode toggle
- 🌐 Internationalization (English/Arabic) support
- 🔄 RTL/LTR layout switching
- 🏷️ Real-time stock status display
- ⭐ Dynamic product rating system
- 🔍 Search functionality with category filters
- 📱 Fully responsive design
- 🛒 Advanced shopping cart with persistent storage
- 👤 User authentication and registration
- 💾 Local storage for cart, theme, and language preferences
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

3. Create a `.env` file in the root directory with:
```bash
VITE_APP_BASE_URL=https://dummyjson.com
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

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
│   │   ├── ThemeContext.jsx # Dark/Light mode
│   │   └── LanguageContext.jsx # Internationalization
│   ├── translations/  # Translation files
│   │   └── index.js   # EN/AR translations
│   ├── apis/          # API configuration
│   └── assets/        # Static assets
├── public/            # Public assets
└── index.html         # Entry HTML file
```

## Recent Updates

### Features Added
- Added complete internationalization (i18n) support
- Implemented RTL layout for Arabic language
- Enhanced user registration with field validation
- Added language preference persistence
- Improved cart persistence with localStorage
- Added breadcrumb navigation for better UX
- Implemented product image gallery with thumbnails
- Added quantity management in product details

### Code Improvements
- Optimized cart state management
- Implemented lazy loading for better performance
- Enhanced error handling and loading states
- Improved form validation logic
- Added proper API error handling
- Environment variable configuration
- Consistent code style and organization

### UI Enhancements
- Added RTL/LTR layout support
- Improved product details layout
- Enhanced cart summary display
- Added loading states and spinners
- Implemented responsive image gallery
- Enhanced form validation feedback
- Improved accessibility with ARIA labels

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.


