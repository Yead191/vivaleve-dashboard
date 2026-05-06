import { useState } from 'react';
import { App, Table, Button, Tag, Progress } from 'antd';
import { Plus, Edit3, Trash2, ZapOff } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PromoCodeFormModal from './PromoCodeFormModal';
import { promoCodes, PromoCode } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

export default function PromoCodesTab() {
  const { message, modal } = App.useApp();
  const [codes, setCodes]   = useState<PromoCode[]>(promoCodes);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const openAdd  = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (c: PromoCode) => { setEditing(c); setOpenForm(true); };

  const handleSave = (data: any) => {
    if (editing) {
      setCodes(cs => cs.map(c => c.id === editing.id ? { ...c, ...data } : c));
      message.success('Promo code updated');
    } else {
      setCodes(cs => [{ id: `pc_${Date.now()}`, used: 0, status: 'active', ...data }, ...cs]);
      message.success('Promo code created');
    }
    setOpenForm(false);
  };

  const cols: ColumnsType<PromoCode> = [
    { title: 'Code', dataIndex: 'code', key: 'code',
      render: v => <code className="text-[12px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-100">{v}</code> },
    { title: 'Discount', key: 'discount',
      render: (_, r) => <span className="text-[13px] font-medium text-gray-900">
        {r.discountType === 'percent' ? `${r.discount}%` : `$${r.discount}`}
      </span> },
    { title: 'Type', dataIndex: 'discountType', key: 'discountType', width: 100,
      render: v => <Tag className="!m-0 !text-[11px]">{v}</Tag> },
    { title: 'Usage', key: 'usage', width: 200,
      render: (_, r) => {
        const pct = Math.round((r.used / r.maxUses) * 100);
        return (
          <div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>{r.used.toLocaleString()} / {r.maxUses.toLocaleString()}</span>
              <span>{pct}%</span>
            </div>
            <Progress percent={pct} size="small" showInfo={false} strokeColor="#429CA8" />
          </div>
        );
      },
    },
    { title: 'Expiry', dataIndex: 'expiry', key: 'expiry', width: 110, render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Plan', dataIndex: 'planRestriction', key: 'planRestriction', render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: v => <StatusBadge status={v} /> },
    {
      title: '', key: 'a', width: 130, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" type="text" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEdit(r)} />
          {r.status === 'active' && (
            <Button size="small" type="text" danger icon={<ZapOff className="w-3.5 h-3.5" />}
              onClick={() => modal.confirm({
                title: `Expire ${r.code} now?`,
                content: 'The code will be unusable immediately. Existing redemptions are unaffected.',
                okText: 'Expire', okButtonProps: { danger: true },
                onOk: () => {
                  setCodes(cs => cs.map(x => x.id === r.id ? { ...x, status: 'expired' } : x));
                  message.success(`${r.code} expired`);
                },
              })}
            />
          )}
          <Button size="small" type="text" danger icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => modal.confirm({
              title: `Delete ${r.code}?`,
              content: 'This permanently removes the code. Cannot be undone.',
              okText: 'Delete', okButtonProps: { danger: true },
              onOk: () => { setCodes(cs => cs.filter(x => x.id !== r.id)); message.success('Code deleted'); },
            })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Promo codes</h3>
          <p className="text-[12px] text-gray-500">Time-limited discounts and trial extensions.</p>
        </div>
        <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Create promo code</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table dataSource={codes} columns={cols} rowKey="id" pagination={{ pageSize: 8 }} />
      </div>

      <PromoCodeFormModal open={openForm} code={editing} onCancel={() => setOpenForm(false)} onSave={handleSave} />
    </div>
  );
}
