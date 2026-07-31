import { Input, Select, Button } from 'antd';
import { Search, Download } from 'lucide-react';

interface UsersFilterBarProps {
  filters: { q: string; status: string; plan: string; verifiedStatus: string };
  setFilters: (f: UsersFilterBarProps['filters']) => void;
  onExport: () => void;
  exporting?: boolean;
}

export default function UsersFilterBar({
  filters,
  setFilters,
  onExport,
  exporting,
}: UsersFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 mb-4">
      <Input
        prefix={<Search className="h-4 w-4 text-gray-400" />}
        placeholder="Search by name or email"
        value={filters.q}
        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        className="!w-full sm:!w-72"
      />
      <Select
        value={filters.status}
        onChange={(v) => setFilters({ ...filters, status: v })}
        className="!w-full sm:!w-40"
        options={[
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'suspended', label: 'Suspended' },
          { value: 'banned', label: 'Banned' },
        ]}
      />
      <Select
        value={filters.plan}
        onChange={(v) => setFilters({ ...filters, plan: v })}
        className="!w-full sm:!w-40"
        options={[
          { value: 'all', label: 'All plans' },
          { value: 'Free', label: 'Free' },
          { value: 'Premium', label: 'Premium' },
        ]}
      />
      <Select
        value={filters.verifiedStatus}
        onChange={(v) => setFilters({ ...filters, verifiedStatus: v })}
        className="!w-full sm:!w-44"
        options={[
          { value: 'all', label: 'All verification' },
          { value: 'pending', label: 'Pending' },
          { value: 'verified', label: 'Verified' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />
      <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto">
        <Button
          icon={<Download className="h-4 w-4" />}
          onClick={onExport}
          loading={exporting}
        >
          Export Excel
        </Button>
      </div>
    </div>
  );
}
