import { useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import TabsBar from '../../components/common/TabsBar';
import UsersFilterBar from './UsersFilterBar';
import UsersTable from './UsersTable';
import ReportedAccountsTab from './ReportedAccountsTab';
import BanUserModal from './BanUserModal';
import { reportsAgainstUsers, User } from '../../data/mockData';
import {
  useGetUserListQuery,
  useLazyGetUserListQuery,
} from '../../redux/apiSlices/overviewApi';
import type { DashboardUser } from '../../redux/apiSlices/overviewApi';
import {
  useBanUserMutation,
  useUpdateVerifiedStatusMutation,
} from '../../redux/apiSlices/userApi';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  formatVerifiedStatusLabel,
  resolveVerifiedStatus,
  type VerifiedStatus,
} from '../../utils/verifiedStatus';

interface UserFilters {
  q: string;
  status: string;
  plan: string;
  verifiedStatus: string;
}

const mapDashboardUser = (user: DashboardUser): User => ({
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

const matchesFilters = (user: User, filters: UserFilters) => {
  const query = filters.q.toLowerCase();
  const matchesQ =
    !query ||
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query);
  const matchesStatus =
    filters.status === 'all' || user.status === filters.status;
  const matchesPlan = filters.plan === 'all' || user.plan === filters.plan;
  const matchesVerifiedStatus =
    filters.verifiedStatus === 'all' ||
    user.verifiedStatus === filters.verifiedStatus;

  return matchesQ && matchesStatus && matchesPlan && matchesVerifiedStatus;
};

export default function UsersList() {
  const [tab, setTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    q: '',
    status: 'all',
    plan: 'all',
    verifiedStatus: 'all',
  });
  const [exporting, setExporting] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const { data: userList, isLoading, isError } = useGetUserListQuery(page);
  const [fetchUserList] = useLazyGetUserListQuery();
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [updateVerifiedStatus, { isLoading: isUpdatingVerifiedStatus }] =
    useUpdateVerifiedStatusMutation();
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject' | null>(
    null,
  );

  const users = useMemo<User[]>(
    () => (userList?.data ?? []).map(mapDashboardUser),
    [userList?.data],
  );

  const filtered = useMemo(
    () => users.filter((user) => matchesFilters(user, filters)),
    [filters, users],
  );

  const handleExport = async () => {
    const totalPages = userList?.pagination.totalPage ?? 0;

    if (!totalPages) {
      toast.warning('No users available to export.');
      return;
    }

    setExporting(true);

    try {
      const pages = await Promise.all(
        Array.from({ length: totalPages }, (_, index) =>
          fetchUserList(index + 1, true).unwrap(),
        ),
      );
      const exportUsers = pages
        .flatMap((result) => result.data)
        .map(mapDashboardUser)
        .filter((user) => matchesFilters(user, filters));

      if (!exportUsers.length) {
        toast.warning('No users match the selected filters.');
        return;
      }

      const rows = exportUsers.map((user) => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Joined: user.joinDate,
        Updated: user.lastActive,
        Status: user.status,
        Plan: user.plan,
        'Verification status': formatVerifiedStatusLabel(user.verifiedStatus),
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(
        workbook,
        `vivaleve-users-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      toast.success(`Exported ${exportUsers.length} users.`);
    } catch {
      toast.error('Unable to export users. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleBanClick = (user: User) => {
    setUserToBan(user);
  };

  const handleVerifiedStatusUpdate = async (
    user: User,
    verifiedStatus: VerifiedStatus,
    action: 'verify' | 'reject',
  ) => {
    setActionUserId(user.id);
    setActionType(action);

    try {
      await updateVerifiedStatus({ userId: user.id, verifiedStatus }).unwrap();
      toast.success(
        verifiedStatus === 'verified'
          ? `${user.name} has been verified`
          : `${user.name} verification has been rejected`,
      );
    } catch {
      toast.error(
        verifiedStatus === 'verified'
          ? 'Unable to verify user. Please try again.'
          : 'Unable to reject verification. Please try again.',
      );
    } finally {
      setActionUserId(null);
      setActionType(null);
    }
  };

  const handleBanConfirm = async ({
    user,
  }: {
    user: User | null;
    reason: string;
  }) => {
    if (!user) return;

    try {
      await banUser(user.id).unwrap();
      toast.success(`${user.name} has been banned`);
      setUserToBan(null);
    } catch {
      toast.error('Unable to ban user. Please try again.');
    }
  };

  const tabs = [
    { key: 'all', label: 'All users', count: userList?.pagination.total ?? 0 },
    {
      key: 'reported',
      label: 'Reported accounts',
      count: reportsAgainstUsers.length,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User management"
        subtitle="Search, filter, moderate and inspect every account on VivaLeve."
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'all' && (
        <>
          <UsersFilterBar
            filters={filters}
            setFilters={setFilters}
            onExport={handleExport}
            exporting={exporting}
          />
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <UsersTable
              data={filtered}
              onBan={handleBanClick}
              onVerify={(user) =>
                void handleVerifiedStatusUpdate(user, 'verified', 'verify')
              }
              onReject={(user) =>
                void handleVerifiedStatusUpdate(user, 'rejected', 'reject')
              }
              banningUserId={isBanning ? userToBan?.id : null}
              verifyingUserId={
                isUpdatingVerifiedStatus && actionType === 'verify'
                  ? actionUserId
                  : null
              }
              rejectingUserId={
                isUpdatingVerifiedStatus && actionType === 'reject'
                  ? actionUserId
                  : null
              }
              loading={isLoading}
              isError={isError}
              currentPage={userList?.pagination.page ?? page}
              pageSize={userList?.pagination.limit ?? 10}
              total={userList?.pagination.total ?? 0}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {tab === 'reported' && <ReportedAccountsTab />}

      <BanUserModal
        open={!!userToBan}
        user={userToBan}
        loading={isBanning}
        onCancel={() => setUserToBan(null)}
        onConfirm={handleBanConfirm}
      />
    </div>
  );
}
