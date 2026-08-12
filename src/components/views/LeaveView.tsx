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
  Edit3
} from 'lucide-react';
import { LeaveRequest, LeaveType, Employee, UserAccount, AttendanceRecord, AttendanceCorrection } from '../../types';

interface LeaveViewProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  attendanceRecords?: AttendanceRecord[];
  currentUser: UserAccount | null;
  onApproveLeave: (id: string, note?: string) => void;
  onRejectLeave: (id: string, note?: string) => void;
  onRequestLeave: (request: LeaveRequest) => void;
  onRequestCorrection?: (newCor: AttendanceCorrection) => void;
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
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteAction, setNoteAction] = useState<'approve' | 'reject'>('approve');

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
  // Employees see ONLY their own leave requests!
  const myLeaveRequests = isAdmin 
    ? leaveRequests 
    : leaveRequests.filter(r => r.employeeId === currentUser?.id || r.employeeName.toLowerCase() === currentUser?.name.toLowerCase());

  const filteredRequests = myLeaveRequests.filter((r) => 
    filterStatus === 'All' ? true : r.status === filterStatus
  );

  const pendingCount = myLeaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = myLeaveRequests.filter(r => r.status === 'Approved').length;

  // Filter attendance records for current employee
  const myAttendanceLogs = isAdmin 
    ? attendanceRecords 
    : attendanceRecords.filter(a => a.employeeId === currentUser?.id || a.employeeName.toLowerCase() === currentUser?.name.toLowerCase());

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
      {/* ATTENDANCE ANALYSIS & LOG HISTORY FOR EMPLOYEE (Point 4) */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1a2b3c] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0060ac]" />
              {isAdmin ? 'Workforce Attendance Analysis & Punch Logs' : 'My Attendance Analysis & Log History (/attendance/me/history)'}
            </h3>
            <p className="text-xs text-slate-500">Track daily check-ins, check-outs, work duration, and punctuality rate</p>
          </div>

          {!isAdmin && (
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="text-xs font-bold text-[#0060ac] hover:underline flex items-center gap-1"
            >
              + Request Punch Correction
            </button>
          )}
        </div>

        {/* Employee Attendance KPI Mini Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500">Present Days</span>
            <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">21 / 22 Days</p>
            <span className="text-[10px] font-bold text-emerald-600">95.4% Rate</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500">Punctuality Score</span>
            <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">96.2%</p>
            <span className="text-[10px] font-bold text-teal-600">On Time</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500">Avg Daily Work Hours</span>
            <p className="text-lg font-bold text-[#1a2b3c] mt-0.5">8h 45m</p>
            <span className="text-[10px] font-bold text-blue-600">Full Shift</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500">Late Punch occurrences</span>
            <p className="text-lg font-bold text-amber-700 mt-0.5">1 Day</p>
            <span className="text-[10px] font-bold text-amber-600">Aug 10</span>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 pl-4">Date</th>
                <th className="p-3">Employee</th>
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
                  <td className="p-3 font-semibold text-slate-800">{att.employeeName}</td>
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
