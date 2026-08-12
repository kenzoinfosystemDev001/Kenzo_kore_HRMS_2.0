import React from 'react';
import { 
  Employee, 
  Candidate, 
  LeaveRequest, 
  PayrollRecord, 
  ActivityLog, 
  NavView, 
  UserAccount, 
  EmployeeDocument,
  AttendanceRecord,
  AttendanceCorrection,
  SupportTicket,
  AssetItem,
  Announcement,
  NotificationItem
} from '../../types';
import { AdminControlCenterView } from './AdminControlCenterView';
import { EmployeeDashboardView } from './EmployeeDashboardView';

interface DashboardViewProps {
  employees: Employee[];
  candidates: Candidate[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  activities: ActivityLog[];
  attendanceRecords: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  supportTickets: SupportTicket[];
  assets: AssetItem[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  currentUser: UserAccount | null;
  onNavigate: (view: NavView) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onApproveCorrection: (id: string) => void;
  onRejectCorrection: (id: string) => void;
  onUpdateTicketStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
  onRequestLeave: (newReq: LeaveRequest) => void;
  onRequestCorrection: (newCor: AttendanceCorrection) => void;
  onSubmitTicket: (newTck: SupportTicket) => void;
  onUpdateEmployeeProfile?: (id: string, updatedData: Partial<Employee>) => void;
  onUpdateEmployeeDocuments?: (id: string, docs: EmployeeDocument[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const isAdmin = props.currentUser?.role === 'Admin';

  if (isAdmin) {
    return (
      <AdminControlCenterView
        employees={props.employees}
        candidates={props.candidates}
        leaveRequests={props.leaveRequests}
        payroll={props.payroll}
        activities={props.activities}
        attendanceRecords={props.attendanceRecords}
        attendanceCorrections={props.attendanceCorrections}
        supportTickets={props.supportTickets}
        assets={props.assets}
        currentUser={props.currentUser}
        onNavigate={props.onNavigate}
        onApproveLeave={props.onApproveLeave}
        onRejectLeave={props.onRejectLeave}
        onApproveCorrection={props.onApproveCorrection}
        onRejectCorrection={props.onRejectCorrection}
        onUpdateTicketStatus={props.onUpdateTicketStatus}
      />
    );
  }

  return (
    <EmployeeDashboardView
      employees={props.employees}
      leaveRequests={props.leaveRequests}
      payroll={props.payroll}
      attendanceRecords={props.attendanceRecords}
      attendanceCorrections={props.attendanceCorrections}
      supportTickets={props.supportTickets}
      assets={props.assets}
      announcements={props.announcements}
      notifications={props.notifications}
      currentUser={props.currentUser}
      onNavigate={props.onNavigate}
      onRequestLeave={props.onRequestLeave}
      onRequestCorrection={props.onRequestCorrection}
      onSubmitTicket={props.onSubmitTicket}
      onUpdateEmployeeProfile={props.onUpdateEmployeeProfile}
      onUpdateEmployeeDocuments={props.onUpdateEmployeeDocuments}
    />
  );
};
