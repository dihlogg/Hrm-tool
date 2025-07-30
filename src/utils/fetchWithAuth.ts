import { getAccessToken } from "./getAccessToken";
import { refreshAccessToken } from "./refreshAccessToken";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = getAccessToken();

  const makeRequest = async (accessToken: string) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    return response;
  };

  let response = await makeRequest(token!);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      response = await makeRequest(newToken);
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API error");
  }

  return response.json();
}
