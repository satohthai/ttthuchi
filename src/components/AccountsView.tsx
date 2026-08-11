import React, { useState } from 'react';
import { Wallet, Building2, Smartphone, PiggyBank, Plus, ArrowRightLeft, CreditCard, Archive, Trash2 } from 'lucide-react';
import { Account, AccountType, CurrencyCode } from '../types';
import { formatCurrency } from '../lib/formatters';

interface AccountsViewProps {
  accounts: Account[];
  currency: CurrencyCode;
  onCreateAccount: (acc: Partial<Account>) => Promise<void>;
  onOpenQuickAdd: () => void;
  onDeleteAccount: (id: string) => Promise<void>;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  currency,
  onCreateAccount,
  onOpenQuickAdd,
  onDeleteAccount,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.status === 'active' ? a.balance : 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await onCreateAccount({
        name,
        type,
        balance: parseFloat(balance.replace(/[^0-9]/g, '')) || 0,
        bankName,
        accountNumber,
        color,
        icon: type === 'bank' ? 'Building2' : type === 'cash' ? 'Wallet' : 'Smartphone',
      });
      setShowModal(false);
      setName('');
      setBalance('');
      setBankName('');
      setAccountNumber('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountIcon = (t: AccountType) => {
    switch (t) {
      case 'bank':
        return <Building2 className="h-6 w-6 text-blue-500" />;
      case 'wallet':
        return <Smartphone className="h-6 w-6 text-pink-500" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6 text-purple-500" />;
      case 'credit':
        return <CreditCard className="h-6 w-6 text-amber-500" />;
      default:
        return <Wallet className="h-6 w-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ví & Tài Khoản Ngân Hàng</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản lý dòng tiền tập trung: Tiền mặt, Vietcombank, MoMo, Thẻ tín dụng, Tiết kiệm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ArrowRightLeft className="h-4 w-4 text-blue-600" /> Chuyển Ví
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Thêm Ví Mới
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 dark:border-blue-900/30 dark:from-slate-900 dark:to-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Tổng Dư Tất Cả Tài Khoản
        </p>
        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
          {formatCurrency(totalBalance, currency)}
        </p>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{acc.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {acc.bankName ? `${acc.bankName} • ${acc.accountNumber || ''}` : acc.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteAccount(acc.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                title="Xóa/Lưu trữ ví"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase text-slate-400">Số dư hiện tại</p>
              <p className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">
                {formatCurrency(acc.balance, currency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal create account */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm Ví / Tài Khoản Mới</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tên ví / tài khoản</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Techcombank, MoMo, Ví tiền mặt..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Loại tài khoản</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="bank">Ngân hàng (Vietcombank, MB, Techcombank...)</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="wallet">Ví điện tử (MoMo, ZaloPay, ShopeePay...)</option>
                  <option value="credit">Thẻ tín dụng (Credit Card)</option>
                  <option value="savings">Tiết kiệm</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Số dư ban đầu (₫)</label>
                <input
                  type="text"
                  placeholder="0 ₫"
                  value={balance}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setBalance(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {type === 'bank' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tên Ngân hàng</label>
                    <input
                      type="text"
                      placeholder="VCB, TCB, ACB..."
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Số tài khoản</label>
                    <input
                      type="text"
                      placeholder="101..."
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

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
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Lưu Ví
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
