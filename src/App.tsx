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
  ExpenseRequest,
  SupportTicket,
  AssetItem,
  Announcement,
  NotificationItem
} from './types';

import { 
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_ATTENDANCE_CORRECTIONS, 
  INITIAL_EXPENSES, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_ASSETS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './data/hrmsArchitectureData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Database State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // HRMS Architecture Extensions State
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [attendanceCorrections, setAttendanceCorrections] = useState<AttendanceCorrection[]>(INITIAL_ATTENDANCE_CORRECTIONS);
  const [expenses, setExpenses] = useState<ExpenseRequest[]>(INITIAL_EXPENSES);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [loadingData, setLoadingData] = useState(false);

  // Load state from backend API when logged in
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [empRes, leaveRes, payRes, candRes, goalRes, actRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leaves'),
        fetch('/api/payroll'),
        fetch('/api/candidates'),
        fetch('/api/goals'),
        fetch('/api/activities'),
      ]);

      if (empRes.ok) setEmployees(await empRes.json());
      if (leaveRes.ok) setLeaveRequests(await leaveRes.json());
      if (payRes.ok) setPayroll(await payRes.json());
      if (candRes.ok) setCandidates(await candRes.json());
      if (goalRes.ok) setGoals(await goalRes.json());
      if (actRes.ok) setActivities(await actRes.json());
    } catch (error) {
      console.error('Error loading HRMS data from backend:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  // Handlers - Employees
  const handleAddEmployee = async (newEmpData: any) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEmpData, userRole: newEmpData.userRole || 'Employee' }),
      });
      if (res.ok) {
        const createdEmp = await res.json();
        setEmployees((prev) => [createdEmp, ...prev]);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployeeProfile = async (id: string, updatedData: Partial<Employee>) => {
    try {
      const res = await fetch(`/api/employees/${id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedUser } : e)));
        if (currentUser?.id === id) {
          setCurrentUser((prev) => prev ? { ...prev, ...updatedUser } : null);
        }
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
        setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, documents: docs } : e)));
        if (currentUser?.id === id) {
          setCurrentUser((prev) => prev ? { ...prev, documents: docs } : null);
        }
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
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Handlers - Leaves
  const handleRequestLeave = async (newReq: LeaveRequest) => {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
      if (res.ok) {
        const createdReq = await res.json();
        setLeaveRequests((prev) => [createdReq, ...prev]);
      } else {
        setLeaveRequests((prev) => [newReq, ...prev]);
      }
    } catch (error) {
      setLeaveRequests((prev) => [newReq, ...prev]);
    }
  };

  const handleApproveLeave = async (id: string, note?: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved', approverNote: note || `Approved by ${currentUser?.name}` }),
      });
      setLeaveRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'Approved', approverNote: note || `Approved by ${currentUser?.name}` } : r
        )
      );
    } catch (error) {
      setLeaveRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'Approved' } : r
        )
      );
    }
  };

  const handleRejectLeave = async (id: string, note?: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', approverNote: note || `Rejected by ${currentUser?.name}` }),
      });
      setLeaveRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'Rejected', approverNote: note || `Rejected by ${currentUser?.name}` } : r
        )
      );
    } catch (error) {
      setLeaveRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
      );
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

  // Handlers - Expenses
  const handleSubmitExpense = (newExp: ExpenseRequest) => {
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleApproveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
  };

  const handleRejectExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
  };

  // Handlers - Support Tickets
  const handleSubmitTicket = (newTck: SupportTicket) => {
    setSupportTickets((prev) => [newTck, ...prev]);
  };

  const handleUpdateTicketStatus = (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, lastUpdated: new Date().toISOString().split('T')[0] } : t))
    );
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
        setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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
        setPayroll((prev) => prev.map((p) => (p.id === id ? { ...p, paymentStatus: status } : p)));
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
        setPayroll((prev) => prev.map((p) => ({ ...p, paymentStatus: 'Paid' })));
      }
    } catch (error) {
      console.error('Error running payroll batch:', error);
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
        const created = await res.json();
        setGoals((prev) => [created, ...prev]);
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
        setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, progress } : g)));
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
              expenses={expenses}
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
              onApproveExpense={handleApproveExpense}
              onRejectExpense={handleRejectExpense}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onRequestLeave={handleRequestLeave}
              onRequestCorrection={handleRequestCorrection}
              onSubmitExpense={handleSubmitExpense}
              onSubmitTicket={handleSubmitTicket}
              onUpdateEmployeeProfile={handleUpdateEmployeeProfile}
              onUpdateEmployeeDocuments={handleUpdateEmployeeDocuments}
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
            />
          )}

          {currentView === 'payroll' && (
            <PayrollView
              payroll={payroll}
              currentUser={currentUser}
              onUpdatePayrollStatus={handleUpdatePayrollStatus}
              onRunPayrollBatch={handleRunPayrollBatch}
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
