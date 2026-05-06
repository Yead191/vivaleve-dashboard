import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { navConfig } from '../../routes/navConfig';
import { toast } from 'sonner';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to clear auth session would go here
    navigate('/login');
    toast.success("Logged out successfully!");
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <Link to={'/'} className="h-24 flex items-center gap-2.5 justify-center px-5 border-b border-gray-200 py-2">
        <img src="/logo.png" alt="" className='w-fit h-full object-contain ' />

      </Link>

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
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                ? 'bg-[#429CA8]/10 text-[#429CA8] font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#429CA8]' : 'text-gray-400'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
