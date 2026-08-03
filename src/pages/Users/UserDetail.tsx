import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { App, Button, Image, Popconfirm, Tag } from 'antd';
import {
  ArrowLeft,
  Ban,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Camera,
  FileText,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import { UserDetailSkeleton } from '../../components/common/skeletons/PageSkeletons';
import { User } from '../../data/mockData';
import {
  useBanUserMutation,
  useGetUserByIdQuery,
  useUpdateVerifiedStatusMutation,
  type UserDetails,
} from '../../redux/apiSlices/userApi';
import { toast } from 'sonner';
import {
  formatVerifiedStatusLabel,
  resolveVerifiedStatus,
  VERIFIED_STATUS_STYLES,
  type VerifiedStatus,
} from '../../utils/verifiedStatus';

const toLegacyUser = (user: UserDetails): User => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone ?? '—',
  joinDate: new Date(user.createdAt).toLocaleDateString(),
  lastActive: new Date(user.updatedAt).toLocaleDateString(),
  status: user.isBanned ? 'banned' : user.status.toLowerCase(),
  plan: user.premiumMembership ? 'Premium' : 'Free',
  reports: 0,
  verifiedStatus: resolveVerifiedStatus(user),
});

const VerifiedStatusBadge = ({ status }: { status: VerifiedStatus | null }) => {
  if (!status) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
        Not submitted
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${VERIFIED_STATUS_STYLES[status]}`}
    >
      {formatVerifiedStatusLabel(status)}
    </span>
  );
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    data: userDetails,
    isLoading,
    isError,
    refetch,
  } = useGetUserByIdQuery(id ?? '', { skip: !id });
  const user = useMemo(
    () => (userDetails ? toLegacyUser(userDetails) : null),
    [userDetails],
  );
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [updateVerifiedStatus, { isLoading: isUpdatingVerifiedStatus }] =
    useUpdateVerifiedStatusMutation();
  const [verifyAction, setVerifyAction] = useState<'verify' | 'reject' | null>(
    null,
  );

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (isError || !userDetails || !user) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-sm text-rose-600">Unable to load this user.</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  const photos = [userDetails.profile, userDetails.protectedImages].filter(
    (photo): photo is string => Boolean(photo),
  );
  const verifiedStatus = resolveVerifiedStatus(userDetails);
  const isPending = verifiedStatus === 'pending';
  const ownPicture = userDetails.verifyOwnPicture;
  const documentImage = userDetails.documentVerified;
  const hasVerificationMedia = Boolean(ownPicture || documentImage);
  const location =
    [userDetails.state, userDetails.country].filter(Boolean).join(', ') || '—';
  const accountTimeline = [
    {
      id: 'updated',
      when: new Date(userDetails.updatedAt).toLocaleDateString(),
      label: `Account updated · ${user.status}`,
    },
    {
      id: 'onboarding',
      when: new Date(userDetails.updatedAt).toLocaleDateString(),
      label: userDetails.onboardingComplete
        ? 'Onboarding completed'
        : 'Onboarding incomplete',
    },
    {
      id: 'created',
      when: new Date(userDetails.createdAt).toLocaleDateString(),
      label: 'Account created',
    },
  ];

  const handleVerifiedStatusUpdate = async (
    nextStatus: VerifiedStatus,
    action: 'verify' | 'reject',
  ) => {
    setVerifyAction(action);

    try {
      await updateVerifiedStatus({
        userId: user.id,
        verifiedStatus: nextStatus,
      }).unwrap();
      toast.success(
        nextStatus === 'verified'
          ? `${user.name} has been verified`
          : `${user.name} verification has been rejected`,
      );
    } catch {
      toast.error(
        nextStatus === 'verified'
          ? 'Unable to verify user. Please try again.'
          : 'Unable to reject verification. Please try again.',
      );
    } finally {
      setVerifyAction(null);
    }
  };

  const handleBan = () => {
    const action = userDetails.isBanned ? 'Unban' : 'Ban';

    modal.confirm({
      title: `${action} ${user.name}?`,
      content: userDetails.isBanned
        ? 'This user will regain access to their account.'
        : 'This user will no longer be able to access their account.',
      okText: `${action} user`,
      okButtonProps: { danger: !userDetails.isBanned },
      onOk: async () => {
        try {
          await banUser(user.id).unwrap();
          toast.success(
            `${user.name} has been ${userDetails.isBanned ? 'unbanned' : 'banned'}.`,
          );
        } catch {
          toast.error(`Unable to ${action.toLowerCase()} this user. Please try again.`);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button type="text" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/users')}>Back</Button>
      </div>

      <PageHeader
        breadcrumbs={['Users', user.name]}
        title={user.name}
        subtitle={`User ID · ${user.id}`}
        actions={
          <Button
            icon={<Ban className="w-4 h-4" />}
            danger={!userDetails.isBanned}
            loading={isBanning}
            onClick={handleBan}
          >
            {userDetails.isBanned ? 'Unban' : 'Ban'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - profile */}
        <div className="xl:col-span-1 space-y-6">
          <SectionCard noPadding>
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {userDetails.profile ? (
                  <img
                    src={userDetails.profile}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-semibold">
                    {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div>
                  <div className="text-[16px] font-semibold text-gray-900">{user.name}</div>
                  <div className="text-[12px] text-gray-500">{user.email}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={user.status} />
                    <Tag color="cyan" className="!m-0 !text-[11px]">{user.plan}</Tag>
                    <VerifiedStatusBadge status={verifiedStatus} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2.5 text-[13px]">
              <Detail icon={Mail} label="Email" value={user.email} />
              <Detail icon={Phone} label="Phone" value={user.phone} />
              <Detail icon={MapPin} label="Loc." value={location} />
              <Detail icon={Calendar} label="Joined" value={user.joinDate} />
              <Detail
                icon={ShieldCheck}
                label="Verified"
                value={formatVerifiedStatusLabel(verifiedStatus)}
              />
            </div>

            <div className="p-5 border-t border-gray-100">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Bio</div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {userDetails.bio || 'No bio added.'}
              </p>
            </div>

            <div className="p-5 border-t border-gray-100">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Photos</div>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo) => (
                  <img
                    key={photo}
                    src={photo}
                    alt={`${user.name} profile`}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Subscription & billing">
            <div className="space-y-3 text-[13px]">
              <Row k="Current plan" v={<span className="font-semibold text-gray-900">{user.plan}</span>} />
              <Row k="Status" v={<StatusBadge status={user.status} />} />
            </div>
          </SectionCard>

        </div>

        {/* Right column - account history */}
        <div className="xl:col-span-2 space-y-6">
          <SectionCard
            title="Identity verification"
            description="Compare the user's selfie with their ID document, then approve or reject."
            action={
              isPending ? (
                <div className="flex items-center gap-2">
                  <Popconfirm
                    title="Verify this user?"
                    description="This will approve the user's verification request."
                    okText="Verify"
                    cancelText="Cancel"
                    onConfirm={() =>
                      void handleVerifiedStatusUpdate('verified', 'verify')
                    }
                  >
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      icon={<ShieldCheck className="h-3.5 w-3.5" />}
                      loading={
                        isUpdatingVerifiedStatus && verifyAction === 'verify'
                      }
                    >
                      Verify
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Reject verification?"
                    description="This user will need to submit verification again."
                    okText="Reject"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                    onConfirm={() =>
                      void handleVerifiedStatusUpdate('rejected', 'reject')
                    }
                  >
                    <Button
                      size="small"
                      danger
                      ghost
                      icon={<ShieldX className="h-3.5 w-3.5" />}
                      loading={
                        isUpdatingVerifiedStatus && verifyAction === 'reject'
                      }
                    >
                      Reject
                    </Button>
                  </Popconfirm>
                </div>
              ) : undefined
            }
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetaItem
                  label="Status"
                  value={<VerifiedStatusBadge status={verifiedStatus} />}
                />
                <MetaItem
                  label="Document type"
                  value={userDetails.documentType || '—'}
                />
                <MetaItem
                  label="Admin verified"
                  value={userDetails.isAdminVerified ? 'Yes' : 'No'}
                />
              </div>

              {hasVerificationMedia ? (
                <Image.PreviewGroup>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <VerificationImageCard
                      label="Own picture"
                      icon={Camera}
                      emptyText="No selfie uploaded."
                      src={ownPicture}
                      alt={`${user.name} own picture`}
                    />
                    <VerificationImageCard
                      label="ID document"
                      icon={FileText}
                      emptyText="No document uploaded."
                      src={documentImage}
                      alt={`${user.name} ID document`}
                    />
                  </div>
                </Image.PreviewGroup>
              ) : (
                <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] text-gray-500">
                  No verification media uploaded yet.
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Account status & history">
            <ol className="relative pl-5">
              <span className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
              {accountTimeline.map(t => (
                <li key={t.id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-white border-2 border-brand-500" />
                  <div className="text-[13px] text-gray-900 font-medium">{t.label}</div>
                  <div className="text-[11px] text-gray-500">{t.when}</div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Profile details">
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-[13px] sm:grid-cols-2">
              <Row k="Display name" v={userDetails.displayName || '—'} />
              <Row k="Date of birth" v={userDetails.DOB ? new Date(userDetails.DOB).toLocaleDateString() : '—'} />
              <Row k="Gender" v={userDetails.gender || '—'} />
              <Row k="Looking for" v={userDetails.lookingFor || '—'} />
              <Row k="Occupation" v={userDetails.occupation || '—'} />
              <Row k="Education" v={userDetails.education || '—'} />
              <Row k="Relationship" v={userDetails.relationStatus || '—'} />
              <Row k="Nationality" v={userDetails.nationality || '—'} />
              <Row k="Height" v={userDetails.height ? `${userDetails.height} cm` : '—'} />
              <Row k="Weight" v={userDetails.weight ? `${userDetails.weight} kg` : '—'} />
            </div>
          </SectionCard>

        </div>
      </div>

    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-[12px] text-gray-500 w-14">{label}</span>
      <span className="text-[13px] text-gray-900 truncate">{value}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-gray-500">{k}</span>
      <span className="text-[13px] text-gray-900">{v}</span>
    </div>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="text-[13px] font-medium text-gray-900">{value}</div>
    </div>
  );
}

const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'%3E%3Crect width='320' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function VerificationImageCard({
  label,
  icon: Icon,
  src,
  alt,
  emptyText,
}: {
  label: string;
  icon: typeof Camera;
  src?: string;
  alt: string;
  emptyText: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width="100%"
          style={{
            width: '100%',
            height: 280,
            objectFit: 'contain',
            background: '#f9fafb',
          }}
          rootClassName="!block"
          fallback={IMAGE_FALLBACK}
        />
      ) : (
        <div className="flex h-[280px] items-center justify-center bg-gray-50 px-4 text-center text-[13px] text-gray-500">
          {emptyText}
        </div>
      )}
    </div>
  );
}
