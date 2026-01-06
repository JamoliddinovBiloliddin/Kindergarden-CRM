
// Interfaces
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  studentsCount: number;
  groupsCount: number;
  location: { lat: number; lng: number };
}

export interface Group {
  id: string;
  name: string;
  branchId: string;
  teacherId: string;
  studentsCount: number;
  ageRange: string;
}

export interface Evaluation {
  date: string;
  score: number;
  note: string;
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  dob?: string;
  groupId: string;
  branchId: string;
  parentId: string;
  photo?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  evaluations?: Evaluation[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  branchId: string;
  groupIds: string[];
  specialization: string;
  status: 'active' | 'inactive';
  salary?: number;
  joinDate?: string;
  photo?: string;
  password?: string;
  role?: 'teacher';
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  childrenIds: string[];
  address: string;
  password?: string;
  role?: 'parent';
}

export interface FinancialRecord {
  id: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  branchId?: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  date: string;
  branchId: string;
  menu: string[];
  calories: number;
}

export interface Vaccination {
  id: string;
  studentId: string;
  vaccineName: string;
  date: string;
  nextDoseDate?: string;
  status: 'completed' | 'scheduled' | 'overdue';
  notes?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'educational' | 'physical' | 'creative' | 'social';
  groupId: string;
  scheduledTime: string;
  duration: number;
  description: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  branchId: string;
  lastUpdated: string;
}

export interface SleepRecord {
  id: string;
  studentId: string;
  date: string;
  startTime: string;
  endTime: string;
  quality: 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface Homework {
  id: string;
  groupId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  status: 'active' | 'completed';
}

export interface Complaint {
  id: string;
  parentId: string;
  subject: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
  response?: string;
}

export interface Admission {
  id: string;
  childName: string;
  parentName: string;
  phone: string;
  email: string;
  preferredBranch: string;
  age: number;
  status: 'pending' | 'approved' | 'rejected' | 'waitlist';
  applicationDate: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'director' | 'admin' | 'teacher' | 'parent' | 'superadmin';
  avatar?: string;
  password?: string;
  status: 'active' | 'inactive';
  branchId?: string; // Optional: If set, user is restricted to this branch
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

// Global Stats Interface
export interface DashboardStats {
  totalStudents: number;
  totalGroups: number;
  totalRevenue: number;
  totalStaff: number;
  attendanceToday: number;
  attendancePercentage: number;
}

// EXPORT EMPTY ARRAYS FOR ZERO DATA STATE
export const branches: Branch[] = [];
export const groups: Group[] = [];
export const students: Student[] = [];
export const teachers: Teacher[] = [];
export const parents: Parent[] = [];
export const financialRecords: FinancialRecord[] = [];
export const meals: Meal[] = [];
export const vaccinations: Vaccination[] = [];
export const activities: Activity[] = [];
export const warehouseItems: WarehouseItem[] = [];
export const sleepRecords: SleepRecord[] = [];
export const homeworks: Homework[] = [];
export const complaints: Complaint[] = [];
export const admissions: Admission[] = [];
export const notifications: Notification[] = [];
export const dashboardStats: DashboardStats = {
  totalStudents: 0,
  totalGroups: 0,
  totalRevenue: 0,
  totalStaff: 0,
  attendanceToday: 0,
  attendancePercentage: 0,
};
export const monthlyFinance: any[] = [];
