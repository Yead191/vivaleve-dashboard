import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/env";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from "./authStorage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const findAccessToken = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.accessToken === "string") {
    return record.accessToken;
  }

  return findAccessToken(record.data);
};

let refreshPromise: Promise<string | null> | null = null;
let authFailureHandled = false;

export const markAuthenticationActive = () => {
  authFailureHandled = false;
};

const handleAuthenticationFailure = () => {
  clearAuthTokens();

  if (authFailureHandled) {
    return;
  }

  authFailureHandled = true;
  toast.error("Your session has expired. Please sign in again.");

  if (window.location.pathname !== "/auth/login") {
    window.location.assign("/auth/login");
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiContext, extraOptions) => {
  let result = await rawBaseQuery(args, apiContext, extraOptions);
  const requestUrl = typeof args === "string" ? args : args.url;

  if (
    result.error?.status !== 401 ||
    requestUrl === "/auth/login" ||
    requestUrl === "/auth/refresh-token"
  ) {
    return result;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    handleAuthenticationFailure();
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        apiContext,
        extraOptions,
      );

      if (refreshResult.error) {
        return null;
      }

      const accessToken = findAccessToken(refreshResult.data);

      if (accessToken) {
        saveAccessToken(accessToken);
        markAuthenticationActive();
      }

      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const accessToken = await refreshPromise;

  if (!accessToken) {
    handleAuthenticationFailure();
    return result;
  }

  result = await rawBaseQuery(args, apiContext, extraOptions);
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "AdminData",
    "Banner",
    "Notification",
    "Overview",
    "Package",
  ],
  endpoints: () => ({}),
});
