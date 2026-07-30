import { api } from "../api/baseApi";

export interface SwipeAnalyticsData {
  day: string;
  likes: number;
  rejects: number;
  matches: number;
}

interface SwipeAnalyticsResponse {
  success: boolean;
  message: string;
  data: SwipeAnalyticsData[];
}

export interface RevenueAnalyticsData {
  period: string;
  subscriptions: number;
}

interface RevenueAnalyticsResponse {
  success: boolean;
  message: string;
  data: RevenueAnalyticsData[];
}

export interface PlanDistributionData {
  name: string;
  value: number;
}

interface PlanDistributionResponse {
  success: boolean;
  message: string;
  data: PlanDistributionData[];
}

export interface GenderDistributionData {
  name: string;
  value: number;
}

interface GenderDistributionResponse {
  success: boolean;
  message: string;
  data: GenderDistributionData[];
}

export interface AgeDistributionData {
  range: string;
  users: number;
}

interface AgeDistributionResponse {
  success: boolean;
  message: string;
  data: AgeDistributionData[];
}

const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSwipeAnalytics: builder.query<SwipeAnalyticsData[], void>({
      query: () => ({
        url: "/dashboard/analytics",
        method: "GET",
      }),
      transformResponse: (response: SwipeAnalyticsResponse) => response.data,
    }),
    getMonthlyRevenueAnalytics: builder.query<RevenueAnalyticsData[], void>({
      query: () => ({
        url: "/dashboard/analytics/revenue",
        method: "GET",
      }),
      transformResponse: (response: RevenueAnalyticsResponse) => response.data,
    }),
    getYearlyRevenueAnalytics: builder.query<RevenueAnalyticsData[], void>({
      query: () => ({
        url: "/dashboard/analytics/revenue/yearly",
        method: "GET",
      }),
      transformResponse: (response: RevenueAnalyticsResponse) => response.data,
    }),
    getPlanDistributionAnalytics: builder.query<PlanDistributionData[], void>({
      query: () => ({
        url: "/dashboard/analytics/plan-distribution",
        method: "GET",
      }),
      transformResponse: (response: PlanDistributionResponse) => response.data,
    }),
    getGenderDistributionAnalytics: builder.query<GenderDistributionData[], void>({
      query: () => ({
        url: "/dashboard/analytics/gender-distribution",
        method: "GET",
      }),
      transformResponse: (response: GenderDistributionResponse) => response.data,
    }),
    getAgeDistributionAnalytics: builder.query<AgeDistributionData[], void>({
      query: () => ({
        url: "/dashboard/analytics/age-distribution",
        method: "GET",
      }),
      transformResponse: (response: AgeDistributionResponse) => response.data,
    }),
  }),
});

export const {
  useGetSwipeAnalyticsQuery,
  useGetMonthlyRevenueAnalyticsQuery,
  useGetYearlyRevenueAnalyticsQuery,
  useGetPlanDistributionAnalyticsQuery,
  useGetGenderDistributionAnalyticsQuery,
  useGetAgeDistributionAnalyticsQuery,
} = analyticsApi;
