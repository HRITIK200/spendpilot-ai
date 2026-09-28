import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("spendpilot_token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("spendpilot_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' or 'register'

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    const verifySavedSession = async () => {
      if (token) {
        try {
          const profile = await getMe(token);
          if (profile) {
            setUser({
              id: profile._id,
              name: profile.name,
              email: profile.email,
              company: profile.company,
              role: profile.role,
            });
            localStorage.setItem(
              "spendpilot_user",
              JSON.stringify({
                id: profile._id,
                name: profile.name,
                email: profile.email,
                company: profile.company,
                role: profile.role,
              })
            );
          }
        } catch (error) {
          console.warn("Session expired or invalid, logging out:", error);
          logout();
        }
      }
      setLoading(false);
    };

    verifySavedSession();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("spendpilot_token", data.token);
      localStorage.setItem("spendpilot_user", JSON.stringify(data.user));
      closeAuthModal();
      return data;
    }
    throw new Error(data?.message || "Login failed");
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("spendpilot_token", data.token);
      localStorage.setItem("spendpilot_user", JSON.stringify(data.user));
      closeAuthModal();
      return data;
    }
    throw new Error(data?.message || "Registration failed");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("spendpilot_token");
    localStorage.removeItem("spendpilot_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
