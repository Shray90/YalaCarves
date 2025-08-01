import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      // Don't add if already exists
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_WISHLIST":
      return {
        items: [],
      };

    case "LOAD_WISHLIST":
      return {
        items: action.payload,
      };

    default:
      return state;
  }
};

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
  });

  // Load wishlist from localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlistFromStorage();
    } else {
      // Clear wishlist when user logs out
      dispatch({ type: "CLEAR_WISHLIST" });
    }
  }, [isAuthenticated, user]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const wishlistKey = `yalacarves_wishlist_${user.id}`;
      localStorage.setItem(wishlistKey, JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated, user]);

  const loadWishlistFromStorage = () => {
    try {
      const wishlistKey = `yalacarves_wishlist_${user.id}`;
      const savedWishlist = localStorage.getItem(wishlistKey);
      if (savedWishlist) {
        const items = JSON.parse(savedWishlist);
        dispatch({ type: "LOAD_WISHLIST", payload: items });
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
    }
  };

  const addToWishlist = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeFromWishlist = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    // Also clear from localStorage
    if (isAuthenticated && user) {
      const wishlistKey = `yalacarves_wishlist_${user.id}`;
      localStorage.removeItem(wishlistKey);
    }
  };

  const isInWishlist = (id) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
