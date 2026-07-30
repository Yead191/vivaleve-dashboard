import { useState, type ReactNode } from "react";
import { Button } from "antd";
import dayjs from "dayjs";
import { Calendar, CreditCard, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../../components/common/StatusBadge";
import { CardGridSkeleton } from "../../components/common/skeletons/PageSkeletons";
import PackageFormModal from "./PackageFormModal";
import {
  type CreatePackageRequest,
  type Package,
  useCreatePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from "../../redux/apiSlices/packageApi";

export default function PlansTab() {
  const [openForm, setOpenForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const {
    data: packages = [],
    isLoading,
    isError,
    refetch,
  } = useGetPackagesQuery();
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingPackage(null);
  };

  const handleCreate = async (values: CreatePackageRequest) => {
    try {
      await createPackage(values).unwrap();
      toast.success("Package created successfully.");
      handleCloseForm();
    } catch {
      toast.error("Unable to create package. Please try again.");
    }
  };

  const handleUpdate = async (values: CreatePackageRequest) => {
    if (!editingPackage) {
      return;
    }

    try {
      await updatePackage({
        packageId: editingPackage._id,
        body: {
          title: values.title,
          price: values.price,
          duration: values.duration,
          paymentType: values.paymentType,
        },
      }).unwrap();
      toast.success("Package updated successfully.");
      handleCloseForm();
    } catch {
      toast.error("Unable to update package. Please try again.");
    }
  };

  const handleSubmit = (values: CreatePackageRequest) => {
    if (editingPackage) {
      void handleUpdate(values);
      return;
    }

    void handleCreate(values);
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-[14px] font-semibold text-gray-900">
          Subscription plans
        </h3>
        <p className="text-[12px] text-gray-500">
          Packages, pricing, billing cycle, and Stripe payment details.
        </p>
      </div>
      <Button
        type="primary"
        icon={<Plus className="h-4 w-4" />}
        onClick={handleOpenCreate}
      >
        Add package
      </Button>
    </div>
  );

  let content: ReactNode;

  if (isLoading) {
    content = <CardGridSkeleton count={3} />;
  } else if (isError) {
    content = (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-rose-600">
          Unable to load subscription plans.
        </p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (!packages.length) {
    content = (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-gray-900">
          No subscription plans
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Create a package to start offering subscriptions.
        </p>
        <Button
          type="primary"
          className="mt-4"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Add package
        </Button>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <article
            key={pkg._id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-card"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-[16px] font-semibold text-gray-900">
                    {pkg.title}
                  </h4>
                  <StatusBadge status={pkg.status} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[26px] font-semibold text-gray-900">
                    ${pkg.price}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    / {pkg.duration}
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-lg bg-[#EAF5F6] p-2 text-[#287D89]">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <DetailRow label="Payment type" value={pkg.paymentType} />
              <DetailRow label="Duration" value={pkg.duration} />
              <DetailRow label="Product ID" value={pkg.productId} mono />
              <DetailRow label="Price ID" value={pkg.priceId} mono />
              <DetailRow
                label="Created"
                value={dayjs(pkg.createdAt).format("MMM D, YYYY")}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
              <DetailRow
                label="Updated"
                value={dayjs(pkg.updatedAt).format("MMM D, YYYY")}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
            </div>

            {pkg.status === "Active" && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Button
                  block
                  icon={<Pencil className="h-4 w-4" />}
                  onClick={() => handleOpenEdit(pkg)}
                >
                  Edit package
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {header}
      {content}

      <PackageFormModal
        open={openForm}
        loading={isCreating || isUpdating}
        editingPackage={editingPackage}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
        {icon}
        {label}
      </span>
      <span
        className={`max-w-[58%] text-right text-[12px] font-medium text-gray-800 ${
          mono ? "font-mono text-[11px] break-all" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
