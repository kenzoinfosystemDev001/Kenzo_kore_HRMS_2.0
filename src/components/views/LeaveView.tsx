import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Calendar as CalendarIcon, 
  UserCheck, 
  AlertCircle,
  X,
  FileText,
  BarChart3,
  TrendingUp,
  MapPin,
  Lock,
  Edit3,
  Search,
  Download,
  Filter,
  Users,
  AlertTriangle
} from 'lucide-react';
import { LeaveRequest, LeaveType, Employee, UserAccount, AttendanceRecord, AttendanceCorrection } from '../../types';
import { AttendanceCalendar } from '../attendance/AttendanceCalendar';

interface LeaveViewProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  attendanceRecords?: AttendanceRecord[];
  currentUser: UserAccount | null;
  onApproveLeave: (id: string, note?: string) => void;
  onRejectLeave: (id: string, note?: string) => void;
  onRequestLeave: (request: LeaveRequest) => void;
  onRequestCorrection?: (newCor: AttendanceCorrection) => void;
  onClockIn?: (employeeId: string, employeeName: string) => void;
  onClockOut?: (employeeId: string) => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({
  leaveRequests,
  employees,
  attendanceRecords = [],
  currentUser,
  onApproveLeave,
  onRejectLeave,
  onRequestLeave,
  onRequestCorrection,
  onClockIn,
  onClockOut,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteAction, setNoteAction] = useState<'approve' | 'reject'>('approve');

  // Admin Attendance Management State
  const getTodayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = getTodayStr();
  const [selectedAttDate, setSelectedAttDate] = useState(todayStr);
  const isSelectedDateToday = selectedAttDate === todayStr;
  const [attSearch, setAttSearch] = useState('');
  const [attDeptFilter, setAttDeptFilter] = useState('All');
  const [attStatusFilter, setAttStatusFilter] = useState('All');

  // Request Form state
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.id || employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('PTO');
  const [startDate, setStartDate] = useState('2026-08-20');
  const [endDate, setEndDate] = useState('2026-08-22');
  const [daysCount, setDaysCount] = useState(3);
  const [reason, setReason] = useState('');

  // Correction Form state
  const [corrDate, setCorrDate] = useState('2026-08-10');
  const [corrReqIn, setCorrReqIn] = useState('09:00 AM');
  const [corrReqOut, setCorrReqOut] = useState('06:00 PM');
  const [corrReason, setCorrReason] = useState('');

  // FILTERING LOGIC:
  const myLeaveRequests = isAdmin 
    ? leaveRequests 
    : leaveRequests.filter(r => r.employeeId === currentUser?.id || r.employeeName.toLowerCase() === currentUser?.name.toLowerCase());

  const filteredRequests = myLeaveRequests.filter((r) => 
    filterStatus === 'All' ? true : r.status === filterStatus
  );

  const pendingCount = myLeaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = myLeaveRequests.filter(r => r.status === 'Approved').length;

  // Filter attendance records for current employee (Strictly scoped for employees)
  const myAttendanceLogs = attendanceRecords.filter(a => a.employeeId === currentUser?.id || a.employeeName.toLowerCase() === currentUser?.name.toLowerCase());

  // Dynamic Employee Attendance KPI Computations (Image 1)
  const totalEmpLogs = myAttendanceLogs.length;
  const empPresentCount = myAttendanceLogs.filter(a => a.status === 'Present').length;
  const empLateCount = myAttendanceLogs.filter(a => a.status === 'Late').length;
  const empHalfDayCount = myAttendanceLogs.filter(a => a.status === 'Half Day').length;

  const activePresentDays = empPresentCount + empLateCount + empHalfDayCount;
  const workingDaysInCycle = Math.max(totalEmpLogs, 22);

  const presentDaysText = `${activePresentDays} / ${workingDaysInCycle} Days`;
  const presentRatePct = `${workingDaysInCycle > 0 ? Math.round((activePresentDays / workingDaysInCycle) * 100) : 100}% Rate`;

  const punctualityScorePct = activePresentDays > 0 
    ? `${Math.round((empPresentCount / activePresentDays) * 100)}%` 
    : '100%';
  const punctualityLabel = empLateCount === 0 ? 'On Time' : empLateCount <= 2 ? 'Minor Delay' : 'Late Alerts';

  const avgWorkHoursStr = totalEmpLogs > 0 ? '8h 50m' : '8h 30m';
  const lateLog = myAttendanceLogs.find(a => a.status === 'Late');
  const latestLateDateStr = lateLog ? lateLog.date : (empLateCount > 0 ? 'Aug 10' : 'None');

  // Admin Attendance Dashboard Computations (Image 2)
  const recordsForDate = attendanceRecords.filter(a => a.date === selectedAttDate);
  const activeRoster = employees.filter(e => e.status === 'Active' || e.status === 'Remote');
  const totalRosterCount = activeRoster.length || 5;

  const presentCount = recordsForDate.filter(a => a.status === 'Present').length;
  const lateCount = recordsForDate.filter(a => a.status === 'Late').length;
  const halfDayCount = recordsForDate.filter(a => a.status === 'Half Day').length;
  const absentCount = Math.max(0, totalRosterCount - (presentCount + lateCount + halfDayCount));
  const attendanceRatePct = Math.round(((presentCount + lateCount + halfDayCount) / totalRosterCount) * 100) || 0;

  const rosterWithAttendance = activeRoster.map(emp => {
    const record = recordsForDate.find(r => r.employeeId === emp.id || r.employeeName.toLowerCase() === emp.name.toLowerCase());
    return {
      emp,
      record: record || null,
      status: record ? record.status : 'Absent',
    };
  });

  const filteredAdminAttendance = rosterWithAttendance.filter(item => {
    const matchesSearch = item.emp.name.toLowerCase().includes(attSearch.toLowerCase()) ||
                          item.emp.department.toLowerCase().includes(attSearch.toLowerCase()) ||
                          item.emp.id.toLowerCase().includes(attSearch.toLowerCase());
    const matchesDept = attDeptFilter === 'All' || item.emp.department === attDeptFilter;
    const matchesStatus = attStatusFilter === 'All' || item.status === attStatusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const empIdToUse = isAdmin ? selectedEmpId : (currentUser?.id || 'EMP-1001');
    const emp = employees.find(e => e.id === empIdToUse) || {
      id: currentUser?.id || 'EMP-1001',
      name: currentUser?.name || 'Sujal kumar',
      avatar: currentUser?.avatar || '',
      department: currentUser?.department || 'Engineering'
    };

    const newReq: LeaveRequest = {
      id: `LR-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar || '',
      department: emp.department,
      type: leaveType,
      startDate,
      endDate,
      days: Number(daysCount),
      reason: reason || 'Personal time off requested',
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
    };

    onRequestLeave(newReq);
    setIsRequestModalOpen(false);
    setReason('');
  };

  const handleCreateCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrReason.trim() || !onRequestCorrection) return;

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

  const openActionNoteModal = (id: string, action: 'approve' | 'reject') => {
    setNoteModalId(id);
    setNoteAction(action);
    setNoteText('');
  };

  const handleConfirmActionNote = () => {
    if (!noteModalId) return;
    if (noteAction === 'approve') {
      onApproveLeave(noteModalId, noteText);
    } else {
      onRejectLeave(noteModalId, noteText);
    }
    setNoteModalId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Scope Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1a2b3c]">Leave & Attendance Management</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0060ac] border border-blue-200">
              {isAdmin ? 'Admin View' : 'My Personal Leave & Attendance Portal'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin 
              ? 'Review organization-wide PTO requests, attendance corrections & leave calendars.' 
              : `Viewing personal leave requests and attendance logs for ${currentUser?.name}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-3.5 py-2 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold rounded-xl hover:bg-purple-100 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Request Attendance Correction
            </button>
          )}

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2 bg-[#1a2b3c] text-white text-xs font-bold rounded-xl hover:bg-[#041627] flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Request Leave
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-amber-600 uppercase">Pending Review</span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">{pendingCount} Requests</p>
          <p className="text-xs text-slate-500 mt-0.5">{isAdmin ? 'Requires manager sign-off' : 'Awaiting admin approval'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase font-semibold">Approved Leave</span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">{approvedCount} Approved</p>
          <p className="text-xs text-slate-500 mt-0.5">Active PTO & parental schedules</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">My Leave Balance</span>
            <p className="text-base font-bold text-[#1a2b3c] mt-1">
              PTO: <strong className="text-teal-600">{currentUser?.leaveBalance?.pto || 15}d</strong> • Sick: <strong className="text-blue-600">{currentUser?.leaveBalance?.sick || 10}d</strong>
            </p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3.5 py-2 bg-[#0060ac] text-white text-xs font-bold rounded-lg hover:bg-[#004e8c] flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Book PTO
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CORPORATE TIME & ATTENDANCE MANAGEMENT (IMAGE 2 DESIGN FOR ADMIN) */}
      {/* ---------------------------------------------------------------- */}
      {isAdmin ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-2xs space-y-6">
          {/* Header Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0060ac] border border-blue-200 uppercase tracking-wider">
                Corporate Time & Attendance Tracking
              </span>
              <h2 className="text-xl font-extrabold text-[#1a2b3c] mt-1 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#0060ac]" /> Attendance Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Calendar date inspection & strict current-day clock-in enforcement</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="date"
                value={selectedAttDate}
                onChange={(e) => setSelectedAttDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
              <button
                onClick={() => setSelectedAttDate(todayStr)}
                className="px-3 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-2xs"
              >
                Today
              </button>
              <button
                onClick={() => alert(`Exporting complete attendance logs for ${selectedAttDate}...`)}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 flex items-center gap-1.5 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" /> Export Logs
              </button>
              {onClockIn && (
                <button
                  onClick={() => onClockIn(currentUser?.id || 'EMP-1003', currentUser?.name || 'Ankit sethi')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" /> Clock In ({new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                </button>
              )}
            </div>
          </div>

          {/* Live Marking Active Banner */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Current Day (Live Marking Active for {selectedAttDate})
            </span>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">PRESENT</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{presentCount}</p>
              <span className="text-[10px] text-slate-400">On-time arrivals (&le;10:30 AM)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">LATE ARRIVALS</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 mt-2">{lateCount}</p>
              <span className="text-[10px] text-slate-400">Arrivals 10:31 AM - 12:30 PM</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">HALF DAY</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-extrabold text-orange-600 mt-2">{halfDayCount}</p>
              <span className="text-[10px] text-slate-400">Clocked in AFTER 12:30 PM</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">ABSENT</span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-extrabold text-red-600 mt-2">{absentCount}</p>
              <span className="text-[10px] text-slate-400">Not clocked in for {selectedAttDate}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">TOTAL ROSTER</span>
                <Users className="w-4 h-4 text-[#0060ac]" />
              </div>
              <p className="text-2xl font-extrabold text-[#1a2b3c] mt-2">{totalRosterCount}</p>
              <span className="text-[10px] text-slate-400">Active workforce on {selectedAttDate}</span>
            </div>
          </div>

          {/* Main Attendance Logs & Calendar Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Log Table (2/3) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1a2b3c]">
                    Attendance Logs ({selectedAttDate})
                  </h3>
                  <p className="text-xs text-slate-500">Real-time check-in records for all active employees</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search employee..."
                      value={attSearch}
                      onChange={(e) => setAttSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <select
                    value={attDeptFilter}
                    onChange={(e) => setAttDeptFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="All">All Depts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>

                  <select
                    value={attStatusFilter}
                    onChange={(e) => setAttStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              {filteredAdminAttendance.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No matching attendance records found for {selectedAttDate}.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3 pl-4">Employee</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Check In</th>
                        <th className="p-3">Check Out</th>
                        <th className="p-3">Total Hours</th>
                        <th className="p-3">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredAdminAttendance.map(({ emp, record, status }) => (
                        <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 pl-4 font-bold text-[#1a2b3c]">
                            <div className="flex items-center gap-2.5">
                              <img src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=0060ac&color=fff`} alt={emp.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                              <div>
                                <p className="font-bold text-[#1a2b3c]">{emp.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{emp.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{emp.department}</td>
                          <td className="p-3 font-mono font-medium">{record?.checkIn || '--'}</td>
                          <td className="p-3 font-mono font-medium">{record?.checkOut || '--'}</td>
                          <td className="p-3 font-bold text-slate-900">{record?.workHours || '0h 0m'}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              status === 'Present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              status === 'Late' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              status === 'Half Day' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side Calendar Inspector (1/3) */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-sm text-[#1a2b3c] flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#0060ac]" /> Date & Calendar Inspector
                  </h4>
                  {isSelectedDateToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Today
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Date to Inspect Logs</label>
                  <input
                    type="date"
                    value={selectedAttDate}
                    onChange={(e) => setSelectedAttDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0060ac]"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200 p-5 text-center shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-[#0060ac] uppercase tracking-wider">
                  ATTENDANCE RATE ({selectedAttDate})
                </span>
                <p className="text-3xl font-extrabold text-[#1a2b3c]">{attendanceRatePct}%</p>
                <p className="text-xs text-slate-600 font-semibold">
                  {presentCount + lateCount + halfDayCount} of {totalRosterCount} active on {selectedAttDate}
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MONTHLY ATTENDANCE CALENDAR */}
          <AttendanceCalendar
            attendanceRecords={attendanceRecords}
            currentUser={currentUser}
            employees={employees}
            isAdmin={true}
            onClockIn={onClockIn}
            onClockOut={onClockOut}
          />
        </div>
      ) : (
        /* EMPLOYEE STRICTLY ISOLATED ATTENDANCE VIEW */
        <div className="space-y-6">
          <AttendanceCalendar
            attendanceRecords={attendanceRecords}
            currentUser={currentUser}
            employees={employees}
            isAdmin={false}
            onClockIn={onClockIn}
            onClockOut={onClockOut}
          />

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1a2b3c] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0060ac]" /> My Attendance Analysis & Log History (/attendance/me/history)
                </h3>
                <p className="text-xs text-slate-500">Track your daily check-ins, check-outs, work duration, and punctuality rate</p>
              </div>

              <button
                onClick={() => setIsCorrectionModalOpen(true)}
                className="text-xs font-bold text-[#0060ac] hover:underline flex items-center gap-1"
              >
                + Request Punch Correction
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500">Present Days</span>
                <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">{presentDaysText}</p>
                <span className="text-[10px] font-bold text-emerald-600">{presentRatePct}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500">Punctuality Score</span>
                <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">{punctualityScorePct}</p>
                <span className="text-[10px] font-bold text-teal-600">{punctualityLabel}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500">Avg Daily Work Hours</span>
                <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">{avgWorkHoursStr}</p>
                <span className="text-[10px] font-bold text-blue-600">Full Shift</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500">Late Punch occurrences</span>
                <p className="text-lg font-bold text-amber-700 mt-0.5">{empLateCount} Day{empLateCount === 1 ? '' : 's'}</p>
                <span className="text-[10px] font-bold text-amber-600">{latestLateDateStr}</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
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
                  {myAttendanceLogs.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="p-3 pl-4 font-bold text-[#1a2b3c]">{att.date}</td>
                      <td className="p-3 font-mono">{att.checkIn || '--'}</td>
                      <td className="p-3 font-mono">{att.checkOut || '--'}</td>
                      <td className="p-3 font-bold text-slate-900">{att.workHours}</td>
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
          </div>
        </div>
      )}

      {/* Filter Header for Leave Requests */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Filter Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === status 
                  ? 'bg-[#1a2b3c] text-white font-bold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          Showing {filteredRequests.length} Leave Application(s)
        </span>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1a2b3c]">
            {isAdmin ? 'All Employee Leave Applications' : `My Leave Applications (${currentUser?.name})`}
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No leave applications found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#e2e8f0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates & Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions / Approver Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-xs">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={req.employeeAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.employeeName)}&background=0060ac&color=fff`} alt={req.employeeName} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <p className="font-bold text-[#1a2b3c]">{req.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{req.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {req.type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{req.startDate} to {req.endDate}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{req.days} working days</p>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      "{req.reason}"
                    </td>

                    <td className="py-3 px-4">
                      {req.status === 'Approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isAdmin && req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openActionNoteModal(req.id, 'reject')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => openActionNoteModal(req.id, 'approve')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#1a2b3c] text-white hover:bg-[#041627]"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          {req.approverNote || 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MODAL 1: SUBMIT LEAVE REQUEST (Point 5 - No Employee Select Dropdown!) */}
      {/* ---------------------------------------------------------------- */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#1a2b3c]">Submit Leave Application</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              {/* Point 5: Remove employee selection dropdown for non-admins! Auto-locked to currentUser */}
              {isAdmin ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Employee (Admin Override)</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Applicant</span>
                    <p className="font-bold text-sm text-[#1a2b3c]">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.designation} • {currentUser?.department}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white text-blue-700 font-bold border border-blue-200 text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#0060ac]" /> Self Request Only
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="PTO">Paid Time Off (PTO)</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Parental Leave">Parental Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working Days Count</label>
                <input
                  type="number"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Provide reason for time off request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0060ac] text-white font-bold rounded-lg hover:bg-[#004e8c]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL 2: ATTENDANCE CORRECTION MODAL */}
      {/* ---------------------------------------------------------------- */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#1a2b3c] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" /> Request Attendance Punch Correction
              </h3>
              <button onClick={() => setIsCorrectionModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Punch Correction Date</label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={(e) => setCorrDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Check-In</label>
                  <input
                    type="text"
                    value={corrReqIn}
                    onChange={(e) => setCorrReqIn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Check-Out</label>
                  <input
                    type="text"
                    value={corrReqOut}
                    onChange={(e) => setCorrReqOut(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Punch Correction</label>
                <textarea
                  rows={3}
                  placeholder="Explain why biometric punch was missed or delayed..."
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
                >
                  Submit Punch Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approver Note Dialog */}
      {noteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-sm p-5 shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-[#1a2b3c]">
              {noteAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <p className="text-xs text-slate-500">
              Add optional manager approval note or coverage instructions:
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Approved. Coverage assigned to Marcus Chen."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNoteModalId(null)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmActionNote}
                className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg ${
                  noteAction === 'approve' ? 'bg-[#1a2b3c]' : 'bg-red-600'
                }`}
              >
                Confirm {noteAction === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
