import { useState } from "react";
import { Button, Popconfirm, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Check, CreditCard, Eye, Receipt, X } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import StatusBadge from "../../components/common/StatusBadge";
import EventBookingDetailModal from "./EventBookingDetailModal";
import type { Event } from "../../redux/apiSlices/eventApi";
import type {
  BookingRequestStatus,
  EventBooking,
} from "../../redux/apiSlices/eventBookingApi";
import {
  toEntityId,
  useGetEventBookingsQuery,
  useUpdateBookingRequestStatusMutation,
} from "../../redux/apiSlices/eventBookingApi";

interface EventBookingsTabProps {
  events: Event[];
  selectedEventId: string | null;
  onEventChange: (eventId: string) => void;
}

const formatCurrency = (amount: number, currency: string) => {
  const code = currency.toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString()}`;
  }
};

export default function EventBookingsTab({
  events,
  selectedEventId,
  onEventChange,
}: EventBookingsTabProps) {
  const selectedEvent = events.find((event) => event._id === selectedEventId);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(
    null,
  );
  const [detailBooking, setDetailBooking] = useState<EventBooking | null>(null);

  const openBookingDetails = (booking: EventBooking) => {
    // Must be booking collection `_id`, never eventId._id
    const bookingId = toEntityId(booking._id);

    if (!bookingId) {
      toast.error("Booking id is missing on this row.");
      return;
    }

    setDetailBooking(booking);
  };

  const { data: bookings = [], isLoading, isError, refetch } =
    useGetEventBookingsQuery(selectedEventId ?? "", {
      skip: !selectedEventId,
    });
  const [updateBookingRequestStatus] = useUpdateBookingRequestStatusMutation();

  const paidCount = bookings.filter(
    (booking) => booking.paymentStatus === "paid",
  ).length;
  const totalRevenue = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.paymentAmount, 0);

  const handleStatusUpdate = async (
    booking: EventBooking,
    bookingRequest: Extract<BookingRequestStatus, "approved" | "rejected">,
  ) => {
    if (!selectedEventId) {
      return;
    }

    const bookingId = toEntityId(booking._id);

    if (!bookingId) {
      toast.error("Booking id is missing on this row.");
      return;
    }

    setActionBookingId(bookingId);
    setActionType(bookingRequest);

    try {
      await updateBookingRequestStatus({
        bookingId,
        eventId: selectedEventId,
        bookingRequest,
      }).unwrap();
      toast.success(
        bookingRequest === "approved"
          ? `${booking.userId.name}'s booking approved.`
          : `${booking.userId.name}'s booking rejected.`,
      );
    } catch {
      toast.error(
        bookingRequest === "approved"
          ? "Unable to approve booking. Please try again."
          : "Unable to reject booking. Please try again.",
      );
    } finally {
      setActionBookingId(null);
      setActionType(null);
    }
  };

  const columns: ColumnsType<EventBooking> = [
    {
      title: "Attendee",
      key: "attendee",
      render: (_, record) => <AttendeeCell user={record.userId} />,
    },
    {
      title: "Booking",
      dataIndex: "bookingRequest",
      key: "bookingRequest",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <div className="text-[12px]">
          <div className="flex items-center gap-1.5">
            <StatusBadge status={record.paymentStatus} />
            <span className="font-medium text-gray-900">
              {formatCurrency(record.paymentAmount, record.currency)}
            </span>
          </div>
          {record.paymentDate && (
            <p className="mt-1 text-gray-500">
              Paid {dayjs(record.paymentDate).format("MMM D, YYYY h:mm A")}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Transaction",
      key: "transaction",
      render: (_, record) => (
        <div className="space-y-1 text-[11px] text-gray-600">
          {record.trxId && (
            <p className="font-mono break-all">
              <span className="text-gray-400">Trx:</span> {record.trxId}
            </p>
          )}
          {record.checkoutSessionId && (
            <p className="font-mono break-all">
              <span className="text-gray-400">Session:</span>{" "}
              {record.checkoutSessionId}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Booked",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => (
        <span className="text-[12px] text-gray-700">
          {dayjs(value).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 260,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<Eye className="h-3.5 w-3.5" />}
            onClick={() => openBookingDetails(record)}
          >
            Details
          </Button>
          {record.bookingRequest === "pending" && (
            <>
              <Popconfirm
                title="Approve this booking?"
                description={`${record.userId.name} will be confirmed for this event.`}
                okText="Approve"
                cancelText="Cancel"
                onConfirm={() => void handleStatusUpdate(record, "approved")}
              >
                <Button
                  size="small"
                  type="primary"
                  ghost
                  icon={<Check className="h-3.5 w-3.5" />}
                  loading={
                    actionBookingId === record._id && actionType === "approved"
                  }
                >
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject this booking?"
                description={`${record.userId.name}'s request will be declined.`}
                okText="Reject"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={() => void handleStatusUpdate(record, "rejected")}
              >
                <Button
                  size="small"
                  danger
                  ghost
                  icon={<X className="h-3.5 w-3.5" />}
                  loading={
                    actionBookingId === record._id && actionType === "rejected"
                  }
                >
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!events.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-gray-900">No events yet</p>
        <p className="mt-1 text-xs text-gray-500">
          Create an event first to review bookings and payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">
            Event bookings
          </h3>
          <p className="text-[12px] text-gray-500">
            Review attendees, approve requests, and track payments for an event.
          </p>
        </div>
        <Select
          className="min-w-[280px]"
          placeholder="Select an event"
          value={selectedEventId ?? undefined}
          onChange={onEventChange}
          options={events.map((event) => ({
            value: event._id,
            label: event.eventName,
          }))}
        />
      </div>

      {selectedEvent && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-gray-900">
                {selectedEvent.eventName}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">
                {dayjs(selectedEvent.startDate).format("MMM D, YYYY")}
                {selectedEvent.endDate !== selectedEvent.startDate &&
                  ` – ${dayjs(selectedEvent.endDate).format("MMM D, YYYY")}`}
              </p>
            </div>
            <p className="text-[13px] font-medium text-gray-700">
              Entry fee:{" "}
              {selectedEvent.price > 0
                ? `$${selectedEvent.price.toLocaleString()}`
                : "Free"}
            </p>
          </div>
        </div>
      )}

      {selectedEventId && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<Receipt className="h-4 w-4" />}
            label="Total bookings"
            value={bookings.length.toString()}
          />
          <SummaryCard
            icon={<CreditCard className="h-4 w-4" />}
            label="Paid bookings"
            value={paidCount.toString()}
          />
          <SummaryCard
            icon={<CreditCard className="h-4 w-4" />}
            label="Total revenue"
            value={formatCurrency(
              totalRevenue,
              bookings[0]?.currency ?? "usd",
            )}
          />
        </div>
      )}

      {!selectedEventId ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Select an event above to load bookings.
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-rose-600">
            Unable to load bookings for this event.
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={bookings}
            loading={isLoading}
            scroll={{ x: "max-content" }}
            pagination={false}
            locale={{
              emptyText: "No bookings for this event yet.",
            }}
          />
        </div>
      )}

      <EventBookingDetailModal
        open={Boolean(detailBooking)}
        bookingId={toEntityId(detailBooking?._id)}
        listBooking={detailBooking}
        onCancel={() => setDetailBooking(null)}
      />
    </div>
  );
}

function AttendeeCell({
  user,
}: {
  user: EventBooking["userId"];
}) {
  const initials = (user.name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2.5">
      {user.profile ? (
        <img
          src={user.profile}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[12px] font-semibold text-white">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-gray-900">
          {user.name}
        </p>
        <p className="truncate text-[11px] text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2 text-[#287D89]">
        {icon}
        <span className="text-[12px] text-gray-500">{label}</span>
      </div>
      <p className="text-[22px] font-semibold text-gray-900">{value}</p>
    </div>
  );
}
