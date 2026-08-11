export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'wallet' | 'credit' | 'savings' | 'investment';
export type CategoryType = 'expense' | 'income';
export type FamilyRole = 'owner' | 'admin' | 'member' | 'viewer';
export type SystemRole = 'user' | 'admin';
export type CurrencyCode = 'VND' | 'USD' | 'EUR';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DebtType = 'i_owe' | 'owed_to_me';
export type DebtStatus = 'active' | 'settled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: SystemRole;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  password?: string;
  hasPassword?: boolean;
}

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  currency: CurrencyCode;
  timezone: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: FamilyRole;
  avatar?: string;
  status: 'active' | 'pending';
  joinedDate: string;
}

export interface Account {
  id: string;
  familyId: string;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  bankName?: string;
  accountNumber?: string;
  currency: CurrencyCode;
  color: string;
  icon: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Category {
  id: string;
  familyId: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault?: boolean;
  isEnabled: boolean;
}

export interface TransactionAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export interface Transaction {
  id: string;
  familyId: string;
  accountId: string;
  targetAccountId?: string; // for transfer
  categoryId?: string;
  userId: string;
  memberId?: string; // member who executed
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  description: string;
  transactionDate: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  tags?: string[];
  attachments?: TransactionAttachment[];
  status: 'completed' | 'pending_sync';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Budget {
  id: string;
  familyId: string;
  categoryId: string;
  period: 'month' | 'quarter' | 'year';
  periodKey: string; // e.g. "2026-08"
  amount: number;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  familyId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  color: string;
  icon: string;
  monthlyTarget: number;
  status: 'in_progress' | 'completed';
  createdAt: string;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  accountId: string;
  type: 'add' | 'withdraw';
  amount: number;
  note?: string;
  date: string;
}

export interface Debt {
  id: string;
  familyId: string;
  type: DebtType;
  partyName: string;
  totalAmount: number;
  paidAmount: number;
  borrowDate: string;
  dueDate: string;
  note?: string;
  status: DebtStatus;
  createdAt: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  accountId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface RecurringTransaction {
  id: string;
  familyId: string;
  name: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  accountId: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextExecution: string;
  autoCreate: boolean;
  status: 'active' | 'paused';
}

export interface NotificationItem {
  id: string;
  familyId: string;
  userId?: string;
  type: 'budget_exceeded' | 'budget_warning' | 'debt_reminder' | 'recurring' | 'goal' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  familyId?: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalAssets: number; // Sum of all active account balances
  totalIncome: number; // Month total
  totalExpense: number; // Month total
  totalSavings: number; // Month net savings
  totalDebtToPay: number; // I owe active remaining
  totalOwedToMe: number; // Owed to me active remaining
  recentTransactions: Transaction[];
  budgetSummaries: {
    categoryId: string;
    categoryName: string;
    budgetAmount: number;
    usedAmount: number;
    percentage: number;
    status: 'normal' | 'warning' | 'exceeded';
  }[];
  monthlyCashflow: {
    month: string;
    income: number;
    expense: number;
  }[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    color: string;
    amount: number;
    percentage: number;
  }[];
}

export interface FamilyPermissions {
  familyView: boolean;
  familyUpdate: boolean;
  membersView: boolean;
  membersInvite: boolean;
  membersUpdate: boolean;
  membersDelete: boolean;
  transactionView: boolean;
  transactionCreate: boolean;
  transactionUpdate: boolean;
  transactionDelete: boolean;
  accountView: boolean;
  accountCreate: boolean;
  accountUpdate: boolean;
  accountDelete: boolean;
  categoryView: boolean;
  categoryCreate: boolean;
  categoryUpdate: boolean;
  categoryDelete: boolean;
  budgetView: boolean;
  budgetCreate: boolean;
  budgetUpdate: boolean;
  budgetDelete: boolean;
  reportView: boolean;
  debtView: boolean;
  debtCreate: boolean;
  debtUpdate: boolean;
  debtDelete: boolean;
  goalView: boolean;
  goalCreate: boolean;
  goalUpdate: boolean;
  goalDelete: boolean;
}
