import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { Account, Category, FamilyMember, TransactionType } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  members: FamilyMember[];
  onSave: (txData: any) => Promise<void>;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  accounts,
  categories,
  members,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Auto pick first account & default category on open
  React.useEffect(() => {
    if (isOpen) {
      if (accounts.length > 0 && !accountId) setAccountId(accounts[0].id);
      if (accounts.length > 1 && !targetAccountId) setTargetAccountId(accounts[1].id);
      if (members.length > 0 && !memberId) setMemberId(members[0].id);
      
      const filteredCats = categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense'));
      if (filteredCats.length > 0) setCategoryId(filteredCats[0].id);
      setErrorMsg('');
    }
  }, [isOpen, type, accounts, categories, members]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) =>
    type === 'income' ? c.type === 'income' : c.type === 'expense'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));

    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!accountId) {
      setErrorMsg('Vui lòng chọn ví / tài khoản.');
      return;
    }
    if (type === 'transfer' && accountId === targetAccountId) {
      setErrorMsg('Ví đích phải khác ví nguồn.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        amount: numAmount,
        categoryId: type === 'transfer' ? undefined : categoryId,
        accountId,
        targetAccountId: type === 'transfer' ? targetAccountId : undefined,
        memberId,
        description: description || (type === 'transfer' ? 'Chuyển tiền nội bộ' : 'Giao dịch nhanh'),
        note,
        transactionDate,
      });
      // Reset form
      setAmount('');
      setDescription('');
      setNote('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể lưu giao dịch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Amount preset buttons
  const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Thêm Giao Dịch Nhanh</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {/* 1. Transaction Type Toggle */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ArrowDownRight className="h-4 w-4" /> Chi Tiêu
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" /> Thu Nhập
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                type === 'transfer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" /> Chuyển Ví
            </button>
          </div>

          {/* 2. Amount Input */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Số tiền (₫)
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                autoFocus
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(val ? parseInt(val, 10).toLocaleString('vi-VN') : '');
                }}
                placeholder="0 ₫"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-black text-slate-900 tracking-tight transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            {/* Amount Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toLocaleString('vi-VN'))}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  +{preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Category Selection (If Expense / Income) */}
          {type !== 'transfer' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Danh mục
              </label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {filteredCategories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-center transition-all ${
                      categoryId === cat.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-xl text-white text-xs font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name.slice(0, 1)}
                    </div>
                    <span className="truncate text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Wallet Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {type === 'transfer' ? 'Ví nguồn' : 'Ví / Tài khoản'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.balance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Ví đích
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.balance.toLocaleString('vi-VN')} ₫)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Người thực hiện
                </label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Description & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Nội dung
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Ăn trưa, Cà phê, Xăng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <>
                <Check className="h-5 w-5" /> Lưu Giao Dịch (&lt; 10s)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
