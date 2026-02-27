// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

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
          toast.error("Error fetching current user");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 🔹 Register
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // 🔹 Login
  // 🔹 Login
const login = async (email, password) => {
  return api.post("/auth/login", { email, password })
    .then((res) => {
      setUser(res.data.data.user);
      return res.data; // return actual data
    })
    .catch((error) => {
      console.log("Error during login:", error.response?.data || error);
      throw error;
    });
};

  // 🔹 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      toast.error("Error during logout:", error);
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
        register,
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
