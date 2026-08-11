export type NavView = 
  | 'dashboard'
  | 'employees'
  | 'onboarding'
  | 'leave'
  | 'payroll'
  | 'performance'
  | 'ai-assistant'
  | 'settings';

export type UserRole = 'Admin' | 'Employee';

export interface EmployeeDocument {
  id: string;
  name: string;
  isMandatory: boolean;
  status: 'Pending' | 'Uploaded' | 'Approved' | 'Rejected';
  fileName?: string;
  uploadedAt?: string;
  fileSize?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  designation: string;
  status: EmploymentStatus;
  location: string;
  joinDate: string;
  salary: number;
  phone: string;
  emergencyPhone?: string;
  address?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nomineeName?: string;
  nomineeDob?: string;
  nomineeRelation?: string;
  highestQualification?: string;
  medicalHistory?: string;
  scoreCard?: number;
  manager: string;
  avatar: string;
  leaveBalance: {
    pto: number;
    sick: number;
    parental: number;
  };
  performanceRating: number;
  documents?: EmployeeDocument[];
}

export type EmploymentStatus = 'Active' | 'On Leave' | 'Pending' | 'Remote' | 'Contractor' | 'Terminated';

export type Department = 'Engineering' | 'Product & Design' | 'Human Resources' | 'Sales & Marketing' | 'Finance' | 'Operations';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  location: string;
  joinDate: string;
  salary: number;
  phone: string;
  emergencyPhone?: string;
  address?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nomineeName?: string;
  nomineeDob?: string;
  nomineeRelation?: string;
  highestQualification?: string;
  medicalHistory?: string;
  scoreCard?: number;
  manager: string;
  leaveBalance: {
    pto: number;
    sick: number;
    parental: number;
  };
  performanceRating: number;
  onboardingProgress?: number;
  documents?: EmployeeDocument[];
}

export type PipelineStage = 'Sourced' | 'Interviewing' | 'Offer Extended' | 'Onboarding' | 'Completed';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  department: Department;
  stage: PipelineStage;
  avatar: string;
  email: string;
  appliedDate: string;
  tasksCompleted: number;
  totalTasks: number;
  checklist: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export type LeaveType = 'PTO' | 'Sick Leave' | 'Parental Leave' | 'Unpaid Leave' | 'Bereavement';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  requestedOn: string;
  approverNote?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: Department;
  baseSalary: number;
  bonus: number;
  healthDeduction: number;
  taxDeduction: number;
  netPay: number;
  paymentStatus: 'Paid' | 'Processing' | 'Hold';
  payPeriod: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  category: 'Strategic' | 'Technical' | 'Culture' | 'Leadership';
  progress: number;
  dueDate: string;
  rating: number;
  reviewer: string;
  feedback?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  timestamp: string;
  category: 'employee' | 'leave' | 'payroll' | 'onboarding';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: string[];
}
