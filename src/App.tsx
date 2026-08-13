import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/auth/LoginView';

import { DashboardView } from './components/views/DashboardView';
import { EmployeesView } from './components/views/EmployeesView';
import { OnboardingView } from './components/views/OnboardingView';
import { LeaveView } from './components/views/LeaveView';
import { PayrollView } from './components/views/PayrollView';
import { PerformanceView } from './components/views/PerformanceView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SettingsView } from './components/views/SettingsView';

import { 
  NavView, 
  Employee, 
  Candidate, 
  LeaveRequest, 
  PayrollRecord, 
  PerformanceGoal, 
  ActivityLog,
  UserAccount,
  EmployeeDocument,
  AttendanceRecord,
  AttendanceCorrection,
  SupportTicket,
  AssetItem,
  Announcement,
  NotificationItem
} from './types';

import { 
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_ATTENDANCE_CORRECTIONS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_ASSETS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './data/hrmsArchitectureData';

export default function App() {
  // 100% Server & PostgreSQL Database State (No LocalStorage)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Database State - Fetched directly from Neon PostgreSQL server
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // HRMS Architecture Extensions State - Server Synced
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [attendanceCorrections, setAttendanceCorrections] = useState<AttendanceCorrection[]>(INITIAL_ATTENDANCE_CORRECTIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Load state directly from Neon PostgreSQL Database via Express API Server
  const fetchAllData = async () => {
    try {
      const [empRes, leaveRes, payRes, candRes, goalRes, actRes, tckRes, attRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leaves'),
        fetch('/api/payroll'),
        fetch('/api/candidates'),
        fetch('/api/goals'),
        fetch('/api/activities'),
        fetch('/api/helpdesk'),
        fetch('/api/attendance'),
      ]);

      if (empRes.ok) {
        const fetchedEmps = await empRes.json();
        setEmployees(fetchedEmps);
        // If user is currently logged in, sync their profile directly with latest PostgreSQL row
        if (currentUser) {
          const match = fetchedEmps.find((e: Employee) => e.id === currentUser.id || e.email.toLowerCase() === currentUser.email.toLowerCase());
          if (match) {
            setCurrentUser(match);
          }
        }
      }
      if (leaveRes.ok) setLeaveRequests(await leaveRes.json());
      if (payRes.ok) setPayroll(await payRes.json());
      if (candRes.ok) setCandidates(await candRes.json());
      if (goalRes.ok) setGoals(await goalRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (tckRes.ok) setSupportTickets(await tckRes.json());
      if (attRes.ok) setAttendanceRecords(await attRes.json());
    } catch (error) {
      console.error('Error loading data from Neon PostgreSQL database:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
      // Real-time server sync polling every 5 seconds for cross-device consistency!
      const interval = setInterval(() => {
        fetchAllData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser?.id]);

  // Handlers - Clock In / Clock Out (Direct Server Calls)
  const handleClockIn = async (employeeId: string, employeeName: string) => {
    try {
      const res = await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, employeeName }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Clock-in failed');
        return;
      }
      await fetchAllData();
    } catch (error) {
      console.error('Clock in error:', error);
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      const res = await fetch('/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Clock out error:', error);
    }
  };

  // Handlers - Employees (Direct PostgreSQL Calls)
  const handleAddEmployee = async (newEmpData: any) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEmpData, userRole: newEmpData.userRole || 'Employee' }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployeeProfile = async (id: string, updatedData: any) => {
    try {
      const res = await fetch(`/api/employees/${id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating employee profile:', error);
    }
  };

  const handleUpdateEmployeeDocuments = async (id: string, docs: EmployeeDocument[]) => {
    try {
      const res = await fetch(`/api/employees/${id}/documents`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docs }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating employee documents:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Handlers - Leaves (Direct PostgreSQL Calls)
  const handleRequestLeave = async (newReq: LeaveRequest) => {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error requesting leave:', error);
    }
  };

  const handleApproveLeave = async (id: string, note?: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved', approverNote: note || `Approved by ${currentUser?.name}` }),
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (id: string, note?: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', approverNote: note || `Rejected by ${currentUser?.name}` }),
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  // Handlers - Attendance Corrections
  const handleRequestCorrection = (newCor: AttendanceCorrection) => {
    setAttendanceCorrections((prev) => [newCor, ...prev]);
  };

  const handleApproveCorrection = (id: string) => {
    setAttendanceCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c))
    );
  };

  const handleRejectCorrection = (id: string) => {
    setAttendanceCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c))
    );
  };

  // Handlers - Helpdesk Support Tickets (Direct PostgreSQL Calls)
  const handleSubmitTicket = async (newTck: SupportTicket) => {
    try {
      const res = await fetch('/api/helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTck),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error submitting helpdesk ticket:', error);
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    try {
      const res = await fetch(`/api/helpdesk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  // Handlers - Candidate / Onboarding
  const handleUpdateCandidate = async (updated: Candidate) => {
    try {
      const res = await fetch(`/api/candidates/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  // Handlers - Payroll
  const handleUpdatePayrollStatus = async (id: string, status: 'Paid' | 'Processing' | 'Hold') => {
    try {
      const res = await fetch(`/api/payroll/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating payroll:', error);
    }
  };

  const handleRunPayrollBatch = async () => {
    try {
      const res = await fetch('/api/payroll/batch', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error running payroll batch:', error);
    }
  };

  const handleCreatePayroll = async (payrollData: any) => {
    try {
      const res = await fetch('/api/payroll/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payrollData),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error creating payroll:', error);
    }
  };

  // Handlers - Goals
  const handleAddGoal = async (newGoal: PerformanceGoal) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoalProgress = async (id: string, progress: number) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  const handleQuickAction = (actionType: 'add-employee' | 'request-leave' | 'ai-prompt') => {
    if (actionType === 'add-employee') {
      setCurrentView('employees');
    } else if (actionType === 'request-leave') {
      setCurrentView('leave');
    } else if (actionType === 'ai-prompt') {
      setCurrentView('ai-assistant');
    }
  };

  // Render Login landing page if user is unauthenticated
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const activeOnboardingCount = candidates.filter((c) => c.stage === 'Onboarding' || c.stage === 'Offer Extended').length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        pendingLeavesCount={pendingLeavesCount}
        activeOnboardingCount={activeOnboardingCount}
        employeesCount={employees.length}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-w-0">
        {/* Header Bar */}
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onQuickAction={handleQuickAction}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />

        {/* View Router Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              employees={employees}
              candidates={candidates}
              leaveRequests={leaveRequests}
              payroll={payroll}
              activities={activities}
              attendanceRecords={attendanceRecords}
              attendanceCorrections={attendanceCorrections}
              supportTickets={supportTickets}
              assets={assets}
              announcements={announcements}
              notifications={notifications}
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onApproveCorrection={handleApproveCorrection}
              onRejectCorrection={handleRejectCorrection}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onRequestLeave={handleRequestLeave}
              onRequestCorrection={handleRequestCorrection}
              onSubmitTicket={handleSubmitTicket}
              onUpdateEmployeeProfile={handleUpdateEmployeeProfile}
              onUpdateEmployeeDocuments={handleUpdateEmployeeDocuments}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}

          {currentView === 'employees' && (
            <EmployeesView
              employees={employees}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployeeProfile={handleUpdateEmployeeProfile}
              onUpdateEmployeeDocuments={handleUpdateEmployeeDocuments}
              onDeleteEmployee={handleDeleteEmployee}
              currentUser={currentUser}
            />
          )}

          {currentView === 'onboarding' && (
            <OnboardingView
              candidates={candidates}
              onUpdateCandidate={handleUpdateCandidate}
            />
          )}

          {currentView === 'leave' && (
            <LeaveView
              leaveRequests={leaveRequests}
              employees={employees}
              attendanceRecords={attendanceRecords}
              currentUser={currentUser}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onRequestLeave={handleRequestLeave}
              onRequestCorrection={handleRequestCorrection}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}

          {currentView === 'payroll' && (
            <PayrollView
              payroll={payroll}
              employees={employees}
              currentUser={currentUser}
              onUpdatePayrollStatus={handleUpdatePayrollStatus}
              onRunPayrollBatch={handleRunPayrollBatch}
              onCreatePayroll={handleCreatePayroll}
            />
          )}

          {currentView === 'performance' && (
            <PerformanceView
              goals={goals}
              employees={employees}
              onAddGoal={handleAddGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
            />
          )}

          {currentView === 'ai-assistant' && (
            <AiAssistantView employees={employees} />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
