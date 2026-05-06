import PageHeader from '../../components/common/PageHeader';
import ComposeBroadcastPanel from './ComposeBroadcastPanel';
import SafetyTemplatesPanel from './SafetyTemplatesPanel';
import SendHistoryPanel from './SendHistoryPanel';

export default function Messaging() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Push & in-app messaging"
        subtitle="Broadcast announcements, safety reminders, and engagement campaigns."
      />

      <ComposeBroadcastPanel />
      <SafetyTemplatesPanel />
      <SendHistoryPanel />
    </div>
  );
}
