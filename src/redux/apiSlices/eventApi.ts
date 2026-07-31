import { api } from "../api/baseApi";

export const EVENT_VISIBILITY = ["public", "private"] as const;

export const EVENT_STATUSES = ["upcoming", "completed", "cancelled"] as const;

export type EventVisibility = (typeof EVENT_VISIBILITY)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface CreateEventRequest {
  eventName: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  details: string;
  visibility: EventVisibility;
  price: number;
  status: EventStatus;
}

export interface UpdateEventRequest {
  eventId: string;
  body: Partial<CreateEventRequest>;
}

export interface Event extends CreateEventRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface EventListResponse {
  success: boolean;
  message: string;
  data: Event[];
}

interface EventResponse {
  success: boolean;
  message: string;
  data: Event;
}

const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
      transformResponse: (response: EventListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((event) => ({
                type: "Event" as const,
                id: event._id,
              })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),
    createEvent: builder.mutation<Event, CreateEventRequest>({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      transformResponse: (response: EventResponse) => response.data,
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    updateEvent: builder.mutation<Event, UpdateEventRequest>({
      query: ({ eventId, body }) => ({
        url: `/events/${eventId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: EventResponse) => response.data,
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "Event", id: eventId },
        { type: "Event", id: "LIST" },
      ],
    }),
    deleteEvent: builder.mutation<Event, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
      }),
      transformResponse: (response: EventResponse) => response.data,
      invalidatesTags: (_result, _error, eventId) => [
        { type: "Event", id: eventId },
        { type: "Event", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
