import { useState } from 'react';
import { App, Button, Modal, Form, Input, Select, Switch, Table } from 'antd';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard';
import { safetyTemplates, SafetyTemplate } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

export default function SafetyTemplatesPanel() {
  const { message, modal } = App.useApp();
  const [tpls, setTpls]   = useState<SafetyTemplate[]>(safetyTemplates);
  const [editing, setEditing] = useState<SafetyTemplate | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const openAdd  = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const openEdit = (t: SafetyTemplate) => { setEditing(t); form.setFieldsValue(t); setOpen(true); };

  const save = () => {
    form.validateFields().then(values => {
      if (editing) {
        setTpls(ts => ts.map(t => t.id === editing.id ? { ...t, ...values } : t));
        message.success('Template updated');
      } else {
        setTpls(ts => [...ts, { id: `st_${Date.now()}`, active: true, ...values }]);
        message.success('Template added');
      }
      setOpen(false);
    });
  };

  const cols: ColumnsType<SafetyTemplate> = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: v => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Body',  dataIndex: 'body',  key: 'body',  render: v => <span className="text-[12px] text-gray-600 line-clamp-2">{v}</span> },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', width: 140, render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'Active', dataIndex: 'active', key: 'active', width: 80,
      render: (v, r) => (
        <Switch size="small" checked={v}
          onChange={(checked) => {
            setTpls(ts => ts.map(x => x.id === r.id ? { ...x, active: checked } : x));
            message.success(`Template ${checked ? 'activated' : 'paused'}`);
          }}
        />
      ),
    },
    { title: '', key: 'a', width: 100, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" type="text" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEdit(r)} />
          <Button size="small" type="text" danger icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => modal.confirm({
              title: 'Delete template?',
              content: 'This permanently removes the safety reminder template.',
              okText: 'Delete', okButtonProps: { danger: true },
              onOk: () => { setTpls(ts => ts.filter(x => x.id !== r.id)); message.success('Template deleted'); },
            })}
          />
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      title="Safety reminder templates"
      description="Auto-sent reminders that nudge users towards safer behavior."
      action={<Button size="small" type="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={openAdd}>Add template</Button>}
      noPadding
    >
      <Table dataSource={tpls} columns={cols} rowKey="id" pagination={false} />

      <Modal
        open={open}
        title={editing ? 'Edit template' : 'Add safety template'}
        okText={editing ? 'Save changes' : 'Add template'}
        onOk={save}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Meeting safely" />
          </Form.Item>
          <Form.Item name="body" label="Message body" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="The reminder shown to users." />
          </Form.Item>
          <Form.Item name="frequency" label="Send frequency" rules={[{ required: true }]} initialValue="every 30 days">
            <Select options={[
              { value: 'one-time',     label: 'One-time' },
              { value: 'on signup',    label: 'On signup' },
              { value: 'every 7 days', label: 'Every 7 days' },
              { value: 'every 30 days',label: 'Every 30 days' },
              { value: 'every 60 days',label: 'Every 60 days' },
            ]}/>
          </Form.Item>
        </Form>
      </Modal>
    </SectionCard>
  );
}
