import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Badge, Dropdown } from "antd";
import {
  notifications as initialNotifications,
  Notification,
} from "../../data/mockData";
import NotificationDropdown from "../common/NotificationDropdown";

export default function Topbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkAsRead = (id: any) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20 justify-between">
      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1">
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          dropdownRender={() => (
            <NotificationDropdown
              notifications={notifications}
              onReadAll={handleReadAll}
              onMarkAsRead={handleMarkAsRead}
            />
          )}
        >
          <button className="w-10 h-10 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-500 relative transition-colors">
            <Badge
              count={unreadCount}
              size="small"
              offset={[-2, 4]}
              color="#6366f1"
            >
              <Bell className="w-[18px] h-[18px] text-gray-500" />
            </Badge>
          </button>
        </Dropdown>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[13px] font-medium text-gray-900 leading-tight">
              Aria Dey
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">
              Super admin
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
