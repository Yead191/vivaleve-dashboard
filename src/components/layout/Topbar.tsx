import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Bell } from "lucide-react";
import { Skeleton } from "antd";
// import { Badge, Dropdown } from "antd";
// import {
//   notifications as initialNotifications,
//   Notification,
// } from "../../data/mockData";
// import NotificationDropdown from "../common/NotificationDropdown";
import { IMAGE_BASE_URL } from "../../config/env";
import { useGetProfileQuery } from "../../redux/apiSlices/profileApi";

const formatRole = (role: string) =>
  role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const getInitials = (name: string) =>
  name
    .split(/[\s_]+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const resolveProfileImage = (profilePath: string) => {
  if (!profilePath) return undefined;
  if (/^https?:\/\//i.test(profilePath)) return profilePath;
  return `${IMAGE_BASE_URL}${profilePath.startsWith("/") ? profilePath : `/${profilePath}`}`;
};

export default function Topbar() {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  // const [notifications, setNotifications] =
  //   useState<Notification[]>(initialNotifications);

  // const unreadCount = notifications.filter((n) => n.unread).length;
  const profileImage = profile?.profile
    ? resolveProfileImage(profile.profile)
    : undefined;
  const displayName = profile?.name ?? "Admin";
  const displayRole = profile?.role ? formatRole(profile.role) : "Admin";

  // const handleReadAll = () => {
  //   setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  // };

  // const handleMarkAsRead = (id: any) => {
  //   setNotifications((prev) =>
  //     prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
  //   );
  // };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20 justify-between">
      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1">
        {/* <Dropdown
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

        <div className="w-px h-8 bg-gray-200 mx-2" /> */}

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isProfileLoading ? (
            <>
              <Skeleton.Avatar active size={32} />
              <div className="text-left hidden sm:block">
                <Skeleton.Input active size="small" style={{ width: 96 }} />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 72, marginTop: 4 }}
                />
              </div>
            </>
          ) : (
            <>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-[13px] font-medium text-gray-900 leading-tight">
                  {displayName}
                </div>
                <div className="text-[11px] text-gray-500 leading-tight">
                  {displayRole}
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
