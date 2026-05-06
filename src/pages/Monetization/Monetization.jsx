import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import TabsBar from '../../components/common/TabsBar.jsx';
import PlansTab from './PlansTab.jsx';
import RevenueTab from './RevenueTab.jsx';
import PurchasesTab from './PurchasesTab.jsx';
import PromoCodesTab from './PromoCodesTab.jsx';
import { subscriptionPlans, promoCodes } from '../../data/mockData.js';

export default function Monetization() {
  const [tab, setTab] = useState('plans');

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
