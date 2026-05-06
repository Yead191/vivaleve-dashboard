import { useState } from 'react';
import { Eye, Ban, X } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { reportsAgainstUsers, Report } from '../../data/mockData';
import { App, Table, Button, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';

export default function ReportedAccountsTab() {
  const { message, modal } = App.useApp();
  const [detail, setDetail] = useState<Report | null>(null);

  const cols: ColumnsType<Report> = [
    { title: 'Reporter', dataIndex: 'reporter', key: 'reporter', render: v => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Target',   dataIndex: 'target',   key: 'target',   render: v => <span className="text-[13px] text-gray-800">{v}</span> },
    { title: 'Reason',   dataIndex: 'reason',   key: 'reason',   render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Date',     dataIndex: 'date',     key: 'date',     width: 110, render: v => <span className="text-[12px] text-gray-500">{v}</span> },
    { title: 'Status',   dataIndex: 'status',   key: 'status',   width: 110, render: v => <StatusBadge status={v} /> },
    {
      title: '', key: 'a', width: 230, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setDetail(r)}>View</Button>
          <Button size="small" danger icon={<Ban className="w-3.5 h-3.5" />}
            onClick={() => modal.confirm({
              title: `Ban ${r.target}?`,
              content: 'This permanently bans the reported user.',
              okText: 'Ban',
              okButtonProps: { danger: true },
              onOk: () => message.success(`${r.target} has been banned`),
            })}>
            Ban
          </Button>
          <Button size="small" icon={<X className="w-3.5 h-3.5" />}
            onClick={() => message.success('Report dismissed')}>
            Dismiss
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={reportsAgainstUsers} columns={cols} rowKey="id" pagination={{ pageSize: 8 }} />
      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        title="Report detail"
        footer={null}
        destroyOnClose
        width={620}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <Field k="Report ID" v={detail.id} />
            <Field k="Reporter"  v={detail.reporter} />
            <Field k="Target"    v={detail.target} />
            <Field k="Reason"    v={detail.reason} />
            <Field k="Date"      v={detail.date} />
            <Field k="Status"    v={<StatusBadge status={detail.status} />} />
            <div className="pt-3 border-t border-gray-100">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5">Notes from reporter</div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                The reporter described a pattern of unwanted contact attempts after a single match.
                They provided four screenshots and a timeline; chat log access was logged for compliance.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[12px] text-gray-500 w-24">{k}</span>
      <span className="text-[13px] text-gray-900 font-medium">{v}</span>
    </div>
  );
}
