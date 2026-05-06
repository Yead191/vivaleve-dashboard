import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
  DollarSign,
  Bell,
  Settings,
} from 'lucide-react';

export const navConfig = [
  { key: 'dashboard',    label: 'Dashboard',     path: '/dashboard',    icon: LayoutDashboard },
  { key: 'users',        label: 'Users',         path: '/users',        icon: Users },
  { key: 'moderation',   label: 'Moderation',    path: '/moderation',   icon: ShieldCheck },
  { key: 'analytics',    label: 'Analytics',     path: '/analytics',    icon: BarChart3 },
  { key: 'monetization', label: 'Monetization',  path: '/monetization', icon: DollarSign },
  { key: 'messaging',    label: 'Messaging',     path: '/messaging',    icon: Bell },
  { key: 'config',       label: 'App Config',    path: '/config',       icon: Settings },
];
