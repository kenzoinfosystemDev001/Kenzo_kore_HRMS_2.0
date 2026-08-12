import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { PayrollRecord, UserAccount } from '../../types';

interface PayrollViewProps {
  payroll: PayrollRecord[];
  currentUser: UserAccount | null;
  onUpdatePayrollStatus: (id: string, status: 'Paid' | 'Processing' | 'Hold') => void;
  onRunPayrollBatch: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payroll,
  currentUser,
  onUpdatePayrollStatus,
  onRunPayrollBatch,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Filter payroll records based on role:
  // If Employee, show ONLY the logged-in employee's payroll record!
  const displayPayroll = isAdmin
    ? payroll
    : payroll.filter(
        (p) =>
          p.employeeId === currentUser?.id ||
          p.employeeName.toLowerCase() === currentUser?.name.toLowerCase() ||
          p.employeeName.toLowerCase().includes(currentUser?.name.split(' ')[0].toLowerCase() || '')
      );

  // Fallback for employee if not found in mock array
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
    paymentStatus: 'Paid',
    payPeriod: 'Aug 01 - Aug 15, 2026',
  };

  const recordsToRender = isAdmin ? displayPayroll : [mySingleRecord];

  const totalNet = recordsToRender.reduce((acc, c) => acc + c.netPay, 0);
  const totalTaxes = recordsToRender.reduce((acc, c) => acc + c.taxDeduction + c.healthDeduction, 0);
  const totalBonuses = recordsToRender.reduce((acc, c) => acc + c.bonus, 0);
  const processingCount = recordsToRender.filter((p) => p.paymentStatus === 'Processing').length;

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Total Net Disbursement' : 'My Net Monthly Disbursement'}
          </span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">${totalNet.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Bi-weekly pay period • Direct Deposit</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Tax & Health Withholdings' : 'My Tax & Health Deductions'}
          </span>
          <p className="text-2xl font-bold text-[#1a2b3c] mt-1">${totalTaxes.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Federal, State & Medical insurance</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {isAdmin ? 'Performance Bonuses' : 'My Accrued Bonus'}
          </span>
          <p className="text-2xl font-bold text-[#0060ac] mt-1">${totalBonuses.toLocaleString()}</p>
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
                <th className="py-3 px-4">Bonus</th>
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
                    ${p.baseSalary.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-600">
                    +${p.bonus.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-red-600 font-medium">
                    -${(p.healthDeduction + p.taxDeduction).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#1a2b3c] text-sm">
                    ${p.netPay.toLocaleString()}
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
                <span className="font-semibold">${selectedSlip.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Performance Bonus</span>
                <span className="font-semibold text-emerald-600">+${selectedSlip.bonus.toLocaleString()}</span>
              </div>

              <h4 className="font-bold text-slate-700 uppercase text-[11px] pt-2">Tax & Benefits Deductions</h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Federal & State Taxes</span>
                <span className="font-semibold text-red-600">-${selectedSlip.taxDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Health Insurance Plan</span>
                <span className="font-semibold text-red-600">-${selectedSlip.healthDeduction.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-[#1a2b3c] font-bold text-sm text-[#1a2b3c] pt-3">
                <span>Net Disbursement</span>
                <span className="text-emerald-700">${selectedSlip.netPay.toLocaleString()}</span>
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
