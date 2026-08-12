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
  Sun
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
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const companyHolidays = [
    { date: 'Aug 15, 2026', name: 'Independence Day', type: 'Public Holiday' },
    { date: 'Sep 07, 2026', name: 'Labor Day', type: 'Global Holiday' },
    { date: 'Oct 02, 2026', name: 'Gandhi Jayanti', type: 'National Holiday' },
    { date: 'Nov 10, 2026', name: 'Diwali Festival', type: 'Festival Holiday' },
    { date: 'Dec 25, 2026', name: 'Christmas Day', type: 'Public Holiday' },
  ];

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

          {/* Interactive Working Calendar Button (Point 3) */}
          <button
            onClick={() => setIsCalendarOpen(true)}
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

      {/* ---------------------------------------------------------------- */}
      {/* INTERACTIVE WORKING CALENDAR MODAL (Point 3) */}
      {/* ---------------------------------------------------------------- */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#0060ac]" />
                <h3 className="text-base font-bold text-[#1a2b3c]">Company & Workday Calendar</h3>
              </div>
              <button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Month Selector Header */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedMonth('July 2026')}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-[#1a2b3c]">{selectedMonth}</span>
                <button 
                  onClick={() => setSelectedMonth('September 2026')}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Today: Aug 12, 2026
              </span>
            </div>

            {/* August 2026 Days Grid */}
            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-7 text-center font-bold text-slate-400 py-1 uppercase text-[10px]">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="grid grid-cols-7 text-center gap-1 text-xs font-medium">
                {/* Empty padding for month start */}
                <div className="p-2 text-slate-300">26</div>
                <div className="p-2 text-slate-300">27</div>
                <div className="p-2 text-slate-300">28</div>
                <div className="p-2 text-slate-300">29</div>
                <div className="p-2 text-slate-300">30</div>
                <div className="p-2 text-slate-300">31</div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 font-bold">1</div>

                <div className="p-2 rounded-lg hover:bg-slate-100">2</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">3</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">4</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">5</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">6</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">7</div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 font-bold">8</div>

                <div className="p-2 rounded-lg hover:bg-slate-100">9</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">10</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">11</div>

                {/* Today Highlight (Aug 12) */}
                <div className="p-2 rounded-lg bg-[#0060ac] text-white font-extrabold shadow-md ring-2 ring-blue-300">
                  12
                </div>

                <div className="p-2 rounded-lg hover:bg-slate-100">13</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">14</div>

                {/* Holiday Highlight (Aug 15 Independence Day) */}
                <div className="p-2 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-300" title="Independence Day Holiday">
                  15 🎉
                </div>

                <div className="p-2 rounded-lg hover:bg-slate-100">16</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">17</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">18</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">19</div>
                <div className="p-2 rounded-lg bg-purple-100 text-purple-900 font-bold" title="Scheduled PTO">20 🌴</div>
                <div className="p-2 rounded-lg bg-purple-100 text-purple-900 font-bold" title="Scheduled PTO">21 🌴</div>
                <div className="p-2 rounded-lg bg-purple-100 text-purple-900 font-bold" title="Scheduled PTO">22 🌴</div>

                <div className="p-2 rounded-lg hover:bg-slate-100">23</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">24</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">25</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">26</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">27</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">28</div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 font-bold">29</div>

                <div className="p-2 rounded-lg hover:bg-slate-100">30</div>
                <div className="p-2 rounded-lg hover:bg-slate-100">31</div>
              </div>
            </div>

            {/* Upcoming Holidays List */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" /> Upcoming Company Holidays & Events
              </h4>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {companyHolidays.map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#1a2b3c]">{h.name}</p>
                      <p className="text-[10px] text-slate-500">{h.type}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {h.date}
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
