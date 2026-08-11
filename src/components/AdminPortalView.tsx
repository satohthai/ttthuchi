import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Home, Receipt, Activity, Ban, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { api } from '../lib/api';

export const AdminPortalView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const s = await api.getAdminStats();
        const u = await api.getAdminUsers();
        setStats(s);
        setUsersList(u);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleUserStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await api.updateUserStatus(id, nextStatus);
    setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus as any } : u)));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs font-semibold">Đang tải Admin Portal...</div>;
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Admin Header */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Hệ Thống Quản Trị Admin Portal</h2>
            <p className="text-xs text-slate-400">Quản lý toàn bộ người dùng, gia đình, giao dịch & trạng thái server.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Tổng Người Dùng</p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Gia Đình Hoạt Động</p>
          <p className="mt-1 text-2xl font-black text-blue-600">{stats?.totalFamilies || 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Tổng Giao Dịch Hệ Thống</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{stats?.totalTransactions || 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Trạng Thái Sever</p>
          <p className="mt-1 text-sm font-black text-emerald-500 flex items-center gap-1">
            <Activity className="h-4 w-4" /> {stats?.systemStatus || 'Online'}
          </p>
        </div>
      </div>

      {/* Users Management */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Danh Sách Người Dùng Hợp Lệ</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {usersList.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </span>

                <button
                  onClick={() => handleToggleUserStatus(u.id, u.status)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {u.status === 'active' ? 'Khóa TK' : 'Mở TK'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
