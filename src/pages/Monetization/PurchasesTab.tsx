import { useMemo, useState } from 'react';
import { App, Table, Button, Select, DatePicker, Modal, Form, Input } from 'antd';
import { Eye, RefreshCcw } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { purchases, Purchase } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

export default function PurchasesTab() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState({ plan: 'all', status: 'all' });
  const [detail, setDetail]   = useState<Purchase | null>(null);
  const [refund, setRefund]   = useState<Purchase | null>(null);
  const [refundForm] = Form.useForm();

  const filtered = useMemo(() => purchases.filter(p =>
    (filters.plan   === 'all' || p.plan.startsWith(filters.plan)) &&
    (filters.status === 'all' || p.status === filters.status)
  ), [filters]);

  const cols: ColumnsType<Purchase> = [
    { title: 'User',   dataIndex: 'user',   key: 'user',   render: v => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Plan',   dataIndex: 'plan',   key: 'plan',   render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100, render: v => <span className="text-[12px] font-semibold text-gray-900">{v}</span> },
    { title: 'Date',   dataIndex: 'date',   key: 'date',   width: 120, render: v => <span className="text-[12px] text-gray-500">{v}</span> },
    { title: 'Method', dataIndex: 'method', key: 'method', render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 110, render: v => <StatusBadge status={v} /> },
    {
      title: '', key: 'a', width: 180, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setDetail(r)}>View</Button>
          {r.status === 'paid' && (
            <Button size="small" danger icon={<RefreshCcw className="w-3.5 h-3.5" />} onClick={() => setRefund(r)}>Refund</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-gray-200">
        <Select
          value={filters.plan} onChange={v => setFilters({ ...filters, plan: v })} className="!w-44"
          options={[
            { value: 'all',      label: 'All plans' },
            { value: 'Plus',     label: 'Plus' },
            { value: 'Premium',  label: 'Premium' },
          ]}
        />
        <Select
          value={filters.status} onChange={v => setFilters({ ...filters, status: v })} className="!w-44"
          options={[
            { value: 'all',      label: 'All statuses' },
            { value: 'paid',     label: 'Paid' },
            { value: 'refunded', label: 'Refunded' },
            { value: 'failed',   label: 'Failed' },
          ]}
        />
        <RangePicker className="!w-64" placeholder={['Date from', 'to']} />
        <span className="text-[12px] text-gray-500 ml-2">
          <strong className="text-gray-800">{filtered.length}</strong> transactions
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table dataSource={filtered} columns={cols} rowKey="id" pagination={{ pageSize: 10 }} />
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} title="Purchase detail" footer={null} onCancel={() => setDetail(null)} width={520} destroyOnClose>
        {detail && (
          <div className="space-y-3 text-[13px]">
            <Field k="Transaction ID" v={<code className="px-1.5 py-0.5 rounded bg-gray-100 text-[12px]">{detail.id}</code>} />
            <Field k="User"     v={detail.user} />
            <Field k="Plan"     v={detail.plan} />
            <Field k="Amount"   v={<span className="font-semibold text-gray-900">{detail.amount}</span>} />
            <Field k="Date"     v={detail.date} />
            <Field k="Method"   v={detail.method} />
            <Field k="Status"   v={<StatusBadge status={detail.status} />} />
            <div className="pt-3 border-t border-gray-100">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5">Receipt</div>
              <p className="text-[13px] text-gray-700">Receipt sent to user's verified email at {detail.date}.</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Refund modal */}
      <Modal
        open={!!refund}
        title={`Issue refund for ${refund?.id}`}
        okText="Issue refund"
        okButtonProps={{ danger: true }}
        onOk={() => refundForm.validateFields().then(() => { setRefund(null); message.success('Refund issued'); refundForm.resetFields(); })}
        onCancel={() => setRefund(null)}
        destroyOnClose
      >
        <p className="text-[13px] text-gray-600 mb-3">
          Refunding <strong>{refund?.amount}</strong> to {refund?.user} via {refund?.method}.
          The user will be notified by email.
        </p>
        <Form form={refundForm} layout="vertical">
          <Form.Item name="reason" label="Refund reason" rules={[{ required: true, message: 'A reason is required' }]}>
            <Input.TextArea rows={3} placeholder="e.g. Customer requested refund within 14-day window" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[12px] text-gray-500 w-32 shrink-0">{k}</span>
      <span className="text-[13px] text-gray-900">{v}</span>
    </div>
  );
}
