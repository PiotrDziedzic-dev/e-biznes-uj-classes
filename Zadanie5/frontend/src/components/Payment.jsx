import { useState } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const { cartItems } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payment', {
        items: cartItems,
        payment: paymentData
      });
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Card Number"
        value={paymentData.cardNumber}
        onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})}
      />
      <input
        type="text"
        placeholder="MM/YY"
        value={paymentData.expiry}
        onChange={e => setPaymentData({...paymentData, expiry: e.target.value})}
      />
      <input
        type="text"
        placeholder="CVV"
        value={paymentData.cvv}
        onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
      />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default Payment;