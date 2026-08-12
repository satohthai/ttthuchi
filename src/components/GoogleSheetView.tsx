import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Copy,
  Check,
  Link,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Code2,
  ExternalLink,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { api } from '../lib/api';

interface GoogleSheetViewProps {
  onShowToast: (msg: string) => void;
  onRefreshData?: () => void;
}

const APPS_SCRIPT_CODE = `/**
 * ============================================================================
 * FINFAMILY - MÃ NGUỒN GOOGLE APPS SCRIPT ĐỒNG BỘ CƠ SỞ DỮ LIỆU THU CHI GIA ĐÌNH
 * ============================================================================
 * HƯỚNG DẪN TẠO VÀ THIẾT LẬP WEB APP:
 * 1. Mở file Google Sheet bất kỳ của bạn (hoặc tạo file mới tại sheets.google.com).
 * 2. Trên thanh công cụ Google Sheet: Vào "Tiện ích mở rộng" (Extensions) -> Chọn "Apps Script".
 * 3. Xóa toàn bộ đoạn code mặc định và dán toàn bộ mã nguồn bên dưới vào editor.
 * 4. Nhấn Ctrl + S (Mac: Cmd + S) để lưu dự án.
 * 5. Chọn hàm "setupDatabaseSheets" ở thanh menu trên cùng và bấm "Chạy" (Run) 
 *    để tự động khởi tạo 10 Sheets quản lý đúng theo đầy đủ các trường chuẩn.
 * 6. Bấm nút "Triển khai" (Deploy) màu xanh -> Chọn "Triển khai mới" (New deployment).
 * 7. Bấm biểu tượng bánh răng ⚙️ -> Chọn "Ứng dụng Web" (Web App).
 *    - Mô tả: FinFamily Web App API
 *    - Quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone).
 * 8. Bấm "Triển khai" -> Cấp quyền cho Google Sheet -> Sao chép "URL ứng dụng web".
 * 9. Dán URL thu được vào Form kết nối trong phần mềm FinFamily!
 * ============================================================================
 */

function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Danh sách 10 CSDL Thu Chi Chuẩn
  const schema = {
    'Transactions': ['id', 'familyId', 'accountId', 'targetAccountId', 'categoryId', 'userId', 'memberId', 'type', 'amount', 'currency', 'description', 'transactionDate', 'time', 'note', 'tags', 'status', 'createdAt', 'updatedAt', 'deletedAt'],
    'Accounts': ['id', 'familyId', 'name', 'type', 'balance', 'initialBalance', 'bankName', 'accountNumber', 'currency', 'color', 'icon', 'status', 'createdAt'],
    'Categories': ['id', 'familyId', 'name', 'type', 'icon', 'color', 'isDefault', 'isEnabled'],
    'Budgets': ['id', 'familyId', 'categoryId', 'period', 'periodKey', 'amount', 'createdAt'],
    'Goals': ['id', 'familyId', 'name', 'targetAmount', 'currentAmount', 'deadline', 'color', 'icon', 'monthlyTarget', 'status', 'createdAt'],
    'Debts': ['id', 'familyId', 'type', 'partyName', 'totalAmount', 'paidAmount', 'borrowDate', 'dueDate', 'note', 'status', 'createdAt'],
    'Recurring': ['id', 'familyId', 'name', 'amount', 'type', 'categoryId', 'accountId', 'frequency', 'startDate', 'nextExecution', 'autoCreate', 'status'],
    'AuditLogs': ['id', 'familyId', 'userId', 'userName', 'action', 'entity', 'entityId', 'oldValue', 'newValue', 'createdAt'],
    'Family': ['id', 'name', 'ownerId', 'currency', 'timezone', 'status', 'createdAt'],
    'Members': ['id', 'familyId', 'userId', 'name', 'email', 'phone', 'role', 'joinedDate', 'status']
  };

  const colors = {
    'Transactions': '#4f46e5',
    'Accounts': '#2563eb',
    'Categories': '#0284c7',
    'Budgets': '#0d9488',
    'Goals': '#059669',
    'Debts': '#d97706',
    'Recurring': '#7c3aed',
    'AuditLogs': '#475569',
    'Family': '#db2777',
    'Members': '#ca8a04'
  };

  for (const sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    const headers = schema[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(colors[sheetName] || '#4f46e5')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  // Dọn dẹp Sheet1 mặc định nếu có
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  return "Thành công: Đã khởi tạo 10 Sheets chuẩn hóa trường thu chi gia đình!";
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getAll';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Kết nối Web App thành công!' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const result = {};
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      result[sheetName] = [];
      return;
    }
    const headers = data[0];
    const rows = [];
    for (let i = 1; i < data.length; i++) {
      const rowObj = {};
      let hasData = false;
      for (let j = 0; j < headers.length; j++) {
        let val = data[i][j];
        if (val !== '' && val !== null && val !== undefined) hasData = true;
        if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
          try { val = JSON.parse(val); } catch (err) {}
        }
        rowObj[headers[j]] = val;
      }
      if (hasData) rows.push(rowObj);
    }
    result[sheetName] = rows;
  });
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const entity = postData.entity;
    const payload = postData.data;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Kết nối Web App thành công!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'syncAll') {
      setupDatabaseSheets();
      for (const sheetName in payload) {
        let sheet = ss.getSheetByName(sheetName);
        if (!sheet) continue;
        
        const rows = payload[sheetName];
        if (!Array.isArray(rows)) continue;
        
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        sheet.clearContents();
        sheet.getRange(1, 1, 1, headers.length).setValues([headers])
          .setFontWeight('bold')
          .setBackground('#4f46e5')
          .setFontColor('#ffffff');
        
        if (rows.length > 0) {
          const values = rows.map(item => {
            return headers.map(h => {
              const val = item[h];
              if (typeof val === 'object' && val !== null) return JSON.stringify(val);
              return val !== undefined && val !== null ? val : '';
            });
          });
          sheet.getRange(2, 1, values.length, headers.length).setValues(values);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Đã lưu và đồng bộ toàn bộ dữ liệu ra Google Sheet!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'create' && entity) {
      let sheet = ss.getSheetByName(entity);
      if (!sheet) {
        setupDatabaseSheets();
        sheet = ss.getSheetByName(entity);
      }
      if (sheet) {
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const rowValues = headers.map(h => {
          const val = payload[h];
          if (typeof val === 'object' && val !== null) return JSON.stringify(val);
          return val !== undefined && val !== null ? val : '';
        });
        sheet.appendRow(rowValues);
        return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Đã thêm thành công vào Google Sheet' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Đã hoàn thành thao tác' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const GoogleSheetView: React.FC<GoogleSheetViewProps> = ({ onShowToast, onRefreshData }) => {
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'config' | 'code' | 'instructions'>('config');

  // Firebase & 5-Min Backup States
  const [backupInfo, setBackupInfo] = useState<{
    firebaseConnected: boolean;
    projectId: string;
    databaseId: string;
    autoBackupEnabled: boolean;
    intervalMinutes: number;
    lastBackupTime: string;
    nextBackupTime: string;
    totalBackups: number;
    lastStatus: string;
    counts: { transactions: number; accounts: number; categories: number; budgets: number; goals: number; debts: number };
  } | null>(null);
  const [isTriggeringBackup, setIsTriggeringBackup] = useState<boolean>(false);

  useEffect(() => {
    loadConfig();
    loadBackupStatus();
    const timer = setInterval(() => {
      loadBackupStatus();
    }, 15000); // refresh status every 15s
    return () => clearInterval(timer);
  }, []);

  const loadConfig = async () => {
    try {
      const config = await api.getGoogleSheetConfig();
      if (config.url) {
        setSheetUrl(config.url);
        setIsConnected(config.isConnected);
        setLastSyncedAt(config.lastSyncedAt);
      }
    } catch (err) {
      console.error('Failed to load Google Sheet config:', err);
    }
  };

  const loadBackupStatus = async () => {
    try {
      const res = await api.getBackupStatus();
      setBackupInfo({
        firebaseConnected: res.firebase.isConnected,
        projectId: res.firebase.projectId,
        databaseId: res.firebase.databaseId,
        autoBackupEnabled: res.autoBackup.autoBackupEnabled,
        intervalMinutes: res.autoBackup.intervalMinutes,
        lastBackupTime: res.autoBackup.lastBackupTime,
        nextBackupTime: res.autoBackup.nextBackupTime,
        totalBackups: res.autoBackup.totalBackups,
        lastStatus: res.autoBackup.lastStatus,
        counts: res.counts,
      });
    } catch (err) {
      console.error('Failed to load backup status:', err);
    }
  };

  const handleTriggerBackupNow = async () => {
    setIsTriggeringBackup(true);
    try {
      await api.triggerBackupNow();
      onShowToast('Đã đẩy và sao lưu dữ liệu từ Firebase sang Google Sheet thành công!');
      await loadBackupStatus();
    } catch (err: any) {
      onShowToast(err.message || 'Lỗi khi đẩy dữ liệu sang Google Sheet.');
    } finally {
      setIsTriggeringBackup(false);
    }
  };

  const handleSaveUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sheetUrl.trim()) {
      onShowToast('Vui lòng dán đường dẫn Web App Google Sheet.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.saveGoogleSheetUrl(sheetUrl);
      setIsConnected(res.isConnected);
      setLastSyncedAt(res.lastSyncedAt);
      onShowToast('Đã lưu và kết nối với Google Sheet Web App!');
    } catch (err: any) {
      onShowToast(err.message || 'Lỗi kết nối tới Google Sheet. Vui lòng kiểm tra lại URL.');
      setIsConnected(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSheetUrl(text);
        onShowToast('Đã dán URL từ bộ nhớ tạm!');
      }
    } catch (err) {
      onShowToast('Không thể tự động đọc clipboard. Bạn hãy dùng Ctrl+V.');
    }
  };

  const handleExportAll = async () => {
    if (!sheetUrl) {
      onShowToast('Vui lòng lưu URL Google Sheet trước khi xuất dữ liệu.');
      return;
    }

    setIsExporting(true);
    try {
      const res = await api.syncExportGoogleSheet();
      setLastSyncedAt(res.lastSyncedAt);
      setIsConnected(true);
      onShowToast(res.message || 'Đã xuất toàn bộ dữ liệu ra Google Sheet!');
    } catch (err: any) {
      onShowToast(err.message || 'Lỗi xuất dữ liệu ra Google Sheet.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportAll = async () => {
    if (!sheetUrl) {
      onShowToast('Vui lòng lưu URL Google Sheet trước khi nhập dữ liệu.');
      return;
    }

    if (!window.confirm('Nhập dữ liệu từ Google Sheet sẽ cập nhật ứng dụng theo dữ liệu trên trang tính. Bạn có chắc chắn muốn tiếp tục?')) {
      return;
    }

    setIsImporting(true);
    try {
      const res = await api.syncImportGoogleSheet();
      setLastSyncedAt(res.lastSyncedAt);
      setIsConnected(true);
      onShowToast(res.message || 'Đã nhập thành công dữ liệu từ Google Sheet!');
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      onShowToast(err.message || 'Lỗi nhập dữ liệu từ Google Sheet.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    onShowToast('Đã sao chép mã Google Apps Script vào Clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tích Hợp Google Sheet</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lưu trữ, xuất, thêm, sửa, xóa & đồng bộ toàn bộ dữ liệu quản lý tài chính gia đình qua Google Sheets
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Đã kết nối Google Sheet
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4" /> Chưa kết nối Web App
            </span>
          )}
        </div>
      </div>

      {/* View Mode Navigation Tabs */}
      <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'config'
              ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Link className="h-4 w-4" /> Form Cấu Hình & Kết Nối
          </div>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Code2 className="h-4 w-4" /> Code Google Apps Script
          </div>
        </button>
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'instructions'
              ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Info className="h-4 w-4" /> Hướng Dẫn Chi Tiết
          </div>
        </button>
      </div>

      {/* TAB 1: FORM CONFIG & SYNC ACTIONS */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Main URL Form Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Form Lưu Đường Dẫn Google Sheet Web App</h3>
                <p className="text-xs text-slate-500">
                  Dán URL Web App đã phát hành từ Google Apps Script để kích hoạt lưu trữ dữ liệu hai chiều
                </p>
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1mx3RCdD66a0iRFsAgZ62GtK3vTwbQIpO4cRKGzLTWWY/edit?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Mở Google Sheet Trang Tính <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <form onSubmit={handleSaveUrl} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Đường dẫn Web App URL (Google Apps Script Web App)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    title="Dán từ Clipboard"
                  >
                    <Copy className="h-4 w-4" /> Dán URL
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Lưu & Kết Nối
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Ví dụ định dạng đúng: <code className="text-emerald-600 font-mono">https://script.google.com/macros/s/.../exec</code>
                </p>
              </div>
            </form>

            {/* Connection Information */}
            {lastSyncedAt && (
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Trạng thái lưu trữ: <strong>Tự động đồng bộ với Sheet</strong></span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Lần đồng bộ gần nhất: {new Date(lastSyncedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </div>

          {/* 5-Minute Auto-Backup Status & Control Box */}
          <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/70 p-6 shadow-sm dark:border-indigo-800/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
                  <RefreshCw className="h-6 w-6 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Hệ Thống Tự Động Sao Lưu 定期 (5 Phút)
                    </h3>
                    <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      Firebase ➔ Sheet
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Dữ liệu chính lưu trên <strong>Firebase Firestore</strong> và định kỳ <strong>5 phút tự động đẩy backup</strong> sang Google Sheet
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerBackupNow}
                disabled={isTriggeringBackup || !sheetUrl}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all shrink-0"
              >
                {isTriggeringBackup ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Đang đẩy dữ liệu sang Sheet...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4" /> Sao Lưu Firebase Sang Sheet Ngay
                  </>
                )}
              </button>
            </div>

            {/* Backup Engine Live Metrics Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Cơ Sở Dữ Liệu Chính</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firebase Firestore
                </div>
                <div className="mt-1 text-[10px] text-slate-400 font-mono truncate">
                  {backupInfo?.projectId || 'gen-lang-client-...'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Chu Kỳ Sao Lưu Auto</div>
                <div className="mt-1 text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  Mỗi 5 phút / Lần
                </div>
                <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {backupInfo?.autoBackupEnabled ? '✓ Đang chạy ngầm tự động' : 'Tạm dừng'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Lần Sao Lưu Vừa Qua</div>
                <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {backupInfo?.lastBackupTime ? new Date(backupInfo.lastBackupTime).toLocaleTimeString('vi-VN') : 'Chưa chạy'}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  Lượt sao lưu: {backupInfo?.totalBackups || 0} lần
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Trạng Thái Backup</div>
                <div className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate" title={backupInfo?.lastStatus}>
                  {backupInfo?.lastStatus || 'Đang chuẩn bị...'}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  Lượt kế tiếp: {backupInfo?.nextBackupTime ? new Date(backupInfo.nextBackupTime).toLocaleTimeString('vi-VN') : '5 phút nữa'}
                </div>
              </div>
            </div>
          </div>

          {/* Sync Operations Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Xuất Dữ Liệu Lên Sheet</h4>
                  <p className="text-xs text-slate-500">Đẩy toàn bộ 10 bảng dữ liệu hiện tại lên trang tính Google Sheet</p>
                </div>
              </div>
              <button
                onClick={handleExportAll}
                disabled={isExporting || !sheetUrl}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Đang xuất dữ liệu ra Sheet...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Xuất Toàn Bộ Sang Google Sheet
                  </>
                )}
              </button>
            </div>

            {/* Import Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nhập Dữ Liệu Từ Sheet</h4>
                  <p className="text-xs text-slate-500">Tải & đồng bộ dữ liệu từ Google Sheet vào phần mềm FinFamily</p>
                </div>
              </div>
              <button
                onClick={handleImportAll}
                disabled={isImporting || !sheetUrl}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Đang nhập dữ liệu từ Sheet...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Nhập Cập Nhật Từ Google Sheet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supported Sheets Overview */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Danh Sách 10 Bảng Quản Lý Được Đồng Bộ Chuẩn</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { name: 'Transactions', label: 'Giao dịch thu chi', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
                { name: 'Accounts', label: 'Ví & Ngân hàng', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
                { name: 'Categories', label: 'Danh mục thu chi', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
                { name: 'Budgets', label: 'Ngân sách chi tiêu', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' },
                { name: 'Goals', label: 'Mục tiêu tiết kiệm', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
                { name: 'Debts', label: 'Sổ nợ & Cho vay', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
                { name: 'Recurring', label: 'Giao dịch định kỳ', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
                { name: 'AuditLogs', label: 'Nhật ký hệ thống', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
                { name: 'Family', label: 'Hộ gia đình', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
                { name: 'Members', label: 'Thành viên gia đình', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
              ].map((item, idx) => (
                <div key={idx} className={`rounded-2xl p-3 border border-slate-100 dark:border-slate-800 ${item.color}`}>
                  <p className="text-[11px] font-mono font-bold">{item.name}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPS SCRIPT CODE & COPY BUTTON */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-emerald-600" /> Mã Nguồn Google Apps Script Chuẩn
              </h3>
              <p className="text-xs text-slate-500">
                Sao chép mã này và dán vào Apps Script của Google Sheet. Hàm <code className="font-bold text-emerald-600">setupDatabaseSheets()</code> tự động tạo đúng các bảng & cột.
              </p>
            </div>
            <button
              onClick={handleCopyAppsScript}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-md transition-all ${
                copiedScript ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700'
              }`}
            >
              {copiedScript ? (
                <>
                  <Check className="h-4 w-4" /> Đã Sao Chép Mã!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Sao Chép Mã Apps Script
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between bg-slate-900 px-5 py-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">Code.gs — Google Apps Script</span>
              <button
                onClick={handleCopyAppsScript}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </button>
            </div>
            <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{APPS_SCRIPT_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: STEP BY STEP INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Hướng Dẫn Thiết Lập Google Apps Script (5 Bước Dễ Dàng)
            </h3>
            <p className="text-xs text-slate-500">
              Thực hiện lần lượt 5 bước đơn giản để tự động biến Google Sheet của bạn thành cơ sở dữ liệu cloud cá nhân
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-xs text-white">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mở Trang Tính Google Sheet</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Truy cập <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline">sheets.google.com</a> và tạo một trang tính trống mới (đặt tên ví dụ: <em>"Quản Lý Thu Chi Gia Đình FinFamily"</em>).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-xs text-white">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mở Trình Biên Tập Apps Script & Dán Code</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Trên menu trang tính, bấm chọn <strong>Tiện ích mở rộng</strong> (Extensions) &rarr; chọn <strong>Apps Script</strong>. Xóa toàn bộ đoạn mã cũ và dán mã nguồn từ thẻ tab <em>"Code Google Apps Script"</em>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-xs text-white">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Chạy Hàm setupDatabaseSheets Lần Đầu</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Chọn hàm <code className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">setupDatabaseSheets</code> ở thanh trên cùng và bấm nút <strong>Chạy (Run)</strong>. Lập tức Google Sheet của bạn sẽ được tự động tạo 10 bảng dữ liệu với tiêu đề được tô màu cực đẹp!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-xs text-white">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Triển Khai Thành Ứng Dụng Web (Web App)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Bấm nút <strong>Triển khai (Deploy)</strong> ở góc phải trên &rarr; <strong>Triển khai mới (New deployment)</strong> &rarr; Chọn loại <strong>Ứng dụng web (Web app)</strong>.
                  <br />
                  <span className="text-red-600 dark:text-red-400 font-bold">LƯU Ý QUAN TRỌNG:</span> Tại mục <strong>Quyền truy cập (Who has access)</strong>, chọn <strong>Bất kỳ ai (Anyone)</strong> để cho phép giao diện web gửi dữ liệu thu chi.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-xs text-white">
                5
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sao Chép URL & Dán Vào FinFamily</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Sao chép đoạn đường dẫn Web App URL vừa tạo và dán vào ô nhập liệu ở Thẻ <strong>Form Cấu Hình & Kết Nối</strong>. Bấm nút <strong>Lưu & Kết Nối</strong> để hoàn tất!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
