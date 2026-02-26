// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Check if user already logged in (on refresh)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/currentUser");
        setUser(res.data.data);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          showError("Error fetching current user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.data.user);

      return true;
    } catch (error) {
      showError("Error during login:", error.response?.data || error);
      return false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      showError("Error during logout:", error);
    } finally {
      // clear user immediately
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
