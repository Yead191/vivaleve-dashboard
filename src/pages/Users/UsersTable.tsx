import { Link } from 'react-router-dom';
import { Button, Table } from 'antd';
import { Ban, Eye } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import UserCell from '../../components/common/UserCell';
import StatusBadge from '../../components/common/StatusBadge';
import { TableSkeleton } from '../../components/common/skeletons/PageSkeletons';
import { User } from '../../data/mockData';

interface UsersTableProps {
  data: User[];
  onBan: (user: User) => void;
  banningUserId?: string | null;
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  isError?: boolean;
}

export default function UsersTable({
  data,
  onBan,
  banningUserId,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  isError,
}: UsersTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      fixed: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, row) => <UserCell name={row.name} email={row.email} />,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      sorter: (a, b) => a.joinDate.localeCompare(b.joinDate),
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'lastActive',
      key: 'lastActive',
      width: 120,
      render: (value) => (
        <span className="text-[12px] text-gray-600">{value}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      width: 100,
      render: (plan: string) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
            plan === 'Premium'
              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {plan}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, row) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link to={`/users/${row.id}`}>
            <Button size="small" icon={<Eye className="h-3.5 w-3.5" />}>
              Details
            </Button>
          </Link>
          {row.status !== 'banned' && (
            <Button
              size="small"
              danger
              icon={<Ban className="h-3.5 w-3.5" />}
              loading={banningUserId === row.id}
              onClick={() => onBan(row)}
            >
              Ban
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton rows={10} columns={7} />;
  }

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      scroll={{ x: 980 }}
      locale={{
        emptyText: isError ? 'Unable to load users.' : 'No users found.',
      }}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: false,
        onChange: onPageChange,
      }}
    />
  );
}
