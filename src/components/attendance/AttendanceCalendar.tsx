import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Lock, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { AttendanceRecord, UserAccount, Employee } from '../../types';

interface AttendanceCalendarProps {
  attendanceRecords: AttendanceRecord[];
  currentUser: UserAccount | null;
  employees?: Employee[];
  isAdmin?: boolean;
  onClockIn?: (employeeId: string, employeeName: string) => void;
  onClockOut?: (employeeId: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceRecords = [],
  currentUser,
  employees = [],
  isAdmin = false,
  onClockIn,
  onClockOut,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 13)); // Default August 2026
  const [selectedDateStr, setSelectedDateStr] = useState('2026-08-13');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(currentUser?.id || 'EMP-1001');

  // Real-time Clock
  const [nowTime, setNowTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = '2026-08-13'; // Match current system date
  const hours = nowTime.getHours();
  const isClockInAfter5PM = hours >= 17; // 5:00 PM restriction

  const targetEmpId = isAdmin ? selectedEmployeeId : (currentUser?.id || 'EMP-1001');
  const targetEmpName = isAdmin 
    ? (employees.find(e => e.id === selectedEmployeeId)?.name || currentUser?.name || 'Employee')
    : (currentUser?.name || 'Employee');

  // Filter logs for the selected employee
  const targetLogs = attendanceRecords.filter(a => a.employeeId === targetEmpId || a.employeeName.toLowerCase() === targetEmpName.toLowerCase());

  // Today's attendance record
  const todayRecord = targetLogs.find(a => a.date === todayStr);
  const isClockedInToday = Boolean(todayRecord?.checkIn);
  const isClockedOutToday = Boolean(todayRecord?.checkOut);

  // Auto 7:05 PM clock-out logic on frontend
  const isAfter705PM = hours > 19 || (hours === 19 && nowTime.getMinutes() >= 5);

  // Month Calendar Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (dayNum: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = dayNum.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Helper to get status of any date on calendar
  const getDayAttendanceStatus = (dateStr: string) => {
    const record = targetLogs.find(a => a.date === dateStr);
    if (record) {
      if (record.status === 'Present') return { type: 'present', label: 'Present', record };
      if (record.status === 'Late') return { type: 'late', label: 'Late', record };
      if (record.status === 'Half Day') return { type: 'halfday', label: 'Half Day', record };
      return { type: 'present', label: record.status, record };
    }

    // If past weekday with no record => Absent
    if (dateStr < todayStr) {
      const d = new Date(dateStr);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        return { type: 'absent', label: 'Absent', record: null };
      }
    }

    return { type: 'none', label: 'Off / Unmarked', record: null };
  };

  // Currently selected date record details
  const selectedDayInfo = getDayAttendanceStatus(selectedDateStr);
  const isSelectedDatePast = selectedDateStr < todayStr;
  const isSelectedDateFuture = selectedDateStr > todayStr;
  const isSelectedDateToday = selectedDateStr === todayStr;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0060ac] border border-blue-200 uppercase tracking-wider">
            Interactive Attendance Calendar
          </span>
          <h2 className="text-xl font-extrabold text-[#1a2b3c] mt-1 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0060ac]" /> {monthNames[month]} {year} Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-day marking on current date only. Past & future dates locked.
          </p>
        </div>

        {/* Right Admin / Employee controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {isAdmin && employees.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Employee:</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentDate(new Date(2026, 7, 13));
                setSelectedDateStr(todayStr);
              }}
              className="px-3 py-1 bg-white text-xs font-bold text-[#0060ac] rounded-lg shadow-2xs"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Rules Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs"></span>
          <span className="font-semibold text-slate-700">Present (Green)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs"></span>
          <span className="font-semibold text-slate-700">Late Arrival (Yellow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-2xs"></span>
          <span className="font-semibold text-slate-700">Absent (Red)</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500">Locked (Past/Future)</span>
        </div>
      </div>

      {/* Main Calendar Grid & Detail Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2/3) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            {daysOfWeek.map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset cells before 1st of month */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 bg-slate-50/50 rounded-xl border border-slate-100/50"></div>
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatDateString(dayNum);
              const dayStatus = getDayAttendanceStatus(dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;
              const isPast = dateStr < todayStr;
              const isFuture = dateStr > todayStr;

              // Color styles
              let borderBgStyle = 'bg-white border-slate-200 hover:border-slate-300';
              let badgeColor = '';

              if (dayStatus.type === 'present') {
                borderBgStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold';
                badgeColor = 'bg-emerald-500 text-white';
              } else if (dayStatus.type === 'late') {
                borderBgStyle = 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold';
                badgeColor = 'bg-amber-500 text-white';
              } else if (dayStatus.type === 'halfday') {
                borderBgStyle = 'bg-orange-50/80 border-orange-300 text-orange-950 font-bold';
                badgeColor = 'bg-orange-500 text-white';
              } else if (dayStatus.type === 'absent') {
                borderBgStyle = 'bg-red-50/80 border-red-300 text-red-950 font-bold';
                badgeColor = 'bg-red-500 text-white';
              } else if (isPast || isFuture) {
                borderBgStyle = 'bg-slate-50/60 border-slate-200/80 text-slate-400';
              }

              if (isSelected) {
                borderBgStyle += ' ring-2 ring-[#0060ac] shadow-sm';
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 p-2 rounded-xl border flex flex-col justify-between items-start transition-all relative text-left ${borderBgStyle}`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 rounded-full bg-[#0060ac] text-white flex items-center justify-center' : ''}`}>
                      {dayNum}
                    </span>
                    {(isPast || isFuture) && !isToday && (
                      <Lock className="w-3 h-3 text-slate-300" />
                    )}
                  </div>

                  {dayStatus.type !== 'none' && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-tight ${badgeColor}`}>
                      {dayStatus.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector & Clock-In Enforcement Panel (1/3) */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <h4 className="font-extrabold text-sm text-[#1a2b3c]">
                  Date Inspector: {selectedDateStr}
                </h4>
                <p className="text-[11px] text-slate-500">{targetEmpName}</p>
              </div>

              {isSelectedDateToday ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Current Date
                </span>
              ) : isSelectedDatePast ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked (Past)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked (Future)
                </span>
              )}
            </div>

            {/* Attendance Status Summary for Selected Date */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Attendance Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  selectedDayInfo.type === 'present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  selectedDayInfo.type === 'late' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  selectedDayInfo.type === 'halfday' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                  selectedDayInfo.type === 'absent' ? 'bg-red-100 text-red-800 border border-red-300' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {selectedDayInfo.label}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Check-In Time:</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedDayInfo.record?.checkIn || '--'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Check-Out Time:</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedDayInfo.record?.checkOut || (selectedDayInfo.record?.checkIn ? (isAfter705PM ? '07:05 PM (Auto)' : '--') : '--')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Work Duration:</span>
                <span className="font-bold text-[#1a2b3c]">
                  {selectedDayInfo.record?.workHours || '0h 0m'}
                </span>
              </div>
            </div>

            {/* Lock Restrictions & Rules Notification */}
            {isSelectedDatePast && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Past Date Locked:</strong> Attendance on past dates is read-only. Clock-in is restricted to the current date.
                </p>
              </div>
            )}

            {isSelectedDateFuture && (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Future Date Locked:</strong> You cannot mark attendance for future dates.
                </p>
              </div>
            )}

            {isSelectedDateToday && (
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0060ac]">
                    <Info className="w-4 h-4" /> Live Rules for Today ({todayStr}):
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 font-medium">
                    <li>No auto clock-in (Employee action required)</li>
                    <li>Clock-in unavailable after <strong>05:00 PM</strong></li>
                    <li>Auto clocked-out at <strong>07:05 PM</strong></li>
                  </ul>
                </div>

                {/* Clock-In / Clock-Out Action Buttons for Today */}
                {!isClockedInToday ? (
                  isClockInAfter5PM ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold text-center flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Clock-in window closed for today after 05:00 PM
                    </div>
                  ) : (
                    onClockIn && (
                      <button
                        onClick={() => onClockIn(targetEmpId, targetEmpName)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" /> Clock In Now ({nowTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})
                      </button>
                    )
                  )
                ) : !isClockedOutToday ? (
                  onClockOut && (
                    <button
                      onClick={() => onClockOut(targetEmpId)}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" /> Clock Out Now
                    </button>
                  )
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Today's shift completed cleanly!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
