import {
  User,
  Family,
  Account,
  Category,
  Transaction,
  Budget,
  SavingsGoal,
  Debt,
  RecurringTransaction,
  NotificationItem,
  AuditLog,
  DashboardSummary,
  FamilyMember,
} from '../types';

class ApiClient {
  private isOnline: boolean = true;
  private pendingQueue: any[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncPendingQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  public getOnlineStatus() {
    return this.isOnline;
  }

  public setOnline(status: boolean) {
    return this.toggleOnlineSimulator(status);
  }

  public toggleOnlineSimulator(status?: boolean) {
    this.isOnline = status !== undefined ? status : !this.isOnline;
    if (this.isOnline) {
      this.syncPendingQueue();
    }
    return this.isOnline;
  }

  private async syncPendingQueue() {
    if (this.pendingQueue.length === 0) return;
    console.log(`Syncing ${this.pendingQueue.length} offline transactions to server...`);
    for (const item of [...this.pendingQueue]) {
      try {
        await this.fetchJson('/api/transactions', {
          method: 'POST',
          body: JSON.stringify(item),
        });
        this.pendingQueue = this.pendingQueue.filter((q) => q !== item);
      } catch (err) {
        console.error('Failed sync offline tx:', err);
      }
    }
  }

  public getPendingQueueCount() {
    return this.pendingQueue.length;
  }

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...options,
      });

      const contentType = res.headers.get('content-type') || '';
      let json: any;

      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Đường dẫn API không tồn tại (${url}).`);
          }
          throw new Error(`Máy chủ trả về phản hồi không hợp lệ (${res.status}).`);
        }
        try {
          json = JSON.parse(text);
        } catch {
          if (text.startsWith('The page') || text.includes('<!DOCTYPE') || text.includes('<html')) {
            throw new Error('Phản hồi từ máy chủ là trang HTML thay vì dữ liệu JSON. Vui lòng kiểm tra lại URL kết nối.');
          }
          throw new Error('Dữ liệu trả về không đúng định dạng JSON.');
        }
      }

      if (!res.ok || json.success === false) {
        throw new Error(json.error?.message || json.message || `Lỗi thao tác (${res.status}).`);
      }

      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      if (err instanceof SyntaxError || err.message?.includes('JSON')) {
        throw new Error('Dữ liệu nhận được từ máy chủ không đúng định dạng JSON hợp lệ.');
      }
      throw err;
    }
  }

  // Auth
  async getUsersList() {
    return this.fetchJson<Array<{ id: string; name: string; email: string; avatar?: string; role: string; hasPassword?: boolean }>>('/api/auth/users');
  }

  async getMe() {
    return this.fetchJson<{ user: User; family: Family; memberRole: string }>('/api/auth/me');
  }

  async getCurrentUser(): Promise<User> {
    const data = await this.getMe();
    return data.user;
  }

  async login(payload: { userId?: string; email?: string; name?: string; password?: string }) {
    return this.fetchJson<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updatePassword(password: string, action: 'update' | 'clear') {
    return this.fetchJson<{ message: string }>('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password, action }),
    });
  }

  async register(name: string, email: string, phone: string, pass: string) {
    return this.fetchJson<{ user: User; family: Family }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password: pass }),
    });
  }

  // Dashboard
  async getDashboard(): Promise<DashboardSummary> {
    return this.fetchJson<DashboardSummary>('/api/dashboard');
  }

  // Transactions
  async getTransactions(params?: {
    search?: string;
    type?: string;
    categoryId?: string;
    accountId?: string;
    memberId?: string;
    startDate?: string;
    endDate?: string;
    isTrash?: boolean;
  }): Promise<Transaction[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    return this.fetchJson<Transaction[]>(`/api/transactions?${query.toString()}`);
  }

  async createTransaction(txData: Partial<Transaction>): Promise<Transaction> {
    if (!this.isOnline) {
      const mockTx: Transaction = {
        id: `tx-offline-${Date.now()}`,
        familyId: 'fam-1',
        accountId: txData.accountId || 'acc-1',
        categoryId: txData.categoryId,
        userId: 'usr-1',
        type: txData.type || 'expense',
        amount: Number(txData.amount || 0),
        currency: 'VND',
        description: txData.description || 'Giao dịch offline',
        transactionDate: txData.transactionDate || new Date().toISOString().split('T')[0],
        status: 'pending_sync',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pendingQueue.push(txData);
      return mockTx;
    }

    return this.fetchJson<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(txData),
    });
  }

  async updateTransaction(id: string, txData: Partial<Transaction>): Promise<Transaction> {
    return this.fetchJson<Transaction>(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(txData),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.fetchJson(`/api/transactions/${id}`, { method: 'DELETE' });
  }

  async restoreTransaction(id: string): Promise<Transaction> {
    return this.fetchJson<Transaction>(`/api/transactions/${id}/restore`, { method: 'POST' });
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    return this.fetchJson<Account[]>('/api/accounts');
  }

  async createAccount(acc: Partial<Account>): Promise<Account> {
    return this.fetchJson<Account>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(acc),
    });
  }

  async updateAccount(id: string, acc: Partial<Account>): Promise<Account> {
    return this.fetchJson<Account>(`/api/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(acc),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.fetchJson(`/api/accounts/${id}`, { method: 'DELETE' });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.fetchJson<Category[]>('/api/categories');
  }

  async createCategory(cat: Partial<Category>): Promise<Category> {
    return this.fetchJson<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(cat),
    });
  }

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    return this.fetchJson<Category>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cat),
    });
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    return this.fetchJson<Budget[]>('/api/budgets');
  }

  async saveBudget(categoryIdOrObj: string | { categoryId: string; amount: number; periodKey?: string }, amount?: number, periodKey?: string): Promise<Budget> {
    const body = typeof categoryIdOrObj === 'object'
      ? categoryIdOrObj
      : { categoryId: categoryIdOrObj, amount, periodKey };
    return this.fetchJson<Budget>('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Savings Goals
  async getGoals(): Promise<SavingsGoal[]> {
    return this.fetchJson<SavingsGoal[]>('/api/goals');
  }

  async createGoal(goal: Partial<SavingsGoal>): Promise<SavingsGoal> {
    return this.fetchJson<SavingsGoal>('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async contributeGoal(id: string, amountOrObj: number | { amount: number; accountId: string; type: 'add' | 'withdraw' }, accountId?: string, type?: 'add' | 'withdraw'): Promise<SavingsGoal> {
    const body = typeof amountOrObj === 'object'
      ? amountOrObj
      : { amount: amountOrObj, accountId, type };
    return this.fetchJson<SavingsGoal>(`/api/goals/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Debts
  async getDebts(): Promise<Debt[]> {
    return this.fetchJson<Debt[]>('/api/debts');
  }

  async createDebt(debt: Partial<Debt>): Promise<Debt> {
    return this.fetchJson<Debt>('/api/debts', {
      method: 'POST',
      body: JSON.stringify(debt),
    });
  }

  async payDebt(id: string, amountOrObj: number | { amount: number; accountId: string }, accountId?: string): Promise<Debt> {
    const body = typeof amountOrObj === 'object'
      ? amountOrObj
      : { amount: amountOrObj, accountId };
    return this.fetchJson<Debt>(`/api/debts/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Recurring
  async getRecurring(): Promise<RecurringTransaction[]> {
    return this.fetchJson<RecurringTransaction[]>('/api/recurring');
  }

  async createRecurring(rec: Partial<RecurringTransaction>): Promise<RecurringTransaction> {
    return this.fetchJson<RecurringTransaction>('/api/recurring', {
      method: 'POST',
      body: JSON.stringify(rec),
    });
  }

  async executeRecurring(id: string): Promise<Transaction> {
    return this.fetchJson<Transaction>(`/api/recurring/${id}/execute`, { method: 'POST' });
  }

  // Family & Members
  async getFamily(): Promise<Family> {
    return this.fetchJson<Family>('/api/family');
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    return this.fetchJson<FamilyMember[]>('/api/family/members');
  }

  async inviteMember(member: { name: string; email: string; role: string; phone?: string }): Promise<FamilyMember> {
    return this.fetchJson<FamilyMember>('/api/family/members/invite', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async updateMemberRole(id: string, role: string): Promise<FamilyMember> {
    return this.fetchJson<FamilyMember>(`/api/family/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async removeMember(id: string): Promise<void> {
    await this.fetchJson(`/api/family/members/${id}`, { method: 'DELETE' });
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return this.fetchJson<NotificationItem[]>('/api/notifications');
  }

  async markNotificationsRead(): Promise<void> {
    await this.fetchJson('/api/notifications/mark-read', { method: 'POST' });
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.markNotificationsRead();
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.fetchJson<AuditLog[]>('/api/audit-logs');
  }

  // Admin
  async getAdminStats() {
    return this.fetchJson<any>('/api/admin/stats');
  }

  async getAdminUsers(): Promise<User[]> {
    return this.fetchJson<User[]>('/api/admin/users');
  }

  async updateUserStatus(id: string, status: string): Promise<User> {
    return this.fetchJson<User>(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Google Sheets Integration
  async getGoogleSheetConfig(): Promise<{ url: string; isConnected: boolean; lastSyncedAt: string | null }> {
    const res = await this.fetchJson<{ url: string; isConnected: boolean; lastSyncedAt: string | null }>('/api/google-sheet/config');
    return res;
  }

  async saveGoogleSheetUrl(url: string): Promise<{ url: string; isConnected: boolean; lastSyncedAt: string | null }> {
    return this.fetchJson<{ url: string; isConnected: boolean; lastSyncedAt: string | null }>('/api/google-sheet/config', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async syncExportGoogleSheet(): Promise<{ message: string; lastSyncedAt: string }> {
    return this.fetchJson<{ message: string; lastSyncedAt: string }>('/api/google-sheet/export-all', {
      method: 'POST',
    });
  }

  async syncImportGoogleSheet(): Promise<{ message: string; lastSyncedAt: string }> {
    return this.fetchJson<{ message: string; lastSyncedAt: string }>('/api/google-sheet/import-all', {
      method: 'POST',
    });
  }

  // Backup & Firebase Status
  async getBackupStatus(): Promise<{
    firebase: { isConnected: boolean; projectId: string; databaseId: string };
    autoBackup: {
      autoBackupEnabled: boolean;
      intervalMinutes: number;
      lastBackupTime: string;
      nextBackupTime: string;
      totalBackups: number;
      lastStatus: string;
    };
    googleSheetUrl: string;
    counts: { transactions: number; accounts: number; categories: number; budgets: number; goals: number; debts: number };
  }> {
    return this.fetchJson('/api/backup/status');
  }

  async triggerBackupNow(): Promise<{ message: string }> {
    return this.fetchJson('/api/backup/trigger-now', { method: 'POST' });
  }

  async resetAllData(): Promise<{ message: string }> {
    return this.fetchJson('/api/system/reset-all-data', { method: 'POST' });
  }
}

export const api = new ApiClient();
