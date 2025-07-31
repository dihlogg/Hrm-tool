import Cookies from "js-cookie";
import { setAuthCookies } from "./getAccessToken";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) return null;

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await fetch("http://localhost:5678/Auth/RefreshToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Refresh token failed");
        return null;
      }

      const data = await response.json();
      setAuthCookies(data.access_token, data.refresh_token);
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
