import { Modal, Form, Input, Select } from 'antd';

export default function AddNoteModal({ open, onCancel, onSave }) {
  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields().then(values => {
      onSave(values);
      form.resetFields();
    });
  };
  return (
    <Modal
      open={open}
      title="Add admin note"
      okText="Save note"
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="visibility" label="Visibility" initialValue="internal">
          <Select
            options={[
              { value: 'internal', label: 'Internal — visible to admins only' },
              { value: 'flagged',  label: 'Flagged — surfaces in reports too' },
            ]}
          />
        </Form.Item>
        <Form.Item name="note" label="Note" rules={[{ required: true, message: 'Note is required' }]}>
          <Input.TextArea rows={4} placeholder="Add observations, prior conversations, or moderation context…" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
