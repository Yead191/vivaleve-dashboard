import { api } from "../api/baseApi";

export interface DashboardReport {
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

export interface ReportsPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface ReportsResult {
  data: DashboardReport[];
  pagination: ReportsPagination;
}

interface ReportsResponse extends ReportsResult {
  success: boolean;
  message: string;
}

interface ReportResponse {
  success: boolean;
  message: string;
  data: DashboardReport;
}

export type ReportStatus = "pending" | "approved" | "rejected";

interface UpdateReportStatusRequest {
  reportId: string;
  status: ReportStatus;
}

const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResult, number>({
      query: (page) => ({
        url: "/dashboard/reports",
        method: "GET",
        params: { page },
      }),
      transformResponse: ({ data, pagination }: ReportsResponse) => ({
        data,
        pagination,
      }),
      providesTags: ["Overview"],
    }),
    getReportById: builder.query<DashboardReport, string>({
      query: (reportId) => ({
        url: `/dashboard/reports/${reportId}`,
        method: "GET",
      }),
      transformResponse: (response: ReportResponse) => response.data,
      providesTags: ["Overview"],
    }),
    updateReportStatus: builder.mutation<
      DashboardReport,
      UpdateReportStatusRequest
    >({
      query: ({ reportId, status }) => ({
        url: `/dashboard/reports/${reportId}`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ReportResponse) => response.data,
      invalidatesTags: ["Overview"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useLazyGetReportByIdQuery,
  useUpdateReportStatusMutation,
} = reportsApi;
