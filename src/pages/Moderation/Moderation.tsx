import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Image, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { TableSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  useGetReportsQuery,
  useUpdateReportStatusMutation,
  type DashboardReport,
  type ReportStatus,
} from "../../redux/apiSlices/reportsApi";

function ReportStatusControl({ report }: { report: DashboardReport }) {
  const [updateStatus, { isLoading }] = useUpdateReportStatusMutation();

  const handleUpdate = async (status: ReportStatus) => {
    try {
      await updateStatus({ reportId: report._id, status }).unwrap();
      toast.success("Report status updated.");
    } catch {
      toast.error("Unable to update report status.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="small"
        type="primary"
        loading={isLoading}
        disabled={report.status === "approved"}
        onClick={() => handleUpdate("approved")}
      >
        Approve
      </Button>
      <Button
        size="small"
        danger
        loading={isLoading}
        disabled={report.status === "rejected"}
        onClick={() => handleUpdate("rejected")}
      >
        Reject
      </Button>
    </div>
  );
}

export default function Moderation() {
  const [page, setPage] = useState(1);
  const { data: reports, isLoading, isError } = useGetReportsQuery(page);

  const columns: ColumnsType<DashboardReport> = [
    {
      title: "Report",
      key: "report",
      render: (_, report) => (
        <div className="max-w-md">
          <div className="text-[13px] font-medium capitalize text-gray-900">
            {report.reason.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </div>
          <div className="mt-0.5 line-clamp-2 text-[12px] text-gray-500">
            {report.description || "No description provided"}
          </div>
        </div>
      ),
    },
    {
      title: "Evidence",
      dataIndex: "image",
      key: "image",
      width: 110,
      render: (images: string[]) =>
        images.length ? (
          <div className="flex items-center gap-1">
            <Image
              src={images[0]}
              width={42}
              height={42}
              className="rounded-md object-cover"
            />
            {images.length > 1 && (
              <span className="text-[11px] text-gray-500">
                +{images.length - 1}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[12px] text-gray-400">None</span>
        ),
    },
    {
      title: "Post ID",
      dataIndex: "postId",
      key: "postId",
      width: 150,
      render: (postId: string) => (
        <Link
          to={`/posts/${postId}`}
          className="font-mono text-[11px] font-medium text-[#287D89] hover:underline"
        >
          …{postId.slice(-8)}
        </Link>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt: string) => (
        <span className="text-[12px] text-gray-600">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: "Action",
      key: "action",
      width: 280,
      render: (_, report) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/posts/${report.postId}`}>
            <Button size="small" icon={<Eye className="h-3.5 w-3.5" />}>
              View post
            </Button>
          </Link>
          <ReportStatusControl report={report} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Review and track user-submitted content reports."
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <Table
            dataSource={reports?.data ?? []}
            columns={columns}
            rowKey="_id"
            scroll={{ x: 1040 }}
            locale={{
              emptyText: isError
                ? "Unable to load reports."
                : "No reports found.",
            }}
            pagination={{
              current: reports?.pagination.page ?? page,
              pageSize: reports?.pagination.limit ?? 10,
              total: reports?.pagination.total ?? 0,
              showSizeChanger: false,
              onChange: setPage,
            }}
          />
        )}
      </div>
    </div>
  );
}
