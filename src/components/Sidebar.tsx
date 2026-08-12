import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  DollarSign, 
  Award, 
  Sparkles, 
  Settings, 
  Building2, 
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { NavView, UserAccount } from '../types';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  pendingLeavesCount: number;
  activeOnboardingCount: number;
  employeesCount: number;
  currentUser: UserAccount | null;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingLeavesCount,
  activeOnboardingCount,
  employeesCount,
  currentUser,
  onLogout,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const isAdmin = currentUser?.role === 'Admin';

  const navItems = [
    { id: 'dashboard' as NavView, label: isAdmin ? 'Executive Overview' : 'Employee Overview', icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 'employees' as NavView, label: 'Employee Directory', icon: Users, badge: `${employeesCount}` }] : []),
    ...(isAdmin ? [{ id: 'onboarding' as NavView, label: 'Onboarding Pipeline', icon: UserPlus, badge: activeOnboardingCount > 0 ? `${activeOnboardingCount}` : undefined, badgeColor: 'bg-[#48bbbe] text-white' }] : []),
    { id: 'leave' as NavView, label: 'Leave & Attendance', icon: CalendarCheck, badge: (isAdmin && pendingLeavesCount > 0) ? `${pendingLeavesCount}` : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'payroll' as NavView, label: isAdmin ? 'Payroll & Benefits' : 'My Payroll', icon: DollarSign },
    { id: 'performance' as NavView, label: 'Performance & Goals', icon: Award },
    { id: 'ai-assistant' as NavView, label: 'AI HR Assistant', icon: Sparkles, isAi: true },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#1a2b3c] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header Logo */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0060ac] flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/40">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5 truncate">
                  Kenzo_Kore_HRMS
                </h1>
                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                  {currentUser?.role === 'Admin' ? 'Admin Portal' : 'Employee Portal'}
                </p>
              </div>
            </div>

            {/* Mobile Close */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav Section */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Admin Console' : 'Employee Workspace'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group
                    ${isActive 
                      ? 'bg-slate-800/90 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                    }
                  `}
                >
                  {/* Left Active Accent Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#4a90e2] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive 
                        ? 'text-[#4a90e2]' 
                        : item.isAi 
                          ? 'text-cyan-400 animate-pulse' 
                          : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span className={item.isAi ? 'bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-semibold' : ''}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Card & Security Footer */}
        <div className="p-3 border-t border-slate-700/60 space-y-3">
          {/* DB connection status badge */}
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#48bbbe]" />
              <div>
                <p className="text-xs font-medium text-slate-200">PostgreSQL Neon Active</p>
                <p className="text-[10px] text-slate-400">RBAC Hashed Session</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Current User Info */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=0060ac&color=fff`} 
                alt={currentUser?.name} 
                className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-teal-400 font-semibold truncate">{currentUser?.role} • {currentUser?.department}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
