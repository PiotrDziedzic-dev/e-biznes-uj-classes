import { useState } from 'react';
import api from '../api';

const ProductManagement = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...newProduct,
        price: parseFloat(newProduct.price)
      });
      setNewProduct({ name: '', price: '' });
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error adding product');
    }
  };

  return (
    <div style={containerStyles}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          style={inputStyles}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          style={inputStyles}
          required
        />
        <button type="submit" style={submitButtonStyles}>
          Add Product
        </button>
      </form>
    </div>
  );
};

// Style
const containerStyles = {
  maxWidth: '600px',
  margin: '0 auto'
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const inputStyles = {
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const submitButtonStyles = {
  padding: '0.75rem',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ProductManagement;