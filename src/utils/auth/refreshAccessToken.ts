import Cookies from "js-cookie";
import { setAuthCookies } from "./getAccessToken";
import { API_ENDPOINTS } from "@/services/apiService";

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      console.error("Refresh token API failed with status:", response.status);
      return null;
    }
    const data = await response.json();
    setAuthCookies(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}
