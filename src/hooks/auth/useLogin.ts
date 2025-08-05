import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { setAuthCookies } from "@/utils/auth/getAccessToken";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  const login = async (userName: string, password: string) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        userName,
        password,
      });

      const { access_token, refresh_token } = response.data;

      setAuthCookies(access_token, refresh_token);

      router.push("/pim");
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return false;
    }
  };

  return { login, error };
}
