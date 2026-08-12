import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { QuickAddModal } from './components/QuickAddModal';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AccountsView } from './components/AccountsView';
import { CategoriesView } from './components/CategoriesView';
import { BudgetsView } from './components/BudgetsView';
import { GoalsView } from './components/GoalsView';
import { DebtsView } from './components/DebtsView';
import { RecurringView } from './components/RecurringView';
import { ReportsView } from './components/ReportsView';
import { FamilyView } from './components/FamilyView';
import { NotificationsView } from './components/NotificationsView';
import { AuditLogsView } from './components/AuditLogsView';
import { AdminPortalView } from './components/AdminPortalView';
import { SettingsView } from './components/SettingsView';
import { GoogleSheetView } from './components/GoogleSheetView';
import { LoginModal } from './components/LoginModal';

import {
  User,
  Family,
  FamilyMember,
  Account,
  Category,
  Transaction,
  Budget,
  SavingsGoal,
  Debt,
  RecurringTransaction,
  NotificationItem,
  AuditLog,
  CurrencyCode,
  DashboardSummary,
} from './types';
import { api } from './lib/api';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [currency, setCurrency] = useState<CurrencyCode>('VND');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [quickAddInitialType, setQuickAddInitialType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Data Fetching from Server
  const refreshData = async () => {
    try {
      const summary = await api.getDashboard();
      const user = await api.getCurrentUser();
      const fam = await api.getFamily();
      const mems = await api.getFamilyMembers();
      const accs = await api.getAccounts();
      const cats = await api.getCategories();
      const txs = await api.getTransactions();
      const bdgs = await api.getBudgets();
      const gls = await api.getGoals();
      const dbts = await api.getDebts();
      const recs = await api.getRecurring();
      const notifs = await api.getNotifications();
      const logs = await api.getAuditLogs();

      setDashboardSummary(summary);
      setCurrentUser(user);
      setFamily(fam);
      setMembers(mems);
      setAccounts(accs);
      setCategories(cats);
      setTransactions(txs);
      setBudgets(bdgs);
      setGoals(gls);
      setDebts(dbts);
      setRecurringList(recs);
      setNotifications(notifs);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Transactions
  const handleSaveTransaction = async (data: Partial<Transaction>) => {
    try {
      if (editingTransaction) {
        await api.updateTransaction(editingTransaction.id, data);
        showToast('Cập nhật giao dịch thành công!');
      } else {
        await api.createTransaction(data);
        showToast('Thêm giao dịch mới thành công!');
      }
      setIsQuickAddOpen(false);
      setEditingTransaction(null);
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu giao dịch');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Bạn có chắc muốn chuyển giao dịch này vào thùng rác?')) {
      await api.deleteTransaction(id);
      showToast('Đã xóa giao dịch');
      await refreshData();
    }
  };

  const handleRestoreTransaction = async (id: string) => {
    await api.restoreTransaction(id);
    showToast('Đã khôi phục giao dịch');
    await refreshData();
  };

  // Handlers for Accounts
  const handleCreateAccount = async (acc: Partial<Account>) => {
    await api.createAccount(acc);
    showToast('Thêm tài khoản / ví thành công!');
    await refreshData();
  };

  const handleDeleteAccount = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa ví này?')) {
      await api.deleteAccount(id);
      showToast('Đã xóa ví');
      await refreshData();
    }
  };

  // Handlers for Categories
  const handleCreateCategory = async (cat: Partial<Category>) => {
    await api.createCategory(cat);
    showToast('Thêm danh mục thành công!');
    await refreshData();
  };

  const handleUpdateCategory = async (id: string, cat: Partial<Category>) => {
    await api.updateCategory(id, cat);
    showToast('Cập nhật danh mục thành công!');
    await refreshData();
  };

  // Handlers for Budgets
  const handleSaveBudget = async (categoryId: string, amount: number, periodKey?: string) => {
    await api.saveBudget({ categoryId, amount, periodKey });
    showToast('Đặt ngân sách thành công!');
    await refreshData();
  };

  // Handlers for Goals
  const handleCreateGoal = async (goal: Partial<SavingsGoal>) => {
    await api.createGoal(goal);
    showToast('Tạo mục tiêu tiết kiệm thành công!');
    await refreshData();
  };

  const handleContributeGoal = async (id: string, amount: number, accountId: string, type: 'add' | 'withdraw') => {
    await api.contributeGoal(id, { amount, accountId, type });
    showToast(type === 'add' ? 'Đã nộp tiền vào quỹ!' : 'Đã rút tiền từ quỹ!');
    await refreshData();
  };

  // Handlers for Debts
  const handleCreateDebt = async (debt: Partial<Debt>) => {
    await api.createDebt(debt);
    showToast('Thêm khoản nợ/cho vay thành công!');
    await refreshData();
  };

  const handlePayDebt = async (id: string, amount: number, accountId: string) => {
    await api.payDebt(id, { amount, accountId });
    showToast('Đã ghi nhận thanh toán!');
    await refreshData();
  };

  // Handlers for Recurring
  const handleCreateRecurring = async (rec: Partial<RecurringTransaction>) => {
    await api.createRecurring(rec);
    showToast('Tạo giao dịch định kỳ thành công!');
    await refreshData();
  };

  const handleExecuteRecurring = async (id: string) => {
    await api.executeRecurring(id);
    showToast('Đã tự động tạo giao dịch!');
    await refreshData();
  };

  // Handlers for Family
  const handleInviteMember = async (member: { name: string; email: string; role: string; phone?: string }) => {
    await api.inviteMember(member);
    showToast('Đã gửi lời mời thành viên!');
    await refreshData();
  };

  const handleUpdateRole = async (id: string, role: string) => {
    await api.updateMemberRole(id, role);
    showToast('Đã cập nhật quyền thành viên!');
    await refreshData();
  };

  const handleRemoveMember = async (id: string) => {
    if (confirm('Xóa thành viên khỏi gia đình?')) {
      await api.removeMember(id);
      showToast('Đã xóa thành viên');
      await refreshData();
    }
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    showToast('Đã đánh dấu tất cả thông báo là đã đọc');
    await refreshData();
  };

  // Export all data
  const handleExportAllData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      user: currentUser,
      family,
      members,
      accounts,
      categories,
      transactions,
      budgets,
      goals,
      debts,
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `financial_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
            Đang đồng bộ dữ liệu tài chính gia đình...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl dark:bg-blue-600">
          ✨ {toastMessage}
        </div>
      )}

      {/* Mobile Slide-Over Overlay Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative z-50 flex h-full w-72 flex-col bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              activeView={activeView}
              onNavigate={(view) => {
                setActiveView(view);
                setIsMobileDrawerOpen(false);
              }}
              userRole={currentUser?.role}
              trashCount={transactions.filter((t) => !!t.deletedAt).length}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Top Navigation Header */}
      <Header
        user={currentUser}
        family={family}
        memberRole={members.find((m) => m.userId === currentUser?.id)?.role || 'Chủ hộ'}
        currency={currency}
        onCurrencyChange={setCurrency}
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        isDarkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        notifications={notifications}
        onOpenNotifications={() => setActiveView('notifications')}
        onLogout={() => {
          setIsLoginModalOpen(true);
          showToast('Đã mở Form Đăng nhập');
        }}
        activeView={activeView}
        onNavigate={setActiveView}
        isOnline={isOnline}
        onToggleOnline={() => {
          const next = !isOnline;
          setIsOnline(next);
          api.setOnline(next);
          showToast(next ? 'Đã khôi phục kết nối Online' : 'Đã chuyển chế độ Chạy Offline');
        }}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => {
          if (window.innerWidth < 1024 || isMobileSimulator) {
            setIsMobileDrawerOpen(!isMobileDrawerOpen);
          } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }
        }}
      />

      <div className={`mx-auto flex ${isMobileSimulator ? 'max-w-md border-x border-slate-200 dark:border-slate-800 shadow-2xl my-4 rounded-3xl overflow-hidden bg-white dark:bg-slate-900' : 'w-full px-2 sm:px-6'}`}>
        {/* Desktop Sidebar */}
        {!isMobileSimulator && (
          <div className="hidden lg:block shrink-0">
            <Sidebar
              activeView={activeView}
              onNavigate={setActiveView}
              userRole={currentUser?.role}
              trashCount={transactions.filter((t) => !!t.deletedAt).length}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {activeView === 'dashboard' && (
            <DashboardView
              summary={dashboardSummary}
              accounts={accounts}
              currency={currency}
              onOpenQuickAdd={() => {
                setEditingTransaction(null);
                setQuickAddInitialType('expense');
                setIsQuickAddOpen(true);
              }}
              onNavigate={setActiveView}
              onEditTransaction={(tx) => {
                setEditingTransaction(tx);
                setIsQuickAddOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeView === 'transactions' && (
            <TransactionsView
              transactions={transactions.filter((t) => !t.deletedAt)}
              accounts={accounts}
              categories={categories}
              members={members}
              currency={currency}
              onOpenQuickAdd={() => {
                setEditingTransaction(null);
                setQuickAddInitialType('expense');
                setIsQuickAddOpen(true);
              }}
              onEdit={(tx) => {
                setEditingTransaction(tx);
                setIsQuickAddOpen(true);
              }}
              onDelete={handleDeleteTransaction}
              onRestore={handleRestoreTransaction}
            />
          )}

          {activeView === 'trash' && (
            <TransactionsView
              transactions={transactions.filter((t) => !!t.deletedAt)}
              accounts={accounts}
              categories={categories}
              members={members}
              currency={currency}
              onOpenQuickAdd={() => {}}
              onEdit={() => {}}
              onDelete={handleDeleteTransaction}
              onRestore={handleRestoreTransaction}
              isTrashView={true}
            />
          )}

          {activeView === 'accounts' && (
            <AccountsView
              accounts={accounts}
              currency={currency}
              onCreateAccount={handleCreateAccount}
              onOpenQuickAdd={() => {
                setEditingTransaction(null);
                setQuickAddInitialType('transfer');
                setIsQuickAddOpen(true);
              }}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {activeView === 'categories' && (
            <CategoriesView
              categories={categories}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
            />
          )}

          {activeView === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              categories={categories}
              transactions={transactions}
              currency={currency}
              onSaveBudget={handleSaveBudget}
            />
          )}

          {activeView === 'goals' && (
            <GoalsView
              goals={goals}
              accounts={accounts}
              currency={currency}
              onCreateGoal={handleCreateGoal}
              onContribute={handleContributeGoal}
            />
          )}

          {activeView === 'debts' && (
            <DebtsView
              debts={debts}
              accounts={accounts}
              currency={currency}
              onCreateDebt={handleCreateDebt}
              onPayDebt={handlePayDebt}
            />
          )}

          {activeView === 'recurring' && (
            <RecurringView
              recurringList={recurringList}
              accounts={accounts}
              categories={categories}
              currency={currency}
              onCreateRecurring={handleCreateRecurring}
              onExecute={handleExecuteRecurring}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              transactions={transactions}
              categories={categories}
              members={members}
              accounts={accounts}
              currency={currency}
            />
          )}

          {activeView === 'family' && (
            <FamilyView
              family={family}
              members={members}
              onInviteMember={handleInviteMember}
              onUpdateRole={handleUpdateRole}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {activeView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {(activeView === 'audit_logs' || activeView === 'audit-logs') && (
            <AuditLogsView logs={auditLogs} />
          )}

          {(activeView === 'admin_portal' || activeView === 'admin') && (
            <AdminPortalView />
          )}

          {(activeView === 'google-sheet' || activeView === 'google_sheet') && (
            <GoogleSheetView
              onShowToast={showToast}
              onRefreshData={refreshData}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              user={currentUser}
              currency={currency}
              darkMode={darkMode}
              onUpdateCurrency={setCurrency}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              onExportAllData={handleExportAllData}
              onOpenGoogleSheet={() => setActiveView('google-sheet')}
              onResetData={refreshData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenQuickAdd={() => {
          setEditingTransaction(null);
          setQuickAddInitialType('expense');
          setIsQuickAddOpen(true);
        }}
        onOpenMoreMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* Global Quick Add / Edit Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        accounts={accounts}
        categories={categories}
        members={members}
        initialType={quickAddInitialType}
        editingTransaction={editingTransaction}
      />
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
          refreshData();
        }}
        onClose={() => setIsLoginModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
