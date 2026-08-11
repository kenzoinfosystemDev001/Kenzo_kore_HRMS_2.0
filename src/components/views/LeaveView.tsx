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
  FileText
} from 'lucide-react';
import { LeaveRequest, LeaveType, Employee } from '../../types';

interface LeaveViewProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  onApproveLeave: (id: string, note?: string) => void;
  onRejectLeave: (id: string, note?: string) => void;
  onRequestLeave: (request: LeaveRequest) => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({
  leaveRequests,
  employees,
  onApproveLeave,
  onRejectLeave,
  onRequestLeave,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteAction, setNoteAction] = useState<'approve' | 'reject'>('approve');

  // Request Form state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('PTO');
  const [startDate, setStartDate] = useState('2026-08-20');
  const [endDate, setEndDate] = useState('2026-08-22');
  const [daysCount, setDaysCount] = useState(3);
  const [reason, setReason] = useState('');

  const filteredRequests = leaveRequests.filter((r) => 
    filterStatus === 'All' ? true : r.status === filterStatus
  );

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp) return;

    const newReq: LeaveRequest = {
      id: `LR-${500 + leaveRequests.length + 1}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
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
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-amber-600 uppercase">Pending Review</span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">{pendingCount} Requests</p>
          <p className="text-xs text-slate-500 mt-0.5">Requires manager sign-off</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase font-semibold">Approved Leave</span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">{approvedCount} Approved</p>
          <p className="text-xs text-slate-500 mt-0.5">Active PTO & parental schedules</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Submit Request</span>
            <p className="text-xs text-slate-600 mt-1">Book employee time off or sick leave</p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3.5 py-2 bg-[#1a2b3c] text-white text-xs font-semibold rounded-lg hover:bg-[#041627] flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Request Leave
          </button>
        </div>
      </div>

      {/* Filter Header */}
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
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e2e8f0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates & Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-xs">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={req.employeeAvatar} alt={req.employeeName} className="w-8 h-8 rounded-full border border-slate-200" />
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
                    {req.status === 'Pending' ? (
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
                      <span className="text-[11px] text-slate-400 italic">
                        {req.approverNote || 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Leave Request Modal */}
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
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
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
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working Days Count</label>
                <input
                  type="number"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Summer vacation with family"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#1a2b3c] text-white font-semibold rounded-lg hover:bg-[#041627]"
                >
                  Submit Application
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
