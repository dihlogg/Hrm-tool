import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const setAuthCookies = (
  accessToken: string,
  refreshToken: string
): void => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    path: "/",
    expires: 15 / 1440, //15m
    sameSite: "Lax",
    secure: process.env.NODE_ENV === 'production',
  });

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    path: "/",
    expires: 7,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === 'production',
  });
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const clearAuthCookies = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
