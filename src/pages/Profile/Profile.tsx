import { useEffect, useRef, useState } from "react";
import { App, Button, Card, Divider, Form, Input, Tabs, Tag, Upload } from "antd";
import type { UploadFile } from "antd";
import dayjs from "dayjs";
import {
  Camera,
  CheckCircle2,
  Lock,
  LogOut,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { ProfilePageSkeleton } from "../../components/common/skeletons/PageSkeletons";
import { IMAGE_BASE_URL } from "../../config/env";
import { performLogout } from "../../redux/logout";
import { useChangePasswordMutation } from "../../redux/apiSlices/authApi";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/apiSlices/profileApi";
const formatRole = (role: string) =>
  role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const getInitials = (name: string) =>
  name
    .split(/[\s_]+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const resolveProfileImage = (profilePath: string) => {
  if (!profilePath) return undefined;
  if (/^https?:\/\//i.test(profilePath)) return profilePath;
  return `${IMAGE_BASE_URL}${profilePath.startsWith("/") ? profilePath : `/${profilePath}`}`;
};

export default function Profile() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile, form]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (file: File) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (values: { name: string }) => {
    try {
      await updateProfile({
        name: values.name,
        image: profileImage,
      }).unwrap();
      message.success("Profile updated successfully");
      setProfileImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    } catch {
      message.error("Unable to update profile. Please try again.");
    }
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await changePassword(values).unwrap();
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch {
      message.error("Unable to change password. Please check your current password and try again.");
    }
  };

  const handleSignOut = () => {
    performLogout();
    navigate("/auth/login", { replace: true });
    toast.success("Logged out successfully!");
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Admin Profile"
          subtitle="Manage your account settings and security preferences."
        />
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-rose-600">Unable to load profile.</p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const avatarSrc = resolveProfileImage(profile.profile);
  const displayAvatar = imagePreview || avatarSrc;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your account settings and security preferences."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden border-gray-200 shadow-sm">
            <div className="h-24 -mx-6 -mt-6 bg-gradient-to-r from-brand-400 to-brand-600" />
            <div className="relative -mt-12 mb-4 flex flex-col items-center">
              <div className="relative">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={profile.name}
                    className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-white text-3xl font-bold text-white shadow-md"
                    style={{ backgroundColor: "#429CA8" }}
                  >
                    {getInitials(profile.name)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full border border-gray-100 bg-white p-2 shadow-lg transition-colors hover:text-[#429CA8]"
                  aria-label="Change profile photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleImageSelect(file);
                    event.target.value = "";
                  }}
                />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500">
                {formatRole(profile.role)}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <StatusBadge status={profile.status.toLowerCase()} />
                {profile.verified && (
                  <Tag
                    color="cyan"
                    icon={<Shield className="h-3 w-3" />}
                    className="flex items-center gap-1"
                  >
                    Verified
                  </Tag>
                )}
                {profile.isAdminVerified && (
                  <Tag color="blue" className="!m-0">
                    Admin verified
                  </Tag>
                )}
              </div>
            </div>

            <Divider className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                <span>
                  Active since {dayjs(profile.createdAt).format("MMM YYYY")}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <InfoRow
                label="Onboarding"
                value={profile.onboardingComplete ? "Complete" : "Incomplete"}
              />
              <InfoRow
                label="Premium"
                value={profile.premiumMembership ? "Yes" : "No"}
              />
              <InfoRow
                label="Account status"
                value={
                  profile.accountInformation.status ? "Enabled" : "Disabled"
                }
              />
            </div>

            <div className="mt-8">
              <Button
                danger
                block
                icon={<LogOut className="h-4 w-4" />}
                className="flex items-center justify-center"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[600px] border-gray-200 shadow-sm">
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      General Information
                    </span>
                  ),
                  children: (
                    <div className="pt-4">
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Form.Item
                            name="name"
                            label="Full name"
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder="Enter your full name"
                              prefix={
                                <User className="mr-2 h-4 w-4 text-gray-400" />
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name="email"
                            label="Email address"
                            rules={[{ required: true, type: "email" }]}
                          >
                            <Input
                              disabled
                              placeholder="Email cannot be changed"
                              prefix={
                                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                              }
                            />
                          </Form.Item>
                        </div>
                        <Form.Item label="Profile photo">
                          <Upload
                            accept="image/*"
                            maxCount={1}
                            showUploadList={false}
                            beforeUpload={(file) => {
                              handleImageSelect(file);
                              return false;
                            }}
                            fileList={
                              profileImage
                                ? [
                                    {
                                      uid: "-1",
                                      name: profileImage.name,
                                      status: "done",
                                    } as UploadFile,
                                  ]
                                : []
                            }
                          >
                            <Button icon={<Camera className="h-4 w-4" />}>
                              {profileImage ? "Change photo" : "Upload photo"}
                            </Button>
                          </Upload>
                          {profileImage && (
                            <p className="mt-2 text-xs text-gray-500">
                              New photo selected. Save changes to apply.
                            </p>
                          )}
                        </Form.Item>
                        <div className="flex justify-end pt-4">
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<Save className="h-4 w-4" />}
                            size="large"
                            loading={isUpdating}
                          >
                            Save changes
                          </Button>
                        </div>
                      </Form>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Security & Password
                    </span>
                  ),
                  children: (
                    <div className="pt-4">
                      <div className="mb-6 flex gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
                        <Shield className="h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900">
                            Strong password policy
                          </h4>
                          <p className="mt-1 text-xs text-amber-700">
                            Use at least 8 characters with uppercase, lowercase,
                            numbers, and special symbols.
                          </p>
                        </div>
                      </div>

                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                      >
                        <Form.Item
                          name="currentPassword"
                          label="Current password"
                          rules={[{ required: true }]}
                        >
                          <Input.Password
                            placeholder="Enter your current password"
                            prefix={
                              <Lock className="mr-2 h-4 w-4 text-gray-400" />
                            }
                          />
                        </Form.Item>

                        <Divider />

                        <Form.Item
                          name="newPassword"
                          label="New password"
                          rules={[{ required: true, min: 8 }]}
                        >
                          <Input.Password
                            placeholder="Enter your new password"
                            prefix={
                              <Shield className="mr-2 h-4 w-4 text-gray-400" />
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          name="confirmPassword"
                          label="Confirm new password"
                          dependencies={["newPassword"]}
                          rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("newPassword") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("The two passwords do not match."),
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            placeholder="Confirm your new password"
                            prefix={
                              <Shield className="mr-2 h-4 w-4 text-gray-400" />
                            }
                          />
                        </Form.Item>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isChangingPassword}
                          >
                            Update password
                          </Button>
                        </div>
                      </Form>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
