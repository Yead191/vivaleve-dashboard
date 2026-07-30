import { api } from "../api/baseApi";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  role?: string;
  onboardingComplete?: boolean;
}

const unwrapData = <T>(response: T | { data: T }): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return (response as { data: T }).data;
  }

  return response as T;
};

const normalizeAuthSession = (response: unknown): AuthSession => {
  const payload = unwrapData(
    unwrapData(response as AuthSession | { data: AuthSession }),
  );

  if (!payload?.accessToken) {
    throw new Error("The login response did not include an access token.");
  }

  return payload;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: normalizeAuthSession,
      invalidatesTags: ["Auth", "User", "AdminData"],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useChangePasswordMutation } = authApi;
