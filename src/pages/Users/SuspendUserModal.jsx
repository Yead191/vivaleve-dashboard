import { Modal, Form, Input, Select } from 'antd';

export default function SuspendUserModal({ open, user, onCancel, onConfirm }) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      onConfirm({ user, ...values });
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title={`Suspend ${user?.name || 'user'}`}
      okText="Suspend user"
      okButtonProps={{ danger: true }}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <p className="text-[13px] text-gray-600 mb-4">
        The user will be unable to sign in for the selected duration. They’ll see the suspension reason on their next attempt.
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="duration"
          label="Duration"
          rules={[{ required: true, message: 'Pick a duration' }]}
          initialValue="7d"
        >
          <Select
            options={[
              { value: '24h', label: '24 hours' },
              { value: '7d',  label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: 'A reason is required' }]}
        >
          <Input.TextArea rows={3} placeholder="e.g. Repeated reports for inappropriate behavior in DMs" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
