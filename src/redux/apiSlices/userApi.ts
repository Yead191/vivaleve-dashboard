import { api } from "../api/baseApi";

export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
  role: string;
  status: string;
  profile: string;
  isAdminVerified: boolean;
  premiumMembership: boolean;
  isBanned: boolean;
  verified: boolean;
  isResetPassword: boolean;
  accountInformation: {
    status: boolean;
  };
  createdAt: string;
  updatedAt: string;
  DOB?: string;
  bio?: string;
  country?: string;
  displayName?: string;
  education?: string;
  gender?: string;
  height?: number;
  livingWith?: string;
  lookingFor?: string;
  nationality?: string;
  occupation?: string;
  relationStatus?: string;
  state?: string;
  weight?: number;
  zidCode?: number;
  protectedImages?: string;
  phone?: string;
}

interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetails;
}

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<UserDetails, string>({
      query: (userId) => ({
        url: `/dashboard/user-list/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: UserDetailsResponse) => response.data,
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
      ],
    }),
    banUser: builder.mutation<UserDetails, string>({
      query: (userId) => ({
        url: `/dashboard/user-list/${userId}`,
        method: "PATCH",
      }),
      transformResponse: (response: UserDetailsResponse) => response.data,
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "User",
      ],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useBanUserMutation,
} = userApi;
