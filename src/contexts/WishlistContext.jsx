import { createContext, useContext, useReducer } from "react";

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
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
  });

  const addToWishlist = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeFromWishlist = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
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
