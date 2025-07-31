import { createContext, useContext, useReducer } from "react";

const initialUser = {
  id: "1",
  name: "Shrayash Shilpakar",
  email: "shrayash@example.com",
  phone: "+977-9800000000",
  bio: "Art enthusiast and collector of traditional crafts from around the world.",
  joinDate: "2023-01-15",
  addresses: [
    {
      id: "addr-1",
      type: "Home",
      name: "Shrayash Shilpakar",
      address: "Lalitpur-15, Patan",
      city: "Kathmandu, Nepal",
      phone: "+977-9800000000",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "Work",
      name: "Shrayash Shilpakar",
      address: "Thamel, Kathmandu",
      city: "Kathmandu, Nepal",
      phone: "+977-9800000000",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: "pm-1",
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      holderName: "Shrayash Shilpakar",
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "Mastercard",
      last4: "8888",
      expiry: "09/25",
      holderName: "Shrayash Shilpakar",
      isDefault: false,
    },
  ],
  preferences: {
    emailNotifications: true,
    marketingEmails: false,
    smsUpdates: true,
  },
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case "ADD_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload],
        },
      };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map((addr) =>
            addr.id === action.payload.id ? action.payload : addr,
          ),
        },
      };

    case "DELETE_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(
            (addr) => addr.id !== action.payload,
          ),
        },
      };

    case "SET_DEFAULT_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === action.payload,
          })),
        },
      };

    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        user: {
          ...state.user,
          paymentMethods: [...state.user.paymentMethods, action.payload],
        },
      };

    case "UPDATE_PAYMENT_METHOD":
      return {
        ...state,
        user: {
          ...state.user,
          paymentMethods: state.user.paymentMethods.map((pm) =>
            pm.id === action.payload.id ? action.payload : pm,
          ),
        },
      };

    case "DELETE_PAYMENT_METHOD":
      return {
        ...state,
        user: {
          ...state.user,
          paymentMethods: state.user.paymentMethods.filter(
            (pm) => pm.id !== action.payload,
          ),
        },
      };

    case "SET_DEFAULT_PAYMENT":
      return {
        ...state,
        user: {
          ...state.user,
          paymentMethods: state.user.paymentMethods.map((pm) => ({
            ...pm,
            isDefault: pm.id === action.payload,
          })),
        },
      };

    case "UPDATE_PREFERENCES":
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload },
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: initialUser,
    isLoading: false,
  });

  const updateProfile = (data) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    dispatch({ type: "ADD_ADDRESS", payload: newAddress });
  };

  const updateAddress = (address) => {
    dispatch({ type: "UPDATE_ADDRESS", payload: address });
  };

  const deleteAddress = (id) => {
    dispatch({ type: "DELETE_ADDRESS", payload: id });
  };

  const setDefaultAddress = (id) => {
    dispatch({ type: "SET_DEFAULT_ADDRESS", payload: id });
  };

  const addPaymentMethod = (paymentMethod) => {
    const newPaymentMethod = {
      ...paymentMethod,
      id: `pm-${Date.now()}`,
    };
    dispatch({ type: "ADD_PAYMENT_METHOD", payload: newPaymentMethod });
  };

  const updatePaymentMethod = (paymentMethod) => {
    dispatch({ type: "UPDATE_PAYMENT_METHOD", payload: paymentMethod });
  };

  const deletePaymentMethod = (id) => {
    dispatch({ type: "DELETE_PAYMENT_METHOD", payload: id });
  };

  const setDefaultPayment = (id) => {
    dispatch({ type: "SET_DEFAULT_PAYMENT", payload: id });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: preferences });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        setDefaultPayment,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
