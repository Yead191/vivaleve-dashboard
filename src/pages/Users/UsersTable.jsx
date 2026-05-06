import { Link } from 'react-router-dom';
import { Table, Dropdown, Button } from 'antd';
import { MoreVertical, Eye, Pause, Ban, CheckCircle2, FileText, UserCog } from 'lucide-react';
import UserCell from '../../components/common/UserCell.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export default function UsersTable({ data, onAction }) {
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, r) => (
        <Link to={`/users/${r.id}`}>
          <UserCell name={r.name} email={r.email} />
        </Link>
      ),
    },
    { title: 'Phone',       dataIndex: 'phone',     key: 'phone',     render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Joined',      dataIndex: 'joinDate',  key: 'joinDate',  sorter: (a, b) => a.joinDate.localeCompare(b.joinDate), render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Last active', dataIndex: 'lastActive',key: 'lastActive',render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Status',      dataIndex: 'status',    key: 'status',    width: 110, render: v => <StatusBadge status={v} /> },
    { title: 'Plan',        dataIndex: 'plan',      key: 'plan',      width: 90,  render: v => <span className="text-[12px] font-medium text-gray-800">{v}</span> },
    {
      title: 'Reports', dataIndex: 'reports', key: 'reports', width: 90, sorter: (a, b) => a.reports - b.reports,
      render: v => v > 0
        ? <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium">{v}</span>
        : <span className="text-[12px] text-gray-400">—</span>,
    },
    {
      title: '', key: 'actions', width: 50, fixed: 'right',
      render: (_, r) => {
        const items = [
          { key: 'view',       icon: <Eye          className="w-4 h-4" />, label: <Link to={`/users/${r.id}`}>View profile</Link> },
          { key: 'reports',    icon: <FileText     className="w-4 h-4" />, label: 'View reports' },
          { key: 'impersonate',icon: <UserCog      className="w-4 h-4" />, label: 'Impersonate' },
          { type: 'divider' },
          ...(r.status === 'active' ? [
            { key: 'suspend',  icon: <Pause        className="w-4 h-4" />, label: 'Suspend' },
            { key: 'ban',      icon: <Ban          className="w-4 h-4" />, label: 'Ban', danger: true },
          ] : [
            { key: 'activate', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Activate' },
          ]),
        ];

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => onAction(key, r),
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreVertical className="w-4 h-4" />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 980 }}
    />
  );
}
