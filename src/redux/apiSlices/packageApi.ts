import { api } from "../api/baseApi";

export const PACKAGE_DURATIONS = [
  "1 month",
  "3 months",
  "6 months",
  "1 year",
] as const;

export const PACKAGE_PAYMENT_TYPES = ["Monthly", "Yearly"] as const;

export const PACKAGE_STATUSES = ["Active", "Delete"] as const;

export type PackageDuration = (typeof PACKAGE_DURATIONS)[number];
export type PackagePaymentType = (typeof PACKAGE_PAYMENT_TYPES)[number];
export type PackageStatus = (typeof PACKAGE_STATUSES)[number];

/** Writable package fields from the Mongoose schema (excludes user + timestamps). */
export interface PackagePayload {
  title: string;
  price: number;
  duration: PackageDuration;
  paymentType: PackagePaymentType;
  productId: string;
  priceId: string;
  paymentLink: string;
  status: PackageStatus;
}

/** POST /package — user is set server-side from the authenticated admin. */
export type CreatePackageRequest = Omit<PackagePayload, "status">;

export interface UpdatePackageRequest {
  packageId: string;
  body: Partial<PackagePayload>;
}

export interface Package extends PackagePayload {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface PackageListResponse {
  success: boolean;
  message: string;
  data: Package[];
}

interface PackageResponse {
  success: boolean;
  message: string;
  data: Package;
}

const packageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<Package[], void>({
      query: () => ({
        url: "/package",
        method: "GET",
      }),
      transformResponse: (response: PackageListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((pkg) => ({ type: "Package" as const, id: pkg._id })),
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),
    getPackageById: builder.query<Package, string>({
      query: (packageId) => ({
        url: `/package/${packageId}`,
        method: "GET",
      }),
      transformResponse: (response: PackageResponse) => response.data,
      providesTags: (_result, _error, packageId) => [
        { type: "Package", id: packageId },
      ],
    }),
    createPackage: builder.mutation<Package, CreatePackageRequest>({
      query: (body) => ({
        url: "/package",
        method: "POST",
        body,
      }),
      transformResponse: (response: PackageResponse) => response.data,
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),
    updatePackage: builder.mutation<Package, UpdatePackageRequest>({
      query: ({ packageId, body }) => ({
        url: `/package/${packageId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: PackageResponse) => response.data,
      invalidatesTags: (_result, _error, { packageId }) => [
        { type: "Package", id: packageId },
        { type: "Package", id: "LIST" },
      ],
    }),
    deletePackage: builder.mutation<Package, string>({
      query: (packageId) => ({
        url: `/package/${packageId}`,
        method: "PATCH",
        body: { status: "Delete" },
      }),
      transformResponse: (response: PackageResponse) => response.data,
      invalidatesTags: (_result, _error, packageId) => [
        { type: "Package", id: packageId },
        { type: "Package", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
