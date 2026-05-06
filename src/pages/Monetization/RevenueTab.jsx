import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import BarChartCard from '../../components/charts/BarChartCard.jsx';
import PieChartCard from '../../components/charts/PieChartCard.jsx';
import { revenueStats, revenueByPlan, monthlyRevenue } from '../../data/mockData.js';

export default function RevenueTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR"     value={revenueStats.mrr.value} delta={revenueStats.mrr.delta} deltaDir={revenueStats.mrr.dir} icon={TrendingUp}  tone="green" sub="vs last month" />
        <StatCard label="ARR"     value={revenueStats.arr.value} delta={revenueStats.arr.delta} deltaDir={revenueStats.arr.dir} icon={TrendingUp}  tone="brand" sub="annualized" />
        <StatCard label="Refunds (30d)" value={revenueStats.refunds.value} icon={RefreshCcw} tone="rose"  sub={`${revenueStats.refunds.total} total`} />
        <StatCard label="Avg revenue per user" value="$3.42" delta="+0.8%" deltaDir="up" icon={TrendingUp} tone="indigo" sub="ARPU · monthly" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Monthly revenue" description="Last 7 months" className="lg:col-span-2">
          <BarChartCard data={monthlyRevenue} height={280} />
        </SectionCard>
        <SectionCard title="Revenue by plan" description="This month">
          <PieChartCard data={revenueByPlan} height={280} />
        </SectionCard>
      </div>
    </div>
  );
}
