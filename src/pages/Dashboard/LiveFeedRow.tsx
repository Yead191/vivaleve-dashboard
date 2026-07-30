import { Link } from "react-router-dom";
import { Table } from "antd";
import SectionCard from "../../components/common/SectionCard";
import StatusBadge from "../../components/common/StatusBadge";
import UserCell from "../../components/common/UserCell";
import { TableSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  useGetRecentReportsQuery,
  useGetRecentSignupUsersQuery,
  useGetRecentSubscriptionsQuery,
} from "../../redux/apiSlices/overviewApi";
import type {
  RecentReport,
  RecentSignupUser,
  RecentSubscription,
} from "../../redux/apiSlices/overviewApi";
import type { ColumnsType } from "antd/es/table";

const formatTimeAgo = (date: string) => {
  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );

  if (elapsedSeconds < 60) return "just now";
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400)
    return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  if (elapsedSeconds < 2592000)
    return `${Math.floor(elapsedSeconds / 86400)}d ago`;

  return new Date(date).toLocaleDateString();
};

export default function LiveFeedRow() {
  const {
    data: recentSignupUsers = [],
    isLoading: isRecentSignupUsersLoading,
    isError: isRecentSignupUsersError,
  } = useGetRecentSignupUsersQuery();
  const {
    data: recentReports = [],
    isLoading: isRecentReportsLoading,
    isError: isRecentReportsError,
  } = useGetRecentReportsQuery();
  const {
    data: recentSubscriptions = [],
    isLoading: isRecentSubscriptionsLoading,
    isError: isRecentSubscriptionsError,
  } = useGetRecentSubscriptionsQuery();

  const signupCols: ColumnsType<RecentSignupUser> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_, r) => <UserCell name={r.name} email={r.email} />,
    },
    {
      title: "Plan",
      dataIndex: "premiumMembership",
      key: "plan",
      width: 100,
      render: (premium: boolean) => (
        <span className="text-[12px] text-gray-700">
          {premium ? "Premium" : "Free"}
        </span>
      ),
    },
    {
      title: "When",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (createdAt: string) => (
        <span className="text-[12px] text-gray-500">
          {formatTimeAgo(createdAt)}
        </span>
      ),
    },
  ];
  const reportCols: ColumnsType<RecentReport> = [
    {
      title: "Post",
      dataIndex: "postId",
      key: "postId",
      render: (postId: string) => (
        <span className="text-[12px] font-medium text-gray-900">
          …{postId.slice(-6)}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        <span className="text-[12px] text-gray-600">
          {reason.replace(/([a-z])([A-Z])/g, "$1 $2")}
        </span>
      ),
    },
    {
      title: "When",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 90,
      render: (createdAt: string) => (
        <span className="text-[12px] text-gray-500">
          {formatTimeAgo(createdAt)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (v: string) => <StatusBadge status={v} />,
    },
  ];
  const purchaseCols: ColumnsType<RecentSubscription> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (userId: string) => (
        <span className="text-[12px] font-medium text-gray-900">
          …{userId.slice(-6)}
        </span>
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      render: (packageId: string) => (
        <span className="text-[12px] text-gray-600">
          …{packageId.slice(-6)}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "price",
      key: "price",
      width: 90,
      render: (price: number) => (
        <span className="text-[12px] font-medium text-gray-900">
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => <StatusBadge status={v} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SectionCard
        title="Recent signups"
        description="Last 10"
        action={
          <Link
            to="/users"
            className="text-[12px] font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        }
        noPadding
      >
        {isRecentSignupUsersLoading ? (
          <TableSkeleton rows={6} columns={3} />
        ) : (
          <Table
            dataSource={recentSignupUsers}
            columns={signupCols}
            rowKey="_id"
            pagination={false}
            size="small"
            locale={{
              emptyText: isRecentSignupUsersError
                ? "Unable to load recent signups."
                : "No recent signups.",
            }}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Recent reports"
        description="Last 10"
        action={
          <Link
            to="/moderation"
            className="text-[12px] font-medium text-brand-600 hover:text-brand-700"
          >
            Moderate →
          </Link>
        }
        noPadding
      >
        {isRecentReportsLoading ? (
          <TableSkeleton rows={6} columns={4} />
        ) : (
          <Table
            dataSource={recentReports}
            columns={reportCols}
            rowKey="_id"
            pagination={false}
            size="small"
            locale={{
              emptyText: isRecentReportsError
                ? "Unable to load recent reports."
                : "No recent reports.",
            }}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Recent subscriptions"
        description="Last 10"
        action={
          <Link
            to="/monetization"
            className="text-[12px] font-medium text-brand-600 hover:text-brand-700"
          >
            View revenue →
          </Link>
        }
        noPadding
      >
        {isRecentSubscriptionsLoading ? (
          <TableSkeleton rows={6} columns={4} />
        ) : (
          <Table
            dataSource={recentSubscriptions}
            columns={purchaseCols}
            rowKey="_id"
            pagination={false}
            size="small"
            locale={{
              emptyText: isRecentSubscriptionsError
                ? "Unable to load recent subscriptions."
                : "No recent subscriptions.",
            }}
          />
        )}
      </SectionCard>
    </div>
  );
}
