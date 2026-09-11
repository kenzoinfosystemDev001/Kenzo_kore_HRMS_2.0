import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Menu, 
  Calendar as CalendarIcon,
  Building,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Gift,
  Sun,
  Lock,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { NavView, UserAccount } from '../types';

interface HeaderProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onQuickAction: (actionType: 'add-employee' | 'request-leave' | 'ai-prompt') => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const VIEW_TITLES: Record<NavView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive HR Overview',
    subtitle: 'Real-time metrics, workforce distribution, and pending enterprise approvals.'
  },
  workforce: { title: 'Workforce Directory', subtitle: 'Global employee headcount, active check-ins, and growth.' },
  approvals: { title: 'Pending Approvals Center', subtitle: 'Review leave, attendance correction & expense claims.' },
  analytics: { title: 'Workforce & Attendance Analytics', subtitle: 'Punctuality metrics, leave usage & department costs.' },
  talent: { title: 'Talent & Onboarding Pipeline', subtitle: 'Recruitment board, OKR goal tracking & certifications.' },
  operations: { title: 'HR Operations & Asset Desk', subtitle: 'Payroll batch processing, hardware assets & IT support tickets.' },
  reports: { title: 'Enterprise HR & Audit Reports', subtitle: 'Generate compliant workforce, attendance & tax registers.' },
  administration: { title: 'System Administration & RBAC', subtitle: 'Roles, security policies, Neon DB integrations & audit logs.' },
  employees: {
    title: 'Employee Directory',
    subtitle: 'Manage active workforce profiles, roles, departments, and compensation.'
  },
  onboarding: {
    title: 'Onboarding & Candidate Pipeline',
    subtitle: 'Track candidate workflows, compliance verification, and IT provisioning.'
  },
  leave: {
    title: 'Leave & Attendance Management',
    subtitle: 'Review PTO requests, parental leave allocations, and team availability calendars.'
  },
  payroll: {
    title: 'Payroll & Benefits Administration',
    subtitle: 'Bi-weekly payroll disbursements, tax deductions, and benefits management.'
  },
  performance: {
    title: 'Performance & OKR Reviews',
    subtitle: 'Monitor strategic goals, manager evaluations, and talent ratings.'
  },
  'ai-assistant': {
    title: 'Executive AI HR Advisor',
    subtitle: 'Draft policy documents, solve compliance queries, and analyze headcount trends.'
  },
  settings: {
    title: 'Enterprise Settings & Security',
    subtitle: 'Configure company policies, RBAC access controls, and integrations.'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onQuickAction,
  currentUser,
  onLogout,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const currentInfo = VIEW_TITLES[currentView] || { title: 'Kenzo HRMS', subtitle: 'Workplace Operations' };
  
  // Calendar Modal State (Point 3 - Interactive Working Calendar)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(() => new Date().getMonth());
  const [selectedDayLog, setSelectedDayLog] = useState<string | null>(null);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const todayBadgeStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrevMonth = () => {
    setSelectedMonthIdx((prev) => {
      if (prev > 0) return prev - 1;
      setSelectedYear((y) => y - 1);
      return 11;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx((prev) => {
      if (prev < 11) return prev + 1;
      setSelectedYear((y) => y + 1);
      return 0;
    });
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonthIdx(today.getMonth());
  };

  const companyHolidays = [
    { month: 0, day: 26, name: 'Republic Day', type: 'National Holiday' },
    { month: 4, day: 1, name: 'Labor Day', type: 'Global Holiday' },
    { month: 7, day: 15, name: 'Independence Day', type: 'Public Holiday' },
    { month: 9, day: 2, name: 'Gandhi Jayanti', type: 'National Holiday' },
    { month: 10, day: 10, name: 'Diwali Festival', type: 'Festival Holiday' },
    { month: 11, day: 25, name: 'Christmas Day', type: 'Public Holiday' },
  ];

  // Helper to render days grid dynamically for the selected month and year
  const renderDaysGrid = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const todayNum = currentDate.getDate();

    const isCurrentMonth = selectedYear === currentYear && selectedMonthIdx === currentMonth;
    const isFutureMonth = selectedYear > currentYear || (selectedYear === currentYear && selectedMonthIdx > currentMonth);

    const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
    const firstDayOfWeek = new Date(selectedYear, selectedMonthIdx, 1).getDay(); // 0 = Sun

    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayNum;
      const isFuture = isFutureMonth || (isCurrentMonth && day > todayNum);
      const holiday = companyHolidays.find(h => h.month === selectedMonthIdx && h.day === day);
      const isHoliday = Boolean(holiday);

      const monthShort = MONTH_NAMES[selectedMonthIdx].slice(0, 3);
      const logText = isHoliday
        ? `${monthShort} ${day}, ${selectedYear} - Holiday: ${holiday?.name} (${holiday?.type})`
        : isFuture
          ? `${monthShort} ${day}, ${selectedYear} - Scheduled Workday`
          : `${monthShort} ${day}, ${selectedYear} - Present (Checked in 09:00 AM, Clocked out 06:00 PM)`;

      cells.push(
        <button
          key={day}
          disabled={isFuture}
          onClick={() => setSelectedDayLog(logText)}
          className={`
            p-2 rounded-lg text-xs font-bold transition-all relative flex flex-col items-center justify-center
            ${isToday 
              ? 'bg-[#0060ac] text-white font-extrabold shadow-md ring-2 ring-blue-300' 
              : isHoliday
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : isFuture
                  ? 'bg-slate-100/50 text-slate-300 cursor-not-allowed border border-transparent'
                  : 'hover:bg-blue-50 text-slate-800 border border-slate-200'
            }
          `}
          title={isFuture ? 'Upcoming Day' : isHoliday ? holiday?.name : `Day ${day} Attendance`}
        >
          <span>{day}</span>
          {isHoliday && <span className="text-[9px]">🎉</span>}
          {isFuture && <Lock className="w-2.5 h-2.5 text-slate-300 absolute top-0.5 right-0.5" />}
        </button>
      );
    }
    return cells;
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e2e8f0] px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Title & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1a2b3c] tracking-tight">
                {currentInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                <Building className="w-3 h-3 text-slate-500" /> Kenzo HQ
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Global Search Bar */}
          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? "Search directory, ID..." : "Search permitted resources..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Interactive Working Calendar Button */}
          <button
            onClick={() => {
              handleJumpToToday();
              setIsCalendarOpen(true);
            }}
            className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-white px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 hover:border-[#0060ac] transition-all cursor-pointer shadow-2xs"
            title="Open Interactive Company Calendar"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#0060ac]" />
            <span>{todayDateStr}</span>
          </button>

          {/* AI Quick Button */}
          <button
            onClick={() => onQuickAction('ai-prompt')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 text-[#0060ac] hover:bg-teal-100/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#48bbbe]" />
            <span className="hidden sm:inline">Ask AI HR</span>
          </button>

          {/* Primary Action Button */}
          {isAdmin ? (
            <button
              onClick={() => onQuickAction('add-employee')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1a2b3c] text-white hover:bg-[#041627] shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Profile</span>
            </button>
          ) : (
            <button
              onClick={() => onQuickAction('request-leave')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0060ac] text-white hover:bg-[#004e8c] shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Request Leave</span>
            </button>
          )}

          {/* Logged In User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=0060ac&color=fff`}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden sm:block text-xs text-left">
              <p className="font-bold text-slate-800 leading-tight">{currentUser?.name}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
              }`}>
                {currentUser?.role}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* INTERACTIVE FULL-YEAR CALENDAR MODAL */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#0060ac]" />
                <h3 className="text-base font-bold text-[#1a2b3c]">Full Year Workday & Attendance Calendar</h3>
              </div>
              <button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Month Selector */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={selectedMonthIdx}
                  onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
                  className="font-bold text-sm text-[#1a2b3c] bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx}>{m} {selectedYear}</option>
                  ))}
                </select>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleJumpToToday}
                className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full border border-teal-200 transition-colors cursor-pointer"
                title="Click to jump to today"
              >
                Today: {todayBadgeStr}
              </button>
            </div>

            {/* Past 1 Month Attendance Analysis Box */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 text-xs">
              <h4 className="font-bold text-[#0060ac] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> Past 1 Month Attendance Analysis
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="bg-white p-1.5 rounded-lg border border-blue-100 font-bold text-slate-800">
                  <span>22 / 23</span>
                  <p className="text-[9px] text-slate-500 font-normal">Present Days</p>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-blue-100 font-bold text-emerald-700">
                  <span>96.2%</span>
                  <p className="text-[9px] text-slate-500 font-normal">Punctuality</p>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-blue-100 font-bold text-purple-700">
                  <span>8h 45m</span>
                  <p className="text-[9px] text-slate-500 font-normal">Avg Daily Hours</p>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-blue-100 font-bold text-amber-700">
                  <span>1 Day</span>
                  <p className="text-[9px] text-slate-500 font-normal">Late Punch</p>
                </div>
              </div>
            </div>

            {/* Days Grid */}
            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-7 text-center font-bold text-slate-400 py-1 uppercase text-[10px]">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="grid grid-cols-7 text-center gap-1 text-xs font-medium">
                {renderDaysGrid()}
              </div>
            </div>

            {selectedDayLog && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                📅 {selectedDayLog}
              </div>
            )}

            {/* Upcoming Holidays List */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" /> Upcoming Company Holidays
              </h4>

              <div className="space-y-1 max-h-28 overflow-y-auto">
                {companyHolidays.map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#1a2b3c]">{h.name}</p>
                      <p className="text-[10px] text-slate-500">{h.type}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {MONTH_NAMES[h.month].slice(0, 3)} {String(h.day).padStart(2, '0')}, {selectedYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
