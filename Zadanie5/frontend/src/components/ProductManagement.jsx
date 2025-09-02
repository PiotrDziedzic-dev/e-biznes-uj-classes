import { useState } from 'react';
import api from '../api';

const ProductManagement = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({ name: '', price: '' });
  const [submitting, setSubmitting] = useState(false);

  const validate = (data) => {
    const next = { name: '', price: '' };
    const trimmedName = String(data.name || '').trim();
    const numPrice = Number(data.price);

    if (!trimmedName) {
      next.name = 'Name is required';
    }
    if (!Number.isFinite(numPrice) || isNaN(numPrice)) {
      next.price = 'Price must be a number';
    } else if (numPrice < 0) {
      next.price = 'Price cannot be negative';
    }

    setErrors(next);
    // valid when both error fields are empty
    return !next.name && !next.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const candidate = {
      name: newProduct.name,
      price: newProduct.price,
    };
    if (!validate(candidate)) return;

    const payload = {
      name: String(newProduct.name).trim(),
      price: Number(newProduct.price),
    };

    try {
      setSubmitting(true);
      await api.post('/products', payload);
      setNewProduct({ name: '', price: '' });
      setErrors({ name: '', price: '' });
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      // jeśli backend zwróci 400 z treścią, pokaż komunikat
      const msg =
          error?.response?.data?.error ||
          error?.message ||
          'Error adding product';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onChangeName = (e) => {
    const value = e.target.value;
    setNewProduct((p) => ({ ...p, name: value }));
    // live-validate name
    const trimmed = value.trim();
    setErrors((er) => ({ ...er, name: trimmed ? '' : 'Name is required' }));
  };

  const onChangePrice = (e) => {
    const value = e.target.value;
    setNewProduct((p) => ({ ...p, price: value }));
    // live-validate price
    const num = Number(value);
    let msg = '';
    if (value === '') msg = 'Price is required';
    else if (!Number.isFinite(num) || isNaN(num)) msg = 'Price must be a number';
    else if (num < 0) msg = 'Price cannot be negative';
    setErrors((er) => ({ ...er, price: msg }));
  };

  const isDisabled =
      submitting ||
      !String(newProduct.name || '').trim() ||
      !Number.isFinite(Number(newProduct.price)) ||
      Number(newProduct.price) < 0;

  return (
      <div style={containerStyles}>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} style={formStyles} noValidate>
          <div>
            <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={onChangeName}
                style={inputStyles}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && (
                <div id="err-name" style={errorStyles}>{errors.name}</div>
            )}
          </div>

          <div>
            <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={onChangePrice}
                style={inputStyles}
                required
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? 'err-price' : undefined}
            />
            {errors.price && (
                <div id="err-price" style={errorStyles}>{errors.price}</div>
            )}
          </div>

          <button type="submit" style={submitButtonStyles} disabled={isDisabled}>
            Add Product
          </button>
        </form>
      </div>
  );
};

// Styles
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
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box'
};

const errorStyles = {
  marginTop: '0.25rem',
  color: '#c62828',
  fontSize: '0.875rem'
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
