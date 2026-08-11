import React, { useState } from 'react';
import { Users, UserPlus, Shield, Check, Trash2, Mail, Phone } from 'lucide-react';
import { Family, FamilyMember, FamilyRole } from '../types';

interface FamilyViewProps {
  family: Family | null;
  members: FamilyMember[];
  onInviteMember: (member: { name: string; email: string; role: string; phone?: string }) => Promise<void>;
  onUpdateRole: (id: string, role: string) => Promise<void>;
  onRemoveMember: (id: string) => Promise<void>;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  family,
  members,
  onInviteMember,
  onUpdateRole,
  onRemoveMember,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<FamilyRole>('member');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    await onInviteMember({ name, email, role, phone });
    setShowInviteModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const getRoleBadge = (r: FamilyRole) => {
    switch (r) {
      case 'owner':
        return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">Chủ Sở Hữu</span>;
      case 'admin':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">Quản Tri Viên</span>;
      case 'member':
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Thành Viên</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">Chỉ Xem</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Gia Đình & Phân Quyền</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản lý thành viên trong nhà, mời người dùng mới & cài đặt quyền truy cập.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" /> Mời Thành Viên
        </button>
      </div>

      {/* Family Info Box */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-900/30 dark:from-slate-900 dark:to-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{family?.name}</h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Tổng số thành viên: <b>{members.length} người</b> • Múi giờ: {family?.timezone}
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((mem) => (
          <div
            key={mem.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={mem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={mem.name}
                    className="h-11 w-11 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mem.name}</h4>
                    <p className="text-[11px] text-slate-500">{mem.email}</p>
                  </div>
                </div>

                {getRoleBadge(mem.role)}
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
                <p>SĐT: {mem.phone || 'Chưa cập nhật'}</p>
                <p>Tham gia: {mem.joinedDate}</p>
              </div>
            </div>

            {mem.role !== 'owner' && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <select
                  value={mem.role}
                  onChange={(e) => onUpdateRole(mem.id, e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="admin">Quản Trị Viên</option>
                  <option value="member">Thành Viên</option>
                  <option value="viewer">Chỉ Xem</option>
                </select>

                <button
                  onClick={() => onRemoveMember(mem.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  title="Xóa khỏi gia đình"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mời Thành Viên Vào Gia Đình</h3>

            <form onSubmit={handleInvite} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn D"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Vai trò / Quyền hạn</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as FamilyRole)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="admin">Quản Trị Viên (Thêm/Sửa giao dịch + Quản lý)</option>
                  <option value="member">Thành Viên (Thêm/Sửa giao dịch)</option>
                  <option value="viewer">Chỉ Xem (Xem báo cáo & giao dịch)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Gửi Lời Mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
