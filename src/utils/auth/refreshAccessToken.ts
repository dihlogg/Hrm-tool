import Cookies from "js-cookie";
import { setAuthCookies } from "./getAccessToken";

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hrm-api/Auth/RefreshToken`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      }
    );
    const data = await response.json();
    setAuthCookies(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}
