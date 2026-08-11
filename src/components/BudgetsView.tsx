import React, { useState } from 'react';
import { PiggyBank, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Budget, Category, Transaction, CurrencyCode } from '../types';
import { formatCurrency, formatCompactCurrency } from '../lib/formatters';

interface BudgetsViewProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  currency: CurrencyCode;
  onSaveBudget: (categoryId: string, amount: number, periodKey?: string) => Promise<void>;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  categories,
  transactions,
  currency,
  onSaveBudget,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  // Compute stats for selected month
  const activeTxs = transactions.filter(
    (t) => t.type === 'expense' && !t.deletedAt && t.transactionDate.startsWith(selectedMonth)
  );

  const currentBudgets = budgets.filter((b) => b.periodKey === selectedMonth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!selectedCategory || !num) return;
    await onSaveBudget(selectedCategory, num, selectedMonth);
    setShowModal(false);
    setAmount('');
  };

  const totalBudget = currentBudgets.reduce((s, b) => s + b.amount, 0);
  const totalUsed = activeTxs.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quản Lý Ngân Sách</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Đặt hạn mức chi tiêu theo tháng, nhận cảnh báo tự động khi vượt mốc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Đặt Ngân Sách
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Tổng Ngân Sách Tháng {selectedMonth}</p>
            <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalBudget, currency)}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase text-slate-400">Đã Tiêu Dùng</p>
            <p className="mt-1 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalUsed, currency)} ({totalBudget > 0 ? ((totalUsed / totalBudget) * 100).toFixed(1) : 0}%)
            </p>
          </div>
        </div>

        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              totalUsed > totalBudget ? 'bg-red-500' : totalUsed / totalBudget > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min((totalUsed / (totalBudget || 1)) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Categories Budget Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {expenseCategories.map((cat) => {
          const budget = currentBudgets.find((b) => b.categoryId === cat.id);
          const used = activeTxs.filter((t) => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0);
          const budgetAmt = budget ? budget.amount : 0;
          const percent = budgetAmt > 0 ? (used / budgetAmt) * 100 : 0;

          return (
            <div
              key={cat.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-xs"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name.slice(0, 1)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                </div>

                {percent >= 100 ? (
                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-300">
                    <AlertCircle className="h-3 w-3" /> Vượt {percent.toFixed(0)}%
                  </span>
                ) : percent >= 80 ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    Cảnh báo {percent.toFixed(0)}%
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {budgetAmt > 0 ? `${percent.toFixed(0)}%` : 'Chưa đặt'}
                  </span>
                )}
              </div>

              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Đã tiêu: {formatCompactCurrency(used, currency)}</span>
                <span className="text-slate-900 dark:text-white">
                  Hạn mức: {budgetAmt > 0 ? formatCompactCurrency(budgetAmt, currency) : '---'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thiết Lập Ngân Sách Danh Mục</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Chọn danh mục chi tiêu</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Hạn mức cho tháng {selectedMonth} (₫)
                </label>
                <input
                  type="text"
                  required
                  placeholder="5.000.000 ₫"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Lưu Ngân Sách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
