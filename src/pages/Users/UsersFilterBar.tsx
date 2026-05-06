import { Input, Select, DatePicker, Button } from 'antd';
import { Search, Download } from 'lucide-react';

const { RangePicker } = DatePicker;

interface UsersFilterBarProps {
  filters: { q: string; status: string; plan: string };
  setFilters: (f: any) => void;
  onExport: () => void;
}

export default function UsersFilterBar({ filters, setFilters, onExport }: UsersFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 mb-4">
      <Input
        prefix={<Search className="w-4 h-4 text-gray-400" />}
        placeholder="Search by name or email"
        value={filters.q}
        onChange={e => setFilters({ ...filters, q: e.target.value })}
        className="!w-72"
      />
      <Select
        value={filters.status}
        onChange={v => setFilters({ ...filters, status: v })}
        className="!w-40"
        options={[
          { value: 'all',       label: 'All statuses' },
          { value: 'active',    label: 'Active' },
          { value: 'suspended', label: 'Suspended' },
          { value: 'banned',    label: 'Banned' },
        ]}
      />
      <Select
        value={filters.plan}
        onChange={v => setFilters({ ...filters, plan: v })}
        className="!w-40"
        options={[
          { value: 'all',     label: 'All plans' },
          { value: 'Free',    label: 'Free' },
          { value: 'Plus',    label: 'Plus' },
          { value: 'Premium', label: 'Premium' },
        ]}
      />
      <RangePicker className="!w-64" placeholder={['Joined from', 'to']} />

      <div className="ml-auto flex items-center gap-2">
        <Button icon={<Download className="w-4 h-4" />} onClick={onExport}>Export CSV</Button>
      </div>
    </div>
  );
}
