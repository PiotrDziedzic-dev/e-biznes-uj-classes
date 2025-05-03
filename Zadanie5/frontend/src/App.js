import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Products from './components/Products';
import Cart from './components/Cart';
import Payment from './components/Payment';
import ProductManagement from './components/ProductManagement';

const App = () => (
  <CartProvider>
    <Router>
      <nav style={navStyles}>
        <Link to="/" style={linkStyles}>Products</Link>
        <Link to="/cart" style={linkStyles}>Cart</Link>
        <Link to="/manage-products" style={linkStyles}>
          <button style={buttonStyles}>Manage Products</button>
        </Link>
      </nav>

      <div style={contentContainer}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/manage-products" element={<ProductManagement />} />
        </Routes>
      </div>
    </Router>
  </CartProvider>
);

// Style
const navStyles = {
  padding: '1rem',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  gap: '1rem'
};

const linkStyles = {
  textDecoration: 'none',
  color: '#333'
};

const buttonStyles = {
  padding: '0.5rem 1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const contentContainer = {
  padding: '2rem'
};

export default App;