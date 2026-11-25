import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { authAPI } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the user's session when the application loads.
  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Register a new user.
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    setUser(response.user);
    return response;
  };

  // Login an existing user.
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    setUser(response.user);
    return response;
  };

  // Logout the current user.
  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
