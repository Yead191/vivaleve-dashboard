import { Search, Bell, } from 'lucide-react';
import { Badge } from 'antd';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20 justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users, reports, transactions…"
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-transparent
                       focus:bg-white focus:border-brand-300 focus:outline-none focus:ring-2
                       focus:ring-brand-100 text-sm placeholder-gray-400 transition"
          />
          <kbd className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2
                          text-[10px] font-medium text-gray-400 bg-white border border-gray-200
                          rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1 ml-4">

        <button className="w-10 h-10 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-500 relative">
          <Badge count={4} size="small" offset={[-2, 4]}>
            <Bell className="w-[18px] h-[18px] text-gray-500" />
          </Badge>
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[13px] font-medium text-gray-900 leading-tight">Aria Dey</div>
            <div className="text-[11px] text-gray-500 leading-tight">Super admin</div>
          </div>
        </button>
      </div>
    </header>
  );
}
