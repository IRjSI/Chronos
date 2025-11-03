import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";

interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await axios.get<{ user: User }>(`${import.meta.env.VITE_BACKEND_URL}/auth/session`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/csrf`, {
        withCredentials: true,
      });
      const csrfToken = res.data.csrfToken;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        { csrfToken },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};