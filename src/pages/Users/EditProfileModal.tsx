import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { User } from '../../data/mockData';

interface EditProfileModalProps {
  open: boolean;
  user: User | null;
  onCancel: () => void;
  onSave: (values: any) => void;
}

export default function EditProfileModal({ open, user, onCancel, onSave }: EditProfileModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave({ ...user, ...values });
    });
  };

  return (
    <Modal
      open={open}
      title="Edit profile"
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save changes"
      width={560}
      centered
    >
      <Form form={form} layout="vertical" initialValues={user || {}}>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <InputNumber className="!w-full" min={18} max={120} />
          </Form.Item>
        </div>
        <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input placeholder="City, Country" />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="plan" label="Subscription plan">
          <Select
            options={[
              { value: 'Free', label: 'Free' },
              { value: 'Plus', label: 'Plus' },
              { value: 'Premium', label: 'Premium' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
