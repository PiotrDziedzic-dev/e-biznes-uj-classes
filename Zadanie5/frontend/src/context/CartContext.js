import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      return [...state, {...action.payload, quantity: 1}];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

export const CartProvider = ({children}) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{cartItems, dispatch}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);