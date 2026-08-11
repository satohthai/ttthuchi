import React from 'react';
import { History, Shield, User, Clock } from 'lucide-react';
import { AuditLog } from '../types';
import { formatDate } from '../lib/formatters';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nhật Ký Thao Tác & An Ninh</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ghi lại minh bạch mọi thao tác đăng nhập, tạo, sửa, xóa giao dịch & đổi phân quyền.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-4 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <History className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{log.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                  Hành động: <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{log.action}</span> trên {log.entity}
                </p>
                {log.newValue && <p className="mt-0.5 text-[11px] text-slate-500">Giá trị: {log.newValue}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
