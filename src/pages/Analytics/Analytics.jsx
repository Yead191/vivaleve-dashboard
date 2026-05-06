import { App } from 'antd';
import PageHeader from '../../components/common/PageHeader.jsx';
import AnalyticsFilters from './AnalyticsFilters.jsx';
import UserActivitySection from './UserActivitySection.jsx';
import MatchEngagementSection from './MatchEngagementSection.jsx';
import RetentionSection from './RetentionSection.jsx';

export default function Analytics() {
  const { message } = App.useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track user activity, engagement, retention and growth across the platform."
      />

      <AnalyticsFilters onExport={() => message.success('Exporting report…')} />

      <UserActivitySection />
      <MatchEngagementSection />
      <RetentionSection />
    </div>
  );
}
