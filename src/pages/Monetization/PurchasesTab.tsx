import { useMemo, useState, type ReactNode } from "react";
import { Button, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge";
import UserCell from "../../components/common/UserCell";
import {
  useGetSubscriptionsQuery,
  type Subscription,
} from "../../redux/apiSlices/subscriptionApi";

const shortenId = (value: string) =>
  value.length > 10 ? `…${value.slice(-8)}` : value;

export default function PurchasesTab() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<Subscription | null>(null);
  const { data, isLoading, isError } = useGetSubscriptionsQuery(page);

  const subscriptions = useMemo(() => {
    const rows = data?.data ?? [];
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [data?.data, statusFilter]);

  const statusOptions = useMemo(() => {
    const statuses = new Set((data?.data ?? []).map((row) => row.status));
    return [
      { value: "all", label: "All statuses" },
      ...Array.from(statuses).map((status) => ({
        value: status,
        label: status,
      })),
    ];
  }, [data?.data]);

  const columns: ColumnsType<Subscription> = [
    {
      title: "User",
      key: "user",
      width: 220,
      render: (_, row) => (
        <UserCell name={row.user.name} email={row.user.email} />
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      render: (value: string) => (
        <span className="font-mono text-[12px] text-gray-700">
          {shortenId(value)}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 90,
      render: (value: number) => (
        <span className="text-[12px] font-semibold text-gray-900">
          ${value}
        </span>
      ),
    },
    {
      title: "Period",
      key: "period",
      width: 200,
      render: (_, row) => (
        <span className="text-[12px] text-gray-600">
          {dayjs(row.currentPeriodStart).format("MMM D, YYYY")} –{" "}
          {dayjs(row.currentPeriodEnd).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      width: 100,
      render: (value: number) => (
        <span className="text-[12px] text-gray-700">{value} days</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (value: string) => (
        <span className="text-[12px] text-gray-500">
          {dayjs(value).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      align: "right",
      render: (_, row) => (
        <Button
          size="small"
          icon={<Eye className="h-3.5 w-3.5" />}
          onClick={() => setDetail(row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="!w-44"
          options={statusOptions}
        />
        <span className="ml-2 text-[12px] text-gray-500">
          <strong className="text-gray-800">
            {data?.pagination.total ?? 0}
          </strong>{" "}
          subscriptions
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 1040 }}
          locale={{
            emptyText: isError
              ? "Unable to load subscriptions."
              : "No subscriptions found.",
          }}
          pagination={{
            current: data?.pagination.page ?? page,
            pageSize: data?.pagination.limit ?? 10,
            total: data?.pagination.total ?? 0,
            showSizeChanger: false,
            onChange: (nextPage) => setPage(nextPage),
          }}
        />
      </div>

      <Modal
        open={!!detail}
        title="Subscription detail"
        footer={null}
        onCancel={() => setDetail(null)}
        width={560}
        centered
      >
        {detail && (
          <div className="space-y-3 text-[13px]">
            <Field
              k="User"
              v={
                <UserCell
                  name={detail.user.name}
                  email={detail.user.email}
                />
              }
            />
            <Field k="User ID" v={detail.user._id} />
            <Field
              k="Subscription ID"
              v={
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">
                  {detail.subscriptionId}
                </code>
              }
            />
            <Field
              k="Transaction ID"
              v={
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">
                  {detail.trxId}
                </code>
              }
            />
            <Field k="Customer ID" v={detail.customerId} />
            <Field k="Package ID" v={detail.package} />
            <Field
              k="Price"
              v={
                <span className="font-semibold text-gray-900">
                  ${detail.price}
                </span>
              }
            />
            <Field
              k="Current period"
              v={`${dayjs(detail.currentPeriodStart).format("MMM D, YYYY")} – ${dayjs(detail.currentPeriodEnd).format("MMM D, YYYY")}`}
            />
            <Field k="Remaining" v={`${detail.remaining} days`} />
            <Field k="Status" v={<StatusBadge status={detail.status} />} />
            <Field
              k="Created"
              v={dayjs(detail.createdAt).format("MMM D, YYYY h:mm A")}
            />
            <Field
              k="Updated"
              v={dayjs(detail.updatedAt).format("MMM D, YYYY h:mm A")}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-32 shrink-0 text-[12px] text-gray-500">{k}</span>
      <span className="text-[13px] text-gray-900">{v}</span>
    </div>
  );
}
