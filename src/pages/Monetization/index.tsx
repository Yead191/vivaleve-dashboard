import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import TabsBar from '../../components/common/TabsBar';
import PlansTab from './PlansTab';
import PurchasesTab from './PurchasesTab';
import { useGetPackagesQuery } from '../../redux/apiSlices/packageApi';

export default function Monetization() {
  const [tab, setTab] = useState<string>('plans');
  const { data: packages = [] } = useGetPackagesQuery();

  const tabs = [
    { key: 'plans', label: 'Plans', count: packages.length },
    { key: 'purchases', label: 'Purchases' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monetization"
        subtitle="Subscription plans and purchase history."
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'plans' && <PlansTab />}
      {tab === 'purchases' && <PurchasesTab />}
    </div>
  );
}
