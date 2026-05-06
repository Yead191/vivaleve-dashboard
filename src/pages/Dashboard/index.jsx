import { Button } from 'antd';
import { Download } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatsRow from './StatsRow.jsx';
import ChartsRow from './ChartsRow.jsx';
import LiveFeedRow from './LiveFeedRow.jsx';
import QuickActionsRow from './QuickActionsRow.jsx';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Snapshot of activity, growth and operational alerts."
        actions={
          <>
            <Button icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button type="primary">View live feed</Button>
          </>
        }
      />

      <StatsRow />
      <ChartsRow />
      <LiveFeedRow />

      <div>
        <h3 className="text-[12px] font-medium uppercase tracking-wider text-gray-400 mb-2 px-1">Quick actions</h3>
        <QuickActionsRow />
      </div>
    </div>
  );
}
