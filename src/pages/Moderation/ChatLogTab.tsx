import { useState } from 'react';
import { App, Button, Modal, Form, Input, Table, Alert } from 'antd';
import { Search, Flag } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard';
import { chatLogSearches } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

export default function ChatLogTab() {
  const { message } = App.useApp();
  const [requestOpen, setRequestOpen] = useState(false);
  const [thread, setThread] = useState<any | null>(null);
  const [form] = Form.useForm();

  const fakeThread = [
    { from: 'A', body: 'Hey! Loved your photo from the Sundarbans hike.', when: '2026-04-30 14:02' },
    { from: 'B', body: 'Thanks! It was a long day but worth it 😄', when: '2026-04-30 14:11' },
    { from: 'A', body: 'Would you ever do another one this summer?', when: '2026-04-30 14:14' },
    { from: 'B', body: 'Maybe! What did you have in mind?', when: '2026-04-30 14:18' },
    { from: 'A', body: '[Flagged · external contact] Add me on telegram?', when: '2026-04-30 14:22', flagged: true },
  ];

  const cols: ColumnsType<any> = [
    { title: 'User pair', dataIndex: 'pair', key: 'pair', render: v => <span className="text-[13px] font-medium text-gray-900">{v}</span> },
    { title: 'Conversation ID', dataIndex: 'conversationId', key: 'conversationId', render: v => <code className="text-[12px] px-1.5 py-0.5 rounded bg-gray-100">{v}</code> },
    { title: 'Accessed by', dataIndex: 'accessedBy', key: 'accessedBy', render: v => <span className="text-[12px] text-gray-700">{v}</span> },
    { title: 'When', dataIndex: 'accessedAt', key: 'accessedAt', render: v => <span className="text-[12px] text-gray-500">{v}</span> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', render: v => <span className="text-[12px] text-gray-600">{v}</span> },
    {
      title: '', key: 'a', width: 110, align: 'right',
      render: (_, r) => <Button size="small" onClick={() => setThread(r)}>View thread</Button>,
    },
  ];

  return (
    <div className="space-y-5">
      <Alert
        type="warning"
        showIcon
        message="Compliance: every chat log access is recorded"
        description="A reason is required before opening any thread. Your name, the conversation ID, and the timestamp are written to an immutable audit log."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          placeholder="Search by user pair or conversation ID"
          className="!w-96"
        />
        <Button type="primary" onClick={() => setRequestOpen(true)}>Request access</Button>
      </div>

      <SectionCard title="Recent access requests (audit trail)" noPadding>
        <Table dataSource={chatLogSearches} columns={cols} rowKey="id" pagination={false} />
      </SectionCard>

      {/* Compliance reason modal */}
      <Modal
        open={requestOpen}
        title="Request chat access"
        okText="Open thread"
        onOk={() => form.validateFields().then(() => {
          setRequestOpen(false);
          message.success('Access logged. Opening thread…');
          setTimeout(() => setThread({ pair: 'New session', conversationId: 'conv_new' }), 300);
          form.resetFields();
        })}
        onCancel={() => setRequestOpen(false)}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item name="conversationId" label="Conversation ID" rules={[{ required: true }]}>
            <Input placeholder="conv_4422" />
          </Form.Item>
          <Form.Item name="reason" label="Reason for access" rules={[{ required: true, message: 'A reason is required for the audit log' }]}>
            <Input.TextArea rows={3} placeholder="e.g. Investigating user report #r_551" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Thread Modal */}
      <Modal
        open={!!thread}
        onCancel={() => setThread(null)}
        title={`Thread · ${thread?.pair}`}
        width={600}
        footer={null}
        destroyOnClose
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {fakeThread.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'A' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${m.from === 'A' ? 'bg-gray-100 text-gray-900' : 'bg-brand-500 text-white'
                } ${m.flagged ? 'ring-2 ring-rose-300' : ''}`}>
                <p className="text-[13px] leading-relaxed">{m.body}</p>
                <div className="text-[10px] opacity-70 mt-1">{m.when}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Button danger icon={<Flag className="w-4 h-4" />} onClick={() => message.success('Flagged message reported')}>
            Flag message
          </Button>
        </div>
      </Modal>
    </div>
  );
}
