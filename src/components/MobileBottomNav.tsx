import React from 'react';
import { LayoutDashboard, Receipt, Plus, BarChart3, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenQuickAdd: () => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
  onOpenQuickAdd,
  onOpenMoreMenu,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95">
      {/* Trang chủ */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          activeView === 'dashboard'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Tổng quan</span>
      </button>

      {/* Giao dịch */}
      <button
        onClick={() => onNavigate('transactions')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          activeView === 'transactions'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Receipt className="h-5 w-5" />
        <span>Giao dịch</span>
      </button>

      {/* Floating Add Button in Center */}
      <div className="-mt-6 flex justify-center">
        <button
          onClick={onOpenQuickAdd}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-white transition-all active:scale-90 dark:ring-slate-900"
          title="Thêm giao dịch nhanh"
        >
          <Plus className="h-7 w-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Báo cáo */}
      <button
        onClick={() => onNavigate('reports')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          activeView === 'reports'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <BarChart3 className="h-5 w-5" />
        <span>Báo cáo</span>
      </button>

      {/* Khác / Menu */}
      <button
        onClick={onOpenMoreMenu}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          ['accounts', 'categories', 'budgets', 'goals', 'debts', 'family', 'settings'].includes(
            activeView
          )
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Menu className="h-5 w-5" />
        <span>Khác</span>
      </button>
    </div>
  );
};
