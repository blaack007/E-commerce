import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar";
import Products from "./pages/products";
import Notfound from "./pages/notfound";
import Login from "./pages/login";
import Register from "./pages/register";
import ProductDetails from "./pages/ProductDetails";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container my-5">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products/" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
