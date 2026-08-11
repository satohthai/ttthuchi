import React, { useState } from 'react';
import { Repeat, Plus, Play, CheckCircle, Calendar, Clock } from 'lucide-react';
import { RecurringTransaction, Account, Category, CurrencyCode } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface RecurringViewProps {
  recurringList: RecurringTransaction[];
  accounts: Account[];
  categories: Category[];
  currency: CurrencyCode;
  onCreateRecurring: (rec: Partial<RecurringTransaction>) => Promise<void>;
  onExecute: (id: string) => Promise<void>;
}

export const RecurringView: React.FC<RecurringViewProps> = ({
  recurringList,
  accounts,
  categories,
  currency,
  onCreateRecurring,
  onExecute,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!name || !num) return;

    await onCreateRecurring({
      name,
      amount: num,
      type,
      categoryId,
      accountId,
      frequency,
      startDate: new Date().toISOString().split('T')[0],
      autoCreate: true,
    });
    setShowModal(false);
    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Giao Dịch Định Kỳ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tự động tạo giao dịch tiền thuê nhà, internet, bảo hiểm, lương theo chu kỳ.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Thêm Mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recurringList.map((rec) => {
          const acc = accounts.find((a) => a.id === rec.accountId);
          const cat = categories.find((c) => c.id === rec.categoryId);

          return (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <Repeat className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {rec.frequency.toUpperCase()} • Tự động ghi log
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Đang chạy
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500">Số tiền:</span>
                  <span className="text-base font-extrabold text-red-600 dark:text-red-400">
                    {formatCurrency(rec.amount, currency)}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Ví: {acc?.name} • Danh mục: {cat?.name}
                </p>
                <p className="mt-1 text-[11px] text-blue-600 font-semibold">
                  Lần thực hiện kế tiếp: {formatDate(rec.nextExecution)}
                </p>
              </div>

              <button
                onClick={() => onExecute(rec.id)}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                <Play className="h-4 w-4 text-blue-600 fill-blue-600" /> Thực Hiện Ngay
              </button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm Giao Dịch Định Kỳ Mới</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tên khoản tiền</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiền thuê nhà, Tiền điện, Netflix..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Số tiền (₫)</label>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tần suất</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="monthly">Hàng tháng</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="quarterly">Hàng quý</option>
                    <option value="yearly">Hàng năm</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Trừ vào ví</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
