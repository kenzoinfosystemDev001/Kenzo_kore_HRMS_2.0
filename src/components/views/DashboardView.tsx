import React, { useState, useEffect } from 'react';
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
  User,
  HeartHandshake,
  Edit3
} from 'lucide-react';
import { Employee, Candidate, LeaveRequest, PayrollRecord, ActivityLog, NavView, UserAccount, EmployeeDocument } from '../../types';
import { EmployeeProfileModal } from '../profile/EmployeeProfileModal';

interface DashboardViewProps {
  employees: Employee[];
  candidates: Candidate[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  activities: ActivityLog[];
  currentUser: UserAccount | null;
  onNavigate: (view: NavView) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onUpdateEmployeeProfile?: (id: string, updatedData: Partial<Employee>) => void;
  onUpdateEmployeeDocuments?: (id: string, docs: EmployeeDocument[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  candidates,
  leaveRequests,
  payroll,
  activities,
  currentUser,
  onNavigate,
  onApproveLeave,
  onRejectLeave,
  onUpdateEmployeeProfile,
  onUpdateEmployeeDocuments,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  
  // Real-time Clock for Attendance
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Admin Metrics
  const activeCount = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');
  const activeOnboarding = candidates.filter(c => c.stage === 'Onboarding' || c.stage === 'Offer Extended');
  const totalPayrollMonth = payroll.reduce((acc, curr) => acc + curr.netPay, 0);

  // Employee Specific Data
  const myLeaves = leaveRequests.filter(r => r.employeeId === currentUser?.id || r.employeeName === currentUser?.name);
  const myPayroll = payroll.find(p => p.employeeId === currentUser?.id || p.employeeName === currentUser?.name);
  const myEmployeeRecord: Employee = employees.find(e => e.id === currentUser?.id || e.email.toLowerCase() === currentUser?.email.toLowerCase()) || {
    id: currentUser?.id || 'EMP-1001',
    name: currentUser?.name || 'Sujal kumar',
    email: currentUser?.email || 'sujal.kumar@kenzoinfosystems.com',
    avatar: currentUser?.avatar || '',
    role: currentUser?.designation || 'Software Engineer',
    department: currentUser?.department || 'Engineering',
    status: currentUser?.status || 'Active',
    location: currentUser?.location || 'Delhi NCR (HQ)',
    joinDate: currentUser?.joinDate || '2026-01-01',
    salary: currentUser?.salary || 125000,
    phone: currentUser?.phone || '+91 99997 40587',
    emergencyPhone: currentUser?.emergencyPhone || '+91 98110 00000',
    address: currentUser?.address || 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
    maritalStatus: currentUser?.maritalStatus || 'Single',
    nomineeName: currentUser?.nomineeName || 'Parent / Spouse',
    nomineeDob: currentUser?.nomineeDob || '1995-05-15',
    nomineeRelation: currentUser?.nomineeRelation || 'Parent',
    highestQualification: currentUser?.highestQualification || 'Bachelor of Technology (B.Tech)',
    medicalHistory: currentUser?.medicalHistory || 'No major pre-existing conditions reported.',
    scoreCard: currentUser?.scoreCard || 95,
    manager: currentUser?.manager || 'Admin Office',
    leaveBalance: currentUser?.leaveBalance || { pto: 15, sick: 10, parental: 0 },
    performanceRating: currentUser?.performanceRating || 4.5,
    documents: currentUser?.documents,
  };

  // Department Distribution Calculation
  const depts = ['Engineering', 'Product & Design', 'Human Resources', 'Sales & Marketing', 'Finance', 'Operations'];
  const deptCounts = depts.map(d => ({
    name: d,
    count: employees.filter(e => e.department === d).length,
    percentage: Math.round((employees.filter(e => e.department === d).length / (employees.length || 1)) * 100) || 0
  }));

  if (!isAdmin) {
    // ----------------------------------------------------
    // EMPLOYEE DASHBOARD VIEW
    // ----------------------------------------------------
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#0060ac] via-[#1a2b3c] to-[#041627] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30 uppercase tracking-wider">
                  Employee Portal
                </span>
                <span className="text-xs text-slate-300">Kenzo_Kore_HRMS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome back, {currentUser?.name}!
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                {currentUser?.designation} • {currentUser?.department} Department • {currentUser?.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 shrink-0"
              >
                <Edit3 className="w-4 h-4 text-[#0060ac]" />
                <span>My Profile & Documents</span>
              </button>

              <button
                onClick={() => onNavigate('leave')}
                className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Submit Leave</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        </div>

        {/* Today's Attendance & Interactive Action Cards (Matching Image 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Attendance with Clock In */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Today's Attendance</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  checkedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {checkedIn ? `Checked In (${checkInTime})` : 'Not Checked In'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Mark your current day attendance.</p>
            </div>

            <button
              onClick={() => {
                if (!checkedIn) {
                  setCheckedIn(true);
                  setCheckInTime(currentTime);
                } else {
                  setCheckedIn(false);
                  setCheckInTime(null);
                }
              }}
              className={`w-full py-2.5 px-3 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                checkedIn 
                  ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>{checkedIn ? `Clock Out (${currentTime})` : `Clock In (${currentTime})`}</span>
            </button>
          </div>

          {/* Card 2: Leave Application */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Leave Application</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {currentUser?.leaveBalance?.pto || 15} Days Remaining
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Submit time-off requests and track approval status.</p>
            </div>

            <button
              onClick={() => onNavigate('leave')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all text-center"
            >
              Submit Leave Application
            </button>
          </div>

          {/* Card 3: Appraisals & Requests */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Appraisals & Requests</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Rating: {currentUser?.scoreCard || 95}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Request performance appraisal or manager feedback.</p>
            </div>

            <button
              onClick={() => onNavigate('performance')}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl shadow-xs transition-all text-center"
            >
              Submit Appraisal Request
            </button>
          </div>

          {/* Card 4: Helpdesk & Complaints */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <HeartHandshake className="w-4 h-4 text-red-600" />
                  <span>Helpdesk & Complaints</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Raise IT tools requirement, equipment, or complaints.</p>
            </div>

            <button
              onClick={() => onNavigate('ai-assistant')}
              className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all text-center"
            >
              + Raise Support Ticket / Complaint
            </button>
          </div>
        </div>

        {/* Employee KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PTO Balance</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#48bbbe] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1a2b3c]">{currentUser?.leaveBalance?.pto || 15} Days</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Available</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Paid Time Off Annual Allocation</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sick Leave Balance</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0060ac] flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1a2b3c]">{currentUser?.leaveBalance?.sick || 10} Days</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Medical</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Sick & Emergency Days</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Monthly Compensation</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1a2b3c]">
                ${myPayroll ? myPayroll.netPay.toLocaleString() : ((currentUser?.salary || 125000) / 24 * 0.78).toFixed(0)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Bi-Weekly</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Disbursed on alternate Fridays</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance Rating</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1a2b3c]">{currentUser?.performanceRating || 4.5} / 5.0</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Exceeds</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Latest Performance Cycle</p>
          </div>
        </div>

        {/* Employee Details & My Leave History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1a2b3c]">My Leave Requests</h3>
                <button
                  onClick={() => onNavigate('leave')}
                  className="text-xs font-semibold text-[#0060ac] hover:underline"
                >
                  Manage All &rarr;
                </button>
              </div>

              {myLeaves.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No leave requests submitted yet. Click "Submit Leave Request" to apply for PTO or Sick Leave.
                </div>
              ) : (
                <div className="space-y-3">
                  {myLeaves.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{l.type}</span>
                          <span className="text-slate-500">({l.days} days)</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{l.startDate} to {l.endDate} • Requested on {l.requestedOn}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* My Profile Quick Reference */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1a2b3c]">Employee Profile Summary</h3>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xs font-bold text-[#0060ac] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Employee ID</span>
                  <span className="font-semibold text-slate-900">{currentUser?.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Work Email</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[180px]">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-semibold text-slate-900">{currentUser?.phone || '+91 99997 40587'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Emergency Phone</span>
                  <span className="font-semibold text-slate-900">{currentUser?.emergencyPhone || '+91 98110 00000'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Nominee Name</span>
                  <span className="font-semibold text-slate-900">{currentUser?.nomineeName || 'Parent / Spouse'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Qualification</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[160px]">{currentUser?.highestQualification || 'B.Tech'}</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Quick Card */}
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl p-5 text-white shadow-md space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>AI HR Assistant</span>
              </div>
              <p className="text-xs text-slate-100 leading-relaxed">
                Have questions regarding company parental policies, holiday schedules, or benefits eligibility?
              </p>
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="w-full mt-2 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors"
              >
                Ask HR AI Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Self Profile Modal */}
        {isProfileModalOpen && (
          <EmployeeProfileModal
            employee={myEmployeeRecord}
            currentUser={currentUser}
            onClose={() => setIsProfileModalOpen(false)}
            onUpdateProfile={(id, data) => {
              if (onUpdateEmployeeProfile) {
                onUpdateEmployeeProfile(id, data);
              }
            }}
            onUpdateDocuments={(id, docs) => {
              if (onUpdateEmployeeDocuments) {
                onUpdateEmployeeDocuments(id, docs);
              }
            }}
          />
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner - Executive AI Insight */}
      <div className="bg-gradient-to-r from-[#1a2b3c] via-[#0060ac] to-[#1a2b3c] rounded-xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" /> Admin HR Control Center
            </span>
            <span className="text-xs text-slate-300">Neon Postgres Live</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Workforce stability is high at 94.2% retention.
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            {pendingLeaves.length} pending leave requests require administrative review. You have full authority to add new employee accounts or remove records.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className="relative z-10 shrink-0 px-4 py-2 bg-white text-[#1a2b3c] hover:bg-slate-100 font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
        >
          <span>Run AI Workforce Audit</span>
          <ArrowUpRight className="w-4 h-4 text-[#0060ac]" />
        </button>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0060ac] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1a2b3c]">{employees.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeCount} active • {onLeaveCount} on leave
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Onboarding</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#48bbbe] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1a2b3c]">{activeOnboarding.length}</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Candidates in compliance setup
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Leave Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1a2b3c]">{pendingLeaves.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requires Admin Review
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Monthly Payroll</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1a2b3c] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1a2b3c]">
              ${(totalPayrollMonth / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Disbursed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bi-weekly payout on schedule
          </p>
        </div>
      </div>

      {/* Main Content Split: Approvals & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1a2b3c]">
                  Pending Leave Requests ({pendingLeaves.length})
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('leave')}
                className="text-xs font-semibold text-[#0060ac] hover:underline flex items-center gap-1"
              >
                View All Requests <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All leave requests have been reviewed and processed.
              </div>
            ) : (
              <div className="divide-y divide-[#e2e8f0]">
                {pendingLeaves.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={req.employeeAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.employeeName)}&background=0060ac&color=fff`} 
                        alt={req.employeeName} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#1a2b3c]">{req.employeeName}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {req.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <strong className="text-slate-700">{req.type}</strong> ({req.days} days) • {req.startDate} to {req.endDate}
                        </p>
                        <p className="text-[11px] text-slate-400 italic mt-0.5">"{req.reason}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onRejectLeave(req.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveLeave(req.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-md bg-[#1a2b3c] text-white hover:bg-[#041627] transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1a2b3c]">Onboarding Candidates</h3>
                <p className="text-xs text-slate-500">Candidates progressing through compliance and IT setup</p>
              </div>
              <button 
                onClick={() => onNavigate('onboarding')}
                className="text-xs font-semibold text-[#0060ac] hover:underline flex items-center gap-1"
              >
                Pipeline Board <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {candidates.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active onboarding candidates. Clean PostgreSQL database state.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-[#e2e8f0] bg-slate-50/50 flex items-start gap-3">
                    <img src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=48bbbe&color=fff`} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1a2b3c] truncate">{c.name}</p>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          {c.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-[#1a2b3c] mb-1">Department Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Headcount allocation across core divisions</p>

            <div className="space-y-3">
              {deptCounts.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{dept.name}</span>
                    <span className="text-slate-500 font-bold">{dept.count} ({dept.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1a2b3c] rounded-full transition-all"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1a2b3c]">Recent HR Audit Log</h3>
              <span className="text-[10px] uppercase font-bold text-slate-400">Postgres Stream</span>
            </div>

            {activities.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-4">No recent activity logs.</div>
            ) : (
              <div className="space-y-3 pt-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                    <img src={act.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(act.user)}&background=0060ac&color=fff`} alt={act.user} className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 leading-snug">
                        <strong className="font-semibold text-[#1a2b3c]">{act.user}:</strong> {act.action}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
