import SectionCard from '../../components/common/SectionCard.jsx';
import LineChartCard from '../../components/charts/LineChartCard.jsx';
import BarChartCard from '../../components/charts/BarChartCard.jsx';
import { dauTrend, signupsTrend, matchConversionTrend } from '../../data/mockData.js';

export default function ChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="Daily active users" description="Last 30 days">
        <LineChartCard data={dauTrend} />
      </SectionCard>
      <SectionCard title="New signups" description="Last 30 days">
        <BarChartCard data={signupsTrend} />
      </SectionCard>
      <SectionCard title="Match conversion rate" description="Last 30 days · %">
        <LineChartCard data={matchConversionTrend} color="#10b981" />
      </SectionCard>
    </div>
  );
}
