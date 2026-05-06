import { Users, Activity, UserPlus, Heart, Flag, DollarSign } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { dashboardStats } from '../../data/mockData';

export default function StatsRow() {
  const s = dashboardStats;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      <StatCard label="Total users" value={s.totalUsers.value} delta={s.totalUsers.delta} deltaDir={s.totalUsers.dir} sub={s.totalUsers.sub} icon={Users} tone="brand" />
      <StatCard label="Active today (DAU)" value={s.dau.value} delta={s.dau.delta} deltaDir={s.dau.dir} sub={s.dau.sub} icon={Activity} tone="indigo" />
      <StatCard label="New signups today" value={s.newSignupsToday.value} delta={s.newSignupsToday.delta} deltaDir={s.newSignupsToday.dir} sub={s.newSignupsToday.sub} icon={UserPlus} tone="green" />
      <StatCard label="Total matches made" value={s.totalMatches.value} delta={s.totalMatches.delta} deltaDir={s.totalMatches.dir} sub={s.totalMatches.sub} icon={Heart} tone="rose" />
      <StatCard label="Open reports" value={s.openReports.value} delta={s.openReports.delta} deltaDir={s.openReports.dir} sub={s.openReports.sub} icon={Flag} tone="amber" />
      <StatCard label="Revenue this month" value={s.monthlyRevenue.value} delta={s.monthlyRevenue.delta} deltaDir={s.monthlyRevenue.dir} sub={s.monthlyRevenue.sub} icon={DollarSign} tone="green" />
    </div>
  );
}
