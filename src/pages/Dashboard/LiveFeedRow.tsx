import { Link } from 'react-router-dom';
import { Table, Button } from 'antd';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import UserCell from '../../components/common/UserCell';
import { recentSignups, recentReports, recentPurchases, Signup } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

export default function LiveFeedRow() {
  const signupCols: ColumnsType<Signup> = [
    { title: 'User', dataIndex: 'name', key: 'name', render: (_, r) => <UserCell name={r.name} email={r.email} /> },
    { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 100, render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'When', dataIndex: 'joined', key: 'joined', width: 100, render: v => <span className="text-[12px] text-gray-500">{v}</span> },
  ];
  const reportCols = [
    { title: 'Target', dataIndex: 'target', key: 'target', render: (v: string) => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', render: (v: string) => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'When', dataIndex: 'when', key: 'when', width: 90, render: (v: string) => <span className="text-[12px] text-gray-500">{v}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 110, render: (v: string) => <StatusBadge status={v} /> },
  ];
  const purchaseCols = [
    { title: 'User', dataIndex: 'user', key: 'user', render: (v: string) => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Plan', dataIndex: 'plan', key: 'plan', render: (v: string) => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 90, render: (v: string) => <span className="text-[12px] font-medium text-gray-900">{v}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SectionCard
        title="Recent signups"
        description="Last 10"
        action={<Link to="/users" className="text-[12px] font-medium text-brand-600 hover:text-brand-700">View all →</Link>}
        noPadding
      >
        <Table dataSource={recentSignups} columns={signupCols} rowKey="id" pagination={false} size="small" />
      </SectionCard>

      <SectionCard
        title="Recent reports"
        description="Last 10"
        action={<Link to="/moderation" className="text-[12px] font-medium text-brand-600 hover:text-brand-700">Moderate →</Link>}
        noPadding
      >
        <Table dataSource={recentReports} columns={reportCols} rowKey="id" pagination={false} size="small" />
      </SectionCard>

      <SectionCard
        title="Recent purchases"
        description="Last 10"
        action={<Link to="/monetization" className="text-[12px] font-medium text-brand-600 hover:text-brand-700">View revenue →</Link>}
        noPadding
      >
        <Table dataSource={recentPurchases} columns={purchaseCols} rowKey="id" pagination={false} size="small" />
      </SectionCard>
    </div>
  );
}
