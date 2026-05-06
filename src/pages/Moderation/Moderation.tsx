import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import TabsBar from '../../components/common/TabsBar';
import FlaggedContentTab from './FlaggedContentTab';
import AutoModerationTab from './AutoModerationTab';
import ChatLogTab from './ChatLogTab';
import { flaggedContent, moderationRules } from '../../data/mockData';

export default function Moderation() {
  const [tab, setTab] = useState<string>('flagged');

  const tabs = [
    { key: 'flagged', label: 'Flagged content',     count: flaggedContent.filter(f => f.status === 'pending').length },
    { key: 'rules',   label: 'Auto-moderation',     count: moderationRules.length },
    { key: 'chatlog', label: 'Chat log viewer' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content moderation"
        subtitle="Review flagged content, manage automated rules, and audit chat access."
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'flagged' && <FlaggedContentTab />}
      {tab === 'rules'   && <AutoModerationTab />}
      {tab === 'chatlog' && <ChatLogTab />}
    </div>
  );
}
