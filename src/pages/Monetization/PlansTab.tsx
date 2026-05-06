import { useState } from 'react';
import { App, Button, Switch, Tag } from 'antd';
import { Plus, Edit3, Archive, Eye, EyeOff, Users } from 'lucide-react';
import PlanFormModal from './PlanFormModal';
import { subscriptionPlans, SubscriptionPlan } from '../../data/mockData';

export default function PlansTab() {
  const { message, modal } = App.useApp();
  const [plans, setPlans]   = useState<SubscriptionPlan[]>(subscriptionPlans);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const openAdd  = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (p: SubscriptionPlan) => { setEditing(p); setOpenForm(true); };

  const handleSave = (data: any) => {
    if (editing) {
      setPlans(ps => ps.map(p => p.id === editing.id ? { ...p, ...data } : p));
      message.success('Plan updated');
    } else {
      setPlans(ps => [...ps, { id: `pl_${Date.now()}`, activeUsers: 0, visible: true, ...data }]);
      message.success('Plan created');
    }
    setOpenForm(false);
  };

  const archivePlan = (p: SubscriptionPlan) => {
    if (p.activeUsers > 0) {
      modal.warning({
        title: 'Cannot archive plan',
        content: `${p.name} has ${p.activeUsers.toLocaleString()} active users. Migrate them off first before archiving.`,
      });
      return;
    }
    modal.confirm({
      title: `Archive ${p.name}?`,
      content: 'Archived plans cannot be subscribed to. You can restore them later.',
      okText: 'Archive', okButtonProps: { danger: true },
      onOk: () => { setPlans(ps => ps.filter(x => x.id !== p.id)); message.success('Plan archived'); },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Subscription plans</h3>
          <p className="text-[12px] text-gray-500">Manage tiers, pricing, features and visibility.</p>
        </div>
        <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Create plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-card p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[16px] font-semibold text-gray-900">{p.name}</h4>
                  {!p.visible && <Tag color="default" className="!m-0 !text-[10px]">Hidden</Tag>}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[26px] font-semibold text-gray-900">${p.price}</span>
                  <span className="text-[12px] text-gray-500">/ {p.cycle === '—' ? 'free' : p.cycle}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[12px] text-gray-500">
                  <Users className="w-3.5 h-3.5" />
                  {p.activeUsers.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">active users</div>
              </div>
            </div>

            <div className="space-y-1.5 mb-4 flex-1">
              <Stat k="Currency"  v={p.currency} />
              <Stat k="Trial"     v={p.trialDays ? `${p.trialDays} days` : 'No trial'} />
              <Stat k="Features"  v={`${p.features} included`} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {p.visible ? <Eye className="w-3.5 h-3.5 text-gray-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                <span className="text-[12px] text-gray-600">{p.visible ? 'Visible' : 'Hidden'}</span>
                <Switch
                  size="small" checked={p.visible}
                  onChange={(checked) => {
                    setPlans(ps => ps.map(x => x.id === p.id ? { ...x, visible: checked } : x));
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Button size="small" type="text" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEdit(p)} />
                <Button size="small" type="text" danger icon={<Archive className="w-3.5 h-3.5" />} onClick={() => archivePlan(p)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <PlanFormModal
        open={openForm}
        plan={editing}
        onCancel={() => setOpenForm(false)}
        onSave={handleSave}
      />
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-gray-500">{k}</span>
      <span className="text-[12px] font-medium text-gray-800">{v}</span>
    </div>
  );
}
