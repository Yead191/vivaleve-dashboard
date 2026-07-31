import type { ReactNode } from "react";
import { Button, Modal, Spin } from "antd";
import dayjs from "dayjs";
import StatusBadge from "../../components/common/StatusBadge";
import type {
  EventBooking,
  EventBookingDetail,
  EventBookingUser,
} from "../../redux/apiSlices/eventBookingApi";
import { useGetEventBookingByIdQuery } from "../../redux/apiSlices/eventBookingApi";

interface EventBookingDetailModalProps {
  open: boolean;
  /** Booking collection `_id` — never the event id. */
  bookingId: string | null;
  /** List-row data used as fallback / attendee display. */
  listBooking?: EventBooking | null;
  onCancel: () => void;
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

const toDetailFromList = (booking: EventBooking): EventBookingDetail => ({
  _id: booking._id,
  eventId: booking.eventId,
  userId:
    typeof booking.userId === "object" && booking.userId
      ? booking.userId._id
      : String(booking.userId),
  bookingRequest: booking.bookingRequest,
  paymentStatus: booking.paymentStatus,
  paymentDate: booking.paymentDate,
  paymentAmount: booking.paymentAmount,
  currency: booking.currency,
  isDeleted: booking.isDeleted,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
  checkoutSessionId: booking.checkoutSessionId,
  trxId: booking.trxId,
});

export default function EventBookingDetailModal({
  open,
  bookingId,
  listBooking = null,
  onCancel,
}: EventBookingDetailModalProps) {
  const {
    data: fetchedBooking,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetEventBookingByIdQuery(bookingId ?? "", {
    skip: !open || !bookingId,
    refetchOnMountOrArgChange: true,
  });

  const booking = fetchedBooking ?? (listBooking ? toDetailFromList(listBooking) : null);
  const attendee: EventBookingUser | null =
    listBooking && typeof listBooking.userId === "object"
      ? listBooking.userId
      : null;

  const apiErrorMessage =
    error && typeof error === "object" && "data" in error
      ? String(
          (error.data as { message?: string } | undefined)?.message ??
            "Booking not found",
        )
      : "Unable to load booking details.";

  return (
    <Modal
      open={open}
      title="Booking details"
      onCancel={onCancel}
      footer={null}
      centered
      width={640}
      destroyOnClose
    >
      {(isLoading || isFetching) && !booking && (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      )}

      {!isLoading && !isFetching && isError && !booking && (
        <div className="py-8 text-center">
          <p className="text-sm text-rose-600">{apiErrorMessage}</p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {booking && (
        <div className="space-y-5">
          <section className="space-y-3">
            <SectionTitle>Event</SectionTitle>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[14px] font-semibold text-gray-900">
                {booking.eventId.eventName}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">
                {dayjs(booking.eventId.startDate).format("MMM D, YYYY")}
                {booking.eventId.endDate !== booking.eventId.startDate &&
                  ` – ${dayjs(booking.eventId.endDate).format("MMM D, YYYY")}`}
              </p>
              {booking.eventId.details && (
                <p className="mt-2 text-[12px] leading-relaxed text-gray-600">
                  {booking.eventId.details}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {booking.eventId.status && (
                  <StatusBadge status={booking.eventId.status} />
                )}
                <span className="text-[12px] font-medium text-gray-700">
                  Ticket price:{" "}
                  {booking.eventId.price > 0
                    ? formatCurrency(booking.eventId.price, booking.currency)
                    : "Free"}
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle>Attendee</SectionTitle>
            {attendee ? (
              <div className="flex items-center gap-3">
                {attendee.profile ? (
                  <img
                    src={attendee.profile}
                    alt={attendee.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[12px] font-semibold text-white">
                    {(attendee.name || "?")
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-[13px] font-medium text-gray-900">
                    {attendee.name}
                  </p>
                  <p className="text-[12px] text-gray-500">{attendee.email}</p>
                </div>
              </div>
            ) : (
              <DetailRow label="User ID" value={booking.userId} mono />
            )}
          </section>

          <section className="space-y-3">
            <SectionTitle>Booking status</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow
                label="Request"
                value={<StatusBadge status={booking.bookingRequest} />}
              />
              <DetailRow
                label="Payment"
                value={<StatusBadge status={booking.paymentStatus} />}
              />
              <DetailRow
                label="Amount"
                value={formatCurrency(booking.paymentAmount, booking.currency)}
              />
              <DetailRow
                label="Payment date"
                value={
                  booking.paymentDate
                    ? dayjs(booking.paymentDate).format("MMM D, YYYY h:mm A")
                    : "—"
                }
              />
              <DetailRow
                label="Booked on"
                value={dayjs(booking.createdAt).format("MMM D, YYYY h:mm A")}
              />
              <DetailRow
                label="Last updated"
                value={dayjs(booking.updatedAt).format("MMM D, YYYY h:mm A")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle>Payment references</SectionTitle>
            <div className="space-y-2">
              <DetailRow
                label="Transaction ID"
                value={booking.trxId || "—"}
                mono
              />
              <DetailRow
                label="Checkout session"
                value={booking.checkoutSessionId || "—"}
                mono
              />
              <DetailRow label="Booking ID" value={booking._id} mono />
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h4 className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </h4>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-gray-500">{label}</p>
      <div
        className={`mt-0.5 text-[13px] font-medium text-gray-900 ${
          mono ? "break-all font-mono text-[11px]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
