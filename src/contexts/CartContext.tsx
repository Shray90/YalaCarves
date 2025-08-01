// Cart context provider for managing shopping cart state and operations
// Features persistent cart storage, quantity management, and user authentication integration
import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import api from "@/services/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  description: string;
  artisan: string;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.id,
        });
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "LOAD_CART":
      const loadedItems = action.payload;
      return {
        items: loadedItems,
        total: loadedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: loadedItems.reduce((sum, item) => sum + item.quantity, 0),
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Initialize cart from localStorage
const getInitialCartState = (): CartState => {
  try {
    const savedCart = localStorage.getItem('yalacarves_cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      console.log('Initializing cart from localStorage:', cartItems);
      return {
        items: cartItems,
        total: cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
        itemCount: cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
      };
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return {
    items: [],
    total: 0,
    itemCount: 0,
  };
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, getInitialCartState());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving cart to localStorage:', state.items);
    localStorage.setItem('yalacarves_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Load cart from backend when user logs in
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: user?.id });
    if (isAuthenticated && user) {
      console.log('Loading cart for authenticated user:', user.id);
      loadCartFromBackend();
    }
  }, [isAuthenticated, user]);

  const loadCartFromBackend = async () => {
    try {
      console.log('Loading cart from backend...');
      const response = await api.getCart();
      console.log('Cart response:', response);

      if (response.success && response.cart && response.cart.items) {
        // Transform backend cart items to frontend format
        const cartItems = response.cart.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.price, // Backend doesn't have originalPrice
          image: item.product.emoji,
          category: item.product.category || '',
          description: '', // Backend doesn't provide description in cart
          artisan: '', // Backend doesn't provide artisan in cart
          inStock: item.product.inStock,
          stockQuantity: item.product.stockQuantity,
          quantity: item.quantity,
        }));
        console.log('Transformed cart items:', cartItems);
        dispatch({ type: "LOAD_CART", payload: cartItems });
        // Also save to localStorage as backup
        localStorage.setItem('yalacarves_cart', JSON.stringify(cartItems));
      } else {
        console.log('No cart items found or invalid response');
        dispatch({ type: "LOAD_CART", payload: [] });
        localStorage.setItem('yalacarves_cart', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to load cart from backend:', error);
      // Try to load from localStorage as fallback
      try {
        const savedCart = localStorage.getItem('yalacarves_cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          console.log('Loaded cart from localStorage fallback:', cartItems);
          dispatch({ type: "LOAD_CART", payload: cartItems });
        }
      } catch (localError) {
        console.error('Failed to load cart from localStorage fallback:', localError);
      }
    }
  };

  const addItem = async (product: Product) => {
    if (isAuthenticated) {
      try {
        console.log('Adding item to backend cart:', product.id);
        const response = await api.addToCart(product.id, 1);
        console.log('Add to cart response:', response);
        // Reload cart from backend to get updated state
        loadCartFromBackend();
      } catch (error) {
        console.error('Failed to add item to backend cart:', error);
        // Fallback to local state
        dispatch({ type: "ADD_ITEM", payload: product });
      }
    } else {
      // For non-authenticated users, just use local state
      dispatch({ type: "ADD_ITEM", payload: product });
    }
  };

  const removeItem = async (productId: number) => {
    if (isAuthenticated) {
      try {
        console.log('Removing product from cart:', productId);
        await api.removeProductFromCart(productId);
        loadCartFromBackend();
      } catch (error) {
        console.error('Failed to remove item from backend cart:', error);
        // Fallback to local state
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      }
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: productId });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (isAuthenticated) {
      try {
        console.log('Updating product quantity:', productId, quantity);
        await api.updateCartProduct(productId, quantity);
        loadCartFromBackend();
      } catch (error) {
        console.error('Failed to update cart item in backend:', error);
        // Fallback to local state
        dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
      }
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
      }
    }
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
