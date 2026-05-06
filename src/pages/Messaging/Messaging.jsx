import PageHeader from '../../components/common/PageHeader.jsx';
import ComposeBroadcastPanel from './ComposeBroadcastPanel.jsx';
import SafetyTemplatesPanel from './SafetyTemplatesPanel.jsx';
import SendHistoryPanel from './SendHistoryPanel.jsx';

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
