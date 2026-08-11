import React from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Menu, 
  Calendar,
  Building,
  LogOut
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
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
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
            placeholder="Search directory, ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayDate}</span>
        </div>

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
  );
};
