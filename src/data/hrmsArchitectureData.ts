import { 
  AttendanceRecord, 
  AttendanceCorrection, 
  ExpenseRequest, 
  SupportTicket, 
  AssetItem, 
  Announcement, 
  NotificationItem 
} from '../types';

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: 'ATT-101', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-12', checkIn: '09:05 AM', checkOut: null, workHours: '6h 20m', status: 'Present', location: 'Delhi HQ' },
  { id: 'ATT-102', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-11', checkIn: '09:00 AM', checkOut: '06:15 PM', workHours: '9h 15m', status: 'Present', location: 'Delhi HQ' },
  { id: 'ATT-103', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-10', checkIn: '09:12 AM', checkOut: '06:05 PM', workHours: '8h 53m', status: 'Late', location: 'Delhi HQ' },
  { id: 'ATT-104', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-09', checkIn: '09:00 AM', checkOut: '06:00 PM', workHours: '9h 00m', status: 'Present', location: 'Remote' },
  { id: 'ATT-105', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-08', checkIn: null, checkOut: null, workHours: '0h 00m', status: 'On Leave', location: 'N/A' },
  { id: 'ATT-106', employeeId: 'EMP-1002', employeeName: 'Sarah Jenkins', date: '2026-08-12', checkIn: '08:55 AM', checkOut: null, workHours: '6h 30m', status: 'Present', location: 'London Office' },
  { id: 'ATT-107', employeeId: 'EMP-1003', employeeName: 'Michael Chen', date: '2026-08-12', checkIn: '09:30 AM', checkOut: null, workHours: '5h 55m', status: 'Late', location: 'San Francisco HQ' },
  { id: 'ATT-108', employeeId: 'EMP-1004', employeeName: 'Priya Sharma', date: '2026-08-12', checkIn: null, checkOut: null, workHours: '0h 00m', status: 'On Leave', location: 'Bangalore Tech Park' },
];

export const INITIAL_ATTENDANCE_CORRECTIONS: AttendanceCorrection[] = [
  { id: 'COR-01', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', date: '2026-08-10', currentCheckIn: '09:12 AM', currentCheckOut: '06:05 PM', requestedCheckIn: '09:00 AM', requestedCheckOut: '06:05 PM', reason: 'Biometric Scanner Gate 2 malfunction during morning rush.', status: 'Pending', requestedOn: '2026-08-11' },
  { id: 'COR-02', employeeId: 'EMP-1003', employeeName: 'Michael Chen', date: '2026-08-05', currentCheckIn: '10:15 AM', currentCheckOut: '06:30 PM', requestedCheckIn: '09:00 AM', requestedCheckOut: '06:30 PM', reason: 'Early client meeting at offsite location.', status: 'Approved', requestedOn: '2026-08-06' },
];

export const INITIAL_EXPENSES: ExpenseRequest[] = [
  { id: 'EXP-501', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', category: 'Software Tool', amount: 149.00, date: '2026-08-02', description: 'Annual JetBrains IDE All Products License renewal', status: 'Approved', approverNote: 'Approved under Tech Budget 2026' },
  { id: 'EXP-502', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', category: 'Client Meeting', amount: 85.50, date: '2026-08-07', description: 'Lunch meeting with AWS Solutions Architect team', status: 'Pending' },
  { id: 'EXP-503', employeeId: 'EMP-1002', employeeName: 'Sarah Jenkins', category: 'Travel', amount: 620.00, date: '2026-08-01', description: 'Round-trip flight to Berlin Product Summit', status: 'Approved', approverNote: 'Executive travel pre-authorized' },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TCK-901', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', subject: 'Requesting 27" 4K External Monitor for Engineering Desk', category: 'IT Hardware', priority: 'Medium', status: 'In Progress', createdAt: '2026-08-08', lastUpdated: '2026-08-09', description: 'Need second monitor for multi-screen code review and server log monitoring.' },
  { id: 'TCK-902', employeeId: 'EMP-1001', employeeName: 'Sujal kumar', subject: 'PF Nominee Declaration Form Verification', category: 'HR Query', priority: 'Low', status: 'Resolved', createdAt: '2026-07-25', lastUpdated: '2026-07-26', description: 'Inquiring if digital signatures are accepted for Nominee update.' },
  { id: 'TCK-903', employeeId: 'EMP-1004', employeeName: 'Priya Sharma', subject: 'VPN Tunnel Disconnect on macOS Sequoia', category: 'IT Hardware', priority: 'High', status: 'Open', createdAt: '2026-08-11', lastUpdated: '2026-08-11', description: 'Enterprise Cisco AnyConnect drops connection during database deployments.' },
];

export const INITIAL_ASSETS: AssetItem[] = [
  { id: 'AST-1001', assetName: 'MacBook Pro 16" M3 Max (64GB RAM)', category: 'Laptop', serialNumber: 'C02GX901M3X', assignedToId: 'EMP-1001', assignedToName: 'Sujal kumar', assignedDate: '2026-01-02', status: 'Active' },
  { id: 'AST-1002', assetName: 'Dell UltraSharp 27" 4K USB-C Monitor', category: 'Monitor', serialNumber: 'CN-048291-728', assignedToId: 'EMP-1001', assignedToName: 'Sujal kumar', assignedDate: '2026-01-05', status: 'Active' },
  { id: 'AST-1003', assetName: 'Kenzo Enterprise RFID Access Card #4092', category: 'Access Card', serialNumber: 'RFID-99201', assignedToId: 'EMP-1001', assignedToName: 'Sujal kumar', assignedDate: '2026-01-01', status: 'Active' },
  { id: 'AST-1004', assetName: 'Apple Magic Keyboard & Trackpad 2', category: 'Peripherals', serialNumber: 'MK-88201', assignedToId: 'EMP-1001', assignedToName: 'Sujal kumar', assignedDate: '2026-01-05', status: 'Active' },
  { id: 'AST-1005', assetName: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop', serialNumber: 'PF-39102X', assignedToId: 'EMP-1002', assignedToName: 'Sarah Jenkins', assignedDate: '2025-11-15', status: 'Active' },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ANC-01', title: '🎉 Kenzo HRMS 2.0 Released Across All Global Hubs', category: 'Company News', content: 'We are thrilled to roll out Kenzo HRMS 2.0 with redesigned Employee & Admin control centers, attendance analytics, and AI HR assistance.', author: 'HR Executive Office', publishedDate: '2026-08-10', priority: 'High' },
  { id: 'ANC-02', title: '📢 Q3 Performance Appraisal Review Cycle Begins Aug 15', category: 'Policy Update', content: 'All managers and employees are reminded to complete self-evaluations and OKR progress submissions by August 25th.', author: 'Talent Management', publishedDate: '2026-08-08', priority: 'High' },
  { id: 'ANC-03', title: '🌴 Upcoming Independence Day Holiday Notice', category: 'Event', content: 'Kenzo offices will remain closed on Friday, August 15th for Independence Day celebration.', author: 'People & Culture', publishedDate: '2026-08-05', priority: 'Normal' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'NT-01', title: 'Leave Approved', message: 'Your PTO request for 3 days (Aug 20 - Aug 22) has been approved by Admin Office.', timestamp: '10 mins ago', read: false, type: 'leave' },
  { id: 'NT-02', title: 'Expense Claim Processed', message: 'Expense EXP-501 ($149.00 for JetBrains IDE) was approved and routed to payroll disbursement.', timestamp: '2 hours ago', read: false, type: 'expense' },
  { id: 'NT-03', title: 'IT Support Update', message: 'Support ticket TCK-901 status changed to "In Progress".', timestamp: '1 day ago', read: true, type: 'ticket' },
];
