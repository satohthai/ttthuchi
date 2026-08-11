import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { api } from '../lib/api';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
  onClose?: () => void;
  onShowToast: (msg: string) => void;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  hasPassword?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  onShowToast,
}) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('1');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // New register fields
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('1');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const list = await api.getUsersList();
      setUsers(list);
      if (list.length > 0 && !selectedUserId) {
        setSelectedUserId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load users list:', err);
    }
  };

  if (!isOpen) return null;

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMsg('Vui lòng chọn tài khoản người dùng.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.login({
        userId: selectedUserId,
        password: password,
      });
      onShowToast(`Đăng nhập thành công! Chào mừng ${res.user.name}`);
      onSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mật khẩu không chính xác. Mặc định là 1.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      setErrorMsg('Vui lòng nhập tên và email.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.register(newName, newEmail, '', newPassword || '1');
      onShowToast(`Đã tạo tài khoản thành công!`);
      onSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo tài khoản mới.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white font-black text-xl">
              ₫
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">FinFamily — Đăng Nhập</h2>
              <p className="text-xs text-emerald-100 opacity-90">
                Chọn tên thành viên và nhập mật khẩu (mặc định: <strong>1</strong>)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Select User Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. Chọn tên người dùng
                </label>

                {/* Users List Grid */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {users.map((u) => {
                    const isSelected = u.id === selectedUserId;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedUserId(u.id);
                          setErrorMsg(null);
                        }}
                        className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all border ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={u.name}
                          className="h-10 w-10 rounded-full object-cover mb-1.5 border border-slate-200 dark:border-slate-700"
                        />
                        <span className="text-xs font-bold truncate max-w-full">{u.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    2. Nhập Mật khẩu
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Mặc định: <strong className="font-mono underline">1</strong>
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu (mặc định là 1)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Bạn có thể đổi hoặc xóa mật khẩu bất kỳ lúc nào trong Cài Đặt.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg hover:from-emerald-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'} <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('1');
                      onShowToast('Đã điền mật khẩu mặc định: 1');
                    }}
                    className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 underline font-medium"
                  >
                    Sử dụng mật khẩu mặc định (1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-indigo-600 hover:underline font-bold dark:text-indigo-400 flex items-center gap-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Tạo thành viên mới
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Register Mode Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ & Tên
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn D"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu (Mặc định: 1)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Quay lại đăng nhập
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
