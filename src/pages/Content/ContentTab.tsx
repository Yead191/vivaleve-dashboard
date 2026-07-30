import { useState } from "react";
import { Button } from "antd";
import dayjs from "dayjs";
import { Calendar, FileText, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import ContentFormModal from "./ContentFormModal";
import { ContentPageSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  type ContentType,
  type Rule,
  type SaveRuleRequest,
  useGetRuleByTypeQuery,
  useSaveRuleMutation,
} from "../../redux/apiSlices/contentApi";

interface ContentTabProps {
  type: ContentType;
  label: string;
}

export default function ContentTab({ type, label }: ContentTabProps) {
  const [openForm, setOpenForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const {
    data: rule,
    isLoading,
    isError,
    refetch,
  } = useGetRuleByTypeQuery(type);
  const [saveRule, { isLoading: isSaving }] = useSaveRuleMutation();

  const handleOpenCreate = () => {
    setEditingRule(null);
    setOpenForm(true);
  };

  const handleOpenEdit = () => {
    if (!rule) {
      return;
    }

    setEditingRule(rule);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRule(null);
  };

  const handleSubmit = async (values: SaveRuleRequest) => {
    try {
      await saveRule(values).unwrap();
      toast.success(
        editingRule
          ? `${label} updated successfully.`
          : `${label} created successfully.`,
      );
      handleCloseForm();
    } catch {
      toast.error(
        editingRule
          ? `Unable to update ${label.toLowerCase()}. Please try again.`
          : `Unable to create ${label.toLowerCase()}. Please try again.`,
      );
    }
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-[14px] font-semibold text-gray-900">{label}</h3>
        <p className="text-[12px] text-gray-500">
          Manage the {label.toLowerCase()} shown in the mobile app.
        </p>
      </div>
      {rule ? (
        <Button
          type="primary"
          icon={<Pencil className="h-4 w-4" />}
          onClick={handleOpenEdit}
        >
          Edit page
        </Button>
      ) : (
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Add page
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {header}
        <ContentPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        {header}
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-rose-600">
            Unable to load {label.toLowerCase()}.
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="space-y-4">
        {header}
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-gray-900">
            No {label.toLowerCase()} yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Create the {label.toLowerCase()} page for app users.
          </p>
          <Button
            type="primary"
            className="mt-4"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add page
          </Button>
        </div>

        <ContentFormModal
          open={openForm}
          loading={isSaving}
          initialType={type}
          editingRule={editingRule}
          onCancel={handleCloseForm}
          onSubmit={(values) => void handleSubmit(values)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {header}

      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-[18px] font-semibold text-gray-900">
                {label}
              </h4>
              <span className="rounded-full bg-[#EAF5F6] px-2.5 py-0.5 text-[11px] font-medium text-[#287D89]">
                {rule.type}
              </span>
            </div>
            {(rule.createdAt || rule.updatedAt) && (
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-gray-500">
                {rule.createdAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Created {dayjs(rule.createdAt).format("MMM D, YYYY")}
                  </span>
                )}
                {rule.updatedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Updated {dayjs(rule.updatedAt).format("MMM D, YYYY")}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="shrink-0 rounded-lg bg-[#EAF5F6] p-2 text-[#287D89]">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div
          className="rule-content-preview rounded-lg border border-gray-100 bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: rule.content }}
        />
      </article>

      <ContentFormModal
        open={openForm}
        loading={isSaving}
        initialType={type}
        editingRule={editingRule}
        onCancel={handleCloseForm}
        onSubmit={(values) => void handleSubmit(values)}
      />
    </div>
  );
}
