import React, { useState } from 'react';
import {
  Bell,
  Smartphone,
  Monitor,
  User as UserIcon,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Wifi,
  WifiOff,
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { User, Family, NotificationItem, CurrencyCode } from '../types';

interface HeaderProps {
  user: User | null;
  family: Family | null;
  memberRole: string;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onLogout: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  family,
  memberRole,
  currency,
  onCurrencyChange,
  isMobileSimulator,
  onToggleSimulator,
  isDarkMode,
  onToggleDarkMode,
  notifications,
  onOpenNotifications,
  onLogout,
  onNavigate,
  isOnline,
  onToggleOnline,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 sm:px-6">
      {/* Left: App Title & Sidebar Toggle */}
      <div className="flex items-center gap-2.5">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-all shadow-xs"
            title={isSidebarCollapsed ? "Mở rộng Menu bên trái" : "Thu gọn Menu bên trái (Mở rộng không gian)"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        )}

        <div
          onClick={() => onNavigate('dashboard')}
          className="flex cursor-pointer items-center gap-2.5 font-extrabold text-indigo-600 dark:text-indigo-400 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <span className="text-lg font-black tracking-tight">₫</span>
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:inline-block">
            FinFamily
          </span>
        </div>

        <div className="hidden h-5 w-[1px] bg-slate-200 dark:bg-slate-800 md:block" />

        {/* Current Family & Firebase Sync Status Badge */}
        {family && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span className="font-bold">{family.name}</span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {memberRole}
              </span>
            </div>

            {/* Firebase & 5m Sheet Backup Status Badge */}
            <div
              onClick={() => onNavigate('google-sheet')}
              className="hidden lg:flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/40 hover:bg-emerald-100 transition-colors"
              title="Firebase kết nối trực tiếp - Tự động đẩy Google Sheet 5 phút"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>🔥 Firebase DB</span>
              <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.2 rounded-full font-extrabold">
                Backup 5m Sheet
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Online/Offline Simulator Toggle */}
        <button
          onClick={onToggleOnline}
          title={isOnline ? 'Đang Online (Nhấn để thử nghiệm Offline)' : 'Đang Offline (Nhấn để khôi phục Online)'}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-800/60 dark:text-amber-300'
          }`}
        >
          {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5 animate-pulse" />}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        {/* Currency Switcher */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50 py-1.5 pr-7 pl-3 text-xs font-bold text-slate-700 transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="VND">VND (₫)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Mobile App View Simulator Toggle */}
        <button
          onClick={onToggleSimulator}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
            isMobileSimulator
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950/50 dark:border-indigo-600 dark:text-indigo-300'
              : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300'
          }`}
          title="Chuyển chế độ Khung Hình Mobile"
        >
          {isMobileSimulator ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
          <span className="hidden md:inline">{isMobileSimulator ? 'Giao diện App' : 'Giao diện Web'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Thao tác Chế độ Sáng / Tối"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-slate-200/80 object-cover dark:border-slate-700"
            />
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <UserIcon className="h-4 w-4" /> Cài đặt tài khoản
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                  >
                    <ShieldCheck className="h-4 w-4" /> Quản trị Hệ thống
                  </button>
                )}
              </div>

              <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                >
                  <UserIcon className="h-4 w-4" /> Đổi tài khoản / Đăng nhập
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
