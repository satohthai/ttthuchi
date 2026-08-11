import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Download,
  Calendar,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction, Account, Category, FamilyMember, CurrencyCode } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  members: FamilyMember[];
  currency: CurrencyCode;
  onOpenQuickAdd: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  isTrashView?: boolean;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  categories,
  members,
  currency,
  onOpenQuickAdd,
  onEdit,
  onDelete,
  onRestore,
  isTrashView = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    if (selectedType !== 'all' && tx.type !== selectedType) return false;
    if (selectedAccount !== 'all' && tx.accountId !== selectedAccount && tx.targetAccountId !== selectedAccount)
      return false;
    if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) return false;
    if (selectedMember !== 'all' && tx.memberId !== selectedMember) return false;
    if (startDate && tx.transactionDate < startDate) return false;
    if (endDate && tx.transactionDate > endDate) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchNote = tx.note?.toLowerCase().includes(q);
      const matchTag = tx.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchDesc && !matchNote && !matchTag) return false;
    }
    return true;
  });

  const totalIncome = filteredTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['ID', 'Loại', 'Số tiền', 'Nội dung', 'Danh mục', 'Ví', 'Người thực hiện', 'Ngày'];
    const rows = filteredTxs.map((t) => [
      t.id,
      t.type === 'income' ? 'Thu' : t.type === 'expense' ? 'Chi' : 'Chuyển',
      t.amount,
      `"${t.description.replace(/"/g, '""')}"`,
      categories.find((c) => c.id === t.categoryId)?.name || 'Chuyển khoản',
      accounts.find((a) => a.id === t.accountId)?.name || '',
      members.find((m) => m.id === t.memberId)?.name || '',
      t.transactionDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bao_cao_giao_dich_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      {/* Top Header & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isTrashView ? 'Thùng Rác Giao Dịch' : 'Danh Sách Giao Dịch'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTrashView ? 'Các giao dịch đã xóa mềm. Khôi phục hoặc xóa vĩnh viễn.' : 'Tìm kiếm, lọc nâng cao, xuất báo cáo Excel/CSV.'}
          </p>
        </div>

        {!isTrashView && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Xuất CSV
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Thêm mới
            </button>
          </div>
        )}
      </div>

      {/* Summary Filter Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Số lượng</p>
          <p className="text-lg font-black text-slate-900 dark:text-white">{filteredTxs.length} Giao dịch</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase text-slate-400">Tổng Thu Lọc Được</p>
          <p className="text-lg font-black text-emerald-600">+{formatCurrency(totalIncome, currency)}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 sm:col-span-1">
          <p className="text-[10px] font-bold uppercase text-slate-400">Tổng Chi Lọc Được</p>
          <p className="text-lg font-black text-red-600">-{formatCurrency(totalExpense, currency)}</p>
        </div>
      </div>

      {/* Search Input & Filter Toggle */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo nội dung, ghi chú, tag #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
              showFilters
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:grid-cols-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Loại</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tất cả</option>
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
                <option value="transfer">Chuyển tiền</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Ví/Tài khoản</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tất cả các ví</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Danh mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Người thực hiện</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tất cả thành viên</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Từ ngày</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Transaction List / Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {filteredTxs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chưa có giao dịch nào phù hợp.</p>
            <p className="mt-1 text-xs text-slate-400">Bắt đầu ghi lại thu chi để quản lý tài chính dễ dàng.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTxs.map((tx) => {
              const acc = accounts.find((a) => a.id === tx.accountId);
              const targetAcc = accounts.find((a) => a.id === tx.targetAccountId);
              const cat = categories.find((c) => c.id === tx.categoryId);
              const mem = members.find((m) => m.id === tx.memberId);

              return (
                <div
                  key={tx.id}
                  className="flex flex-col gap-2 p-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-md ${
                        tx.type === 'income'
                          ? 'bg-emerald-500 shadow-emerald-500/20'
                          : tx.type === 'expense'
                          ? 'bg-red-500 shadow-red-500/20'
                          : 'bg-blue-500 shadow-blue-500/20'
                      }`}
                    >
                      {tx.type === 'income' ? <ArrowDownRight className="h-5 w-5" /> : tx.type === 'expense' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowLeftRight className="h-5 w-5" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.description}</p>
                        {tx.status === 'pending_sync' && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                            Chờ sync
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{formatDate(tx.transactionDate)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {tx.type === 'transfer' ? `${acc?.name} → ${targetAcc?.name}` : acc?.name}
                        </span>
                        {cat && (
                          <>
                            <span>•</span>
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {cat.name}
                            </span>
                          </>
                        )}
                        {mem && (
                          <>
                            <span>•</span>
                            <span>{mem.name}</span>
                          </>
                        )}
                      </div>

                      {tx.note && <p className="text-[11px] italic text-slate-400 dark:text-slate-500">{tx.note}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <span
                      className={`text-base font-extrabold ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'expense'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                      {formatCurrency(tx.amount, currency)}
                    </span>

                    <div className="flex items-center gap-1">
                      {isTrashView ? (
                        <button
                          onClick={() => onRestore(tx.id)}
                          className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="Khôi phục"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onEdit(tx)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDelete(tx.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        title={isTrashView ? 'Xóa vĩnh viễn' : 'Chuyển vào thùng rác'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
