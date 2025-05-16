import { createSlice } from '@reduxjs/toolkit';

// Helper function to get cart from localStorage
const getStoredCart = (username) => {
  const storedCart = localStorage.getItem(`cart_${username}`);
  return storedCart ? JSON.parse(storedCart) : { items: [], totalQuantity: 0, totalAmount: 0 };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart, username) => {
  localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (currentUser) {
        const userCart = getStoredCart(currentUser.username);
        const existingItem = userCart.items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          existingItem.quantity += newItem.quantity || 1;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
          userCart.items.push({
            ...newItem,
            quantity: newItem.quantity || 1,
            totalPrice: newItem.price * (newItem.quantity || 1),
          });
        }
        
        userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);
        userCart.totalAmount = userCart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        
        // Update both localStorage and state
        saveCartToStorage(userCart, currentUser.username);
        Object.assign(state, userCart);
      } else {
        // Handle guest cart in Redux state only
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity || 1;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
          state.items.push({
            ...newItem,
            quantity: newItem.quantity || 1,
            totalPrice: newItem.price * (newItem.quantity || 1),
          });
        }
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (currentUser) {
        const userCart = getStoredCart(currentUser.username);
        const existingItem = userCart.items.find(item => item.id === id);
        
        if (existingItem) {
          userCart.totalQuantity -= existingItem.quantity;
          userCart.items = userCart.items.filter(item => item.id !== id);
          userCart.totalAmount = userCart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          
          // Update both localStorage and state
          saveCartToStorage(userCart, currentUser.username);
          Object.assign(state, userCart);
        }
      } else {
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          state.totalQuantity -= existingItem.quantity;
          state.items = state.items.filter(item => item.id !== id);
          state.totalAmount = state.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        }
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (currentUser) {
        const userCart = getStoredCart(currentUser.username);
        const item = userCart.items.find(item => item.id === id);
        
        if (item) {
          const quantityDiff = quantity - item.quantity;
          item.quantity = quantity;
          item.totalPrice = item.price * quantity;
          userCart.totalQuantity += quantityDiff;
          userCart.totalAmount = userCart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          
          // Update both localStorage and state
          saveCartToStorage(userCart, currentUser.username);
          Object.assign(state, userCart);
        }
      } else {
        const item = state.items.find(item => item.id === id);
        if (item) {
          const quantityDiff = quantity - item.quantity;
          item.quantity = quantity;
          item.totalPrice = item.price * quantity;
          state.totalQuantity += quantityDiff;
          state.totalAmount = state.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        }
      }
    },
    clearCart: (state) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        saveCartToStorage(initialState, currentUser.username);
      }
      Object.assign(state, initialState);
    },
    loadUserCart: (state, action) => {
      const username = action.payload;
      if (username) {
        const userCart = getStoredCart(username);
        Object.assign(state, userCart);
      } else {
        Object.assign(state, initialState);
      }
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadUserCart } = cartSlice.actions;
export default cartSlice.reducer; 