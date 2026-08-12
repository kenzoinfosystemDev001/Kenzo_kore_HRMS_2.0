import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Award,
  FileText,
  Building2,
  ShieldCheck,
  Briefcase,
  Helpdesk,
  Layers,
  Settings,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  AlertCircle,
  Laptop,
  Check,
  X,
  Filter,
  Download,
  Plus,
  Lock,
  Database,
  Bell
} from 'lucide-react';
import { 
  Employee, 
  Candidate, 
  LeaveRequest, 
  PayrollRecord, 
  ActivityLog, 
  NavView, 
  UserAccount, 
  AttendanceRecord,
  AttendanceCorrection,
  ExpenseRequest,
  SupportTicket,
  AssetItem
} from '../../types';

interface AdminControlCenterViewProps {
  employees: Employee[];
  candidates: Candidate[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  activities: ActivityLog[];
  attendanceRecords: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  expenses: ExpenseRequest[];
  supportTickets: SupportTicket[];
  assets: AssetItem[];
  currentUser: UserAccount | null;
  onNavigate: (view: NavView) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onApproveCorrection: (id: string) => void;
  onRejectCorrection: (id: string) => void;
  onApproveExpense: (id: string) => void;
  onRejectExpense: (id: string) => void;
  onUpdateTicketStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
}

export const AdminControlCenterView: React.FC<AdminControlCenterViewProps> = ({
  employees,
  candidates,
  leaveRequests,
  payroll,
  activities,
  attendanceRecords,
  attendanceCorrections,
  expenses,
  supportTickets,
  assets,
  currentUser,
  onNavigate,
  onApproveLeave,
  onRejectLeave,
  onApproveCorrection,
  onRejectCorrection,
  onApproveExpense,
  onRejectExpense,
  onUpdateTicketStatus
}) => {
  const [activeTab, setActiveTab] = useState<
    'workforce' | 'approvals' | 'analytics' | 'talent' | 'operations' | 'reports' | 'administration'
  >('workforce');

  const [approvalSubTab, setApprovalSubTab] = useState<'leave' | 'attendance' | 'expenses' | 'requests'>('leave');
  const [workforceSubTab, setWorkforceSubTab] = useState<'total' | 'present' | 'leave' | 'growth'>('total');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'attendance' | 'leave' | 'workforce' | 'department'>('attendance');
  const [talentSubTab, setTalentSubTab] = useState<'recruitment' | 'performance' | 'training'>('recruitment');
  const [operationsSubTab, setOperationsSubTab] = useState<'payroll' | 'assets' | 'helpdesk'>('payroll');
  const [reportsSubTab, setReportsSubTab] = useState<'workforce' | 'attendance' | 'leave' | 'payroll' | 'custom'>('workforce');
  const [adminSubTab, setAdminSubTab] = useState<'organization' | 'roles' | 'policies' | 'integrations' | 'audit' | 'settings'>('organization');

  // Metrics
  const activeCount = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');
  const pendingCorrections = attendanceCorrections.filter(c => c.status === 'Pending');
  const pendingExpenses = expenses.filter(e => e.status === 'Pending');
  const openTickets = supportTickets.filter(t => t.status !== 'Resolved');
  const activeOnboarding = candidates.filter(c => c.stage === 'Onboarding' || c.stage === 'Offer Extended');
  const totalPayrollMonth = payroll.reduce((acc, curr) => acc + curr.netPay, 0);

  // Department distribution
  const depts = ['Engineering', 'Product & Design', 'Human Resources', 'Sales & Marketing', 'Finance', 'Operations'];
  const deptCounts = depts.map(d => ({
    name: d,
    count: employees.filter(e => e.department === d).length,
    percentage: Math.round((employees.filter(e => e.department === d).length / (employees.length || 1)) * 100) || 0
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner - Executive AI HR Control Center */}
      <div className="bg-gradient-to-r from-[#1a2b3c] via-[#0060ac] to-[#041627] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" /> Admin / HR Control Center
              </span>
              <span className="text-xs text-slate-300">Neon Postgres Live • RBAC Authenticated</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Enterprise HR Operations & Governance
            </h2>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              Real-time oversight across {employees.length} workforce members, {pendingLeaves.length + pendingCorrections.length + pendingExpenses.length} pending approvals, and ${ (totalPayrollMonth / 1000).toFixed(1) }k active payroll.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 bg-white text-[#1a2b3c] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#0060ac]" />
              <span>AI Workforce Audit</span>
            </button>
            <button
              onClick={() => onNavigate('employees')}
              className="px-4 py-2.5 bg-[#48bbbe] hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* Main 7-Category HR Architecture Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'workforce', label: 'Workforce', icon: Users, count: employees.length },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle2, count: pendingLeaves.length + pendingCorrections.length + pendingExpenses.length, badgeColor: 'bg-amber-500 text-white' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'talent', label: 'Talent', icon: Award, count: candidates.length },
            { id: 'operations', label: 'Operations', icon: Briefcase, count: openTickets.length },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
            { id: 'administration', label: 'Administration', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all relative
                  ${isActive 
                    ? 'bg-[#1a2b3c] text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#48bbbe]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${tab.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700')}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: WORKFORCE CONTROL */}
      {activeTab === 'workforce' && (
        <div className="space-y-6">
          {/* Sub-navigation bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'total', label: 'Total Employees', count: employees.length },
              { id: 'present', label: 'Present Today', count: activeCount },
              { id: 'leave', label: 'On Leave', count: onLeaveCount },
              { id: 'growth', label: 'Workforce Growth', count: '+12%' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setWorkforceSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  workforceSubTab === sub.id
                    ? 'bg-blue-50 text-[#0060ac] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{sub.label}</span>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">{sub.count}</span>
              </button>
            ))}
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0060ac] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1a2b3c]">{employees.length}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Global active profiles across all divisions</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1a2b3c]">{activeCount}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {Math.round((activeCount / (employees.length || 1)) * 100)}% Rate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Checked in via portal or biometric</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On Leave</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1a2b3c]">{onLeaveCount}</span>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Approved PTO
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Vacation, Sick & Parental leave</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workforce Growth</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#48bbbe] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1a2b3c]">+12.4%</span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  Q3 YoY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Net headcount expansion rate</p>
            </div>
          </div>

          {/* Table of Employees under Workforce */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-[#1a2b3c]">Workforce Member Directory</h3>
                <p className="text-xs text-slate-500">Live employee list with department, location & compensation access</p>
              </div>
              <button
                onClick={() => onNavigate('employees')}
                className="text-xs font-bold text-[#0060ac] hover:underline flex items-center gap-1"
              >
                Full Employee Directory &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3 pl-4">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3 text-right pr-4">Annual Compensation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2.5">
                          <img src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=0060ac&color=fff`} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          <div>
                            <p className="font-bold text-[#1a2b3c]">{emp.name}</p>
                            <p className="text-[10px] text-slate-400">{emp.id} • {emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{emp.department}</td>
                      <td className="p-3 text-slate-600">{emp.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          emp.status === 'Remote' ? 'bg-blue-100 text-blue-800' :
                          emp.status === 'On Leave' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{emp.location}</td>
                      <td className="p-3 text-slate-500">{emp.joinDate}</td>
                      <td className="p-3 text-right pr-4 font-bold text-slate-900">${emp.salary?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPROVALS CONTROL CENTER */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Sub-tabs: Leave, Attendance, Expenses, Employee Requests */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'leave', label: 'Leave Approvals', count: pendingLeaves.length },
              { id: 'attendance', label: 'Attendance Corrections', count: pendingCorrections.length },
              { id: 'expenses', label: 'Expense Claims', count: pendingExpenses.length },
              { id: 'requests', label: 'Employee Requests', count: 0 },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setApprovalSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  approvalSubTab === sub.id
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{sub.label}</span>
                {sub.count > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500 text-white">{sub.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Sub-view: Leave Approvals */}
          {approvalSubTab === 'leave' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-[#1a2b3c]">Pending Leave Requests ({pendingLeaves.length})</h3>
                  <p className="text-xs text-slate-500">Review PTO, Sick leave & Parental time-off applications</p>
                </div>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All leave requests have been reviewed and finalized.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingLeaves.map((req) => (
                    <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <img src={req.employeeAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.employeeName)}&background=0060ac&color=fff`} alt={req.employeeName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#1a2b3c]">{req.employeeName}</p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{req.department}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            <strong className="text-slate-900">{req.type}</strong> • {req.days} days ({req.startDate} to {req.endDate})
                          </p>
                          <p className="text-xs text-slate-500 italic mt-0.5">"{req.reason}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onRejectLeave(req.id)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onApproveLeave(req.id)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#1a2b3c] text-white hover:bg-[#041627] shadow-xs transition-colors"
                        >
                          Approve Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-view: Attendance Corrections */}
          {approvalSubTab === 'attendance' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-[#1a2b3c]">Attendance Correction Requests ({pendingCorrections.length})</h3>
                  <p className="text-xs text-slate-500">Employee punch-in/out timestamp correction requests requiring approval</p>
                </div>
              </div>

              {attendanceCorrections.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No attendance correction requests.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {attendanceCorrections.map((cor) => (
                    <div key={cor.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#1a2b3c]">{cor.employeeName}</p>
                          <span className="text-[10px] text-slate-400">Date: {cor.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Current: <span className="line-through text-slate-400">{cor.currentCheckIn} - {cor.currentCheckOut}</span> &rarr; Requested: <strong className="text-emerald-700">{cor.requestedCheckIn} - {cor.requestedCheckOut}</strong>
                        </p>
                        <p className="text-xs text-slate-500 italic mt-0.5">Reason: "{cor.reason}"</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {cor.status === 'Pending' ? (
                          <>
                            <button onClick={() => onRejectCorrection(cor.id)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-100">Reject</button>
                            <button onClick={() => onApproveCorrection(cor.id)} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Approve Correction</button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cor.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {cor.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-view: Expenses */}
          {approvalSubTab === 'expenses' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-[#1a2b3c]">Expense Claims ({expenses.length})</h3>
                  <p className="text-xs text-slate-500">Employee expense reimbursements for software, travel & client meetings</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <div key={exp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#1a2b3c]">{exp.employeeName}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{exp.category}</span>
                      </div>
                      <p className="text-sm font-extrabold text-[#1a2b3c] mt-1">${exp.amount.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{exp.description} • {exp.date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {exp.status === 'Pending' ? (
                        <>
                          <button onClick={() => onRejectExpense(exp.id)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-100">Reject</button>
                          <button onClick={() => onApproveExpense(exp.id)} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700">Approve & Reimburse</button>
                        </>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {exp.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-view: Employee Requests */}
          {approvalSubTab === 'requests' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs shadow-2xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              No pending employee profile document change requests.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'attendance', label: 'Attendance Analytics' },
              { id: 'leave', label: 'Leave Utilization' },
              { id: 'workforce', label: 'Workforce Demographics' },
              { id: 'department', label: 'Department Headcount & Cost' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setAnalyticsSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  analyticsSubTab === sub.id
                    ? 'bg-purple-50 text-purple-800 border border-purple-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#1a2b3c]">Department Headcount Ratio</h3>
              <div className="space-y-3">
                {deptCounts.map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{dept.name}</span>
                      <span className="text-slate-900">{dept.count} members ({dept.percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a2b3c] rounded-full transition-all" style={{ width: `${dept.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#1a2b3c]">Punctuality & Shift Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Average Check-in Time</p>
                  <p className="text-xl font-bold text-[#1a2b3c] mt-1">09:02 AM</p>
                  <span className="text-[10px] font-bold text-emerald-600">On Schedule</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Punctuality Score</p>
                  <p className="text-xl font-bold text-[#1a2b3c] mt-1">96.4%</p>
                  <span className="text-[10px] font-bold text-teal-600">Top Tier</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Leave Utilization Rate</p>
                  <p className="text-xl font-bold text-[#1a2b3c] mt-1">42.1%</p>
                  <span className="text-[10px] font-bold text-blue-600">Balanced</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Annual Retention</p>
                  <p className="text-xl font-bold text-[#1a2b3c] mt-1">94.8%</p>
                  <span className="text-[10px] font-bold text-purple-600">Industry Leader</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TALENT MANAGEMENT */}
      {activeTab === 'talent' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'recruitment', label: 'Recruitment & Onboarding', count: candidates.length },
              { id: 'performance', label: 'Performance & OKRs' },
              { id: 'training', label: 'Training & Certifications' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setTalentSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  talentSubTab === sub.id
                    ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1a2b3c]">Active Recruitment Pipeline</h3>
                <p className="text-xs text-slate-500">Candidates in screening, interview & compliance setup</p>
              </div>
              <button onClick={() => onNavigate('onboarding')} className="text-xs font-bold text-[#0060ac] hover:underline">
                View Kanban Board &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">{c.stage}</span>
                    <span className="text-[10px] text-slate-400">{c.appliedDate}</span>
                  </div>
                  <p className="font-bold text-sm text-[#1a2b3c]">{c.name}</p>
                  <p className="text-xs text-slate-600">{c.role} • {c.department}</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${(c.tasksCompleted / (c.totalTasks || 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OPERATIONS */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'payroll', label: 'Payroll Operations' },
              { id: 'assets', label: 'Asset Management', count: assets.length },
              { id: 'helpdesk', label: 'Helpdesk & Support', count: openTickets.length },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setOperationsSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  operationsSubTab === sub.id
                    ? 'bg-blue-50 text-blue-800 border border-blue-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {operationsSubTab === 'payroll' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a2b3c]">Enterprise Payroll Batch Disbursement</h3>
                <p className="text-xs text-slate-500">Bi-weekly payroll automated batch processing & tax calculations</p>
              </div>
              <button onClick={() => onNavigate('payroll')} className="px-4 py-2 bg-[#1a2b3c] text-white font-bold text-xs rounded-xl hover:bg-[#041627]">
                Manage Payroll Portal &rarr;
              </button>
            </div>
          )}

          {operationsSubTab === 'assets' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1a2b3c]">Company Assigned Assets ({assets.length})</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 pl-4">Asset Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Serial Number</th>
                    <th className="p-3">Assigned To</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-3 pl-4 font-bold text-[#1a2b3c]">{a.assetName}</td>
                      <td className="p-3 text-slate-600">{a.category}</td>
                      <td className="p-3 text-slate-500 font-mono">{a.serialNumber}</td>
                      <td className="p-3 font-semibold text-slate-800">{a.assignedToName}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {operationsSubTab === 'helpdesk' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1a2b3c]">IT Support Tickets ({supportTickets.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {supportTickets.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1a2b3c]">{t.id}: {t.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">{t.category}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Raised by {t.employeeName} • {t.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTicketStatus(t.id, e.target.value as any)}
                        className="text-xs font-bold border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-800"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1a2b3c]">Enterprise HR & Audit Reports</h3>
              <p className="text-xs text-slate-500">Generate and export compliant workforce, attendance, and payroll reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { title: 'Workforce Master Report', desc: 'Complete headcount details, roles, salaries & contact info.', format: 'CSV / Excel' },
              { title: 'Monthly Attendance Register', desc: 'Daily punch logs, total working hours & late occurrences.', format: 'PDF / Excel' },
              { title: 'Leave Balance & Audit Report', desc: 'Approved, pending and remaining PTO allocations.', format: 'CSV' },
              { title: 'Tax & Payroll Register', desc: 'Gross salary, PF deductions, tax withholdings & net pay.', format: 'PDF' },
            ].map((rep, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#1a2b3c]">{rep.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{rep.desc}</p>
                </div>
                <button
                  onClick={() => alert(`Generating ${rep.title}... Download started.`)}
                  className="w-full py-2 bg-white text-slate-800 border border-slate-200 font-bold text-xs rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#0060ac]" /> Export ({rep.format})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ADMINISTRATION */}
      {activeTab === 'administration' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'organization', label: 'Organization Setup' },
              { id: 'roles', label: 'Roles & Permissions (RBAC)' },
              { id: 'policies', label: 'Leave & Attendance Policies' },
              { id: 'integrations', label: 'Integrations & API' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'settings', label: 'System Settings' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setAdminSubTab(sub.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminSubTab === sub.id
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            {adminSubTab === 'organization' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1a2b3c]">Kenzo Infosystems Organization Overview</h3>
                <p className="text-xs text-slate-500">Corporate HQ: East Delhi • Regional Offices: London, San Francisco, Bangalore</p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <p><strong>Primary Entity:</strong> Kenzo Infosystems Private Limited</p>
                  <p><strong>Registered Address:</strong> 32-C, Unit No. 107, B.R. Complex, Mayur Vihar Phase I, East Delhi - 110091</p>
                  <p><strong>Active Employees:</strong> {employees.length} Members</p>
                </div>
              </div>
            )}

            {adminSubTab === 'roles' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1a2b3c]">Role-Based Access Control (RBAC)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-[#1a2b3c] flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Role</p>
                    <p className="text-slate-600">Full system authority, headcount management, payroll processing, policy configuration, audit logs access.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-[#1a2b3c] flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-teal-600" /> Employee Role</p>
                    <p className="text-slate-600">Restricted access to own profile, personal attendance check-in, leave applications, payslip downloads, assets.</p>
                  </div>
                </div>
              </div>
            )}

            {adminSubTab === 'audit' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1a2b3c]">System Audit Trail</h3>
                <div className="divide-y divide-slate-100">
                  {activities.map((a) => (
                    <div key={a.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{a.user}</strong>: {a.action}
                      </div>
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminSubTab === 'integrations' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1a2b3c]">Enterprise API & Data Connectors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-900">PostgreSQL Neon DB</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Connected & Active</span>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-900">Google Gemini AI 3.6</p>
                    <span className="text-[10px] text-teal-600 font-bold">Active Assistant</span>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-900">Bcrypt Password Hashing</p>
                    <span className="text-[10px] text-purple-600 font-bold">Encrypted RBAC</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
