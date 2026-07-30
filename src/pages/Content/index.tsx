import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import TabsBar from "../../components/common/TabsBar";
import ContentTab from "./ContentTab";
import { CONTENT_TYPES } from "../../redux/apiSlices/contentApi";

const tabs = [
  { key: CONTENT_TYPES.PRIVACY, label: "Privacy Policy" },
  { key: CONTENT_TYPES.TERMS, label: "Terms of Service" },
  { key: CONTENT_TYPES.ABOUT, label: "About" },
] as const;

export default function Content() {
  const [tab, setTab] = useState<string>(CONTENT_TYPES.PRIVACY);
  const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="App pages"
        subtitle="Create and edit Privacy Policy, Terms of Service, and About pages."
      />

      <TabsBar tabs={[...tabs]} value={tab} onChange={setTab} />

      <ContentTab type={activeTab.key} label={activeTab.label} />
    </div>
  );
}
