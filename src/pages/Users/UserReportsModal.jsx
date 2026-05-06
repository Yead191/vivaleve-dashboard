import { Modal, Table, Empty } from 'antd';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { reportsAgainstUsers } from '../../data/mockData.js';

export default function UserReportsModal({ open, user, onCancel }) {
  // Pretend filter — in a real app you'd fetch by userId
  const data = user ? reportsAgainstUsers.slice(0, 4) : [];

  const cols = [
    { title: 'Reporter', dataIndex: 'reporter', key: 'reporter' },
    { title: 'Reason',   dataIndex: 'reason',   key: 'reason' },
    { title: 'Date',     dataIndex: 'date',     key: 'date',     width: 110 },
    { title: 'Status',   dataIndex: 'status',   key: 'status',   width: 110, render: v => <StatusBadge status={v} /> },
  ];

  return (
    <Modal
      open={open}
      title={`Reports against ${user?.name || ''}`}
      width={720}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      {data.length ? (
        <Table dataSource={data} columns={cols} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No reports" />
      )}
    </Modal>
  );
}
