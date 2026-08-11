import React from 'react';
import { Bell, CheckCheck, AlertCircle, HandCoins, PiggyBank, Target } from 'lucide-react';
import { NotificationItem } from '../types';
import { formatDate } from '../lib/formatters';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => Promise<void>;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  const getIcon = (t: string) => {
    switch (t) {
      case 'budget_exceeded':
      case 'budget_warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'debt_reminder':
        return <HandCoins className="h-5 w-5 text-red-500" />;
      case 'goal':
        return <Target className="h-5 w-5 text-emerald-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trung Tâm Thông Báo</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cảnh báo vượt ngân sách, nhắc nợ đến hạn & hoàn thành mục tiêu tiết kiệm.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <CheckCheck className="h-4 w-4 text-emerald-600" /> Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">Không có thông báo nào.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3.5 p-4 transition-colors ${
                !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="mt-0.5 shrink-0 rounded-xl bg-slate-100 p-2 dark:bg-slate-800">{getIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                  <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
