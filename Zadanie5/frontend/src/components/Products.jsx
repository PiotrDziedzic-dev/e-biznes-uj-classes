import { useEffect, useState } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleUpdate = async (product) => {
    try {
      await api.put(`/products/${product.id}`, product);
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="products">
      {products.map(product => (
        <div key={product.id} style={productCardStyles}>
          {editingProduct?.id === product.id ? (
            <div style={editFormStyles}>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  name: e.target.value
                })}
                style={inputStyles}
              />
              <input
                type="number"
                step="0.01"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  price: e.target.value
                })}
                style={inputStyles}
              />
              <div style={buttonGroupStyles}>
                <button
                  onClick={() => handleUpdate(editingProduct)}
                  style={saveButtonStyles}
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
              <p>Price: ${product.price.toFixed(2)}</p>
              <div style={actionButtonGroup}>
                <button
                  onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                  style={addToCartButton}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  style={editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={deleteButton}
                >
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

export default Products

// Dodaj style
const productCardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  margin: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const editFormStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const inputStyles = {
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem'
};

const saveButtonStyles = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const cancelButtonStyles = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const actionButtonGroup = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1rem'
};

const addToCartButton = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const editButton = {
  backgroundColor: '#FFC107',
  color: 'black',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteButton = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer'
};