import { api } from "../api/baseApi";

export interface ProfileData {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile: string;
  onboardingComplete: boolean;
  premiumMembership: boolean;
  isBanned: boolean;
  verified: boolean;
  isAdminVerified: boolean;
  isResetPassword: boolean;
  accountInformation: {
    status: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}

export interface UpdateProfileRequest {
  name: string;
  image?: File | null;
}

const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileData, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      transformResponse: (response: ProfileResponse) => response.data,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ProfileData, UpdateProfileRequest>({
      query: ({ name, image }) => {
        const formData = new FormData();
        formData.append("name", name);
        if (image) {
          formData.append("image", image);
        }

        return {
          url: "/user",
          method: "PATCH",
          body: formData,
        };
      },
      transformResponse: (response: ProfileResponse) => response.data,
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
