import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
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

const DEFAULT_USERS: UserOption[] = [
  {
    id: 'usr-1',
    name: 'Thái',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hasPassword: true,
  },
  {
    id: 'usr-2',
    name: 'Trần Thị B',
    email: 'tranb@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hasPassword: true,
  },
  {
    id: 'usr-3',
    name: 'Nguyễn Văn C',
    email: 'vanc@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hasPassword: true,
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  onShowToast,
}) => {
  const [users, setUsers] = useState<UserOption[]>(DEFAULT_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string>('usr-1');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const list = await api.getUsersList();
      if (list && list.length > 0) {
        setUsers(list);
        const defaultUser = list.find((u) => u.id === 'usr-1' || u.name === 'Thái') || list[0];
        setSelectedUserId(defaultUser.id);
      } else {
        setUsers(DEFAULT_USERS);
        setSelectedUserId('usr-1');
      }
      setPassword('');
    } catch (err) {
      console.error('Failed to load users list, falling back to default:', err);
      setUsers(DEFAULT_USERS);
      setSelectedUserId('usr-1');
      setPassword('');
    }
  };

  if (!isOpen) return null;

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
      setErrorMsg(err.message || 'Mật khẩu không chính xác.');
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
              <h2 className="text-xl font-black tracking-tight">FinFamily — Form Đăng Nhập</h2>
              <p className="text-xs text-emerald-100 opacity-90">
                Chọn Họ & Tên thành viên và nhập mật khẩu bảo mật
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

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Select User Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                1. Chọn Họ & Tên thành viên đăng nhập
              </label>

              {/* Users List Grid */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {users.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setErrorMsg(null);
                        setPassword('');
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
                      <span className="text-[10px] text-slate-400 capitalize">{u.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. Mật khẩu truy cập
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  Bảo mật mã hóa
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
                  placeholder="Nhập mật khẩu của bạn..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Mật khẩu được bảo vệ an toàn. Bạn có thể thay đổi hoặc xóa trong Cài Đặt.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg hover:from-emerald-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

