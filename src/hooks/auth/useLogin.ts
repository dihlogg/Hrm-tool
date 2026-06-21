import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { setAuthCookies } from "@/utils/auth/getAccessToken";
import axiosInstance from "@/utils/auth/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "@/contexts/authContext";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { setUserId, setUserRoles, setEmployee } = useAuthContext();

  const login = async (userName: string, password: string) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        userName,
        password,
      });

      const { access_token, refresh_token } = response.data;

      setAuthCookies(access_token, refresh_token);

      //decode get userId and roles from token
      const decodedToken: Record<string, unknown> = jwtDecode(access_token);
      const userId = decodedToken.sub as string;
      const roles = (decodedToken.roles as string[]) || [];
      setUserId(userId);
      setUserRoles(Array.isArray(roles) ? roles : [roles]);

      // Fetch employee details sau khi có userId
      const employeeResponse = await axiosInstance.get(
        `${API_ENDPOINTS.GET_EMPLOYEE_DETAILS_BY_USER_ID}/${userId}`
      );
      setEmployee(employeeResponse.data);

      router.push("/dashboard");
      return true;
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message = errorObj.response?.data?.message || errorObj.message || "Login failed";
      setError(message);
      return false;
    }
  };

  return { login, error };
}
