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
import { useBanUserMutation } from '../../redux/apiSlices/userApi';
import { toast } from 'sonner';

interface UserFilters {
  q: string;
  status: string;
  plan: string;
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

  return matchesQ && matchesStatus && matchesPlan;
};

const escapeCsvCell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export default function UsersList() {
  const [tab, setTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    q: '',
    status: 'all',
    plan: 'all',
  });
  const [exporting, setExporting] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const { data: userList, isLoading, isError } = useGetUserListQuery(page);
  const [fetchUserList] = useLazyGetUserListQuery();
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();

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

      const headers = [
        'Name',
        'Email',
        'Phone',
        'Joined',
        'Updated',
        'Status',
        'Plan',
      ];
      const rows = exportUsers.map((user) => [
        user.name,
        user.email,
        user.phone,
        user.joinDate,
        user.lastActive,
        user.status,
        user.plan,
      ]);
      const csv = [headers, ...rows]
        .map((row) => row.map(escapeCsvCell).join(','))
        .join('\r\n');
      const url = URL.createObjectURL(
        new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `vivaleve-users-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
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
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <UsersTable
              data={filtered}
              onBan={handleBanClick}
              banningUserId={isBanning ? userToBan?.id : null}
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
