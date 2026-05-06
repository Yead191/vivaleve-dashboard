import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import LineChartCard from '../../components/charts/LineChartCard.jsx';
import BarChartCard from '../../components/charts/BarChartCard.jsx';
import { analyticsDau, wauMau, newSignupsBars, churnRate } from '../../data/mockData.js';

export default function UserActivitySection() {
  return (
    <div className="space-y-4">
      <h3 className="text-[12px] font-medium uppercase tracking-wider text-gray-400 px-1">User activity</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Daily active users" description="DAU · last 30 days" className="lg:col-span-2">
          <LineChartCard data={analyticsDau} height={260} />
        </SectionCard>

        <div className="space-y-4">
          <StatCard label="Churn rate (30d)" value={churnRate.value} delta={churnRate.delta} deltaDir={churnRate.dir} icon={TrendingDown} tone="rose" sub="vs prior period" />
          <SectionCard title="New signups" description="Last 30 days">
            <BarChartCard data={newSignupsBars} height={170} />
          </SectionCard>
        </div>
      </div>

      <SectionCard title="WAU vs MAU" description="Last 5 months">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={wauMau} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
              <Line type="monotone" dataKey="wau" name="WAU" stroke="#429CA8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="mau" name="MAU" stroke="#a855f7" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
