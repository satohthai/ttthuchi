import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  Plus,
  ArrowRight,
  HandCoins,
  Receipt,
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Tv,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardSummary, Transaction, Account, CurrencyCode } from '../types';
import { formatCurrency, formatCompactCurrency, formatDate } from '../lib/formatters';

interface DashboardViewProps {
  summary: DashboardSummary | null;
  accounts: Account[];
  currency: CurrencyCode;
  onOpenQuickAdd: () => void;
  onNavigate: (view: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  accounts,
  currency,
  onOpenQuickAdd,
  onNavigate,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  if (!summary) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const {
    totalAssets,
    totalIncome,
    totalExpense,
    totalSavings,
    totalDebtToPay,
    totalOwedToMe,
    recentTransactions,
    budgetSummaries,
    monthlyCashflow,
    categoryBreakdown,
  } = summary;

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 text-white shadow-xl shadow-blue-500/15 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            Tháng 08/2026
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Tổng Tài Sản: {formatCurrency(totalAssets, currency)}
          </h2>
          <p className="mt-1 text-xs text-blue-100">
            Cập nhật realtime từ {accounts.length} ví & tài khoản ngân hàng.
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-blue-700 shadow-md transition-all hover:bg-blue-50 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Thêm Giao Dịch Nhanh
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Income */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Tổng Thu (Tháng)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            +{formatCompactCurrency(totalIncome, currency)}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Tổng Chi (Tháng)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-red-600 dark:text-red-400">
            -{formatCompactCurrency(totalExpense, currency)}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            {formatCurrency(totalExpense, currency)}
          </p>
        </div>

        {/* Savings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Tiết Kiệm Ròng
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <p className={`mt-2 text-xl font-extrabold ${totalSavings >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600'}`}>
            {totalSavings >= 0 ? '+' : ''}{formatCompactCurrency(totalSavings, currency)}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            Tỉ lệ tích lũy: {totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(0) : 0}%
          </p>
        </div>

        {/* Debts */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Nợ Phải Trả
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <HandCoins className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatCompactCurrency(totalDebtToPay, currency)}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            Cho vay: {formatCompactCurrency(totalOwedToMe, currency)}
          </p>
        </div>
      </div>

      {/* Charts Section: Cashflow & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cashflow Bar Chart (2 cols) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Biểu Đồ Thu / Chi Các Tháng
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">So sánh dòng tiền 5 tháng gần nhất</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Chi tiết <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-[10px]" />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000000}M`}
                  className="text-[10px]"
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency), '']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="income" name="Thu nhập" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Chi tiêu" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Expense Donut Chart (1 col) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cơ Cấu Chi Tiêu
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Phân bổ chi tiêu tháng 8/2026</p>
          </div>

          <div className="mt-2 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value), currency), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="mt-2 space-y-1.5 overflow-y-auto max-h-32">
            {categoryBreakdown.slice(0, 5).map((item) => (
              <div key={item.categoryId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{item.categoryName}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Progress & Alerts Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Theo Dõi Ngân Sách Hàng Tháng
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Cảnh báo tự động khi vượt 80% & 100%</p>
          </div>
          <button
            onClick={() => onNavigate('budgets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Quản lý ngân sách →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {budgetSummaries.map((item) => (
            <div key={item.categoryId} className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{item.categoryName}</span>
                {item.status === 'exceeded' ? (
                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-300">
                    <AlertCircle className="h-3 w-3" /> Vượt {item.percentage}%
                  </span>
                ) : item.status === 'warning' ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {item.percentage}%
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {item.percentage}%
                  </span>
                )}
              </div>

              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.status === 'exceeded'
                      ? 'bg-red-500'
                      : item.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{formatCompactCurrency(item.usedAmount, currency)}</span>
                <span>/ {formatCompactCurrency(item.budgetAmount, currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Giao Dịch Gần Đây</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Thao tác chỉnh sửa & xóa trực tiếp</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Xem tất cả ({recentTransactions.length}) →
          </button>
        </div>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white font-bold text-sm ${
                    tx.type === 'income'
                      ? 'bg-emerald-500'
                      : tx.type === 'expense'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {tx.type === 'income' ? '↓' : tx.type === 'expense' ? '↑' : '⇄'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{tx.description}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDate(tx.transactionDate)} • {accounts.find((a) => a.id === tx.accountId)?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-extrabold ${
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
