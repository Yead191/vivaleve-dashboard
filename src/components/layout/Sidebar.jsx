import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { navConfig } from '../../routes/navConfig.js';

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-gray-900 leading-tight">VivaLeve</div>
          <div className="text-[11px] text-gray-500 leading-tight">Admin Console</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 px-3 mb-2">
          General
        </div>
        {navConfig.map(({ key, label, path, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-500' : 'text-gray-400'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer card */}
      <div className="p-3 border-t border-gray-200">
        <div className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white p-3">
          <div className="text-[12px] font-semibold">VivaLeve v1.0</div>
          <div className="text-[11px] text-brand-100 mt-0.5">Build · 2026.05.06</div>
        </div>
      </div>
    </aside>
  );
}
