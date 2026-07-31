import { useEffect } from "react";
import {
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  EVENT_STATUSES,
  EVENT_VISIBILITY,
  type CreateEventRequest,
  type Event,
} from "../../redux/apiSlices/eventApi";

interface EventFormValues {
  eventName: string;
  type: string;
  startDate: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs;
  details: string;
  visibility: CreateEventRequest["visibility"];
  price: number;
  status: CreateEventRequest["status"];
}

interface EventFormModalProps {
  open: boolean;
  loading?: boolean;
  editingEvent?: Event | null;
  onCancel: () => void;
  onSubmit: (data: CreateEventRequest) => void;
}

const toCreateEventRequest = (values: EventFormValues): CreateEventRequest => {
  const startDate = dayjs(values.startDate).startOf("day");
  const endDate = dayjs(values.endDate).startOf("day");
  const startTime = startDate
    .hour(values.startTime.hour())
    .minute(values.startTime.minute())
    .second(0)
    .millisecond(0);

  return {
    eventName: values.eventName.trim(),
    type: values.type.trim(),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    startTime: startTime.toISOString(),
    details: values.details.trim(),
    visibility: values.visibility,
    price: values.price,
    status: values.status,
  };
};

export default function EventFormModal({
  open,
  loading = false,
  editingEvent = null,
  onCancel,
  onSubmit,
}: EventFormModalProps) {
  const [form] = Form.useForm<EventFormValues>();
  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingEvent) {
      form.setFieldsValue({
        eventName: editingEvent.eventName,
        type: editingEvent.type,
        startDate: dayjs(editingEvent.startDate),
        endDate: dayjs(editingEvent.endDate),
        startTime: dayjs(editingEvent.startTime),
        details: editingEvent.details,
        visibility: editingEvent.visibility,
        price: editingEvent.price,
        status: editingEvent.status,
      });
      return;
    }

    form.resetFields();
  }, [open, editingEvent, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(toCreateEventRequest(values));
    } catch {
      // validation errors are shown by antd form
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit event" : "Create event"}
      okText={isEditing ? "Save changes" : "Create event"}
      confirmLoading={loading}
      onOk={() => void handleOk()}
      onCancel={onCancel}
      centered
      width={680}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          visibility: "public",
          status: "upcoming",
        }}
      >
        <Form.Item
          name="eventName"
          label="Event name"
          rules={[{ required: true, message: "Event name is required" }]}
        >
          <Input placeholder="e.g. Flutter Team Sprint Planning" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="type"
            label="Event type"
            rules={[{ required: true, message: "Event type is required" }]}
          >
            <Input placeholder="e.g. meeting, workshop, social" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select
              options={EVENT_STATUSES.map((value) => ({
                value,
                label: value,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="details"
          label="Details"
          rules={[{ required: true, message: "Details are required" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Describe the event agenda, goals, and any notes for attendees."
          />
        </Form.Item>

        <Divider className="!my-4" plain>
          Schedule
        </Divider>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="startDate"
            label="Start date"
            rules={[{ required: true, message: "Start date is required" }]}
          >
            <DatePicker className="!w-full" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End date"
            rules={[
              { required: true, message: "End date is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue("startDate");

                  if (!value || !startDate || !value.isBefore(startDate, "day")) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("End date cannot be before start date"),
                  );
                },
              }),
            ]}
          >
            <DatePicker className="!w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="startTime"
          label="Start time"
          rules={[{ required: true, message: "Start time is required" }]}
        >
          <TimePicker className="!w-full" format="h:mm A" use12Hours />
        </Form.Item>

        <Divider className="!my-4" plain>
          Visibility
        </Divider>

        <Form.Item
          name="visibility"
          label="Who can see this event"
          rules={[{ required: true, message: "Visibility is required" }]}
        >
          <Select
            options={EVENT_VISIBILITY.map((value) => ({
              value,
              label: value,
            }))}
          />
        </Form.Item>

        <Divider className="!my-4" plain>
          Other
        </Divider>

        <Form.Item
          name="price"
          label="Price / entry fee"
          extra="Set the amount attendees pay to join this event. Use 0 for free events."
          rules={[{ required: true, message: "Price is required" }]}
        >
          <InputNumber min={0} step={1} prefix="$" className="!w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
