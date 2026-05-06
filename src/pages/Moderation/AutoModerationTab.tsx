import { useState } from 'react';
import { App, Button, Modal, Form, Input, Select, Switch, Table, Tag } from 'antd';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { moderationRules, ModerationRule } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

export default function AutoModerationTab() {
  const { message, modal } = App.useApp();
  const [rules, setRules] = useState<ModerationRule[]>(moderationRules);
  const [editing, setEditing] = useState<ModerationRule | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setOpenForm(true); };
  const openEdit = (r: ModerationRule) => { setEditing(r); form.setFieldsValue(r); setOpenForm(true); };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editing) {
        setRules(rs => rs.map(r => r.id === editing.id ? { ...editing, ...values } : r));
        message.success('Rule updated');
      } else {
        setRules(rs => [{ id: `mr_${Date.now()}`, active: true, created: '2026-05-06', ...values }, ...rs]);
        message.success('Rule added');
      }
      setOpenForm(false);
    });
  };

  const cols: ColumnsType<ModerationRule> = [
    {
      title: 'Keyword / pattern', dataIndex: 'keyword', key: 'keyword',
      render: v => <code className="text-[12px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{v}</code>
    },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 130, render: v => <Tag className="!m-0">{v}</Tag> },
    {
      title: 'Action', dataIndex: 'action', key: 'action', width: 170,
      render: v => {
        const colors: any = { 'auto-remove': 'red', 'flag for review': 'orange', 'warn user': 'gold' };
        return <Tag color={colors[v] || 'default'} className="!m-0">{v}</Tag>;
      },
    },
    { title: 'Created', dataIndex: 'created', key: 'created', width: 110, render: v => <span className="text-[12px] text-gray-500">{v}</span> },
    {
      title: 'Active', dataIndex: 'active', key: 'active', width: 80,
      render: (v, r) => (
        <Switch checked={v} size="small"
          onChange={(checked) => {
            setRules(rs => rs.map(x => x.id === r.id ? { ...x, active: checked } : x));
            message.success(`Rule ${checked ? 'activated' : 'paused'}`);
          }}
        />
      ),
    },
    {
      title: '', key: 'a', width: 110, align: 'right',
      render: (_, r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="small" type="text" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEdit(r)} />
          <Button size="small" type="text" danger icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => modal.confirm({
              title: 'Delete rule?',
              content: 'This action cannot be undone.',
              okText: 'Delete', okButtonProps: { danger: true },
              onOk: () => { setRules(rs => rs.filter(x => x.id !== r.id)); message.success('Rule deleted'); },
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
          <h3 className="text-[14px] font-semibold text-gray-900">Active rules</h3>
          <p className="text-[12px] text-gray-500">Automatic content filtering applied to all incoming photos, bios and DMs.</p>
        </div>
        <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add rule</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table dataSource={rules} columns={cols} rowKey="id" pagination={false} />
      </div>

      <Modal
        open={openForm}
        title={editing ? 'Edit rule' : 'Add new rule'}
        okText={editing ? 'Save changes' : 'Create rule'}
        onOk={handleSave}
        onCancel={() => setOpenForm(false)}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Rule type" rules={[{ required: true }]} initialValue="keyword">
            <Select
              options={[
                { value: 'keyword', label: 'Keyword' },
                { value: 'regex', label: 'Regex' },
                { value: 'image score', label: 'Image score threshold' },
              ]}
            />
          </Form.Item>
          <Form.Item name="keyword" label="Keyword / pattern / threshold" rules={[{ required: true }]}>
            <Input placeholder="e.g. crypto · \\b\\d{10}\\b · NSFW score > 0.85" />
          </Form.Item>
          <Form.Item name="action" label="Action when matched" rules={[{ required: true }]} initialValue="flag for review">
            <Select
              options={[
                { value: 'auto-remove', label: 'Auto-remove content' },
                { value: 'flag for review', label: 'Flag for human review' },
                { value: 'warn user', label: 'Warn user' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
