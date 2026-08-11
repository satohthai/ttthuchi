import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
  DashboardSummary,
  DebtPayment,
  GoalTransaction,
} from "./src/types";

const app = express();
app.use(express.json());

// In-Memory Database Storage initialized with realistic Vietnamese demo seed
let users: User[] = [
  {
    id: "usr-1",
    name: "Admin",
    email: "admin@example.com",
    phone: "0901234567",
    role: "admin",
    status: "active",
    password: "thai1991",
    hasPassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-2",
    name: "Trần Thị B",
    email: "tranb@example.com",
    phone: "0912345678",
    role: "user",
    status: "active",
    password: "1",
    hasPassword: true,
    createdAt: "2026-01-02T00:00:00.000Z",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-3",
    name: "Nguyễn Văn C",
    email: "vanc@example.com",
    phone: "0923456789",
    role: "user",
    status: "active",
    password: "1",
    hasPassword: true,
    createdAt: "2026-01-10T00:00:00.000Z",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
];

let families: Family[] = [
  {
    id: "fam-1",
    name: "Gia đình Nguyễn",
    ownerId: "usr-1",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

let familyMembers: FamilyMember[] = [
  {
    id: "fm-1",
    familyId: "fam-1",
    userId: "usr-1",
    name: "Nguyễn Văn A (Ba)",
    email: "demo@example.com",
    phone: "0901234567",
    role: "owner",
    joinedDate: "2026-01-01",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    id: "fm-2",
    familyId: "fam-1",
    userId: "usr-2",
    name: "Trần Thị B (Mẹ)",
    email: "tranb@example.com",
    phone: "0912345678",
    role: "admin",
    joinedDate: "2026-01-02",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    id: "fm-3",
    familyId: "fam-1",
    userId: "usr-3",
    name: "Nguyễn Văn C (Con)",
    email: "vanc@example.com",
    phone: "0923456789",
    role: "member",
    joinedDate: "2026-01-10",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
  },
];

let accounts: Account[] = [
  {
    id: "acc-1",
    familyId: "fam-1",
    name: "Tiền mặt",
    type: "cash",
    balance: 5500000,
    initialBalance: 2000000,
    currency: "VND",
    color: "#10B981",
    icon: "Wallet",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "acc-2",
    familyId: "fam-1",
    name: "Vietcombank Main",
    type: "bank",
    balance: 48500000,
    initialBalance: 20000000,
    bankName: "Vietcombank",
    accountNumber: "1018899889",
    currency: "VND",
    color: "#2563EB",
    icon: "Building2",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "acc-3",
    familyId: "fam-1",
    name: "Ví MoMo",
    type: "wallet",
    balance: 3200000,
    initialBalance: 1000000,
    bankName: "MoMo",
    accountNumber: "0901234567",
    currency: "VND",
    color: "#EC4899",
    icon: "Smartphone",
    status: "active",
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "acc-4",
    familyId: "fam-1",
    name: "Sổ Tiết Kiệm VCB",
    type: "savings",
    balance: 150000000,
    initialBalance: 150000000,
    bankName: "Vietcombank",
    accountNumber: "STK-882910",
    currency: "VND",
    color: "#8B5CF6",
    icon: "PiggyBank",
    status: "active",
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];

let categories: Category[] = [
  // Expense
  { id: "cat-1", familyId: "fam-1", name: "Ăn uống", type: "expense", icon: "Utensils", color: "#EF4444", isDefault: true, isEnabled: true },
  { id: "cat-2", familyId: "fam-1", name: "Nhà ở & Điện nước", type: "expense", icon: "Home", color: "#F59E0B", isDefault: true, isEnabled: true },
  { id: "cat-3", familyId: "fam-1", name: "Đi lại & Xăng xe", type: "expense", icon: "Car", color: "#3B82F6", isDefault: true, isEnabled: true },
  { id: "cat-4", familyId: "fam-1", name: "Mua sắm", type: "expense", icon: "ShoppingBag", color: "#EC4899", isDefault: true, isEnabled: true },
  { id: "cat-5", familyId: "fam-1", name: "Giáo dục & Học phí", type: "expense", icon: "GraduationCap", color: "#8B5CF6", isDefault: true, isEnabled: true },
  { id: "cat-6", familyId: "fam-1", name: "Y tế & Sức khỏe", type: "expense", icon: "HeartPulse", color: "#10B981", isDefault: true, isEnabled: true },
  { id: "cat-7", familyId: "fam-1", name: "Giải trí & Du lịch", type: "expense", icon: "Tv", color: "#06B6D4", isDefault: true, isEnabled: true },
  { id: "cat-8", familyId: "fam-1", name: "Chi khác", type: "expense", icon: "MoreHorizontal", color: "#6B7280", isDefault: true, isEnabled: true },
  // Income
  { id: "cat-10", familyId: "fam-1", name: "Lương hàng tháng", type: "income", icon: "Briefcase", color: "#10B981", isDefault: true, isEnabled: true },
  { id: "cat-11", familyId: "fam-1", name: "Thưởng & Doanh số", type: "income", icon: "Award", color: "#F59E0B", isDefault: true, isEnabled: true },
  { id: "cat-12", familyId: "fam-1", name: "Kinh doanh & Đầu tư", type: "income", icon: "TrendingUp", color: "#2563EB", isDefault: true, isEnabled: true },
  { id: "cat-13", familyId: "fam-1", name: "Thu khác", type: "income", icon: "DollarSign", color: "#8B5CF6", isDefault: true, isEnabled: true },
];

let transactions: Transaction[] = [
  {
    id: "tx-1",
    familyId: "fam-1",
    accountId: "acc-2",
    categoryId: "cat-10",
    userId: "usr-1",
    memberId: "fm-1",
    type: "income",
    amount: 38000000,
    currency: "VND",
    description: "Nhận lương tháng 8/2026",
    transactionDate: "2026-08-01",
    time: "08:30",
    note: "Chuyển khoản lương công ty",
    tags: ["#luong", "#cong_viec"],
    status: "completed",
    createdAt: "2026-08-01T08:30:00.000Z",
    updatedAt: "2026-08-01T08:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-2",
    familyId: "fam-1",
    accountId: "acc-2",
    categoryId: "cat-10",
    userId: "usr-2",
    memberId: "fm-2",
    type: "income",
    amount: 22000000,
    currency: "VND",
    description: "Nhận lương tháng 8/2026 (Mẹ)",
    transactionDate: "2026-08-02",
    time: "09:15",
    note: "Lương giảng dạy",
    tags: ["#luong"],
    status: "completed",
    createdAt: "2026-08-02T09:15:00.000Z",
    updatedAt: "2026-08-02T09:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-3",
    familyId: "fam-1",
    accountId: "acc-2",
    categoryId: "cat-2",
    userId: "usr-1",
    memberId: "fm-1",
    type: "expense",
    amount: 6500000,
    currency: "VND",
    description: "Thanh toán tiền nhà tháng 8",
    transactionDate: "2026-08-03",
    time: "10:00",
    note: "Chuyển khoản chủ nhà",
    tags: ["#nhao"],
    status: "completed",
    createdAt: "2026-08-03T10:00:00.000Z",
    updatedAt: "2026-08-03T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-4",
    familyId: "fam-1",
    accountId: "acc-3",
    categoryId: "cat-2",
    userId: "usr-2",
    memberId: "fm-2",
    type: "expense",
    amount: 1850000,
    currency: "VND",
    description: "Tiền điện & nước tháng 7",
    transactionDate: "2026-08-04",
    time: "14:20",
    note: "Thanh toán qua MoMo",
    tags: ["#diennuoc"],
    status: "completed",
    createdAt: "2026-08-04T14:20:00.000Z",
    updatedAt: "2026-08-04T14:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-5",
    familyId: "fam-1",
    accountId: "acc-1",
    categoryId: "cat-1",
    userId: "usr-2",
    memberId: "fm-2",
    type: "expense",
    amount: 4500000,
    currency: "VND",
    description: "Đi chợ & siêu thị tuần 1",
    transactionDate: "2026-08-05",
    time: "11:30",
    note: "Mua thực phẩm gia đình",
    tags: ["#an_uong"],
    status: "completed",
    createdAt: "2026-08-05T11:30:00.000Z",
    updatedAt: "2026-08-05T11:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-6",
    familyId: "fam-1",
    accountId: "acc-3",
    categoryId: "cat-1",
    userId: "usr-1",
    memberId: "fm-1",
    type: "expense",
    amount: 1250000,
    currency: "VND",
    description: "Ăn tối nhà hàng gia đình cuối tuần",
    transactionDate: "2026-08-07",
    time: "19:45",
    note: "Kỷ niệm ngày cưới",
    tags: ["#an_uong", "#gia_dinh"],
    status: "completed",
    createdAt: "2026-08-07T19:45:00.000Z",
    updatedAt: "2026-08-07T19:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-7",
    familyId: "fam-1",
    accountId: "acc-1",
    categoryId: "cat-3",
    userId: "usr-1",
    memberId: "fm-1",
    type: "expense",
    amount: 800000,
    currency: "VND",
    description: "Đổ xăng ô tô & xe máy",
    transactionDate: "2026-08-08",
    time: "07:50",
    tags: ["#di_lai"],
    status: "completed",
    createdAt: "2026-08-08T07:50:00.000Z",
    updatedAt: "2026-08-08T07:50:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-8",
    familyId: "fam-1",
    accountId: "acc-2",
    categoryId: "cat-5",
    userId: "usr-2",
    memberId: "fm-2",
    type: "expense",
    amount: 3200000,
    currency: "VND",
    description: "Học phí học kỳ mới cho con",
    transactionDate: "2026-08-09",
    time: "16:00",
    tags: ["#hieu_hoc"],
    status: "completed",
    createdAt: "2026-08-09T16:00:00.000Z",
    updatedAt: "2026-08-09T16:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "tx-9",
    familyId: "fam-1",
    accountId: "acc-2",
    targetAccountId: "acc-1",
    userId: "usr-1",
    memberId: "fm-1",
    type: "transfer",
    amount: 5000000,
    currency: "VND",
    description: "Rút tiền ATM ngân hàng ra ví tiền mặt",
    transactionDate: "2026-08-10",
    time: "10:15",
    status: "completed",
    createdAt: "2026-08-10T10:15:00.000Z",
    updatedAt: "2026-08-10T10:15:00.000Z",
    deletedAt: null,
  },
];

let budgets: Budget[] = [
  { id: "bud-1", familyId: "fam-1", categoryId: "cat-1", period: "month", periodKey: "2026-08", amount: 8000000, createdAt: "2026-08-01" },
  { id: "bud-2", familyId: "fam-1", categoryId: "cat-2", period: "month", periodKey: "2026-08", amount: 9000000, createdAt: "2026-08-01" },
  { id: "bud-3", familyId: "fam-1", categoryId: "cat-3", period: "month", periodKey: "2026-08", amount: 3000000, createdAt: "2026-08-01" },
  { id: "bud-4", familyId: "fam-1", categoryId: "cat-4", period: "month", periodKey: "2026-08", amount: 5000000, createdAt: "2026-08-01" },
];

let savingsGoals: SavingsGoal[] = [
  {
    id: "goal-1",
    familyId: "fam-1",
    name: "Đổi Xe Máy Mới",
    targetAmount: 60000000,
    currentAmount: 35000000,
    deadline: "2026-12-31",
    color: "#2563EB",
    icon: "Bike",
    monthlyTarget: 5000000,
    status: "in_progress",
    createdAt: "2026-01-15",
  },
  {
    id: "goal-2",
    familyId: "fam-1",
    name: "Quỹ Du Lịch Gia Đình",
    targetAmount: 40000000,
    currentAmount: 28000000,
    deadline: "2026-10-30",
    color: "#10B981",
    icon: "Plane",
    monthlyTarget: 4000000,
    status: "in_progress",
    createdAt: "2026-02-01",
  },
];

let debts: Debt[] = [
  {
    id: "debt-1",
    familyId: "fam-1",
    type: "i_owe",
    partyName: "Ngân hàng Shinhan (Vay trả góp)",
    totalAmount: 50000000,
    paidAmount: 30000000,
    borrowDate: "2025-06-01",
    dueDate: "2026-12-01",
    note: "Trả góp 2.500.000 / tháng",
    status: "active",
    createdAt: "2025-06-01",
  },
  {
    id: "debt-2",
    familyId: "fam-1",
    type: "owed_to_me",
    partyName: "Anh Nam (Đồng nghiệp)",
    totalAmount: 10000000,
    paidAmount: 4000000,
    borrowDate: "2026-05-10",
    dueDate: "2026-09-01",
    note: "Vay mượn làm ăn ngắn hạn",
    status: "active",
    createdAt: "2026-05-10",
  },
];

let recurringTransactions: RecurringTransaction[] = [
  {
    id: "rec-1",
    familyId: "fam-1",
    name: "Tiền Thuê Nhà Hàng Tháng",
    amount: 6500000,
    type: "expense",
    categoryId: "cat-2",
    accountId: "acc-2",
    frequency: "monthly",
    startDate: "2026-01-01",
    nextExecution: "2026-09-01",
    autoCreate: true,
    status: "active",
  },
  {
    id: "rec-2",
    familyId: "fam-1",
    name: "Gói Mạng Internet FPT",
    amount: 320000,
    type: "expense",
    categoryId: "cat-2",
    accountId: "acc-3",
    frequency: "monthly",
    startDate: "2026-01-05",
    nextExecution: "2026-09-05",
    autoCreate: true,
    status: "active",
  },
];

let notifications: NotificationItem[] = [
  {
    id: "notif-1",
    familyId: "fam-1",
    userId: "usr-1",
    type: "budget_warning",
    title: "Cảnh báo Ngân sách Ăn uống",
    message: "Bạn đã tiêu 5.750.000 / 8.000.000 ₫ (71.8% ngân sách ăn uống tháng 8).",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    familyId: "fam-1",
    userId: "usr-1",
    type: "debt_reminder",
    title: "Nhắc nhở Khoản nợ",
    message: "Khoản cho Anh Nam vay còn 6.000.000 ₫ sắp đến hạn (01/09/2026).",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

let auditLogs: AuditLog[] = [
  {
    id: "log-1",
    familyId: "fam-1",
    userId: "usr-1",
    userName: "Nguyễn Văn A",
    action: "CREATE_TRANSACTION",
    entity: "Transaction",
    entityId: "tx-1",
    newValue: "Nhận lương tháng 8/2026 (38.000.000 ₫)",
    createdAt: "2026-08-01T08:30:00.000Z",
  },
  {
    id: "log-2",
    familyId: "fam-1",
    userId: "usr-2",
    userName: "Trần Thị B",
    action: "CREATE_TRANSACTION",
    entity: "Transaction",
    entityId: "tx-5",
    newValue: "Đi chợ & siêu thị tuần 1 (4.500.000 ₫)",
    createdAt: "2026-08-05T11:30:00.000Z",
  },
];

// Helper: Current Logged In User
let currentUserId = "usr-1";

// Helper Functions for Balance recalculation & Audit log
let googleSheetConfig = {
  url: "https://docs.google.com/spreadsheets/d/1mx3RCdD66a0iRFsAgZ62GtK3vTwbQIpO4cRKGzLTWWY/edit?usp=sharing",
  isConnected: true,
  lastSyncedAt: new Date().toISOString(),
};

async function pushToGoogleSheet(action: string, entity: string, data: any) {
  if (!googleSheetConfig.url || !googleSheetConfig.isConnected) return;
  try {
    await fetch(googleSheetConfig.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, entity, data }),
    });
  } catch (err) {
    console.error("Google Sheet auto-push error:", err);
  }
}

function addAuditLog(action: string, entity: string, entityId?: string, oldValue?: string, newValue?: string) {
  const user = users.find((u) => u.id === currentUserId);
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    familyId: "fam-1",
    userId: currentUserId,
    userName: user ? user.name : "Hệ thống",
    action,
    entity,
    entityId,
    oldValue,
    newValue,
    createdAt: new Date().toISOString(),
  };
  auditLogs.unshift(log);
}

function adjustAccountBalance(accountId: string, amountChange: number) {
  const account = accounts.find((a) => a.id === accountId);
  if (account) {
    account.balance += amountChange;
  }
}

function applyTransactionBalance(tx: Transaction) {
  if (tx.type === "expense") {
    adjustAccountBalance(tx.accountId, -tx.amount);
  } else if (tx.type === "income") {
    adjustAccountBalance(tx.accountId, tx.amount);
  } else if (tx.type === "transfer" && tx.targetAccountId) {
    adjustAccountBalance(tx.accountId, -tx.amount);
    adjustAccountBalance(tx.targetAccountId, tx.amount);
  }
}

function rollbackTransactionBalance(tx: Transaction) {
  if (tx.type === "expense") {
    adjustAccountBalance(tx.accountId, tx.amount);
  } else if (tx.type === "income") {
    adjustAccountBalance(tx.accountId, -tx.amount);
  } else if (tx.type === "transfer" && tx.targetAccountId) {
    adjustAccountBalance(tx.accountId, tx.amount);
    adjustAccountBalance(tx.targetAccountId, -tx.amount);
  }
}

// Check budget exceeded / warning
function checkBudgetAlerts(familyId: string, categoryId: string) {
  const currentMonthKey = "2026-08";
  const budget = budgets.find((b) => b.familyId === familyId && b.categoryId === categoryId && b.periodKey === currentMonthKey);
  if (!budget) return;

  const categoryTxs = transactions.filter(
    (t) => t.familyId === familyId && t.categoryId === categoryId && t.type === "expense" && !t.deletedAt && t.transactionDate.startsWith(currentMonthKey)
  );
  const totalSpent = categoryTxs.reduce((sum, t) => sum + t.amount, 0);
  const cat = categories.find((c) => c.id === categoryId);
  const percent = (totalSpent / budget.amount) * 100;

  if (percent >= 100) {
    notifications.unshift({
      id: `notif-${Date.now()}`,
      familyId,
      userId: currentUserId,
      type: "budget_exceeded",
      title: `Vượt ngân sách: ${cat?.name || "Danh mục"}`,
      message: `Bạn đã tiêu ${totalSpent.toLocaleString("vi-VN")} / ${budget.amount.toLocaleString("vi-VN")} ₫ (${percent.toFixed(1)}%).`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  } else if (percent >= 80) {
    notifications.unshift({
      id: `notif-${Date.now()}`,
      familyId,
      userId: currentUserId,
      type: "budget_warning",
      title: `Cảnh báo ngân sách: ${cat?.name || "Danh mục"}`,
      message: `Bạn đã sử dụng ${percent.toFixed(1)}% ngân sách cho ${cat?.name || "Danh mục"}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }
}

// REST API ROUTES

// Auth Routes
app.get("/api/auth/users", (req, res) => {
  const userList = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    hasPassword: u.hasPassword !== false,
  }));
  res.json({ success: true, data: userList });
});

app.get("/api/auth/me", (req, res) => {
  const user = users.find((u) => u.id === currentUserId);
  const family = families.find((f) => f.id === "fam-1");
  const member = familyMembers.find((fm) => fm.userId === currentUserId);
  res.json({
    success: true,
    data: {
      user,
      family,
      memberRole: member ? member.role : "owner",
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { userId, email, name, password } = req.body;
  let user: User | undefined;

  if (userId) {
    user = users.find((u) => u.id === userId);
  } else if (email) {
    user = users.find((u) => u.email === email);
  } else if (name) {
    user = users.find((u) => u.name === name);
  }

  if (!user) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Tài khoản người dùng không tồn tại." },
    });
  }

  // Password check: If user has set hasPassword = false or empty password, allow direct login
  const requiresPassword = user.hasPassword !== false && !!user.password;
  if (requiresPassword) {
    if (password !== user.password) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Mật khẩu không chính xác." },
      });
    }
  }

  currentUserId = user.id;
  user.lastLogin = new Date().toISOString();
  addAuditLog("LOGIN", "User", user.id, undefined, `${user.name} đăng nhập`);
  res.json({
    success: true,
    data: { user, token: "mock-jwt-token-xyz" },
    message: `Đăng nhập thành công với tên ${user.name}!`,
  });
});

app.post("/api/auth/password", (req, res) => {
  const { password, action } = req.body; // action: 'update' | 'clear'
  const user = users.find((u) => u.id === currentUserId);
  if (!user) {
    return res.status(404).json({ success: false, error: { message: "Không tìm thấy người dùng." } });
  }

  if (action === 'clear') {
    user.password = "";
    user.hasPassword = false;
    addAuditLog("CLEAR_PASSWORD", "User", user.id, undefined, "Đã xóa mật khẩu");
    return res.json({ success: true, message: "Đã xóa mật khẩu thành công! Giờ đây bạn có thể đăng nhập trực tiếp." });
  } else {
    user.password = password || "1";
    user.hasPassword = true;
    addAuditLog("UPDATE_PASSWORD", "User", user.id, undefined, "Đã cập nhật mật khẩu");
    return res.json({ success: true, message: "Cập nhật mật khẩu thành công!" });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Vui lòng nhập đầy đủ thông tin bắt buộc." },
    });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: { code: "EMAIL_EXISTS", message: "Email này đã được đăng ký." },
    });
  }
  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || "",
    role: "user",
    status: "active",
    createdAt: new Date().toISOString(),
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  };
  users.push(newUser);
  currentUserId = newUser.id;

  // Auto-create Family
  const newFam: Family = {
    id: `fam-${Date.now()}`,
    name: `Gia đình ${name}`,
    ownerId: newUser.id,
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  families.push(newFam);

  familyMembers.push({
    id: `fm-${Date.now()}`,
    familyId: newFam.id,
    userId: newUser.id,
    name,
    email,
    phone: phone || "",
    role: "owner",
    joinedDate: new Date().toISOString().split("T")[0],
    status: "active",
  });

  addAuditLog("REGISTER", "User", newUser.id, undefined, `Đăng ký tài khoản ${name}`);

  res.json({
    success: true,
    data: { user: newUser, family: newFam },
    message: "Đăng ký tài khoản thành công.",
  });
});

// Dashboard Summary API
app.get("/api/dashboard", (req, res) => {
  const activeAccounts = accounts.filter((a) => a.familyId === "fam-1" && a.status === "active");
  const totalAssets = activeAccounts.reduce((sum, a) => sum + a.balance, 0);

  const monthKey = "2026-08";
  const activeTxs = transactions.filter((t) => t.familyId === "fam-1" && !t.deletedAt && t.transactionDate.startsWith(monthKey));

  const totalIncome = activeTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = activeTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  const activeDebts = debts.filter((d) => d.familyId === "fam-1" && d.status === "active");
  const totalDebtToPay = activeDebts.filter((d) => d.type === "i_owe").reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const totalOwedToMe = activeDebts.filter((d) => d.type === "owed_to_me").reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

  // Recent 8 transactions
  const recentTransactions = [...transactions]
    .filter((t) => t.familyId === "fam-1" && !t.deletedAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // Budget summaries for this month
  const currentBudgets = budgets.filter((b) => b.familyId === "fam-1" && b.periodKey === monthKey);
  const budgetSummaries = currentBudgets.map((b) => {
    const cat = categories.find((c) => c.id === b.categoryId);
    const spent = activeTxs.filter((t) => t.categoryId === b.categoryId && t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const percentage = Math.min((spent / b.amount) * 100, 150);
    let status: "normal" | "warning" | "exceeded" = "normal";
    if (percentage >= 100) status = "exceeded";
    else if (percentage >= 80) status = "warning";

    return {
      categoryId: b.categoryId,
      categoryName: cat?.name || "Danh mục",
      budgetAmount: b.amount,
      usedAmount: spent,
      percentage: Number(percentage.toFixed(1)),
      status,
    };
  });

  // Monthly Cashflow data for chart
  const months = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];
  const monthlyCashflow = months.map((m) => {
    const mTxs = transactions.filter((t) => t.familyId === "fam-1" && !t.deletedAt && t.transactionDate.startsWith(m));
    const inc = mTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0) || (m === "2026-07" ? 55000000 : m === "2026-06" ? 52000000 : 50000000);
    const exp = mTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0) || (m === "2026-07" ? 31000000 : m === "2026-06" ? 28000000 : 27000000);
    return {
      month: `Thg ${m.split("-")[1]}`,
      income: inc,
      expense: exp,
    };
  });

  // Category Expense Breakdown
  const catExpenseMap: Record<string, number> = {};
  activeTxs
    .filter((t) => t.type === "expense" && t.categoryId)
    .forEach((t) => {
      catExpenseMap[t.categoryId!] = (catExpenseMap[t.categoryId!] || 0) + t.amount;
    });

  const categoryBreakdown = Object.keys(catExpenseMap).map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    const amt = catExpenseMap[catId];
    return {
      categoryId: catId,
      categoryName: cat?.name || "Khác",
      color: cat?.color || "#9CA3AF",
      amount: amt,
      percentage: totalExpense > 0 ? Number(((amt / totalExpense) * 100).toFixed(1)) : 0,
    };
  });

  const summary: DashboardSummary = {
    totalAssets,
    totalIncome,
    totalExpense,
    totalSavings,
    totalDebtToPay,
    totalOwedToMe,
    recentTransactions,
    budgetSummaries,
    monthlyCashflow,
    categoryBreakdown,
  };

  res.json({ success: true, data: summary });
});

// Transactions CRUD API
app.get("/api/transactions", (req, res) => {
  const { search, type, categoryId, accountId, memberId, startDate, endDate, isTrash } = req.query;

  let list = transactions.filter((t) => t.familyId === "fam-1");

  if (isTrash === "true") {
    list = list.filter((t) => t.deletedAt !== null && t.deletedAt !== undefined);
  } else {
    list = list.filter((t) => !t.deletedAt);
  }

  if (type) list = list.filter((t) => t.type === type);
  if (categoryId) list = list.filter((t) => t.categoryId === categoryId);
  if (accountId) list = list.filter((t) => t.accountId === accountId || t.targetAccountId === accountId);
  if (memberId) list = list.filter((t) => t.memberId === memberId);
  if (startDate) list = list.filter((t) => t.transactionDate >= (startDate as string));
  if (endDate) list = list.filter((t) => t.transactionDate <= (endDate as string));
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter((t) => t.description.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)) || (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q))));
  }

  list.sort((a, b) => new Date(b.transactionDate + "T" + (b.time || "00:00")).getTime() - new Date(a.transactionDate + "T" + (a.time || "00:00")).getTime());

  res.json({ success: true, data: list });
});

app.post("/api/transactions", (req, res) => {
  const { type, amount, categoryId, accountId, targetAccountId, memberId, description, transactionDate, time, note, tags, attachments } = req.body;

  if (!type || !amount || amount <= 0 || !accountId || !transactionDate) {
    return res.status(422).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Số tiền, ví, loại và ngày giao dịch là bắt buộc." },
    });
  }

  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    familyId: "fam-1",
    accountId,
    targetAccountId: type === "transfer" ? targetAccountId : undefined,
    categoryId: type === "transfer" ? undefined : categoryId,
    userId: currentUserId,
    memberId: memberId || familyMembers.find((fm) => fm.userId === currentUserId)?.id,
    type,
    amount: Number(amount),
    currency: "VND",
    description: description || (type === "transfer" ? "Chuyển tiền nội bộ" : "Giao dịch mới"),
    transactionDate,
    time: time || new Date().toTimeString().slice(0, 5),
    note,
    tags: tags || [],
    attachments: attachments || [],
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  // ATOMIC DATABASE TRANSACTION EFFECT
  applyTransactionBalance(newTx);
  transactions.unshift(newTx);

  if (type === "expense" && categoryId) {
    checkBudgetAlerts("fam-1", categoryId);
  }

  addAuditLog("CREATE_TRANSACTION", "Transaction", newTx.id, undefined, `${newTx.description} (${newTx.amount.toLocaleString("vi-VN")} ₫)`);

  res.json({
    success: true,
    data: newTx,
    message: "Đã thêm giao dịch thành công.",
  });
});

app.patch("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const txIndex = transactions.findIndex((t) => t.id === id);
  if (txIndex === -1) {
    return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Giao dịch không tồn tại." } });
  }

  const oldTx = transactions[txIndex];

  // 1. Rollback old balance effect
  rollbackTransactionBalance(oldTx);

  // 2. Apply updates
  const updatedTx: Transaction = {
    ...oldTx,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  // 3. Apply new balance effect
  applyTransactionBalance(updatedTx);
  transactions[txIndex] = updatedTx;

  addAuditLog("UPDATE_TRANSACTION", "Transaction", id, oldTx.description, updatedTx.description);

  res.json({
    success: true,
    data: updatedTx,
    message: "Cập nhật giao dịch thành công.",
  });
});

app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const tx = transactions.find((t) => t.id === id);
  if (!tx) {
    return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Giao dịch không tồn tại." } });
  }

  if (tx.deletedAt) {
    // Permanent delete
    transactions = transactions.filter((t) => t.id !== id);
    addAuditLog("PERMANENT_DELETE_TRANSACTION", "Transaction", id, tx.description);
    return res.json({ success: true, message: "Đã xóa vĩnh viễn giao dịch." });
  }

  // Soft Delete with Balance Rollback
  rollbackTransactionBalance(tx);
  tx.deletedAt = new Date().toISOString();

  addAuditLog("DELETE_TRANSACTION", "Transaction", id, tx.description, "Soft Deleted");

  res.json({
    success: true,
    data: tx,
    message: "Đã chuyển giao dịch vào Thùng rác.",
  });
});

app.post("/api/transactions/:id/restore", (req, res) => {
  const { id } = req.params;
  const tx = transactions.find((t) => t.id === id);
  if (!tx || !tx.deletedAt) {
    return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Giao dịch không nằm trong thùng rác." } });
  }

  // Restore balance effect
  applyTransactionBalance(tx);
  tx.deletedAt = null;

  addAuditLog("RESTORE_TRANSACTION", "Transaction", id, undefined, tx.description);

  res.json({ success: true, data: tx, message: "Đã khôi phục giao dịch." });
});

// Accounts API
app.get("/api/accounts", (req, res) => {
  res.json({ success: true, data: accounts.filter((a) => a.familyId === "fam-1") });
});

app.post("/api/accounts", (req, res) => {
  const { name, type, balance, bankName, accountNumber, color, icon } = req.body;
  if (!name || !type) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Tên tài khoản và loại là bắt buộc." } });
  }

  const initial = Number(balance || 0);
  const newAccount: Account = {
    id: `acc-${Date.now()}`,
    familyId: "fam-1",
    name,
    type,
    balance: initial,
    initialBalance: initial,
    bankName,
    accountNumber,
    currency: "VND",
    color: color || "#2563EB",
    icon: icon || "Wallet",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  addAuditLog("CREATE_ACCOUNT", "Account", newAccount.id, undefined, newAccount.name);

  res.json({ success: true, data: newAccount, message: "Tạo ví/tài khoản thành công." });
});

app.patch("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const acc = accounts.find((a) => a.id === id);
  if (!acc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Không tìm thấy tài khoản." } });

  Object.assign(acc, req.body);
  addAuditLog("UPDATE_ACCOUNT", "Account", id, undefined, acc.name);

  res.json({ success: true, data: acc, message: "Cập nhật tài khoản thành công." });
});

app.delete("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const acc = accounts.find((a) => a.id === id);
  if (!acc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Không tìm thấy tài khoản." } });

  // Check if transactions exist
  const count = transactions.filter((t) => (t.accountId === id || t.targetAccountId === id) && !t.deletedAt).length;
  if (count > 0) {
    acc.status = "archived";
    addAuditLog("ARCHIVE_ACCOUNT", "Account", id, acc.name);
    return res.json({ success: true, message: `Tài khoản có ${count} giao dịch. Đã lưu trữ thay vì xóa.` });
  }

  accounts = accounts.filter((a) => a.id !== id);
  addAuditLog("DELETE_ACCOUNT", "Account", id, acc.name);
  res.json({ success: true, message: "Đã xóa tài khoản thành công." });
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json({ success: true, data: categories.filter((c) => c.familyId === "fam-1") });
});

app.post("/api/categories", (req, res) => {
  const { name, type, icon, color } = req.body;
  if (!name || !type) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Tên và loại danh mục bắt buộc." } });
  }

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    familyId: "fam-1",
    name,
    type,
    icon: icon || "Tag",
    color: color || "#3B82F6",
    isEnabled: true,
  };

  categories.push(newCat);
  addAuditLog("CREATE_CATEGORY", "Category", newCat.id, undefined, newCat.name);
  res.json({ success: true, data: newCat, message: "Thêm danh mục mới thành công." });
});

app.patch("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const cat = categories.find((c) => c.id === id);
  if (!cat) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Danh mục không tồn tại." } });

  Object.assign(cat, req.body);
  addAuditLog("UPDATE_CATEGORY", "Category", id, undefined, cat.name);
  res.json({ success: true, data: cat, message: "Cập nhật danh mục thành công." });
});

// Budgets API
app.get("/api/budgets", (req, res) => {
  res.json({ success: true, data: budgets.filter((b) => b.familyId === "fam-1") });
});

app.post("/api/budgets", (req, res) => {
  const { categoryId, periodKey, amount } = req.body;
  if (!categoryId || !amount) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Danh mục và số tiền bắt buộc." } });
  }

  const existing = budgets.find((b) => b.familyId === "fam-1" && b.categoryId === categoryId && b.periodKey === (periodKey || "2026-08"));
  if (existing) {
    existing.amount = Number(amount);
    addAuditLog("UPDATE_BUDGET", "Budget", existing.id, undefined, `${amount} ₫`);
    return res.json({ success: true, data: existing, message: "Cập nhật ngân sách thành công." });
  }

  const newBudget: Budget = {
    id: `bud-${Date.now()}`,
    familyId: "fam-1",
    categoryId,
    period: "month",
    periodKey: periodKey || "2026-08",
    amount: Number(amount),
    createdAt: new Date().toISOString(),
  };

  budgets.push(newBudget);
  addAuditLog("CREATE_BUDGET", "Budget", newBudget.id, undefined, `${amount} ₫`);
  res.json({ success: true, data: newBudget, message: "Thiết lập ngân sách thành công." });
});

app.delete("/api/budgets/:id", (req, res) => {
  const { id } = req.params;
  budgets = budgets.filter((b) => b.id !== id);
  res.json({ success: true, message: "Đã xóa ngân sách." });
});

// Savings Goals API
app.get("/api/goals", (req, res) => {
  res.json({ success: true, data: savingsGoals.filter((g) => g.familyId === "fam-1") });
});

app.post("/api/goals", (req, res) => {
  const { name, targetAmount, currentAmount, deadline, color, icon } = req.body;
  if (!name || !targetAmount) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Tên mục tiêu và số tiền cần đạt bắt buộc." } });
  }

  const newGoal: SavingsGoal = {
    id: `goal-${Date.now()}`,
    familyId: "fam-1",
    name,
    targetAmount: Number(targetAmount),
    currentAmount: Number(currentAmount || 0),
    deadline: deadline || "2026-12-31",
    color: color || "#2563EB",
    icon: icon || "Target",
    monthlyTarget: Math.round((Number(targetAmount) - Number(currentAmount || 0)) / 5),
    status: "in_progress",
    createdAt: new Date().toISOString(),
  };

  savingsGoals.push(newGoal);
  addAuditLog("CREATE_GOAL", "SavingsGoal", newGoal.id, undefined, newGoal.name);
  res.json({ success: true, data: newGoal, message: "Tạo mục tiêu tiết kiệm thành công." });
});

app.post("/api/goals/:id/contribute", (req, res) => {
  const { id } = req.params;
  const { amount, accountId, type } = req.body; // type: 'add' | 'withdraw'
  const goal = savingsGoals.find((g) => g.id === id);
  if (!goal) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Mục tiêu không tồn tại." } });

  const num = Number(amount);
  if (type === "withdraw") {
    goal.currentAmount = Math.max(0, goal.currentAmount - num);
    if (accountId) adjustAccountBalance(accountId, num);
  } else {
    goal.currentAmount += num;
    if (accountId) adjustAccountBalance(accountId, -num);
  }

  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = "completed";
    notifications.unshift({
      id: `notif-${Date.now()}`,
      familyId: "fam-1",
      userId: currentUserId,
      type: "goal",
      title: "🎉 Đạt mục tiêu tiết kiệm!",
      message: `Chúc mừng! Bạn đã hoàn thành mục tiêu "${goal.name}".`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  addAuditLog("GOAL_TRANSACTION", "SavingsGoal", id, undefined, `${type === "withdraw" ? "Rút" : "Nộp"} ${num.toLocaleString("vi-VN")} ₫`);
  res.json({ success: true, data: goal, message: "Cập nhật quỹ tiết kiệm thành công." });
});

// Debts API
app.get("/api/debts", (req, res) => {
  res.json({ success: true, data: debts.filter((d) => d.familyId === "fam-1") });
});

app.post("/api/debts", (req, res) => {
  const { type, partyName, totalAmount, paidAmount, borrowDate, dueDate, note } = req.body;
  if (!partyName || !totalAmount) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Đối tác và tổng số tiền bắt buộc." } });
  }

  const newDebt: Debt = {
    id: `debt-${Date.now()}`,
    familyId: "fam-1",
    type: type || "i_owe",
    partyName,
    totalAmount: Number(totalAmount),
    paidAmount: Number(paidAmount || 0),
    borrowDate: borrowDate || new Date().toISOString().split("T")[0],
    dueDate: dueDate || "2026-12-31",
    note,
    status: Number(paidAmount || 0) >= Number(totalAmount) ? "settled" : "active",
    createdAt: new Date().toISOString(),
  };

  debts.push(newDebt);
  addAuditLog("CREATE_DEBT", "Debt", newDebt.id, undefined, newDebt.partyName);
  res.json({ success: true, data: newDebt, message: "Thêm khoản nợ/cho vay thành công." });
});

app.post("/api/debts/:id/pay", (req, res) => {
  const { id } = req.params;
  const { amount, accountId } = req.body;
  const debt = debts.find((d) => d.id === id);
  if (!debt) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Không tìm thấy khoản nợ." } });

  const pAmount = Number(amount);
  debt.paidAmount += pAmount;
  if (debt.paidAmount >= debt.totalAmount) {
    debt.status = "settled";
  }

  // Adjust balance
  if (accountId) {
    if (debt.type === "i_owe") {
      adjustAccountBalance(accountId, -pAmount);
    } else {
      adjustAccountBalance(accountId, pAmount);
    }
  }

  addAuditLog("PAY_DEBT", "Debt", id, undefined, `Thanh toán ${pAmount.toLocaleString("vi-VN")} ₫`);
  res.json({ success: true, data: debt, message: "Ghi nhận trả nợ/thu nợ thành công." });
});

// Recurring Transactions API
app.get("/api/recurring", (req, res) => {
  res.json({ success: true, data: recurringTransactions.filter((r) => r.familyId === "fam-1") });
});

app.post("/api/recurring", (req, res) => {
  const { name, amount, type, categoryId, accountId, frequency, startDate, autoCreate } = req.body;
  const newRec: RecurringTransaction = {
    id: `rec-${Date.now()}`,
    familyId: "fam-1",
    name,
    amount: Number(amount),
    type: type || "expense",
    categoryId,
    accountId,
    frequency: frequency || "monthly",
    startDate: startDate || new Date().toISOString().split("T")[0],
    nextExecution: startDate || new Date().toISOString().split("T")[0],
    autoCreate: autoCreate !== false,
    status: "active",
  };

  recurringTransactions.push(newRec);
  res.json({ success: true, data: newRec, message: "Tạo giao dịch định kỳ thành công." });
});

app.post("/api/recurring/:id/execute", (req, res) => {
  const { id } = req.params;
  const rec = recurringTransactions.find((r) => r.id === id);
  if (!rec) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Không tìm thấy giao dịch định kỳ." } });

  // Create real transaction
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    familyId: rec.familyId,
    accountId: rec.accountId,
    categoryId: rec.categoryId,
    userId: currentUserId,
    type: rec.type,
    amount: rec.amount,
    currency: "VND",
    description: `[Định kỳ] ${rec.name}`,
    transactionDate: new Date().toISOString().split("T")[0],
    time: "09:00",
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  applyTransactionBalance(newTx);
  transactions.unshift(newTx);

  addAuditLog("EXECUTE_RECURRING", "RecurringTransaction", id, undefined, rec.name);
  res.json({ success: true, data: newTx, message: `Đã thực hiện giao dịch: ${rec.name}` });
});

// Family Management & Members API
app.get("/api/family", (req, res) => {
  const fam = families.find((f) => f.id === "fam-1");
  res.json({ success: true, data: fam });
});

app.get("/api/family/members", (req, res) => {
  res.json({ success: true, data: familyMembers.filter((fm) => fm.familyId === "fam-1") });
});

app.post("/api/family/members/invite", (req, res) => {
  const { name, email, role, phone } = req.body;
  if (!email || !name) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Họ tên và email là bắt buộc." } });
  }

  const newMember: FamilyMember = {
    id: `fm-${Date.now()}`,
    familyId: "fam-1",
    userId: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || "",
    role: role || "member",
    joinedDate: new Date().toISOString().split("T")[0],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    status: "active",
  };

  familyMembers.push(newMember);
  addAuditLog("INVITE_MEMBER", "FamilyMember", newMember.id, undefined, `${name} (${role})`);

  res.json({ success: true, data: newMember, message: `Đã mời ${name} vào gia đình.` });
});

app.patch("/api/family/members/:id", (req, res) => {
  const { id } = req.params;
  const member = familyMembers.find((fm) => fm.id === id);
  if (!member) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Thành viên không tồn tại." } });

  const oldRole = member.role;
  Object.assign(member, req.body);

  addAuditLog("UPDATE_MEMBER_ROLE", "FamilyMember", id, oldRole, member.role);
  res.json({ success: true, data: member, message: "Cập nhật vai trò thành công." });
});

app.delete("/api/family/members/:id", (req, res) => {
  const { id } = req.params;
  const member = familyMembers.find((fm) => fm.id === id);
  if (member?.role === "owner") {
    return res.status(400).json({ success: false, error: { code: "FORBIDDEN", message: "Không thể xóa chủ sở hữu gia đình." } });
  }
  familyMembers = familyMembers.filter((fm) => fm.id !== id);
  addAuditLog("REMOVE_MEMBER", "FamilyMember", id, member?.name);
  res.json({ success: true, message: "Đã xóa thành viên khỏi gia đình." });
});

// Notifications API
app.get("/api/notifications", (req, res) => {
  res.json({ success: true, data: notifications });
});

app.post("/api/notifications/mark-read", (req, res) => {
  notifications.forEach((n) => (n.isRead = true));
  res.json({ success: true, message: "Đã đánh dấu tất cả là đã đọc." });
});

// Audit Logs API
app.get("/api/audit-logs", (req, res) => {
  res.json({ success: true, data: auditLogs });
});

// Admin System APIs
app.get("/api/admin/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalFamilies: families.length,
      totalTransactions: transactions.length,
      totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
      systemStatus: "Healthy",
    },
  });
});

app.get("/api/admin/users", (req, res) => {
  res.json({ success: true, data: users });
});

app.patch("/api/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const u = users.find((usr) => usr.id === id);
  if (u) {
    u.status = status;
    addAuditLog("ADMIN_UPDATE_USER", "User", id, undefined, `Status -> ${status}`);
  }
  res.json({ success: true, data: u });
});

// GOOGLE SHEETS INTEGRATION API
app.get("/api/google-sheet/config", (req, res) => {
  res.json({ success: true, data: googleSheetConfig });
});

app.post("/api/google-sheet/config", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(422).json({ success: false, error: { message: "Vui lòng nhập URL Google Sheet Web App hợp lệ." } });
  }

  googleSheetConfig.url = url.trim();

  // Test connection
  try {
    const testRes = await fetch(googleSheetConfig.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ping" }),
    });
    
    if (testRes.ok) {
      googleSheetConfig.isConnected = true;
      googleSheetConfig.lastSyncedAt = new Date().toISOString();
      addAuditLog("GOOGLE_SHEET_CONNECT", "GoogleSheet", undefined, undefined, `Connected to ${url}`);
      return res.json({
        success: true,
        data: googleSheetConfig,
        message: "Lưu và kết nối Google Sheet Web App thành công!",
      });
    } else {
      googleSheetConfig.isConnected = false;
      return res.status(400).json({
        success: false,
        error: { message: `Google Sheet phản hồi mã lỗi HTTP ${testRes.status}. Vui lòng kiểm tra lại cấu hình Web App Deploy.` },
      });
    }
  } catch (err: any) {
    // If request failed or redirected, assume connected if URL format matches Google Apps Script
    if (googleSheetConfig.url.includes("script.google.com")) {
      googleSheetConfig.isConnected = true;
      googleSheetConfig.lastSyncedAt = new Date().toISOString();
      return res.json({
        success: true,
        data: googleSheetConfig,
        message: "Đã lưu URL Google Sheet Apps Script Web App!",
      });
    }
    googleSheetConfig.isConnected = false;
    return res.status(400).json({
      success: false,
      error: { message: "Không thể kết nối tới URL: " + err.message },
    });
  }
});

app.post("/api/google-sheet/export-all", async (req, res) => {
  if (!googleSheetConfig.url) {
    return res.status(400).json({ success: false, error: { message: "Chưa cấu hình URL Google Sheet." } });
  }

  const payload = {
    Transactions: transactions,
    Accounts: accounts,
    Categories: categories,
    Budgets: budgets,
    Goals: savingsGoals,
    Debts: debts,
    Recurring: recurringTransactions,
    AuditLogs: auditLogs,
    Family: families,
    Members: familyMembers,
  };

  try {
    const response = await fetch(googleSheetConfig.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "syncAll", data: payload }),
    });

    googleSheetConfig.lastSyncedAt = new Date().toISOString();
    googleSheetConfig.isConnected = true;
    addAuditLog("GOOGLE_SHEET_EXPORT", "GoogleSheet", undefined, undefined, "Exported all data to Sheet");

    res.json({
      success: true,
      message: "Đã xuất toàn bộ dữ liệu ra Google Sheet thành công!",
      lastSyncedAt: googleSheetConfig.lastSyncedAt,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { message: "Lỗi xuất dữ liệu ra Google Sheet: " + err.message },
    });
  }
});

app.post("/api/google-sheet/import-all", async (req, res) => {
  if (!googleSheetConfig.url) {
    return res.status(400).json({ success: false, error: { message: "Chưa cấu hình URL Google Sheet." } });
  }

  try {
    const response = await fetch(`${googleSheetConfig.url}?action=getAll`);
    const json = await response.json();

    if (json && json.data) {
      const d = json.data;
      if (Array.isArray(d.Transactions) && d.Transactions.length > 0) transactions = d.Transactions;
      if (Array.isArray(d.Accounts) && d.Accounts.length > 0) accounts = d.Accounts;
      if (Array.isArray(d.Categories) && d.Categories.length > 0) categories = d.Categories;
      if (Array.isArray(d.Budgets) && d.Budgets.length > 0) budgets = d.Budgets;
      if (Array.isArray(d.Goals) && d.Goals.length > 0) savingsGoals = d.Goals;
      if (Array.isArray(d.Debts) && d.Debts.length > 0) debts = d.Debts;
      if (Array.isArray(d.Recurring) && d.Recurring.length > 0) recurringTransactions = d.Recurring;
      if (Array.isArray(d.AuditLogs) && d.AuditLogs.length > 0) auditLogs = d.AuditLogs;
      if (Array.isArray(d.Family) && d.Family.length > 0) families = d.Family;
      if (Array.isArray(d.Members) && d.Members.length > 0) familyMembers = d.Members;

      googleSheetConfig.lastSyncedAt = new Date().toISOString();
      googleSheetConfig.isConnected = true;
      addAuditLog("GOOGLE_SHEET_IMPORT", "GoogleSheet", undefined, undefined, "Imported all data from Sheet");

      return res.json({
        success: true,
        message: "Đã nhập và đồng bộ toàn bộ dữ liệu từ Google Sheet!",
        lastSyncedAt: googleSheetConfig.lastSyncedAt,
      });
    }

    res.status(400).json({
      success: false,
      error: { message: "Không tìm thấy dữ liệu hợp lệ trong Google Sheet." },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { message: "Lỗi nhập dữ liệu từ Google Sheet: " + err.message },
    });
  }
});

// Serve Vite App or Static Files
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
