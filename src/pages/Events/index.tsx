import { useEffect, useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../components/common/PageHeader";
import TabsBar from "../../components/common/TabsBar";
import EventBookingsTab from "./EventBookingsTab";
import EventFormModal from "./EventFormModal";
import EventsTable from "./EventsTable";
import {
  type CreateEventRequest,
  type Event,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useUpdateEventMutation,
} from "../../redux/apiSlices/eventApi";

export default function Events() {
  const [tab, setTab] = useState("events");
  const [openForm, setOpenForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data: events = [], isLoading, isError, refetch } = useGetEventsQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    if (!events.length) {
      setSelectedEventId(null);
      return;
    }

    if (!selectedEventId || !events.some((event) => event._id === selectedEventId)) {
      setSelectedEventId(events[0]._id);
    }
  }, [events, selectedEventId]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setOpenForm(true);
  };

  const handleViewBookings = (event: Event) => {
    setSelectedEventId(event._id);
    setTab("bookings");
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingEvent(null);
  };

  const handleCreate = async (values: CreateEventRequest) => {
    try {
      await createEvent(values).unwrap();
      toast.success("Event created successfully.");
      handleCloseForm();
    } catch {
      toast.error("Unable to create event. Please try again.");
    }
  };

  const handleUpdate = async (values: CreateEventRequest) => {
    if (!editingEvent) {
      return;
    }

    try {
      await updateEvent({
        eventId: editingEvent._id,
        body: values,
      }).unwrap();
      toast.success("Event updated successfully.");
      handleCloseForm();
    } catch {
      toast.error("Unable to update event. Please try again.");
    }
  };

  const handleSubmit = (values: CreateEventRequest) => {
    if (editingEvent) {
      void handleUpdate(values);
      return;
    }

    void handleCreate(values);
  };

  const handleDelete = async (event: Event) => {
    setDeletingEventId(event._id);

    try {
      await deleteEvent(event._id).unwrap();
      toast.success(`${event.eventName} has been deleted.`);
    } catch {
      toast.error("Unable to delete event. Please try again.");
    } finally {
      setDeletingEventId(null);
    }
  };

  const tabs = [
    { key: "events", label: "All events", count: events.length },
    { key: "bookings", label: "Bookings" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event management"
        subtitle="Create and manage curated events, meetings, and paid experiences."
        actions={
          tab === "events" ? (
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleOpenCreate}
            >
              Create event
            </Button>
          ) : undefined
        }
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === "events" && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-rose-600">Unable to load events.</p>
              <Button className="mt-4" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <EventsTable
              data={events}
              loading={isLoading}
              deletingEventId={deletingEventId}
              onEdit={handleOpenEdit}
              onDelete={(event) => void handleDelete(event)}
              onViewBookings={handleViewBookings}
            />
          )}
        </div>
      )}

      {tab === "bookings" && (
        <EventBookingsTab
          events={events}
          selectedEventId={selectedEventId}
          onEventChange={setSelectedEventId}
        />
      )}

      <EventFormModal
        open={openForm}
        loading={isCreating || isUpdating}
        editingEvent={editingEvent}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
