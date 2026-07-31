import { api } from "../api/baseApi";
import type { VerifiedStatus } from "../../utils/verifiedStatus";

export interface OverviewData {
  totalUser: number;
  activeToday: number;
  newSignupUser: number;
  totalMatchesUser: number;
  openReport: number;
}

interface OverviewResponse {
  success: boolean;
  message: string;
  data: OverviewData;
}

export interface UserActivityData {
  day: string;
  activeCount: number;
}

interface UserActivityResponse {
  success: boolean;
  message: string;
  data: UserActivityData[];
}

export interface NewUserActivityData {
  day: string;
  newUser: number;
}

interface NewUserActivityResponse {
  success: boolean;
  message: string;
  data: NewUserActivityData[];
}

export interface RecentSignupUser {
  _id: string;
  name: string;
  email: string;
  profile: string;
  status: string;
  onboardingComplete: boolean;
  premiumMembership: boolean;
  verified: boolean;
  isAdminVerified: boolean;
  verifiedStatus?: VerifiedStatus;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RecentSignupUsersResponse {
  success: boolean;
  message: string;
  data: RecentSignupUser[];
}

export interface RecentReport {
  _id: string;
  postId: string;
  userId: string;
  reason: string;
  description: string;
  image: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RecentReportsResponse {
  success: boolean;
  message: string;
  data: RecentReport[];
}

export interface RecentSubscription {
  _id: string;
  customerId: string;
  price: number;
  user: string;
  package: string;
  trxId: string;
  subscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  remaining: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RecentSubscriptionsResponse {
  success: boolean;
  message: string;
  data: RecentSubscription[];
}

export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  profile: string;
  premiumMembership: boolean;
  isBanned: boolean;
  verified: boolean;
  isAdminVerified: boolean;
  verifiedStatus?: VerifiedStatus;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface UserListResult {
  data: DashboardUser[];
  pagination: UserListPagination;
}

interface UserListResponse extends UserListResult {
  success: boolean;
  message: string;
}

const overviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewData, void>({
      query: () => ({
        url: "/dashboard/overview/",
        method: "GET",
      }),
      transformResponse: (response: OverviewResponse) => response.data,
      providesTags: ["Overview"],
    }),
    // get user activity
    getUserActivity: builder.query<UserActivityData[], void>({
      query: () => ({
        url: "/dashboard/user-activity",
        method: "GET",
      }),
      transformResponse: (response: UserActivityResponse) => response.data,
      providesTags: ["Overview"],
    }),
    // get new user activity
    getNewUsersActivity: builder.query<NewUserActivityData[], void>({
      query: () => ({
        url: "/dashboard/new-user-activity",
        method: "GET",
      }),
      transformResponse: (response: NewUserActivityResponse) => response.data,
      providesTags: ["Overview"],
    }),
    // recent signup user
    getRecentSignupUsers: builder.query<RecentSignupUser[], void>({
      query: () => ({
        url: "/dashboard/recent-signup-users",
        method: "GET",
      }),
      transformResponse: (response: RecentSignupUsersResponse) => response.data,
      providesTags: ["Overview"],
    }),
    // recent report
    getRecentReports: builder.query<RecentReport[], void>({
      query: () => ({
        url: "/dashboard/recent-reports",
        method: "GET",
      }),
      transformResponse: (response: RecentReportsResponse) => response.data,
      providesTags: ["Overview"],
    }),
    // recent subscription
    getRecentSubscriptions: builder.query<RecentSubscription[], void>({
      query: () => ({
        url: "/dashboard/recent-subscriptions",
        method: "GET",
      }),
      transformResponse: (response: RecentSubscriptionsResponse) =>
        response.data,
      providesTags: ["Overview"],
    }),
    getUserList: builder.query<UserListResult, number>({
      query: (page) => ({
        url: "/dashboard/user-list",
        method: "GET",
        params: { page },
      }),
      transformResponse: ({ data, pagination }: UserListResponse) => ({
        data,
        pagination,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetUserActivityQuery,
  useGetNewUsersActivityQuery,
  useGetRecentSignupUsersQuery,
  useGetRecentReportsQuery,
  useGetRecentSubscriptionsQuery,
  useGetUserListQuery,
  useLazyGetUserListQuery,
} = overviewApi;
