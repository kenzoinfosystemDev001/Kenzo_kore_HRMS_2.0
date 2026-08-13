import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Download, 
  Send, 
  FileCheck, 
  ShieldCheck, 
  X,
  FileText,
  HelpCircle,
  Check,
  Plus,
  Bell,
  AlertTriangle,
  Gift,
  Sparkles,
  Calendar,
  UserCheck,
  Building
} from 'lucide-react';
import { PayrollRecord, UserAccount, Employee } from '../../types';

interface PayrollViewProps {
  payroll: PayrollRecord[];
  employees?: Employee[];
  currentUser: UserAccount | null;
  onUpdatePayrollStatus: (id: string, status: 'Paid' | 'Processing' | 'Hold') => void;
  onRunPayrollBatch: () => void;
  onCreatePayroll?: (data: any) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payroll,
  employees = [],
  currentUser,
  onUpdatePayrollStatus,
  onRunPayrollBatch,
  onCreatePayroll,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  
  // Modals state
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEmployeeDisbursementPopupOpen, setIsEmployeeDisbursementPopupOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Notifier Manager State (Admin)
  const [nextPayDate, setNextPayDate] = useState('2026-08-30');
  const [payDuration, setPayDuration] = useState<'Bi-Weekly' | 'Monthly'>('Bi-Weekly');
  const [daysRemaining, setDaysRemaining] = useState(3);

  // Admin Create Payroll Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [baseSalary, setBaseSalary] = useState(5500);
  const [allowanceBonus, setAllowanceBonus] = useState(500);
  const [healthDeduction, setHealthDeduction] = useState(150);
  const [taxDeduction, setTaxDeduction] = useState(1100);
  const [payPeriod, setPayPeriod] = useState('Aug 16 - Aug 30, 2026');

  // Filter payroll records based on role
  const displayPayroll = isAdmin
    ? payroll
    : payroll.filter(
        (p) =>
          p.employeeId === currentUser?.id ||
          p.employeeName.toLowerCase() === currentUser?.name.toLowerCase() ||
          p.employeeName.toLowerCase().includes(currentUser?.name.split(' ')[0].toLowerCase() || '')
      );

  // Fallback for employee if not found
  const mySingleRecord: PayrollRecord = displayPayroll[0] || {
    id: `PAY-${currentUser?.id || '1001'}`,
    employeeId: currentUser?.id || 'EMP-1001',
    employeeName: currentUser?.name || 'Sujal kumar',
    role: currentUser?.designation || 'Software Engineer',
    department: currentUser?.department || 'Engineering',
    baseSalary: currentUser?.salary ? Math.round(currentUser.salary / 24) : 5208.33,
    bonus: 500,
    healthDeduction: 237,
    taxDeduction: 1000,
    netPay: 4062.50,
    paymentStatus: 'Processing',
    payPeriod: 'Aug 01 - Aug 15, 2026',
  };

  // Trigger Automatic Real-Time Pop-Up for Employee if a payroll is ready/processing AND not acknowledged yet
  useEffect(() => {
    if (!isAdmin && mySingleRecord && (mySingleRecord.paymentStatus === 'Processing' || mySingleRecord.paymentStatus === 'Paid')) {
      const ack1 = localStorage.getItem(`acknowledged_${mySingleRecord.id}`);
      const ack2 = localStorage.getItem(`acknowledged_${currentUser?.id}_${mySingleRecord.id}`);
      if (!ack1 && !ack2) {
        setIsEmployeeDisbursementPopupOpen(true);
      }
    }
  }, [isAdmin, mySingleRecord.id, currentUser?.id]);

  const recordsToRender = displayPayroll.length > 0 ? displayPayroll : [mySingleRecord];

  const totalNet = recordsToRender.reduce((acc, c) => acc + c.netPay, 0);
  const totalTaxes = recordsToRender.reduce((acc, c) => acc + c.taxDeduction + c.healthDeduction, 0);
  const totalBonuses = recordsToRender.reduce((acc, c) => acc + c.bonus, 0);
  const processingCount = recordsToRender.filter((p) => p.paymentStatus === 'Processing').length;

  const handleAdminCreatePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const empMatch = employees.find(e => e.id === selectedEmpId) || {
      id: selectedEmpId || 'EMP-1001',
      name: 'Sujal kumar',
      role: 'Software Engineer',
      department: 'Engineering'
    };

    if (onCreatePayroll) {
      onCreatePayroll({
        employeeId: empMatch.id,
        employeeName: empMatch.name,
        role: empMatch.role,
        department: empMatch.department,
        baseSalary,
        bonus: allowanceBonus,
        healthDeduction,
        taxDeduction,
        payPeriod
      });
    }

    setIsCreateModalOpen(false);
    alert(`Payroll disbursed successfully for ${empMatch.name}! Real-time pop-up notification routed to employee portal.`);
  };

  const handleEmployeeAcknowledge = () => {
    localStorage.setItem(`acknowledged_${mySingleRecord.id}`, 'true');
    if (currentUser?.id) {
      localStorage.setItem(`acknowledged_${currentUser.id}_${mySingleRecord.id}`, 'true');
    }
    onUpdatePayrollStatus(mySingleRecord.id, 'Paid');
    setIsEmployeeDisbursementPopupOpen(false);
    alert('Thank you! Salary disbursement receipt acknowledged.');
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* ADMIN SALARY DISBURSEMENT NOTIFIER & BUZZING ALERT BANNER */}
      {/* ---------------------------------------------------- */}
      {isAdmin && daysRemaining <= 5 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">
                🔔 SALARY DISBURSEMENT NOTIFIER: Bi-Weekly Payroll Cycle Due in {daysRemaining} Days!
              </h4>
              <p className="text-xs text-amber-100 mt-0.5">
                Target Pay Date: <strong>{nextPayDate}</strong> ({payDuration}) • {processingCount} employee disbursements ready for disburse.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#0060ac]" />
            <span>Process Payroll Now</span>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ADMIN PAYROLL MANAGER & CYCLE SCHEDULE CARD */}
      {/* ---------------------------------------------------- */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0060ac] flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1a2b3c]">Automated Payroll Schedule & Duration Manager</h3>
              <p className="text-xs text-slate-500">Configure upcoming payroll cycles and automatic salary reminder alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Cycle Duration:</span>
              <select
                value={payDuration}
                onChange={(e) => setPayDuration(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value="Bi-Weekly">Bi-Weekly (15 Days)</option>
                <option value="Monthly">Monthly (30 Days)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Next Pay Date:</span>
              <input
                type="date"
                value={nextPayDate}
                onChange={(e) => setNextPayDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
              />
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#0060ac] text-white font-bold text-xs rounded-xl hover:bg-[#004e8c] shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create & Disburse Payroll</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Total Net Disbursement' : 'My Net Monthly Disbursement'}
          </span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">₹{totalNet.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Bi-weekly pay period • Direct Deposit</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Tax & Health Withholdings' : 'My Tax & Health Deductions'}
          </span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">₹{totalTaxes.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Federal, State & Medical insurance</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Performance Bonuses' : 'My Accrued Bonus'}
          </span>
          <p className="text-2xl font-bold text-[#0060ac] mt-1">₹{totalBonuses.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Q2 Goal completions & incentives</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase">
              {isAdmin ? 'Batch Action' : 'My Payroll Request Status'}
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAdmin
                ? `${processingCount} payments processing`
                : `Status: ${mySingleRecord.paymentStatus}`}
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={onRunPayrollBatch}
              className="w-full py-2 bg-[#1a2b3c] text-white text-xs font-semibold rounded-lg hover:bg-[#041627] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-teal-300" />
              Disburse Bi-Weekly Payroll
            </button>
          ) : (
            <button
              onClick={() => {
                setRequestSubmitted(true);
                setTimeout(() => setRequestSubmitted(false), 4000);
              }}
              className="w-full py-2 bg-[#0060ac] text-white text-xs font-bold rounded-lg hover:bg-[#004e8c] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              {requestSubmitted ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-300" /> Request Submitted
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-teal-300" /> Request Payroll Verification
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {requestSubmitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Your payroll verification request has been routed to HR & Finance administration.
        </div>
      )}

      {/* Payroll Records Data Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#1a2b3c]">
              {isAdmin ? 'Aug 01 - Aug 15 Payroll Schedule (All Employees)' : `My Payroll Schedule (${currentUser?.name})`}
            </h3>
            <p className="text-xs text-slate-500">Automated Direct Deposit via ACH / FedWire • Strictly Confidential</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Current Cycle: Aug 15, 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e2e8f0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Bonus / Allowances</th>
                <th className="py-3 px-4">Health / Tax Deductions</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-xs">
              {recordsToRender.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#1a2b3c]">{p.employeeName}</p>
                    <p className="text-[11px] text-slate-400">{p.role} • {p.department}</p>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700">
                    ₹{p.baseSalary.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-600">
                    +₹{p.bonus.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-red-600 font-medium">
                    -₹{(p.healthDeduction + p.taxDeduction).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#1a2b3c] text-sm">
                    ₹{p.netPay.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    {p.paymentStatus === 'Paid' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : p.paymentStatus === 'Processing' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 w-max">
                        On Hold
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedSlip(p)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0060ac] text-white hover:bg-[#004e8c] flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Payslip
                      </button>
                      {isAdmin && p.paymentStatus === 'Processing' && (
                        <button
                          onClick={() => onUpdatePayrollStatus(p.id, 'Paid')}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#1a2b3c] text-white hover:bg-[#041627]"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: ADMIN CREATE & DISBURSE PAYROLL MODAL */}
      {/* ---------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#0060ac]" />
                <h3 className="text-base font-bold text-[#1a2b3c]">Create & Disburse Employee Payroll</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminCreatePayrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Target Employee</label>
                <select
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) • {emp.role} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Allowances & Bonuses (₹)</label>
                  <input
                    type="number"
                    value={allowanceBonus}
                    onChange={(e) => setAllowanceBonus(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Health Insurance (₹)</label>
                  <input
                    type="number"
                    value={healthDeduction}
                    onChange={(e) => setHealthDeduction(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tax Deductions (₹)</label>
                  <input
                    type="number"
                    value={taxDeduction}
                    onChange={(e) => setTaxDeduction(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pay Period</label>
                <input
                  type="text"
                  required
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center text-xs font-bold">
                <span className="text-[#1a2b3c]">Calculated Net Disbursement:</span>
                <span className="text-emerald-700 text-sm">
                  ₹{Math.max(0, baseSalary + allowanceBonus - (healthDeduction + taxDeduction)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0060ac] text-white font-bold rounded-xl hover:bg-[#004e8c] shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Approve & Disburse Payroll</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: AUTOMATIC EMPLOYEE DISBURSEMENT POP-UP MODAL */}
      {/* ---------------------------------------------------- */}
      {!isAdmin && isEmployeeDisbursementPopupOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Gift className="w-7 h-7 text-emerald-600 animate-bounce" />
              </div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase tracking-widest">
                Payroll Alert
              </span>
              <h3 className="text-xl font-extrabold text-[#1a2b3c]">
                🎁 Salary Disbursement Received!
              </h3>
              <p className="text-xs text-slate-500">
                Your salary for <strong className="text-slate-800">{mySingleRecord.payPeriod}</strong> has been processed by HR Administration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold">
                <span className="text-slate-500">Employee Name:</span>
                <span className="text-[#1a2b3c]">{mySingleRecord.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Salary:</span>
                <span className="font-semibold text-slate-800">₹{mySingleRecord.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allowances & Bonus:</span>
                <span className="font-semibold text-emerald-600">+₹{mySingleRecord.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax & Medical Deductions:</span>
                <span className="font-semibold text-red-600">-₹{(mySingleRecord.healthDeduction + mySingleRecord.taxDeduction).toLocaleString()}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-[#1a2b3c]">
                <span>Net Salary Received:</span>
                <span className="text-emerald-700 text-base">₹{mySingleRecord.netPay.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleEmployeeAcknowledge}
                className="w-full py-3 bg-[#0060ac] hover:bg-[#004e8c] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-300" />
                <span>Acknowledge Salary Receipt</span>
              </button>

              <button
                onClick={() => setSelectedSlip(mySingleRecord)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#0060ac]" />
                <span>Download Payslip PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Inspection Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1a2b3c]">Official Payroll Earnings Statement</h3>
                <p className="text-xs text-slate-500">{selectedSlip.payPeriod}</p>
              </div>
              <button onClick={() => setSelectedSlip(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Employee Name</span>
                <span className="text-[#1a2b3c] font-bold">{selectedSlip.employeeName}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Department & Title</span>
                <span className="text-slate-700">{selectedSlip.role} ({selectedSlip.department})</span>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase text-[11px]">Gross Earnings & Allowances</h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Base Gross Salary</span>
                <span className="font-semibold">₹{selectedSlip.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Performance Bonus & Allowances</span>
                <span className="font-semibold text-emerald-600">+₹{selectedSlip.bonus.toLocaleString()}</span>
              </div>

              <h4 className="font-bold text-slate-700 uppercase text-[11px] pt-2">Tax & Benefits Deductions</h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Federal & State Taxes</span>
                <span className="font-semibold text-red-600">-₹{selectedSlip.taxDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Health Insurance Plan</span>
                <span className="font-semibold text-red-600">-₹{selectedSlip.healthDeduction.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-[#1a2b3c] font-bold text-sm text-[#1a2b3c] pt-3">
                <span>Net Disbursement</span>
                <span className="text-emerald-700">₹{selectedSlip.netPay.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button 
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert('Payslip PDF downloaded to your system.');
                  setSelectedSlip(null);
                }}
                className="px-4 py-2 bg-[#0060ac] text-white rounded-lg text-xs font-bold hover:bg-[#004e8c] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
