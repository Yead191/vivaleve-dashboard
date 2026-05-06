import { Modal, Form, Input, Alert } from 'antd';
import { User } from '../../data/mockData';

interface BanUserModalProps {
  open: boolean;
  user: User | null;
  onCancel: () => void;
  onConfirm: (values: { user: User | null; reason: string }) => void;
}

export default function BanUserModal({ open, user, onCancel, onConfirm }: BanUserModalProps) {
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
      title={`Ban ${user?.name || 'user'} permanently`}
      okText="Ban permanently"
      okButtonProps={{ danger: true }}
      onOk={handleOk}
      onCancel={onCancel}
      centered
    >
      <Alert
        type="error"
        showIcon
        message="This action is permanent"
        description="The user will be banned forever and their account marked as terminated. They will not be able to create another account with the same identifiers."
        className="!mb-4"
      />
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Reason for ban"
          rules={[{ required: true, message: 'A reason is required' }]}
        >
          <Input.TextArea rows={4} placeholder="Document the violation in detail for the audit log" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
