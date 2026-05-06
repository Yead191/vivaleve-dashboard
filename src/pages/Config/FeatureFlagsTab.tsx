import { useState } from 'react';
import { App, Button, Modal, Form, Input, Select, Switch, Table, Tag } from 'antd';
import { Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { featureFlags, FeatureFlag } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

const envColors: Record<string, string> = { dev: 'cyan', staging: 'gold', prod: 'red' };

export default function FeatureFlagsTab() {
  const { message, modal } = App.useApp();
  const [env, setEnv] = useState<string>('all');
  const [flags, setFlags] = useState<FeatureFlag[]>(featureFlags);
  const [editing, setEditing] = useState<FeatureFlag | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = flags.filter(f => env === 'all' || f.env === env);

  const openAdd  = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (f: FeatureFlag) => { setEditing(f); form.setFieldsValue(f); setOpen(true); };

  const save = () => {
    form.validateFields().then(values => {
      if (editing) {
        setFlags(fs => fs.map(f => f.id === editing.id ? { ...f, ...values } : f));
        message.success('Flag updated');
      } else {
        setFlags(fs => [{ id: `ff_${Date.now()}`, status: false, ...values }, ...fs]);
        message.success('Flag created');
      }
      setOpen(false);
    });
  };

  const toggleFlag = (flag: FeatureFlag, checked: boolean) => {
    const apply = () => {
      setFlags(fs => fs.map(f => f.id === flag.id ? { ...f, status: checked } : f));
      message.success(`${flag.key} ${checked ? 'enabled' : 'disabled'}`);
    };
    if (flag.env === 'prod') {
      modal.confirm({
        title: `${checked ? 'Enable' : 'Disable'} on production?`,
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        content: `You're about to change "${flag.key}" on the production environment. This affects real users immediately.`,
        okText: 'Confirm',
        okButtonProps: { danger: true },
        onOk: apply,
      });
    } else {
      apply();
    }
  };

  const cols: ColumnsType<FeatureFlag> = [
    { title: 'Key', dataIndex: 'key', key: 'key',
      render: v => <code className="text-[12px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{v}</code> },
    { title: 'Description', dataIndex: 'description', key: 'description',
      render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    { title: 'Env', dataIndex: 'env', key: 'env', width: 90,
      render: v => <Tag color={envColors[v]} className="!m-0 !text-[11px] uppercase">{v}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100,
      render: (v, r) => <Switch size="small" checked={v} onChange={(c) => toggleFlag(r, c)} /> },
    { title: '', key: 'a', width: 100, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" type="text" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEdit(r)} />
          <Button size="small" type="text" danger icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => modal.confirm({
              title: `Delete flag "${r.key}"?`,
              content: 'This permanently removes the feature flag. Code referencing it will fall back to the default.',
              okText: 'Delete', okButtonProps: { danger: true },
              onOk: () => { setFlags(fs => fs.filter(x => x.id !== r.id)); message.success('Flag deleted'); },
            })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          {[
            { key: 'all',     label: 'All' },
            { key: 'dev',     label: 'Dev' },
            { key: 'staging', label: 'Staging' },
            { key: 'prod',    label: 'Prod' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setEnv(t.key)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition ${
                env === t.key ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add flag</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table dataSource={filtered} columns={cols} rowKey="id" pagination={false} />
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit feature flag' : 'Add feature flag'}
        okText={editing ? 'Save changes' : 'Create flag'}
        onOk={save}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="key" label="Key" rules={[{ required: true, pattern: /^[a-z0-9_]+$/, message: 'Lowercase, numbers and underscores only' }]}>
            <Input placeholder="e.g. video_calls" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="What does this flag enable or disable?" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="env" label="Environment" rules={[{ required: true }]} initialValue="dev">
              <Select options={[
                { value: 'dev',     label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'prod',    label: 'Production' },
              ]}/>
            </Form.Item>
            <Form.Item name="status" label="Default value" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
