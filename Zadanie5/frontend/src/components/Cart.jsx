import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name} x{item.quantity}</span>
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ${total.toFixed(2)}</p>
      <Link to="/payment">Proceed to Payment</Link>
    </div>
  );
};

export default Cart;