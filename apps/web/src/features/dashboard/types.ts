export interface AdminDashboardStats {
  teachers: {
    total: number;
    active: number;
  };
  students: {
    total: number;
    active: number;
  };
  groups: {
    total: number;
  };
  centers: {
    total: number;
  };
  finance: {
    pendingPayments: number;
    overduePayments: number;
    totalRevenue: number;
  };
  lessons: {
    missedFeedbacks: number;
    todayLessons: number;
  };
}

export interface FinanceDashboard {
  revenue: {
    totalRevenue: number;
    paymentsCount: number;
    averagePayment: number;
  };
  expenses: {
    totalExpenses: number;
    salariesPaid: number;
  };
  pendingPayments: {
    count: number;
    overdueCount: number;
    totalPending: number;
  };
  pendingSalaries: {
    count: number;
    totalPending: number;
  };
  profit: number;
}
