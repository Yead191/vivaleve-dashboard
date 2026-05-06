import { useState } from 'react';
import { App, Table, Button, Modal, Tag } from 'antd';
import { Eye, XCircle } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard.jsx';
import { sendHistory } from '../../data/mockData.js';

export default function SendHistoryPanel() {
  const { message, modal } = App.useApp();
  const [history, setHistory] = useState(sendHistory);
  const [detail, setDetail]   = useState(null);

  const cols = [
    { title: 'Title',     dataIndex: 'title',     key: 'title',     render: v => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Audience',  dataIndex: 'audience',  key: 'audience',  render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Type',      dataIndex: 'type',      key: 'type',      width: 130, render: v => <Tag className="!m-0 !text-[11px]">{v}</Tag> },
    { title: 'Sent at',   dataIndex: 'sentAt',    key: 'sentAt',    width: 150, render: v => <span className="text-[12px] text-gray-500">{v}</span> },
    { title: 'Delivered', dataIndex: 'delivered', key: 'delivered', width: 110, render: v => <span className="text-[12px] font-medium text-gray-900">{v.toLocaleString()}</span> },
    { title: 'Open rate', dataIndex: 'openRate',  key: 'openRate',  width: 100, render: v => <span className="text-[12px] font-semibold text-emerald-700">{v}</span> },
    {
      title: '', key: 'a', width: 200, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setDetail(r)}>View</Button>
          {r.live && (
            <Button size="small" danger icon={<XCircle className="w-3.5 h-3.5" />}
              onClick={() => modal.confirm({
                title: `Retract "${r.title}"?`,
                content: 'The in-app banner will be hidden from all users immediately.',
                okText: 'Retract', okButtonProps: { danger: true },
                onOk: () => {
                  setHistory(h => h.map(x => x.id === r.id ? { ...x, live: false } : x));
                  message.success('Message retracted');
                },
              })}
            >
              Retract
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <SectionCard title="Send history" description="All broadcasts sent in the last 90 days." noPadding>
      <Table dataSource={history} columns={cols} rowKey="id" pagination={{ pageSize: 8 }} />

      <Modal open={!!detail} title="Broadcast detail" footer={null} onCancel={() => setDetail(null)} width={560} destroyOnClose>
        {detail && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[15px] font-semibold text-gray-900">{detail.title}</h4>
              <p className="text-[12px] text-gray-500 mt-0.5">{detail.audience} · {detail.type}</p>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5">Message body</div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                Tap to learn more about how Premium can help you stand out and get better matches this spring.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Delivered" value={detail.delivered.toLocaleString()} />
              <Stat label="Open rate" value={detail.openRate} tone="emerald" />
              <Stat label="Sent at"   value={detail.sentAt} small />
            </div>
          </div>
        )}
      </Modal>
    </SectionCard>
  );
}

function Stat({ label, value, tone, small }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className={`mt-0.5 ${small ? 'text-[13px]' : 'text-[18px]'} font-semibold ${tone === 'emerald' ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}
