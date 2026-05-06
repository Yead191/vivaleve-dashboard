import { Modal, Form, Input, InputNumber, Select, Checkbox } from 'antd';
import { SubscriptionPlan } from '../../data/mockData';
import { useEffect } from 'react';

interface PlanFormModalProps {
  open: boolean;
  plan: SubscriptionPlan | null;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const allFeatures = [
  'Unlimited swipes',
  'See who liked you',
  'Advanced filters',
  'Boost (1×/week)',
  'Read receipts',
  'Rewind last swipe',
  'Incognito browsing',
  'Priority support',
  'Hide ads',
  'Travel mode',
  'Profile boost',
  'Verified badge',
];

export default function PlanFormModal({ open, plan, onCancel, onSave }: PlanFormModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (plan) {
        form.setFieldsValue({
          ...plan,
          features: allFeatures.slice(0, plan.features || 0),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, plan, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave({ ...(plan || {}), ...values, features: values.features?.length || 0 });
    });
  };

  return (
    <Modal
      open={open}
      title={plan ? 'Edit plan' : 'Create plan'}
      okText={plan ? 'Save changes' : 'Create plan'}
      onOk={handleOk}
      onCancel={onCancel}
      centered
      width={620}
    >
      <Form form={form} layout="vertical" initialValues={{ currency: 'USD', cycle: 'monthly', trialDays: 7 }}>
        <Form.Item name="name" label="Plan name" rules={[{ required: true }]}>
          <Input placeholder="e.g. Premium" />
        </Form.Item>

        <div className="grid grid-cols-3 gap-3">
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} className="!w-full" />
          </Form.Item>
          <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
            <Select options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'BDT', label: 'BDT' },
            ]} />
          </Form.Item>
          <Form.Item name="cycle" label="Billing cycle" rules={[{ required: true }]}>
            <Select options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Annual' },
              { value: 'weekly', label: 'Weekly' },
              { value: '—', label: 'One-time' },
            ]} />
          </Form.Item>
        </div>

        <Form.Item name="trialDays" label="Trial days">
          <InputNumber min={0} max={90} className="!w-full" />
        </Form.Item>

        <Form.Item name="features" label="Features included">
          <Checkbox.Group className="!grid !grid-cols-2 !gap-y-2">
            {allFeatures.map(f => (
              <Checkbox key={f} value={f} className="!text-[13px]">{f}</Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
