import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import TabsBar from '../../components/common/TabsBar.jsx';
import FeatureFlagsTab from './FeatureFlagsTab.jsx';
import DefaultSettingsTab from './DefaultSettingsTab.jsx';
import LocalizationTab from './LocalizationTab.jsx';
import { featureFlags, localizationStrings } from '../../data/mockData.js';

export default function Config() {
  const [tab, setTab] = useState('flags');

  const tabs = [
    { key: 'flags',   label: 'Feature flags',    count: featureFlags.length },
    { key: 'defaults',label: 'Default settings' },
    { key: 'i18n',    label: 'Localization',     count: localizationStrings.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="App configuration"
        subtitle="Feature toggles, system defaults, and localization strings."
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'flags'    && <FeatureFlagsTab />}
      {tab === 'defaults' && <DefaultSettingsTab />}
      {tab === 'i18n'     && <LocalizationTab />}
    </div>
  );
}
