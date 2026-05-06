import { Select, DatePicker, Button } from 'antd';
import { Download } from 'lucide-react';

const { RangePicker } = DatePicker;

interface AnalyticsFiltersProps {
  onExport: () => void;
}

export default function AnalyticsFilters({ onExport }: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-gray-200">
      <Select
        defaultValue="30"
        className="!w-36"
        options={[
          { value: '7',      label: 'Last 7 days' },
          { value: '30',     label: 'Last 30 days' },
          { value: '90',     label: 'Last 90 days' },
          { value: 'custom', label: 'Custom range' },
        ]}
      />
      <RangePicker className="!w-64" />
      <Select
        defaultValue="all"
        className="!w-44"
        options={[
          { value: 'all', label: 'All regions' },
          { value: 'na',  label: 'North America' },
          { value: 'eu',  label: 'Europe' },
          { value: 'as',  label: 'Asia' },
          { value: 'sa',  label: 'South America' },
        ]}
      />
      <Select
        defaultValue="all"
        className="!w-36"
        options={[
          { value: 'all',     label: 'All platforms' },
          { value: 'ios',     label: 'iOS' },
          { value: 'android', label: 'Android' },
          { value: 'web',     label: 'Web' },
        ]}
      />
      <div className="ml-auto">
        <Button icon={<Download className="w-4 h-4" />} onClick={onExport}>Export CSV / PDF</Button>
      </div>
    </div>
  );
}
