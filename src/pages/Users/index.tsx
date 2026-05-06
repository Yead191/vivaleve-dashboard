import { useMemo, useState } from 'react';
import { App } from 'antd';
import PageHeader from '../../components/common/PageHeader';
import TabsBar from '../../components/common/TabsBar';
import UsersFilterBar from './UsersFilterBar';
import UsersTable from './UsersTable';
import ReportedAccountsTab from './ReportedAccountsTab';
import SuspendUserModal from './SuspendUserModal';
import BanUserModal from './BanUserModal';
import UserReportsModal from './UserReportsModal';
import { users, reportsAgainstUsers, User } from '../../data/mockData';
import { toast } from 'sonner';

export default function UsersList() {
  const { modal } = App.useApp();

  const [tab, setTab] = useState<string>('all');
  const [filters, setFilters] = useState({ q: '', status: 'all', plan: 'all' });

  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [reportsUser, setReportsUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesQ = !filters.q ||
        u.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.q.toLowerCase());
      const matchesStatus = filters.status === 'all' || u.status === filters.status;
      const matchesPlan = filters.plan === 'all' || u.plan === filters.plan;
      return matchesQ && matchesStatus && matchesPlan;
    });
  }, [filters]);

  const handleAction = (key: string, user: User) => {
    if (key === 'suspend') setSuspendUser(user);
    else if (key === 'ban') setBanUser(user);
    else if (key === 'reports') setReportsUser(user);
    else if (key === 'activate') {
      modal.confirm({
        title: `Activate ${user.name}?`,
        content: 'The account will be re-enabled and the user can sign in immediately.',
        okText: 'Activate',
        onOk: () => toast.success(`${user.name} activated`),
      });
    } else if (key === 'impersonate') {
      toast.info(`Opening view-as session for ${user.name}…`);
    }
  };

  const tabs = [
    { key: 'all', label: 'All users', count: users.length },
    { key: 'reported', label: 'Reported accounts', count: reportsAgainstUsers.length },
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
            onExport={() => toast.success('Exporting to CSV…')}
          />
          <div className="bg-white rounded-xl border border-gray-200">
            <UsersTable data={filtered} onAction={handleAction} />
          </div>
        </>
      )}

      {tab === 'reported' && <ReportedAccountsTab />}

      {/* Modals */}
      <SuspendUserModal
        open={!!suspendUser}
        user={suspendUser}
        onCancel={() => setSuspendUser(null)}
        onConfirm={({ user, duration, reason }: any) => {
          toast.success(`${user.name} suspended for ${duration}`);
          setSuspendUser(null);
        }}
      />
      <BanUserModal
        open={!!banUser}
        user={banUser}
        onCancel={() => setBanUser(null)}
        onConfirm={({ user }: any) => {
          toast.success(`${user.name} has been banned`);
          setBanUser(null);
        }}
      />
      <UserReportsModal
        open={!!reportsUser}
        user={reportsUser}
        onCancel={() => setReportsUser(null)}
      />
    </div>
  );
}
