import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import TabsBar from '../../components/common/TabsBar';
import PlansTab from './PlansTab';
import RevenueTab from './RevenueTab';
import PurchasesTab from './PurchasesTab';
import PromoCodesTab from './PromoCodesTab';
import { subscriptionPlans, promoCodes } from '../../data/mockData';

export default function Monetization() {
  const [tab, setTab] = useState<string>('plans');

  const tabs = [
    { key: 'plans',     label: 'Plans',      count: subscriptionPlans.length },
    { key: 'revenue',   label: 'Revenue' },
    { key: 'purchases', label: 'Purchases' },
    { key: 'promo',     label: 'Promo codes', count: promoCodes.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monetization"
        subtitle="Plans, pricing, revenue, transactions and promotional offers."
      />

      <TabsBar tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'plans'     && <PlansTab />}
      {tab === 'revenue'   && <RevenueTab />}
      {tab === 'purchases' && <PurchasesTab />}
      {tab === 'promo'     && <PromoCodesTab />}
    </div>
  );
}
