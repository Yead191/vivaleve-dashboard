import { Button, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Pencil, Trash2, Users } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge";
import type { Event } from "../../redux/apiSlices/eventApi";

interface EventsTableProps {
  data: Event[];
  loading?: boolean;
  isError?: boolean;
  deletingEventId?: string | null;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onViewBookings: (event: Event) => void;
}

export default function EventsTable({
  data,
  loading = false,
  isError = false,
  deletingEventId = null,
  onEdit,
  onDelete,
  onViewBookings,
}: EventsTableProps) {
  const columns: ColumnsType<Event> = [
    {
      title: "Event",
      key: "eventName",
      render: (_, record) => (
        <div>
          <p className="text-[13px] font-medium text-gray-900">
            {record.eventName}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] text-gray-500">
            {record.details}
          </p>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div className="text-[12px] text-gray-700">
          <p>{dayjs(record.startDate).format("MMM D, YYYY")}</p>
          <p className="text-gray-500">
            {dayjs(record.startTime).format("h:mm A")}
          </p>
        </div>
      ),
    },
    {
      title: "Visibility",
      dataIndex: "visibility",
      key: "visibility",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: number) =>
        value > 0 ? `$${value.toLocaleString()}` : "Free",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => <StatusBadge status={value} />,
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
            icon={<Users className="h-3.5 w-3.5" />}
            onClick={() => onViewBookings(record)}
          >
            View bookings
          </Button>
          <Button
            size="small"
            icon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this event?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => onDelete(record)}
          >
            <Button
              size="small"
              danger
              icon={<Trash2 className="h-3.5 w-3.5" />}
              loading={deletingEventId === record._id}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-rose-600">Unable to load events.</p>
      </div>
    );
  }

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={false}
      locale={{ emptyText: "No events yet. Create your first event." }}
    />
  );
}
