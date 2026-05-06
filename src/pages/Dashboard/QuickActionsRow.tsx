import { Link } from 'react-router-dom';
import { LucideIcon, Send, Flag, EyeOff } from 'lucide-react';

interface QuickActionItem {
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
  tone: 'brand' | 'amber' | 'rose';
}

const items: QuickActionItem[] = [
  { label: 'Send broadcast',     description: 'Push or in-app message',     icon: Send,   to: '/messaging',  tone: 'brand' },
  { label: 'View open reports',  description: 'Review pending reports',     icon: Flag,   to: '/moderation', tone: 'amber' },
  { label: 'View flagged content', description: 'Photos, bios, messages',   icon: EyeOff, to: '/moderation', tone: 'rose'  },
];

const toneMap: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  rose:  'bg-rose-50  text-rose-600',
};

export default function QuickActionsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(it => (
        <Link
          key={it.label}
          to={it.to}
          className="bg-white rounded-xl border border-gray-200 shadow-card p-4 hover:border-brand-300 hover:shadow transition group flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneMap[it.tone]}`}>
            <it.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-gray-900 group-hover:text-brand-700">{it.label}</div>
            <div className="text-[12px] text-gray-500">{it.description}</div>
          </div>
          <span className="text-gray-300 group-hover:text-brand-500 transition">→</span>
        </Link>
      ))}
    </div>
  );
}
