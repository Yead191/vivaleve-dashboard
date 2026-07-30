import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () =>
  Cookies.get(REFRESH_TOKEN_KEY) ??
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const saveRefreshToken = (
  refreshToken: string,
  remember = false,
) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: remember ? 30 : 7,
    sameSite: "strict",
    secure: import.meta.env.PROD,
  });
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

/** Clears auth tokens, cookies, and all browser storage used by the app session. */
export const clearAllStoredAuthData = () => {
  clearAuthTokens();
  localStorage.clear();
  sessionStorage.clear();
};
