import { api } from "../api/baseApi";

export interface SubscriptionUser {
  _id: string;
  name: string;
  email: string;
}

export interface Subscription {
  _id: string;
  customerId: string;
  price: number;
  user: SubscriptionUser;
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
export interface SubscriptionsPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface SubscriptionsResult {
  data: Subscription[];
  pagination: SubscriptionsPagination;
}

interface SubscriptionsResponse extends SubscriptionsResult {
  success: boolean;
  message: string;
}

const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<SubscriptionsResult, number>({
      query: (page) => ({
        url: "/subscription",
        method: "GET",
        params: { page },
      }),
      transformResponse: ({ data, pagination }: SubscriptionsResponse) => ({
        data,
        pagination,
      }),
    }),
  }),
});

export const { useGetSubscriptionsQuery } = subscriptionApi;
