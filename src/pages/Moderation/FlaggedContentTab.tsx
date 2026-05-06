import { useState, useMemo } from 'react';
import { App, Button, Modal, Form, Input, Select } from 'antd';
import { Check, X, AlertTriangle, Eye, ImageIcon, FileText, MessageSquare } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { flaggedContent, FlaggedItem } from '../../data/mockData';

const typeIcons: Record<string, any> = { photo: ImageIcon, bio: FileText, message: MessageSquare };
const typeStyles: Record<string, string> = {
  photo:   'bg-rose-50 text-rose-600',
  bio:     'bg-amber-50 text-amber-600',
  message: 'bg-indigo-50 text-indigo-600',
};

export default function FlaggedContentTab() {
  const { message } = App.useApp();
  const [filterType, setFilterType]     = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [escalate, setEscalate]         = useState<FlaggedItem | null>(null);
  const [viewItem, setViewItem]         = useState<FlaggedItem | null>(null);

  const filtered = useMemo(() => {
    return flaggedContent.filter(f =>
      (filterType === 'all'   || f.type   === filterType) &&
      (filterStatus === 'all' || f.status === filterStatus)
    );
  }, [filterType, filterStatus]);

  const [escForm] = Form.useForm();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filterType} onChange={setFilterType} className="!w-44"
          options={[
            { value: 'all',     label: 'All types' },
            { value: 'photo',   label: 'Photos' },
            { value: 'bio',     label: 'Bios' },
            { value: 'message', label: 'Messages' },
          ]}
        />
        <Select
          value={filterStatus} onChange={setFilterStatus} className="!w-44"
          options={[
            { value: 'all',      label: 'All statuses' },
            { value: 'pending',  label: 'Pending' },
            { value: 'reviewed', label: 'Reviewed' },
          ]}
        />
        <span className="text-[12px] text-gray-500 ml-2">
          Showing <strong className="text-gray-800">{filtered.length}</strong> of {flaggedContent.length}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(item => {
          const Icon = typeIcons[item.type];
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyles[item.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900 capitalize">{item.type} report</div>
                    <div className="text-[11px] text-gray-500">{item.id} · {item.when}</div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="space-y-2.5 mb-4">
                <KV k="Reporter" v={item.reporter} />
                <KV k="Target"   v={item.target} />
                <KV k="Reason"   v={item.reason} />
              </div>

              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">Content preview</div>
                <p className="text-[13px] text-gray-700 italic">"{item.preview}"</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="small" icon={<Check  className="w-3.5 h-3.5" />} onClick={() => message.success(`Approved · ${item.id}`)}>Approve</Button>
                <Button size="small" danger icon={<X className="w-3.5 h-3.5" />} onClick={() => message.success(`Removed · ${item.id}`)}>Remove</Button>
                <Button size="small" icon={<AlertTriangle className="w-3.5 h-3.5" />} onClick={() => setEscalate(item)}>Escalate</Button>
                <Button size="small" type="text" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setViewItem(item)}>View full</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escalate Modal */}
      <Modal
        open={!!escalate}
        title={`Escalate · ${escalate?.id}`}
        okText="Escalate"
        onOk={() => escForm.validateFields().then(() => { setEscalate(null); message.success('Escalated to senior trust & safety'); escForm.resetFields(); })}
        onCancel={() => setEscalate(null)}
        destroyOnClose
      >
        <Form form={escForm} layout="vertical">
          <Form.Item name="team" label="Escalate to" initialValue="senior_ts">
            <Select options={[
              { value: 'senior_ts',  label: 'Senior trust & safety' },
              { value: 'legal',      label: 'Legal team' },
              { value: 'leadership', label: 'Leadership' },
            ]}/>
          </Form.Item>
          <Form.Item name="notes" label="Notes" rules={[{ required: true, message: 'Add escalation context' }]}>
            <Input.TextArea rows={4} placeholder="Why does this need senior review?" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Full Modal */}
      <Modal
        open={!!viewItem}
        title="Full content"
        footer={null}
        onCancel={() => setViewItem(null)}
        width={620}
      >
        {viewItem && (
          <div className="space-y-3">
            <KV k="Type"     v={<span className="capitalize">{viewItem.type}</span>} />
            <KV k="Reporter" v={viewItem.reporter} />
            <KV k="Target"   v={viewItem.target} />
            <KV k="Reason"   v={viewItem.reason} />
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">Content</div>
              <p className="text-[13px] text-gray-800 leading-relaxed">"{viewItem.preview}"</p>
              {viewItem.type === 'photo' && (
                <div className="mt-3 aspect-video rounded bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center text-white text-sm font-medium">
                  Photo redacted in preview
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium w-16 shrink-0">{k}</span>
      <span className="text-[13px] text-gray-800">{v}</span>
    </div>
  );
}
