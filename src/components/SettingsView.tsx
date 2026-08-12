import React, { useState } from 'react';
import { User, Globe, Moon, Sun, Lock, ShieldCheck, Download, Database, KeyRound, FileSpreadsheet, ExternalLink, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { User as UserType, CurrencyCode } from '../types';

interface SettingsViewProps {
  user: UserType | null;
  currency: CurrencyCode;
  darkMode: boolean;
  onUpdateCurrency: (c: CurrencyCode) => void;
  onToggleDarkMode: () => void;
  onExportAllData: () => void;
  onOpenGoogleSheet?: () => void;
  onResetData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currency,
  darkMode,
  onUpdateCurrency,
  onToggleDarkMode,
  onExportAllData,
  onOpenGoogleSheet,
  onResetData,
}) => {
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleResetData = async () => {
    const confirmFirst = window.confirm(
      '⚠️ CẢNH BÁO NGHÊM TRỌNG:\n\nHành động này sẽ XÓA TRẮNG TOÀN BỘ dữ liệu:\n- Xóa sạch 100% tất cả giao dịch thu chi\n- Xóa sạch tất cả tài khoản & số dư ví\n- Xóa sạch ngân sách, mục tiêu tiết kiệm, sổ nợ\n- Đồng thời XÓA TRẮNG trên cả Firebase Firestore.\n\nTất cả sẽ về 0 để bạn bắt đầu cài đặt lại từ đầu mà không có dữ liệu ảo.\n\nBạn có CHẮC CHẮN muốn xóa mất trắng dữ liệu không?'
    );

    if (!confirmFirst) return;

    const confirmSecond = window.prompt(
      'XÁC NHẬN LẦN 2:\nNhập chữ "RESET" viết hoa vào ô dưới đây để xác nhận xóa sạch toàn bộ dữ liệu:'
    );

    if (confirmSecond !== 'RESET') {
      alert('Chữ xác nhận không đúng. Đã hủy thao tác xóa dữ liệu.');
      return;
    }

    setIsResetting(true);
    try {
      const { api } = await import('../lib/api');
      const res = await api.resetAllData();
      alert(res.message || 'Đã xóa trắng toàn bộ dữ liệu thành công!');
      if (onResetData) {
        onResetData();
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa dữ liệu.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Cài Đặt Hệ Thống</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tùy chỉnh cá nhân hóa, đơn vị tiền tệ, giao diện sáng/tối & sao lưu dữ liệu.
        </p>
      </div>

      {/* User Profile Info */}
      <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={user?.name}
          className="h-16 w-16 rounded-full border-2 border-blue-500 object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="mt-1 text-[11px] font-semibold text-blue-600">SĐT: {user?.phone || 'Chưa cập nhật'}</p>
        </div>
      </div>

      {/* Google Sheet Direct Integration Card */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm dark:border-emerald-800/80 dark:bg-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Tích Hợp Dữ Liệu Google Sheet
                <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Khuyên dùng</span>
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Lưu trữ toàn bộ dữ liệu 10 bảng thu chi trên trang tính Google Sheet cá nhân của bạn. Xuất, nhập, thêm, sửa, xóa tự động qua Google Apps Script Web App API.
              </p>
            </div>
          </div>
          {onOpenGoogleSheet && (
            <button
              onClick={onOpenGoogleSheet}
              className="shrink-0 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
            >
              Cấu Hình & Tạo Script <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* General Settings */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Cấu Hình Chung
        </div>

        <div className="divide-y divide-slate-100 p-5 space-y-4 dark:divide-slate-800">
          {/* Currency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Đơn vị tiền tệ chính</p>
              <p className="text-[11px] text-slate-500">Định dạng hiển thị tiền mặt & ngân hàng</p>
            </div>
            <select
              value={currency}
              onChange={(e) => onUpdateCurrency(e.target.value as CurrencyCode)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="VND">VND (₫ - Việt Nam Đồng)</option>
              <option value="USD">USD ($ - Đô la Mỹ)</option>
              <option value="EUR">EUR (€ - Euro)</option>
            </select>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Giao diện Tối (Dark Mode)</p>
              <p className="text-[11px] text-slate-500">Bảo vệ mắt khi sử dụng ứng dụng ban đêm</p>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Backup & Export */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Sao lưu toàn bộ dữ liệu (JSON)</p>
              <p className="text-[11px] text-slate-500">Tải về toàn bộ lịch sử giao dịch & danh mục</p>
            </div>
            <button
              onClick={onExportAllData}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-4 w-4 text-blue-600" /> Tải Dữ Liệu
            </button>
          </div>
        </div>
      </div>

      {/* Password Management Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bảo Mật & Mật Khẩu Đăng Nhập</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Mật khẩu hiện tại: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{user?.hasPassword !== false ? '••••••••' : 'Đã xóa (Không cần mật khẩu)'}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Mật khẩu tài khoản được mã hóa và bảo mật. Bạn có thể thay đổi mật khẩu mới hoặc xóa mật khẩu hoàn toàn để đăng nhập trực tiếp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={async () => {
              const newPass = window.prompt('Nhập mật khẩu mới cho tài khoản:');
              if (newPass !== null && newPass.trim() !== '') {
                try {
                  const { api } = await import('../lib/api');
                  const res = await api.updatePassword(newPass, 'update');
                  alert(res.message || 'Cập nhật mật khẩu thành công!');
                } catch (err: any) {
                  alert('Lỗi cập nhật mật khẩu.');
                }
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
          >
            <KeyRound className="h-4 w-4" /> Đổi Mật Khẩu
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Bạn có chắc muốn xóa mật khẩu? Sau khi xóa, bạn sẽ đăng nhập trực tiếp mà không cần mật khẩu.')) {
                try {
                  const { api } = await import('../lib/api');
                  const res = await api.updatePassword('', 'clear');
                  alert(res.message || 'Đã xóa mật khẩu thành công!');
                } catch (err: any) {
                  alert('Lỗi khi xóa mật khẩu.');
                }
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 transition-all"
          >
            Xóa Mật Khẩu (Đăng Nhập Trực Tiếp)
          </button>
        </div>
      </div>

      {/* Danger Zone: Full Data Reset */}
      <div className="overflow-hidden rounded-3xl border border-rose-300 bg-rose-50/70 p-6 shadow-sm dark:border-rose-900/80 dark:bg-rose-950/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 animate-pulse" />
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
              Xóa Trắng & Reset Dữ Liệu Ban Đầu
            </h3>
          </div>
          <span className="rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-2.5 py-0.5 text-[10px] font-black uppercase">
            Vùng Nguy Hiểm
          </span>
        </div>

        <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
          Dùng nút này khi bạn muốn <strong>XÓA MẤT TRẮNG TOÀN BỘ</strong> tất cả lịch sử thu chi, danh sách tài khoản/ví, ngân sách, mục tiêu tiết kiệm, sổ nợ và đồng bộ xóa sạch trên Firebase Firestore để thực hiện cài đặt lại dữ liệu thật từ đầu.
        </p>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 disabled:opacity-50 transition-all"
        >
          {isResetting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Đang xóa trắng dữ liệu hệ thống & Firebase...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" /> Xóa Trắng Dữ Liệu & Reset Hệ Thống Về 0
            </>
          )}
        </button>
      </div>
    </div>
  );
};
