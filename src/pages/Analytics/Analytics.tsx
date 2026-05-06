import PageHeader from '../../components/common/PageHeader';
import AnalyticsFilters from './AnalyticsFilters';
import UserActivitySection from './UserActivitySection';
import MatchEngagementSection from './MatchEngagementSection';
import RetentionSection from './RetentionSection';
import { toast } from 'sonner';

export default function Analytics() {

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track user activity, engagement, retention and growth across the platform."
      />

      <AnalyticsFilters onExport={() => toast.success('Exporting report…')} />

      <UserActivitySection />
      <MatchEngagementSection />
      <RetentionSection />
    </div>
  );
}
