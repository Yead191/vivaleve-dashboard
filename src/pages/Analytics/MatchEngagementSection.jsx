import SectionCard from '../../components/common/SectionCard.jsx';
import { matchFunnel, peakHours } from '../../data/mockData.js';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MatchEngagementSection() {
  const max = matchFunnel[0].value;

  // Heatmap color computation
  const cellColor = (intensity) => {
    if (intensity < 25) return 'bg-brand-50';
    if (intensity < 45) return 'bg-brand-100';
    if (intensity < 65) return 'bg-brand-300';
    if (intensity < 85) return 'bg-brand-500';
    return 'bg-brand-700';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[12px] font-medium uppercase tracking-wider text-gray-400 px-1">Match & engagement</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Match conversion funnel" description="Views → Likes → Matches → Messages" className="lg:col-span-2">
          <div className="space-y-3">
            {matchFunnel.map((s, i) => {
              const pct = (s.value / max) * 100;
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-gray-800">{s.stage}</span>
                    <span className="text-[12px] text-gray-500">
                      {s.value.toLocaleString()}
                      {i > 0 && (
                        <span className="ml-2 text-[11px] text-rose-500">
                          ({((s.value / matchFunnel[i - 1].value) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-7 rounded-md bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-md transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <Stat label="Avg messages per match" value="14.6" />
          <Stat label="Avg session duration"   value="9m 12s" />
          <Stat label="Avg matches per user"   value="4.2" />
        </div>
      </div>

      <SectionCard title="Peak usage hours" description="Heatmap · Mon–Sun · UTC">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-[60px_repeat(24,minmax(20px,1fr))] gap-0.5 text-[10px] text-gray-500">
              <div />
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-center">{i}</div>
              ))}
              {days.map((d, dIdx) => (
                <div key={d} className="contents">
                  <div className="font-medium text-gray-700 flex items-center">{d}</div>
                  {Array.from({ length: 24 }, (_, h) => {
                    const cell = peakHours.find(p => p.day === dIdx && p.hour === h);
                    return (
                      <div
                        key={h}
                        title={`${d} ${h}:00 · ${cell.value}%`}
                        className={`aspect-square rounded ${cellColor(cell.value)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-gray-500">
          <span>Less</span>
          <div className="w-4 h-4 rounded bg-brand-50" />
          <div className="w-4 h-4 rounded bg-brand-100" />
          <div className="w-4 h-4 rounded bg-brand-300" />
          <div className="w-4 h-4 rounded bg-brand-500" />
          <div className="w-4 h-4 rounded bg-brand-700" />
          <span>More</span>
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-5">
      <div className="text-[12px] text-gray-500">{label}</div>
      <div className="text-[24px] font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
