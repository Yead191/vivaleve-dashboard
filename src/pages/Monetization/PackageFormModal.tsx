import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import {
  PACKAGE_DURATIONS,
  PACKAGE_PAYMENT_TYPES,
  type CreatePackageRequest,
} from "../../redux/apiSlices/packageApi";

interface PackageFormModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: CreatePackageRequest) => void;
}

export default function PackageFormModal({
  open,
  loading = false,
  onCancel,
  onSubmit,
}: PackageFormModalProps) {
  const [form] = Form.useForm<CreatePackageRequest>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // validation errors are shown by antd form
    }
  };

  return (
    <Modal
      open={open}
      title="Add package"
      okText="Create package"
      confirmLoading={loading}
      onOk={() => void handleOk()}
      onCancel={onCancel}
      centered
      width={620}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          duration: "1 month",
          paymentType: "Monthly",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="e.g. Starter Membership" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber min={0} step={0.01} className="!w-full" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Duration is required" }]}
          >
            <Select
              options={PACKAGE_DURATIONS.map((value) => ({
                value,
                label: value,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="paymentType"
          label="Payment type"
          rules={[{ required: true, message: "Payment type is required" }]}
        >
          <Select
            options={PACKAGE_PAYMENT_TYPES.map((value) => ({
              value,
              label: value,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
