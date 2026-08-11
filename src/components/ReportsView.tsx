import React, { useState } from 'react';
import { BarChart3, Download, PieChart as PieIcon, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Transaction, Category, FamilyMember, Account, CurrencyCode } from '../types';
import { formatCurrency, formatCompactCurrency } from '../lib/formatters';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
  members: FamilyMember[];
  accounts: Account[];
  currency: CurrencyCode;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  categories,
  members,
  accounts,
  currency,
}) => {
  const [reportPeriod, setReportPeriod] = useState('2026-08');

  const activeTxs = transactions.filter((t) => !t.deletedAt && t.transactionDate.startsWith(reportPeriod));

  const totalIncome = activeTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = activeTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Category Expense Breakdown
  const categoryMap: Record<string, number> = {};
  activeTxs
    .filter((t) => t.type === 'expense' && t.categoryId)
    .forEach((t) => {
      categoryMap[t.categoryId!] = (categoryMap[t.categoryId!] || 0) + t.amount;
    });

  const categoryChartData = Object.keys(categoryMap).map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      name: cat?.name || 'Khác',
      value: categoryMap[catId],
      color: cat?.color || '#3B82F6',
    };
  });

  // Member Spend Breakdown
  const memberMap: Record<string, number> = {};
  activeTxs
    .filter((t) => t.type === 'expense' && t.memberId)
    .forEach((t) => {
      memberMap[t.memberId!] = (memberMap[t.memberId!] || 0) + t.amount;
    });

  const memberBreakdown = Object.keys(memberMap).map((mId) => {
    const m = members.find((mem) => mem.id === mId);
    return {
      memberName: m?.name || 'Chưa phân loại',
      amount: memberMap[mId],
      percentage: totalExpense > 0 ? ((memberMap[mId] / totalExpense) * 100).toFixed(1) : 0,
    };
  });

  // Daily spend line chart
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = String(i + 1).padStart(2, '0');
    const dateStr = `${reportPeriod}-${dayNum}`;
    const dayTxs = activeTxs.filter((t) => t.transactionDate === dateStr);
    const inc = dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      day: `Ng ${i + 1}`,
      income: inc,
      expense: exp,
    };
  });

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Báo Cáo Tài Chính</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Phân tích chuyên sâu thu chi, xu hướng dòng tiền & đóng góp của từng thành viên.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase text-slate-400">Tổng Thu Trong Tháng</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">+{formatCurrency(totalIncome, currency)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase text-slate-400">Tổng Chi Trong Tháng</p>
          <p className="mt-1 text-2xl font-black text-red-600">-{formatCurrency(totalExpense, currency)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase text-slate-400">Dòng Tiền Tích Lũy Ròng</p>
          <p className={`mt-1 text-2xl font-black ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
            {formatCurrency(totalIncome - totalExpense, currency)}
          </p>
        </div>
      </div>

      {/* Daily Cashflow Trend Line Chart */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Xu Hướng Thu Chi Theo Ngày Trong Tháng</h3>
        <p className="text-[11px] text-slate-500 mb-4">Biểu đồ đường dòng tiền hàng ngày</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daysInMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-[10px]" />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}K`} className="text-[10px]" />
              <Tooltip formatter={(value: any) => [formatCurrency(Number(value), currency), '']} />
              <Legend />
              <Line type="monotone" dataKey="income" name="Thu nhập" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" name="Chi tiêu" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns: Category Breakdown & Member Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Pie */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chi Tiêu Theo Danh Mục</h3>
          <p className="text-[11px] text-slate-500 mb-2">Tỉ lệ cơ cấu chi tiêu</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`c-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value), currency), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Spending Table */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chi Tiêu Theo Thành Viên Gia Đình</h3>
          <p className="text-[11px] text-slate-500 mb-4">Theo dõi chi tiêu từng người trong nhà</p>

          <div className="space-y-3">
            {memberBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.memberName}</p>
                  <p className="text-[10px] text-slate-500">Chiếm {item.percentage}% tổng chi tiêu</p>
                </div>
                <span className="text-sm font-extrabold text-red-600">{formatCurrency(item.amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
