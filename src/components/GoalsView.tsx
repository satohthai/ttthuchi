import React, { useState } from 'react';
import { Target, Plus, PiggyBank, Calendar, CheckCircle2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { SavingsGoal, Account, CurrencyCode } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface GoalsViewProps {
  goals: SavingsGoal[];
  accounts: Account[];
  currency: CurrencyCode;
  onCreateGoal: (goal: Partial<SavingsGoal>) => Promise<void>;
  onContribute: (id: string, amount: number, accountId: string, type: 'add' | 'withdraw') => Promise<void>;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  accounts,
  currency,
  onCreateGoal,
  onContribute,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add');

  // Form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');

  // Contribute form
  const [contribAmount, setContribAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tNum = parseFloat(targetAmount.replace(/[^0-9]/g, ''));
    const cNum = parseFloat(currentAmount.replace(/[^0-9]/g, '')) || 0;
    if (!name || !tNum) return;

    await onCreateGoal({
      name,
      targetAmount: tNum,
      currentAmount: cNum,
      deadline,
      color: '#2563EB',
      icon: 'Target',
    });
    setShowCreateModal(false);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
  };

  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(contribAmount.replace(/[^0-9]/g, ''));
    if (!num || !selectedGoalId || !selectedAccount) return;

    await onContribute(selectedGoalId, num, selectedAccount, actionType);
    setShowContributeModal(false);
    setContribAmount('');
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mục Tiêu Tiết Kiệm</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lập kế hoạch mua sắm lớn, quỹ du lịch, tự động tính số tiền cần tích lũy mỗi tháng.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Mục Tiêu Mới
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

          return (
            <div
              key={goal.id}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{goal.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Hạn chót: {formatDate(goal.deadline)}
                      </p>
                    </div>
                  </div>

                  {goal.status === 'completed' && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Đạt
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-600 dark:text-blue-400">
                      Đã đạt: {formatCurrency(goal.currentAmount, currency)}
                    </span>
                    <span className="text-slate-900 dark:text-white">{percent.toFixed(1)}%</span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Mục tiêu: {formatCurrency(goal.targetAmount, currency)}</span>
                    <span>Cần: {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount), currency)}</span>
                  </div>
                </div>

                {/* Monthly estimate box */}
                <div className="mt-4 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  💡 Cần tiết kiệm khoảng <b>{formatCurrency(goal.monthlyTarget, currency)}</b> / tháng để kịp hạn chót.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setActionType('add');
                    setShowContributeModal(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" /> Nộp Thêm
                </button>
                <button
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setActionType('withdraw');
                    setShowContributeModal(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" /> Rút Quỹ
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create Goal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tạo Mục Tiêu Tiết Kiệm Mới</h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tên mục tiêu</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mua ô tô, Du lịch Nhật Bản..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Mục tiêu cần đạt (₫)</label>
                <input
                  type="text"
                  required
                  placeholder="100.000.000 ₫"
                  value={targetAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setTargetAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Đã có sẵn (₫)</label>
                <input
                  type="text"
                  placeholder="0 ₫"
                  value={currentAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCurrentAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Hạn chót</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Tạo Mục Tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contribute / Withdraw */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {actionType === 'add' ? 'Nộp Tiền Vào Quỹ Tiết Kiệm' : 'Rút Tiền Từ Quỹ Tiết Kiệm'}
            </h3>

            <form onSubmit={handleContributeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Số tiền (₫)</label>
                <input
                  type="text"
                  required
                  placeholder="0 ₫"
                  value={contribAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setContribAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {actionType === 'add' ? 'Trừ vào ví / tài khoản' : 'Cộng vào ví / tài khoản'}
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Xác Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
