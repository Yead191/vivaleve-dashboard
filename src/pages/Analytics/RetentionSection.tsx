import SectionCard from '../../components/common/SectionCard';
import LineChartCard from '../../components/charts/LineChartCard';
import { retentionCohort } from '../../data/mockData';

// Color the cell by retention %
interface RetentionData {
  cohort: string;
  d1: number;
  d7: number;
  d14: number;
  d30: number;
  [key: string]: any;
}

const cellShade = (v: number) => {
  if (v >= 60) return 'bg-brand-700 text-white';
  if (v >= 40) return 'bg-brand-500 text-white';
  if (v >= 25) return 'bg-brand-300 text-brand-900';
  if (v >= 15) return 'bg-brand-100 text-brand-800';
  return 'bg-brand-50 text-brand-700';
};

// Trend = avg D7 retention by cohort
const trendData = retentionCohort.map(c => ({ label: c.cohort, value: c.d7 }));

export default function RetentionSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-[12px] font-medium uppercase tracking-wider text-gray-400 px-1">Retention</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Cohort retention"
          description="% of users still active after N days"
          className="lg:col-span-2"
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="px-5 py-2.5 text-left font-medium text-gray-600">Cohort</th>
                  <th className="px-5 py-2.5 text-center font-medium text-gray-600">D1</th>
                  <th className="px-5 py-2.5 text-center font-medium text-gray-600">D7</th>
                  <th className="px-5 py-2.5 text-center font-medium text-gray-600">D14</th>
                  <th className="px-5 py-2.5 text-center font-medium text-gray-600">D30</th>
                </tr>
              </thead>
              <tbody>
                {(retentionCohort as RetentionData[]).map((c, i) => (
                  <tr key={c.cohort} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                    <td className="px-5 py-3 font-medium text-gray-800">{c.cohort}</td>
                    {['d1', 'd7', 'd14', 'd30'].map(k => (
                      <td key={k} className="px-3 py-3 text-center">
                        <span className={`inline-block min-w-[44px] px-2 py-1 rounded-md text-[12px] font-semibold ${cellShade(c[k])}`}>
                          {c[k]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Retention trend" description="D7 retention by cohort">
          <LineChartCard data={trendData} height={260} />
        </SectionCard>
      </div>
    </div>
  );
}
