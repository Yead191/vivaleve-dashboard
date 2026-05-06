import { useState } from 'react';
import { App, Button, Input, Select, Switch, DatePicker, Modal, Alert } from 'antd';
import { Eye, Send, Smartphone, Bell } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard.jsx';

const audiences = {
  all:        { label: 'All users',           count: 128492 },
  premium:    { label: 'Premium users',       count:  14060 },
  inactive7d: { label: 'Inactive 7d+',        count:  18420 },
  na:         { label: 'North America',       count:  42100 },
  eu:         { label: 'Europe',              count:  39800 },
  as:         { label: 'Asia',                count:  31900 },
};

export default function ComposeBroadcastPanel() {
  const { message } = App.useApp();
  const [title, setTitle]       = useState('');
  const [body, setBody]         = useState('');
  const [audience, setAudience] = useState('all');
  const [type, setType]         = useState('both');
  const [ctaUrl, setCtaUrl]     = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const audienceCount = audiences[audience].count;

  const reset = () => {
    setTitle(''); setBody(''); setAudience('all'); setType('both'); setCtaUrl(''); setScheduled(false);
  };

  return (
    <SectionCard
      title="Compose broadcast"
      description="Send a push or in-app message to a segment of users."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form column */}
        <div className="lg:col-span-2 space-y-4">
          <Field label="Title">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="A short, catchy headline" maxLength={60} showCount />
          </Field>

          <Field label="Message body">
            <Input.TextArea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write the body of the message…" maxLength={280} showCount />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Audience">
              <Select
                value={audience} onChange={setAudience}
                options={Object.entries(audiences).map(([k, v]) => ({
                  value: k, label: `${v.label} · ${v.count.toLocaleString()}`,
                }))}
                className="!w-full"
              />
            </Field>
            <Field label="Delivery type">
              <Select
                value={type} onChange={setType}
                options={[
                  { value: 'push',   label: 'Push notification only' },
                  { value: 'in-app', label: 'In-app banner only' },
                  { value: 'both',   label: 'Push + in-app banner' },
                ]}
                className="!w-full"
              />
            </Field>
          </div>

          <Field label="Deep link / CTA URL (optional)">
            <Input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} placeholder="vivaleve://offers/premium  or  https://…" />
          </Field>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <div className="text-[13px] font-medium text-gray-900">Schedule</div>
              <div className="text-[11px] text-gray-500">Send now, or pick a future date and time.</div>
            </div>
            <Switch checked={scheduled} onChange={setScheduled} />
          </div>

          {scheduled && (
            <Field label="Send at">
              <DatePicker showTime className="!w-full" />
            </Field>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Button icon={<Eye className="w-4 h-4" />} onClick={() => setPreviewOpen(true)} disabled={!title || !body}>Preview</Button>
            <Button type="primary" icon={<Send className="w-4 h-4" />} onClick={() => setConfirmOpen(true)} disabled={!title || !body}>
              {scheduled ? 'Schedule send' : 'Send now'}
            </Button>
            <Button type="text" onClick={reset}>Reset</Button>
            <span className="ml-auto text-[12px] text-gray-500">
              Audience: <strong className="text-gray-800">{audienceCount.toLocaleString()}</strong> users
            </span>
          </div>
        </div>

        {/* Live preview column */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Live preview</div>
          <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <div className="bg-white rounded-xl shadow-sm p-3 flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-700">VivaLeve</span>
                  <span className="text-[10px] text-gray-400">now</span>
                </div>
                <div className="text-[13px] font-semibold text-gray-900 truncate">{title || 'Your title here'}</div>
                <div className="text-[12px] text-gray-600 line-clamp-2">{body || 'Your message body shows here as the user will see it.'}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
              <Smartphone className="w-3.5 h-3.5" />
              {type === 'push' && 'Push notification'}
              {type === 'in-app' && 'In-app banner'}
              {type === 'both' && 'Push + in-app banner'}
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <Modal open={previewOpen} title="Preview" footer={null} onCancel={() => setPreviewOpen(false)} width={420} destroyOnClose>
        <div className="space-y-3">
          <div className="rounded-xl bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow p-3 flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-medium text-gray-700">VivaLeve</div>
                <div className="text-[13px] font-semibold text-gray-900">{title}</div>
                <div className="text-[12px] text-gray-600">{body}</div>
              </div>
            </div>
          </div>
          <div className="text-[12px] text-gray-500 space-y-1">
            <div>Audience: <strong>{audiences[audience].label}</strong> ({audienceCount.toLocaleString()} users)</div>
            <div>Type: <strong>{type}</strong></div>
            {ctaUrl && <div>CTA: <code className="text-[11px] bg-gray-100 px-1 rounded">{ctaUrl}</code></div>}
          </div>
        </div>
      </Modal>

      {/* Final confirm */}
      <Modal
        open={confirmOpen}
        title="Confirm send"
        okText={scheduled ? 'Schedule' : 'Send now'}
        okButtonProps={{ danger: true }}
        onOk={() => { setConfirmOpen(false); message.success(scheduled ? 'Broadcast scheduled' : 'Broadcast sent'); reset(); }}
        onCancel={() => setConfirmOpen(false)}
        destroyOnClose
      >
        <Alert
          type="warning"
          showIcon
          message={`This will reach ${audienceCount.toLocaleString()} users`}
          description={`"${title}" will be delivered as a ${type === 'both' ? 'push + in-app banner' : type}. This action cannot be undone once delivery starts.`}
        />
      </Modal>
    </SectionCard>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
