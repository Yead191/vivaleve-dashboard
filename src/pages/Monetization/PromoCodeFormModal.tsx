import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PromoCode } from '../../data/mockData';
import { useEffect } from 'react';

interface PromoCodeFormModalProps {
  open: boolean;
  code: PromoCode | null;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function PromoCodeFormModal({ open, code, onCancel, onSave }: PromoCodeFormModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (code) {
        form.setFieldsValue({
          ...code,
          expiry: code.expiry ? dayjs(code.expiry) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, code, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave({
        ...(code || {}),
        ...values,
        expiry: values.expiry ? values.expiry.format('YYYY-MM-DD') : null,
      });
    });
  };

  return (
    <Modal
      open={open}
      title={code ? 'Edit promo code' : 'Create promo code'}
      okText={code ? 'Save changes' : 'Create code'}
      onOk={handleOk}
      onCancel={onCancel}
      centered
      width={560}
    >
      <Form form={form} layout="vertical" initialValues={{ discountType: 'percent', planRestriction: 'Any' }}>
        <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
          <Input placeholder="e.g. WELCOME20" style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="discountType" label="Discount type" rules={[{ required: true }]}>
            <Select options={[
              { value: 'percent', label: '% percentage' },
              { value: 'fixed', label: 'Fixed amount' },
            ]} />
          </Form.Item>
          <Form.Item name="discount" label="Discount value" rules={[{ required: true }]}>
            <InputNumber min={0} className="!w-full" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="maxUses" label="Max uses" rules={[{ required: true }]}>
            <InputNumber min={1} className="!w-full" placeholder="1000" />
          </Form.Item>
          <Form.Item name="expiry" label="Expiry date" rules={[{ required: true }]}>
            <DatePicker className="!w-full" />
          </Form.Item>
        </div>

        <Form.Item name="planRestriction" label="Plan restriction">
          <Select options={[
            { value: 'Any', label: 'Any plan' },
            { value: 'Plus', label: 'Plus only' },
            { value: 'Premium', label: 'Premium only' },
            { value: 'Plus, Premium', label: 'Plus or Premium' },
          ]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
