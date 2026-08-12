import React, { useState } from 'react';
import { User, Globe, Moon, Sun, Lock, ShieldCheck, Download, Database, KeyRound, FileSpreadsheet, ExternalLink, Trash2, AlertTriangle, RefreshCw, Copy, Check, Eye, EyeOff, Flame, Layers } from 'lucide-react';
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
  const [showFirebaseKeys, setShowFirebaseKeys] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState<boolean>(false);
  const [firebaseSyncMsg, setFirebaseSyncMsg] = useState<string | null>(null);

  const firebaseConfigData = {
    projectId: "gen-lang-client-0483201894",
    firestoreDatabaseId: "ai-studio-qunlthuchigianh-82068185-5d5a-4e6a-b414-ae06b67ad570",
    apiKey: "AIzaSyCjCU9dIASMFOW3BMVs6VejozFIuaqxpoI",
    authDomain: "gen-lang-client-0483201894.firebaseapp.com",
    appId: "1:805800390411:web:537e0b7b81c3f0db527c0e",
    storageBucket: "gen-lang-client-0483201894.firebasestorage.app",
    messagingSenderId: "805800390411",
  };

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllJson = () => {
    navigator.clipboard.writeText(JSON.stringify(firebaseConfigData, null, 2));
    setCopiedKey('allJson');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncToFirebase = async () => {
    setIsSyncingFirebase(true);
    setFirebaseSyncMsg(null);
    try {
      const { api } = await import('../lib/api');
      const res = await api.syncAllToFirebase();
      setFirebaseSyncMsg(res.message || 'Đã nâng cấp đồng bộ toàn bộ dữ liệu lên Firebase Firestore thành công!');
      setTimeout(() => setFirebaseSyncMsg(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối đồng bộ Firebase.');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

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

      {/* Firebase Firestore Database Integration Card */}
      <div className="rounded-3xl border border-amber-200/90 bg-amber-50/40 p-6 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60 dark:border-amber-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Lưu Trữ & Đồng Bộ Firebase Firestore Cloud
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-900/80 dark:text-amber-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Đã Kích Hoạt Cloud
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Toàn bộ dữ liệu 11 bảng thu chi, tài khoản, giao dịch, gia đình, sổ nợ & ngân sách được lưu trữ thời gian thực lên Firebase Cloud.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncToFirebase}
            disabled={isSyncingFirebase}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 transition-all"
          >
            {isSyncingFirebase ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Đang Đồng Bộ...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" /> Đồng Bộ 100% Lên Firebase Ngay
              </>
            )}
          </button>
        </div>

        {firebaseSyncMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{firebaseSyncMsg}</span>
          </div>
        )}

        {/* Firebase Config Key Display Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-500" /> Cấu Hình Khóa Firebase Mặc Định (Firebase Applet Config)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFirebaseKeys(!showFirebaseKeys)}
                className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                {showFirebaseKeys ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showFirebaseKeys ? 'Ẩn Giá Trị' : 'Hiện Khóa'}
              </button>

              <button
                onClick={handleCopyAllJson}
                className="flex items-center gap-1 rounded-xl bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600 transition-colors"
              >
                {copiedKey === 'allJson' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === 'allJson' ? 'Đã Sao Chép All' : 'Sao Chép Cấu Hình JSON'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Project ID</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {showFirebaseKeys ? firebaseConfigData.projectId : '••••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(firebaseConfigData.projectId, 'projectId')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'projectId' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Firestore Database ID</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {showFirebaseKeys ? firebaseConfigData.firestoreDatabaseId : '••••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(firebaseConfigData.firestoreDatabaseId, 'firestoreDatabaseId')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'firestoreDatabaseId' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">API Key</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {showFirebaseKeys ? firebaseConfigData.apiKey : '••••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(firebaseConfigData.apiKey, 'apiKey')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'apiKey' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Auth Domain</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {showFirebaseKeys ? firebaseConfigData.authDomain : '••••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(firebaseConfigData.authDomain, 'authDomain')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'authDomain' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:col-span-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">App ID</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[340px]">
                  {showFirebaseKeys ? firebaseConfigData.appId : '••••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(firebaseConfigData.appId, 'appId')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'appId' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
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
