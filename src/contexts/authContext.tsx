"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";
import Cookies from "js-cookie";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.GET_USER_INFOR);
        setUserId(res.data.userId);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
