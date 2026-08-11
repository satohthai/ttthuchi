import React, { useState } from 'react';
import { Tag, Plus, Check, X, Edit, Trash } from 'lucide-react';
import { Category, CategoryType } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  onCreateCategory: (cat: Partial<Category>) => Promise<void>;
  onUpdateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await onCreateCategory({
      name,
      type: activeTab,
      color,
      icon: 'Tag',
    });
    setShowModal(false);
    setName('');
  };

  const presetColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quản Lý Danh Mục Thu Chi</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tùy chỉnh nhóm khoản chi & thu nhập theo nhu cầu gia đình.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Thêm Danh Mục
        </button>
      </div>

      {/* Expense / Income Tabs */}
      <div className="flex w-fit gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab('expense')}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
            activeTab === 'expense'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Chi Tiêu ({categories.filter((c) => c.type === 'expense').length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
            activeTab === 'income'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Thu Nhập ({categories.filter((c) => c.type === 'income').length})
        </button>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name.slice(0, 1)}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</span>
            </div>

            <button
              onClick={() => onUpdateCategory(cat.id, { isEnabled: !cat.isEnabled })}
              className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                cat.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {cat.isEnabled ? 'Mở' : 'Tắt'}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm Danh Mục Mới</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Tên danh mục</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thú cưng, Bảo hiểm..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Màu sắc</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
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
                  Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
