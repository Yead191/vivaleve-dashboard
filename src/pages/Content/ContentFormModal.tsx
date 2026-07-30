import { useEffect } from "react";
import { Form, Modal, Select } from "antd";
import RichTextEditor, { isRichTextEmpty } from "../../components/common/RichTextEditor";
import {
  CONTENT_TYPES,
  type ContentType,
  type Rule,
  type SaveRuleRequest,
} from "../../redux/apiSlices/contentApi";

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  [CONTENT_TYPES.PRIVACY]: "Privacy Policy",
  [CONTENT_TYPES.TERMS]: "Terms of Service",
  [CONTENT_TYPES.ABOUT]: "About",
};

interface ContentFormModalProps {
  open: boolean;
  loading?: boolean;
  initialType?: ContentType;
  editingRule?: Rule | null;
  onCancel: () => void;
  onSubmit: (data: SaveRuleRequest) => void;
}

export default function ContentFormModal({
  open,
  loading = false,
  initialType,
  editingRule = null,
  onCancel,
  onSubmit,
}: ContentFormModalProps) {
  const [form] = Form.useForm<SaveRuleRequest>();
  const isEditing = Boolean(editingRule);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingRule) {
      form.setFieldsValue({
        type: editingRule.type,
        content: editingRule.content,
      });
      return;
    }

    form.resetFields();
    if (initialType) {
      form.setFieldValue("type", initialType);
    }
  }, [open, editingRule, initialType, form]);

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
      title={isEditing ? "Edit page" : "Add page"}
      okText={isEditing ? "Save changes" : "Create page"}
      confirmLoading={loading}
      onOk={() => void handleOk()}
      onCancel={onCancel}
      centered
      width={820}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Page type"
          rules={[{ required: true, message: "Page type is required" }]}
        >
          <Select
            disabled={isEditing}
            placeholder="Select page type"
            options={Object.values(CONTENT_TYPES).map((value) => ({
              value,
              label: CONTENT_TYPE_LABELS[value],
            }))}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[
            {
              required: true,
              validator: async (_, value: string) => {
                if (isRichTextEmpty(value)) {
                  throw new Error("Content is required");
                }
              },
            },
          ]}
        >
          <RichTextEditor placeholder="Write the page content here…" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
