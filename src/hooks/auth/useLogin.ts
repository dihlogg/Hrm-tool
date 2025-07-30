import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { setAuthCookies } from "@/utils/getAccessToken";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  const login = async (userName: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        return false;
      }

      const data = await response.json();

      console.log("Login response:", data);
      setAuthCookies(data.access_token, data.refresh_token);

      router.push("/pim");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Something wrong during login.");
      return false;
    }
  };

  return { login, error };
}
