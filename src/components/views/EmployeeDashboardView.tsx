import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  HeartHandshake, 
  Edit3, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Sparkles, 
  Laptop, 
  LifeBuoy, 
  Bell, 
  ChevronRight,
  Send,
  X,
  ShieldAlert,
  Search,
  UserCheck,
  Building,
  Check,
  CalendarCheck,
  Briefcase
} from 'lucide-react';
import { 
  Employee, 
  LeaveRequest, 
  PayrollRecord, 
  NavView, 
  UserAccount, 
  EmployeeDocument,
  AttendanceRecord,
  AttendanceCorrection,
  SupportTicket,
  AssetItem,
  Announcement,
  NotificationItem
} from '../../types';
import { EmployeeProfileModal } from '../profile/EmployeeProfileModal';

interface EmployeeDashboardViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  attendanceRecords: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  supportTickets: SupportTicket[];
  assets: AssetItem[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  currentUser: UserAccount | null;
  onNavigate: (view: NavView) => void;
  onRequestLeave: (newReq: LeaveRequest) => void;
  onRequestCorrection: (newCor: AttendanceCorrection) => void;
  onSubmitTicket: (newTck: SupportTicket) => void;
  onUpdateEmployeeProfile?: (id: string, updatedData: Partial<Employee>) => void;
  onUpdateEmployeeDocuments?: (id: string, docs: EmployeeDocument[]) => void;
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  employees,
  leaveRequests,
  payroll,
  attendanceRecords,
  attendanceCorrections,
  supportTickets,
  assets,
  announcements,
  notifications,
  currentUser,
  onNavigate,
  onRequestLeave,
  onRequestCorrection,
  onSubmitTicket,
  onUpdateEmployeeProfile,
  onUpdateEmployeeDocuments,
}) => {
  // Real-time Clock for Attendance
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>('09:05 AM');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isRaiseTicketModalOpen, setIsRaiseTicketModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<'PTO' | 'Sick Leave' | 'Parental Leave' | 'Unpaid Leave'>('PTO');
  const [leaveStartDate, setLeaveStartDate] = useState('2026-08-20');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-08-22');
  const [leaveReason, setLeaveReason] = useState('');

  const [corrDate, setCorrDate] = useState('2026-08-10');
  const [corrReqIn, setCorrReqIn] = useState('09:00 AM');
  const [corrReqOut, setCorrReqOut] = useState('06:00 PM');
  const [corrReason, setCorrReason] = useState('');

  const [tckSubject, setTckSubject] = useState('');
  const [tckCategory, setTckCategory] = useState<'IT Hardware' | 'HR Query' | 'Payroll Inquiry' | 'General Issue'>('IT Hardware');
  const [tckPriority, setTckPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [tckDesc, setTckDesc] = useState('');

  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Employee specific records
  const myLeaves = leaveRequests.filter(r => r.employeeId === currentUser?.id || r.employeeName.toLowerCase() === currentUser?.name.toLowerCase());
  const myPayroll = payroll.find(p => p.employeeId === currentUser?.id || p.employeeName.toLowerCase() === currentUser?.name.toLowerCase());
  const myAttendance = attendanceRecords.filter(a => a.employeeId === currentUser?.id || a.employeeName.toLowerCase() === currentUser?.name.toLowerCase());
  const myAssets = assets.filter(a => a.assignedToId === currentUser?.id || a.assignedToName.toLowerCase() === currentUser?.name.toLowerCase());
  const myTickets = supportTickets.filter(t => t.employeeId === currentUser?.id || t.employeeName.toLowerCase() === currentUser?.name.toLowerCase());

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

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const newReq: LeaveRequest = {
      id: `LR-${Date.now()}`,
      employeeId: currentUser?.id || 'EMP-1001',
      employeeName: currentUser?.name || 'Sujal kumar',
      employeeAvatar: currentUser?.avatar || '',
      department: currentUser?.department || 'Engineering',
      type: leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      days: 3,
      reason: leaveReason,
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
    };
    onRequestLeave(newReq);
    setIsApplyLeaveModalOpen(false);
    setLeaveReason('');
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrReason.trim()) return;
    const newCor: AttendanceCorrection = {
      id: `COR-${Date.now()}`,
      employeeId: currentUser?.id || 'EMP-1001',
      employeeName: currentUser?.name || 'Sujal kumar',
      date: corrDate,
      currentCheckIn: '09:12 AM',
      currentCheckOut: '06:05 PM',
      requestedCheckIn: corrReqIn,
      requestedCheckOut: corrReqOut,
      reason: corrReason,
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
    };
    onRequestCorrection(newCor);
    setIsCorrectionModalOpen(false);
    setCorrReason('');
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tckSubject.trim() || !tckDesc.trim()) return;
    const newTck: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: currentUser?.id || 'EMP-1001',
      employeeName: currentUser?.name || 'Sujal kumar',
      subject: tckSubject,
      category: tckCategory,
      priority: tckPriority,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      description: tckDesc,
    };
    onSubmitTicket(newTck);
    setIsRaiseTicketModalOpen(false);
    setTckSubject('');
    setTckDesc('');
  };

  return (
    <div className="space-y-6">
      {/* 1. RESTRICTED EMPLOYEE HEADER SEARCH & SCOPE INFORMATION BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0060ac] flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#1a2b3c]">Employee Self Service (ESS) Portal</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                /api/me Scope Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Authenticated Context: <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.id})
            </p>
          </div>
        </div>

        {/* Permitted Resource Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search my requests, tickets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0060ac] transition-all text-slate-800"
            />
          </div>

          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 relative text-slate-600 shrink-0"
            title="My Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs text-[#1a2b3c] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#0060ac]" /> Personal Notifications (/notifications/me)
            </h4>
            <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No notifications.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#1a2b3c]">{n.title}</p>
                    <p className="text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. GREETING BANNER */}
      <div className="bg-gradient-to-r from-[#0060ac] via-[#1a2b3c] to-[#041627] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30 uppercase tracking-wider">
                Employee Portal
              </span>
              <span className="text-xs text-slate-300">{todayDateStr}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Good Morning, {currentUser?.name || 'Sujal'}! 👋
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              {currentUser?.designation} • {currentUser?.department} Department • {currentUser?.location}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-[#0060ac]" />
              <span>My Profile & Docs</span>
            </button>

            <button
              onClick={() => setIsApplyLeaveModalOpen(true)}
              className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Apply Leave</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* 3. QUICK ACTIONS BAR (Expenses Removed) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Workday Actions</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setIsApplyLeaveModalOpen(true)}
            className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-[#0060ac] font-bold text-xs flex items-center gap-2.5 transition-all text-left"
          >
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span>Apply Leave</span>
          </button>

          <button
            onClick={() => {
              if (checkedIn) {
                setCheckedIn(false);
                setCheckInTime(null);
              } else {
                setCheckedIn(true);
                setCheckInTime(currentTime);
              }
            }}
            className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition-all text-left ${
              checkedIn 
                ? 'bg-slate-800 border-slate-900 text-white' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>{checkedIn ? 'Clock Out' : 'Clock In'}</span>
          </button>

          <button
            onClick={() => setIsCorrectionModalOpen(true)}
            className="p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-purple-800 font-bold text-xs flex items-center gap-2.5 transition-all text-left"
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Request Punch Correction</span>
          </button>

          <button
            onClick={() => setIsRaiseTicketModalOpen(true)}
            className="p-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-red-800 font-bold text-xs flex items-center gap-2.5 transition-all text-left"
          >
            <LifeBuoy className="w-4 h-4 shrink-0" />
            <span>Raise Helpdesk Ticket</span>
          </button>
        </div>
      </div>

      {/* 4. TODAY'S ATTENDANCE & LEAVE BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-[11px] text-slate-500 mt-1">Shift: 09:00 AM - 06:00 PM • Delhi HQ</p>
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

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Paid Time Off (PTO)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                Available
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#1a2b3c]">{currentUser?.leaveBalance?.pto || 15} Days</span>
              <span className="text-xs text-slate-400">Total: 20</span>
            </div>
          </div>

          <button
            onClick={() => setIsApplyLeaveModalOpen(true)}
            className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl border border-purple-200 transition-all text-center"
          >
            Apply PTO Leave
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>Sick Leave</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700">
                Medical
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#1a2b3c]">{currentUser?.leaveBalance?.sick || 10} Days</span>
              <span className="text-xs text-slate-400">Total: 12</span>
            </div>
          </div>

          <button
            onClick={() => setIsCorrectionModalOpen(true)}
            className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs rounded-xl border border-teal-200 transition-all text-center"
          >
            Request Attendance Correction
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-all">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Monthly Compensation</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Bi-Weekly
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#1a2b3c]">
                ${myPayroll ? myPayroll.netPay.toLocaleString() : ((currentUser?.salary || 125000) / 24 * 0.78).toFixed(0)}
              </span>
              <span className="text-[10px] text-slate-400">Net Pay</span>
            </div>
          </div>

          <button
            onClick={() => setIsPayslipModalOpen(true)}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Payslip PDF
          </button>
        </div>
      </div>

      {/* 5. MAIN CONTENT SPLIT: ATTENDANCE HISTORY & MY LEAVE REQUESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0060ac]" />
                <h3 className="text-sm font-bold text-[#1a2b3c]">My Attendance Logs (/attendance/me/history)</h3>
              </div>
              <button
                onClick={() => setIsCorrectionModalOpen(true)}
                className="text-xs font-bold text-[#0060ac] hover:underline"
              >
                + Request Punch Correction
              </button>
            </div>

            {myAttendance.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No recent attendance history logs recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3 pl-4">Date</th>
                      <th className="p-3">Check In</th>
                      <th className="p-3">Check Out</th>
                      <th className="p-3">Work Duration</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myAttendance.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50">
                        <td className="p-3 pl-4 font-bold text-[#1a2b3c]">{att.date}</td>
                        <td className="p-3 font-mono">{att.checkIn || '--'}</td>
                        <td className="p-3 font-mono">{att.checkOut || '--'}</td>
                        <td className="p-3 font-semibold">{att.workHours}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            att.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{att.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1a2b3c]">My Leave Requests (/leave/me/requests)</h3>
              <button
                onClick={() => setIsApplyLeaveModalOpen(true)}
                className="text-xs font-bold text-[#0060ac] hover:underline"
              >
                + New Leave Request
              </button>
            </div>

            {myLeaves.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No leave requests submitted yet. Click "Apply Leave" to submit.
              </div>
            ) : (
              <div className="space-y-3">
                {myLeaves.map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{l.type}</span>
                        <span className="text-slate-500">({l.days} days)</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{l.startDate} to {l.endDate} • Reason: "{l.reason}"</p>
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

        {/* RIGHT SIDEBAR: MY ASSETS & HELPDESK TICKETS */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-[#1a2b3c] flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-[#0060ac]" /> Assigned Assets (/assets/me)
              </h3>
            </div>

            {myAssets.length === 0 ? (
              <div className="text-xs text-slate-400 py-2">No hardware assets currently assigned.</div>
            ) : (
              <div className="space-y-2">
                {myAssets.map((ast) => (
                  <div key={ast.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1a2b3c]">{ast.assetName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">S/N: {ast.serialNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{ast.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helpdesk Support Tickets (PostgreSQL Backed) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-[#1a2b3c] flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-red-600" /> My Helpdesk Tickets (/helpdesk/me)
              </h3>
              <button onClick={() => setIsRaiseTicketModalOpen(true)} className="text-xs font-bold text-red-600 hover:underline">
                + Raise Ticket
              </button>
            </div>

            {myTickets.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 text-center">
                No support tickets raised yet. Click "+ Raise Ticket" to submit IT or HR inquiries.
              </div>
            ) : (
              <div className="space-y-2">
                {myTickets.map((tck) => (
                  <div key={tck.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1a2b3c]">{tck.subject}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tck.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 
                        tck.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tck.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">"{tck.description}"</p>
                    <p className="text-[10px] text-slate-400">Category: {tck.category} • Priority: {tck.priority}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#1a2b3c]">Company Announcements</h3>
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No company announcements.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((anc) => (
                  <div key={anc.id} className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#1a2b3c]">{anc.title}</p>
                      <span className="text-[10px] text-slate-400">{anc.publishedDate}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{anc.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: APPLY LEAVE */}
      {isApplyLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0060ac]" /> Submit Leave Application (POST /leave/requests)
              </h3>
              <button onClick={() => setIsApplyLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="PTO">Paid Time Off (PTO)</option>
                  <option value="Sick Leave">Sick & Medical Leave</option>
                  <option value="Parental Leave">Parental Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  placeholder="Provide reason for manager and HR approval..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0060ac] text-white font-bold rounded-xl hover:bg-[#004e8c]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST ATTENDANCE CORRECTION */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" /> Attendance Correction (POST /attendance/corrections)
              </h3>
              <button onClick={() => setIsCorrectionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Date</label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={(e) => setCorrDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Requested Check-In</label>
                  <input
                    type="text"
                    value={corrReqIn}
                    onChange={(e) => setCorrReqIn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Requested Check-Out</label>
                  <input
                    type="text"
                    value={corrReqOut}
                    onChange={(e) => setCorrReqOut(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Punch Correction</label>
                <textarea
                  rows={3}
                  placeholder="Explain why biometric punch was missed..."
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700"
                >
                  Submit Correction Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAYSLIP PREVIEW */}
      {isPayslipModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Payslip (/payroll/me/payslips/:id)
              </h3>
              <button onClick={() => setIsPayslipModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <div>
                  <p className="font-bold text-sm text-[#1a2b3c]">{currentUser?.name}</p>
                  <p className="text-slate-500">{currentUser?.designation} • {currentUser?.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Pay Period: August 2026</p>
                  <p className="text-slate-500">ID: {currentUser?.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-700">Earnings</p>
                  <div className="space-y-1 mt-1 text-slate-600">
                    <div className="flex justify-between"><span>Base Salary:</span> <span>${(currentUser?.salary ? currentUser.salary / 12 * 0.8 : 8000).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Performance Bonus:</span> <span>$500.00</span></div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-700">Deductions</p>
                  <div className="space-y-1 mt-1 text-slate-600">
                    <div className="flex justify-between"><span>Income Tax:</span> <span>$1,200.00</span></div>
                    <div className="flex justify-between"><span>Health Insurance:</span> <span>$150.00</span></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-[#1a2b3c]">
                <span>Net Payable Disbursed:</span>
                <span className="text-emerald-700 text-base">${myPayroll ? myPayroll.netPay.toLocaleString() : '7,150.00'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPayslipModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Payslip PDF downloaded securely to local system.');
                  setIsPayslipModalOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RAISE HELPDESK TICKET (PostgreSQL Persisted) */}
      {isRaiseTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-red-600" /> Raise Support Ticket (POST /api/helpdesk)
              </h3>
              <button onClick={() => setIsRaiseTicketModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of issue..."
                  value={tckSubject}
                  onChange={(e) => setTckSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={tckCategory}
                    onChange={(e) => setTckCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="IT Hardware">IT Hardware / Laptop</option>
                    <option value="HR Query">HR Query</option>
                    <option value="Payroll Inquiry">Payroll Inquiry</option>
                    <option value="General Issue">General Issue</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={tckPriority}
                    onChange={(e) => setTckPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide details of the request..."
                  value={tckDesc}
                  onChange={(e) => setTckDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRaiseTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
                >
                  Submit Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
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
};
