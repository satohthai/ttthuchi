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
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole?: string;
  trashCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  userRole,
  trashCount = 0,
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

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Quản Lý Thu Chi
          </p>
          <nav className="mt-2.5 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Tools */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Hệ Thống & Công Cụ
          </p>
          <nav className="mt-2.5 space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer info card */}
      <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/80 to-slate-50/50 p-3.5 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-900/50">
        <p className="text-[11px] font-bold text-indigo-950 dark:text-indigo-300">
          Nhập Giao Dịch Nhanh
        </p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-indigo-700/80 dark:text-indigo-400">
          Tối ưu hóa thao tác hoàn tất dưới 10 giây.
        </p>
      </div>
    </aside>
  );
};
