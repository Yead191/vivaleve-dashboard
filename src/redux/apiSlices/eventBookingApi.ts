import { api } from "../api/baseApi";

export type BookingRequestStatus = "pending" | "accepted" | "rejected";
export type PaymentStatus = "paid" | "unpaid" | "refunded" | "failed";

export interface EventBookingEvent {
  _id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  details: string;
  price: number;
  status?: string;
  eventOwner?: string;
}

export interface EventBookingUser {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

export interface EventBooking {
  _id: string;
  eventId: EventBookingEvent;
  userId: EventBookingUser;
  bookingRequest: BookingRequestStatus;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentAmount: number;
  currency: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  checkoutSessionId?: string;
  trxId?: string;
}

/** GET /event-booking/:bookingId — userId is a plain string id. */
export interface EventBookingDetail {
  _id: string;
  eventId: EventBookingEvent;
  userId: string;
  bookingRequest: BookingRequestStatus;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentAmount: number;
  currency: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  checkoutSessionId?: string;
  trxId?: string;
}

export interface UpdateBookingRequestStatusRequest {
  bookingId: string;
  eventId: string;
  bookingRequest: Extract<BookingRequestStatus, "accepted" | "rejected">;
}

interface EventBookingListResponse {
  success: boolean;
  message: string;
  data: EventBooking[];
}

interface EventBookingResponse {
  success: boolean;
  message: string;
  data: EventBooking;
}

interface EventBookingDetailResponse {
  success: boolean;
  message: string;
  data: EventBookingDetail;
}

/** Normalize Mongo / API id values to a plain string. */
export const toEntityId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.$oid === "string") {
      return record.$oid;
    }

    if ("_id" in record) {
      return toEntityId(record._id);
    }

    if (typeof record.id === "string") {
      return record.id;
    }
  }

  return null;
};

const eventBookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEventBookings: builder.query<EventBooking[], string>({
      query: (eventId) => ({
        url: `/event-booking/event/${eventId}`,
        method: "GET",
      }),
      transformResponse: (response: EventBookingListResponse) => response.data,
      providesTags: (_result, _error, eventId) => [
        { type: "EventBooking", id: `EVENT-${eventId}` },
      ],
    }),
    /**
     * Single booking details.
     * Path: GET /event-booking/:bookingId
     * Param must be booking collection `_id` — NOT eventId.
     */
    getEventBookingById: builder.query<EventBookingDetail, string>({
      query: (bookingId) => ({
        url: `/event-booking/${bookingId}`,
        method: "GET",
      }),
      transformResponse: (response: EventBookingDetailResponse) =>
        response.data,
      providesTags: (_result, _error, bookingId) => [
        { type: "EventBooking", id: `BOOKING-${bookingId}` },
      ],
    }),
    updateBookingRequestStatus: builder.mutation<
      EventBooking,
      UpdateBookingRequestStatusRequest
    >({
      query: ({ bookingId, bookingRequest }) => ({
        url: `/event-booking/${bookingId}/request`,
        method: "PATCH",
        body: { bookingRequest },
      }),
      transformResponse: (response: EventBookingResponse) => response.data,
      invalidatesTags: (_result, _error, { bookingId, eventId }) => [
        { type: "EventBooking", id: `BOOKING-${bookingId}` },
        { type: "EventBooking", id: `EVENT-${eventId}` },
      ],
    }),
  }),
});

export const {
  useGetEventBookingsQuery,
  useGetEventBookingByIdQuery,
  useLazyGetEventBookingByIdQuery,
  useUpdateBookingRequestStatusMutation,
} = eventBookingApi;
