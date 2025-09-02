import { useEffect, useState } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({ name: '', price: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const validateDraft = (draft) => {
    const next = { name: '', price: '' };
    const name = String(draft?.name || '').trim();
    const priceNum = Number(draft?.price);

    if (!name) next.name = 'Name is required';
    if (draft?.price === '' || draft?.price == null) {
      next.price = 'Price is required';
    } else if (!Number.isFinite(priceNum) || Number.isNaN(priceNum)) {
      next.price = 'Price must be a number';
    } else if (priceNum < 0) {
      next.price = 'Price cannot be negative';
    }

    setErrors(next);
    return !next.name && !next.price;
  };

  const handleUpdate = async (product) => {
    try {
      // --- HARD GUARD ---
      const trimmed = String(product?.name || '').trim();
      if (!trimmed) {
        setErrors((er) => ({ ...er, name: 'Name is required' }));
        alert('Name is required'); // opcjonalnie; ułatwia debug, testy tego nie wymagają
        return; // <--- żadnego PUT
      }

      const payload = {
        id: product.id,
        name: trimmed,
        price: Number(product.price),
        category: String(product.category || '').trim(),
      };

      setSaving(true);
      await api.put(`/products/${product.id}`, payload);
      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Update failed';
      alert(msg);
      console.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  };

  const onEditName = (e) => {
    const value = e.target.value;
    setEditingProduct((p) => ({ ...p, name: value }));
    // live validation for UX + tests
    const trimmed = String(value).trim();
    setErrors((er) => ({ ...er, name: trimmed ? '' : 'Name is required' }));
  };

  const onEditPrice = (e) => {
    const value = e.target.value;
    setEditingProduct((p) => ({ ...p, price: value }));
    const num = Number(value);
    let msg = '';
    if (value === '') msg = 'Price is required';
    else if (!Number.isFinite(num) || Number.isNaN(num)) msg = 'Price must be a number';
    else if (num < 0) msg = 'Price cannot be negative';
    setErrors((er) => ({ ...er, price: msg }));
  };

  const openEdit = (product) => {
    // make a shallow copy to avoid mutating list object by reference
    setEditingProduct({
      id: product.id,
      name: product.name ?? '',
      price: product.price ?? '',
      category: product.category ?? '',
    });
    // reset errors for a clean start
    setErrors({ name: '', price: '' });
  };

  const isSaveDisabled = () => {
    const nameOk = String(editingProduct?.name || '').trim().length > 0;
    const priceNum = Number(editingProduct?.price);
    const priceOk =
        editingProduct?.price !== '' &&
        Number.isFinite(priceNum) &&
        !Number.isNaN(priceNum) &&
        priceNum >= 0;
    return saving || !nameOk || !priceOk;
  };

  return (
      <div className="products">
        {products.map((product) => (
            <div key={product.id} style={productCardStyles}>
              {editingProduct?.id === product.id ? (
                  <div style={editFormStyles}>
                    <input
                        type="text"
                        value={editingProduct.name}
                        onChange={onEditName}
                        style={inputStyles}
                        placeholder="Product Name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `err-name-${product.id}` : undefined}
                    />
                    {errors.name && (
                        <div id={`err-name-${product.id}`} style={errorStyles}>
                          {errors.name}
                        </div>
                    )}

                    <input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={onEditPrice}
                        style={inputStyles}
                        placeholder="Price"
                        aria-invalid={!!errors.price}
                        aria-describedby={errors.price ? `err-price-${product.id}` : undefined}
                    />
                    {errors.price && (
                        <div id={`err-price-${product.id}`} style={errorStyles}>
                          {errors.price}
                        </div>
                    )}

                    <div style={buttonGroupStyles}>
                      <button
                          onClick={() => handleUpdate(editingProduct)}
                          style={{ ...saveButtonStyles, opacity: isSaveDisabled() ? 0.7 : 1 }}
                          disabled={isSaveDisabled()}
                      >
                        Save
                      </button>
                      <button
                          onClick={() => setEditingProduct(null)}
                          style={cancelButtonStyles}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
              ) : (
                  <>
                    <h3>{product.name}</h3>
                    <p>
                      Price: $
                      {Number.isFinite(Number(product.price))
                          ? Number(product.price).toFixed(2)
                          : String(product.price)}
                    </p>
                    <div style={actionButtonGroup}>
                      <button
                          onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                          style={addToCartButton}
                      >
                        Add to Cart
                      </button>
                      <button onClick={() => openEdit(product)} style={editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={deleteButton}>
                        Delete
                      </button>
                    </div>
                  </>
              )}
            </div>
        ))}
      </div>
  );
};

export default Products;

// Styles
const productCardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  margin: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const editFormStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyles = {
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const errorStyles = {
  marginTop: '0.25rem',
  color: '#c62828',
  fontSize: '0.875rem',
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
};

const saveButtonStyles = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelButtonStyles = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};

const actionButtonGroup = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1rem',
};

const addToCartButton = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};

const editButton = {
  backgroundColor: '#FFC107',
  color: 'black',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteButton = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};
