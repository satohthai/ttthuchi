import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tag,
  PiggyBank,
  Target,
  HandCoins,
  Repeat,
  BarChart3,
  Users,
  Bell,
  History,
  ShieldAlert,
  Settings,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole?: string;
  trashCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  userRole,
  trashCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'accounts', label: 'Ví & Tài khoản', icon: Wallet },
    { id: 'categories', label: 'Danh mục', icon: Tag },
    { id: 'budgets', label: 'Ngân sách', icon: PiggyBank },
    { id: 'goals', label: 'Mục tiêu tiết kiệm', icon: Target },
    { id: 'debts', label: 'Khoản nợ & Cho vay', icon: HandCoins },
    { id: 'recurring', label: 'Giao dịch định kỳ', icon: Repeat },
    { id: 'reports', label: 'Báo cáo tài chính', icon: BarChart3 },
    { id: 'family', label: 'Gia đình & Thành viên', icon: Users },
  ];

  const secondaryNav = [
    { id: 'google-sheet', label: 'Tích hợp Google Sheet', icon: FileSpreadsheet },
    { id: 'trash', label: 'Thùng rác', icon: Trash2, badge: trashCount > 0 ? trashCount : undefined },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'audit-logs', label: 'Lịch sử thao tác', icon: History },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  if (userRole === 'admin') {
    secondaryNav.push({ id: 'admin', label: 'Quản trị hệ thống', icon: ShieldAlert });
  }

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-slate-200/80 bg-white p-3 dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300 ease-in-out select-none ${
        isMobileDrawer
          ? 'h-full w-72 shadow-2xl'
          : isCollapsed
          ? 'h-[calc(100vh-4rem)] w-16 items-center px-2'
          : 'h-[calc(100vh-4rem)] w-64'
      }`}
    >
      {/* Header Controls: Mobile Close or PC Toggle Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60 w-full mb-2">
        {isMobileDrawer ? (
          <div className="flex items-center justify-between w-full px-2 py-1">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Menu Hệ Thống
            </span>
            <button
              onClick={onCloseMobileDrawer}
              className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
            {!isCollapsed && (
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Menu Quản Lý
              </span>
            )}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-all shadow-xs"
                title={isCollapsed ? 'Mở rộng Menu bên trái' : 'Thu gọn Menu bên trái (Tăng không gian)'}
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 space-y-5 overflow-y-auto w-full custom-scrollbar pr-0.5">
        {/* Main Section */}
        <div>
          {!isCollapsed && !isMobileDrawer && (
            <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Quản Lý Thu Chi
            </p>
          )}
          <nav className="mt-1 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-xl py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'
                  } ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-bold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Tools Section */}
        <div>
          {!isCollapsed && !isMobileDrawer && (
            <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Hệ Thống & Công Cụ
            </p>
          )}
          <nav className="mt-1 space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex w-full items-center justify-between rounded-xl py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isCollapsed ? 'justify-center px-2' : 'px-3.5'
                  } ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-bold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge !== undefined && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info or Quick Expand Toggle */}
      {!isCollapsed ? (
        <div className="mt-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/80 to-slate-50/50 p-3 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-indigo-950 dark:text-indigo-300">
              Nhập Giao Dịch Nhanh
            </p>
            {onToggleCollapse && !isMobileDrawer && (
              <button
                onClick={onToggleCollapse}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                title="Thu gọn menu"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-0.5 text-[10px] leading-relaxed text-indigo-700/80 dark:text-indigo-400">
            Thao tác hoàn tất dưới 10 giây.
          </p>
        </div>
      ) : (
        <div className="mt-2 flex justify-center w-full">
          <button
            onClick={onToggleCollapse}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-indigo-400 transition-all shadow-xs"
            title="Mở rộng Menu (Hiện tên chức năng)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};

