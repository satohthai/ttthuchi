import React, { useState } from 'react';
import { HandCoins, Plus, CheckCircle, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Debt, Account, DebtType, CurrencyCode } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface DebtsViewProps {
  debts: Debt[];
  accounts: Account[];
  currency: CurrencyCode;
  onCreateDebt: (debt: Partial<Debt>) => Promise<void>;
  onPayDebt: (id: string, amount: number, accountId: string) => Promise<void>;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  accounts,
  currency,
  onCreateDebt,
  onPayDebt,
}) => {
  const [activeTab, setActiveTab] = useState<DebtType>('i_owe');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');

  // Form states
  const [partyName, setPartyName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('2026-12-31');
  const [note, setNote] = useState('');

  // Repayment form
  const [payAmount, setPayAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');

  const filteredDebts = debts.filter((d) => d.type === activeTab);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tNum = parseFloat(totalAmount.replace(/[^0-9]/g, ''));
    const pNum = parseFloat(paidAmount.replace(/[^0-9]/g, '')) || 0;
    if (!partyName || !tNum) return;

    await onCreateDebt({
      type: activeTab,
      partyName,
      totalAmount: tNum,
      paidAmount: pNum,
      borrowDate,
      dueDate,
      note,
    });
    setShowCreateModal(false);
    setPartyName('');
    setTotalAmount('');
    setPaidAmount('');
    setNote('');
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(payAmount.replace(/[^0-9]/g, ''));
    if (!num || !selectedDebtId || !selectedAccount) return;

    await onPayDebt(selectedDebtId, num, selectedAccount);
    setShowPayModal(false);
    setPayAmount('');
  };

  const totalOweRemaining = debts.filter((d) => d.type === 'i_owe' && d.status === 'active').reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0);
  const totalOwedToMeRemaining = debts.filter((d) => d.type === 'owed_to_me' && d.status === 'active').reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quản Lý Khoản Nợ & Cho Vay</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Theo dõi nợ phải trả, khoản cho vay, lịch sử trả góp & nhắc hạn chót.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Thêm Khoản Nợ / Cho Vay
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400">Tổng Nợ Phải Trả Còn Lại</p>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(totalOweRemaining, currency)}
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">Tổng Tiền Cho Vay Còn Lại</p>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalOwedToMeRemaining, currency)}
          </p>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex w-fit gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab('i_owe')}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
            activeTab === 'i_owe'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Tôi Vay Nợ ({debts.filter((d) => d.type === 'i_owe').length})
        </button>
        <button
          onClick={() => setActiveTab('owed_to_me')}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
            activeTab === 'owed_to_me'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Tôi Cho Vay ({debts.filter((d) => d.type === 'owed_to_me').length})
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredDebts.map((debt) => {
          const remaining = debt.totalAmount - debt.paidAmount;
          const percent = Math.min((debt.paidAmount / debt.totalAmount) * 100, 100);

          return (
            <div
              key={debt.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{debt.partyName}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      debt.status === 'settled'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {debt.status === 'settled' ? 'Đã Tất Toán' : 'Đang Theo Dõi'}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Tổng khoản tiền:</span>
                    <span className="font-bold">{formatCurrency(debt.totalAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đã thanh toán:</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(debt.paidAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>Còn lại:</span>
                    <span className="text-amber-600">{formatCurrency(remaining, currency)}</span>
                  </div>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  Vay ngày: {formatDate(debt.borrowDate)} • Hạn trả: {formatDate(debt.dueDate)}
                </p>
                {debt.note && <p className="mt-1 text-[11px] italic text-slate-500">{debt.note}</p>}
              </div>

              {debt.status === 'active' && (
                <button
                  onClick={() => {
                    setSelectedDebtId(debt.id);
                    setShowPayModal(true);
                  }}
                  className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  <HandCoins className="h-4 w-4" /> Ghi Nhận {activeTab === 'i_owe' ? 'Trả Nợ' : 'Thu Nợ'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Create Debt */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thêm Khoản {activeTab === 'i_owe' ? 'Tôi Vay' : 'Tôi Cho Vay'}
            </h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Đối tác / Người giao dịch</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ngân hàng Shinhan, Anh Nam..."
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tổng số tiền (₫)</label>
                <input
                  type="text"
                  required
                  placeholder="20.000.000 ₫"
                  value={totalAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setTotalAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Ngày giao dịch</label>
                  <input
                    type="date"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Hạn chót</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Ghi chú</label>
                <input
                  type="text"
                  placeholder="Trả góp hàng tháng, lãi suất..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pay Debt */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ghi Nhận Thanh Toán / Thu Tiền</h3>

            <form onSubmit={handlePaySubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Số tiền thanh toán (₫)</label>
                <input
                  type="text"
                  required
                  placeholder="5.000.000 ₫"
                  value={payAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPayAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Trừ/Cộng ví nào</label>
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
                  onClick={() => setShowPayModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
