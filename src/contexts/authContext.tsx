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
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import { useRouter } from "next/navigation";
import { socketService } from "@/services/web-socketService";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  userRoles: string[];
  setUserRoles: (roles: string[]) => void;
  employee: CreateEmployeeDto | null;
  setEmployee: (employee: CreateEmployeeDto | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [employee, setEmployee] = useState<CreateEmployeeDto | null>(null);
  const router = useRouter();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) return;
    const fetchUser = async () => {
      try {
        // Fetch user info
        const userResponse = await axiosInstance.get(
          API_ENDPOINTS.GET_USER_INFOR
        );
        const fetchedUserId = userResponse.data.userId;
        setUserId(fetchedUserId);
        setUserRoles(userResponse.data.roles ?? []);

        // Fetch employee details sau khi có userId
        if (fetchedUserId) {
          const employeeResponse = await axiosInstance.get(
            `${API_ENDPOINTS.GET_EMPLOYEE_DETAILS_BY_USER_ID}/${fetchedUserId}`
          );
          const employeeData: CreateEmployeeDto = employeeResponse.data;
          setEmployee(employeeData);

          socketService.connect(token, employeeData.id || "");
          setSocketConnected(true);
        }
      } catch (err) {
        console.error("Failed to fetch user info or employee:", err);
        setUserId(null);
        setUserRoles([]);
        setEmployee(null);
        socketService.disconnect(); // close websocket nếu có lỗi
        setSocketConnected(false);
      }
    };

    fetchUser();
  }, []);
  const logout = () => {
    // clear token fr cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    // Clear state
    setUserId(null);
    setUserRoles([]);
    setEmployee(null);
    socketService.disconnect();

    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId,
        userRoles,
        setUserRoles,
        employee,
        setEmployee,
        logout,
      }}
    >
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
