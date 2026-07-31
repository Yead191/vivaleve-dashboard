import { Link } from "react-router-dom";
import { Button, Popconfirm, Table } from "antd";
import { Ban, Eye, ShieldCheck, ShieldX } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import UserCell from "../../components/common/UserCell";
import StatusBadge from "../../components/common/StatusBadge";
import { TableSkeleton } from "../../components/common/skeletons/PageSkeletons";
import { User } from "../../data/mockData";
import {
  formatVerifiedStatusLabel,
  VERIFIED_STATUS_STYLES,
  type VerifiedStatus,
} from "../../utils/verifiedStatus";

interface UsersTableProps {
  data: User[];
  onBan: (user: User) => void;
  onVerify: (user: User) => void;
  onReject: (user: User) => void;
  banningUserId?: string | null;
  verifyingUserId?: string | null;
  rejectingUserId?: string | null;
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  isError?: boolean;
}

const VerifiedStatusBadge = ({ status }: { status: VerifiedStatus | null }) => {
  if (!status) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
        Not submitted
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${VERIFIED_STATUS_STYLES[status]}`}
    >
      {formatVerifiedStatusLabel(status)}
    </span>
  );
};

export default function UsersTable({
  data,
  onBan,
  onVerify,
  onReject,
  banningUserId,
  verifyingUserId,
  rejectingUserId,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  isError,
}: UsersTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, row) => <UserCell name={row.name} email={row.email} />,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      responsive: ["md"],
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 110,
      responsive: ["lg"],
      sorter: (a, b) => a.joinDate.localeCompare(b.joinDate),
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: "Updated",
      dataIndex: "lastActive",
      key: "lastActive",
      width: 110,
      responsive: ["xl"],
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      width: 96,
      responsive: ["sm"],
      render: (plan: string) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
            plan === "Premium"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {plan}
        </span>
      ),
    },
    {
      title: "Verification",
      dataIndex: "verifiedStatus",
      key: "verifiedStatus",
      width: 120,
      responsive: ["sm"],
      render: (verifiedStatus: VerifiedStatus | null) => (
        <VerifiedStatusBadge status={verifiedStatus} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 300,
      render: (_, row) => {
        const canVerify =
          row.verifiedStatus === "pending" || row.verifiedStatus === "rejected";
        const canReject = row.verifiedStatus === "pending";

        return (
          <div className="flex min-w-[260px] flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <Link to={`/users/${row.id}`}>
              <Button size="small" icon={<Eye className="h-3.5 w-3.5" />}>
                <span className="hidden sm:inline">Details</span>
              </Button>
            </Link>
            {canVerify && (
              <Popconfirm
                title="Verify this user?"
                description="This will approve the user's verification request."
                okText="Verify"
                cancelText="Cancel"
                onConfirm={() => onVerify(row)}
              >
                <Button
                  size="small"
                  type="primary"
                  ghost
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                  loading={verifyingUserId === row.id}
                >
                  <span className="hidden sm:inline">Verify</span>
                </Button>
              </Popconfirm>
            )}
            {canReject && (
              <Popconfirm
                title="Reject verification?"
                description="This user will need to submit verification again."
                okText="Reject"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={() => onReject(row)}
              >
                <Button
                  size="small"
                  danger
                  ghost
                  icon={<ShieldX className="h-3.5 w-3.5" />}
                  loading={rejectingUserId === row.id}
                >
                  <span className="hidden sm:inline">Reject</span>
                </Button>
              </Popconfirm>
            )}
            {row.status !== "banned" && (
              <Button
                size="small"
                danger
                icon={<Ban className="h-3.5 w-3.5" />}
                loading={banningUserId === row.id}
                onClick={() => onBan(row)}
              >
                <span className="hidden sm:inline">Ban</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  return (
    <Table
      className="users-table min-w-[640px]"
      dataSource={data}
      columns={columns}
      rowKey="id"
      size="small"
      scroll={{ x: "max-content" }}
      locale={{
        emptyText: isError ? "Unable to load users." : "No users found.",
      }}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: false,
        responsive: true,
        showLessItems: true,
        onChange: onPageChange,
      }}
    />
  );
}
