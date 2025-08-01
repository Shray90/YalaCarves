// Authentication context provider for user login, registration, and session management
// Features JWT token handling, user role management, and persistent authentication state
import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";
import { toast } from "../hooks/use-toast";

// AuthContext for managing user authentication state across the application
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("yalacarves_user");
      const token = localStorage.getItem("yalacarves_token");

      if (savedUser && token) {
        try {
          // Verify token is still valid by fetching profile
          const response = await apiService.getProfile();
          setUser(response.user);
        } catch (error) {
          console.log('Token invalid, clearing auth');
          localStorage.removeItem("yalacarves_user");
          localStorage.removeItem("yalacarves_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed. Please try again."
      };
    }
  };

  const signup = async (name, email, password, securityQuestion, securityAnswer) => {
    try {
      const response = await apiService.register(name, email, password, securityQuestion, securityAnswer);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Signup failed. Please try again."
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("yalacarves_user");
    localStorage.removeItem("yalacarves_token");
    apiService.logout();
    toast({
      title: "Signed out",
      description: "You have been signed out.",
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
