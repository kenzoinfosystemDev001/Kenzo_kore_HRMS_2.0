import { PayrollRecord } from '../types';

export function downloadPayslipPDF(record: PayrollRecord) {
  const payslipHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Payslip - ${record.employeeName} (${record.payPeriod})</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0060ac; padding-bottom: 16px; margin-bottom: 24px; }
        .logo-title { color: #0060ac; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
        .subtitle { color: #64748b; font-size: 12px; margin-top: 4px; font-weight: 600; text-transform: uppercase; }
        .badge { background: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 9999px; border: 1px solid #86efac; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
        .label { color: #64748b; font-weight: 600; font-size: 11px; text-transform: uppercase; }
        .value { color: #0f172a; font-weight: 700; font-size: 14px; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f8fafc; color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .text-right { text-align: right; }
        .total-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 14px; font-weight: 800; color: #166534; }
        .total-amount { font-size: 24px; font-weight: 900; color: #15803d; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 11px; }
        @media print {
          body { background: #ffffff; padding: 0; }
          .container { border: none; box-shadow: none; width: 100%; max-width: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 class="logo-title">KENZO INFOSYSTEMS</h1>
            <div class="subtitle">Official Payroll Earnings Statement</div>
          </div>
          <div>
            <span class="badge">${record.paymentStatus || 'Paid'}</span>
          </div>
        </div>

        <div class="grid">
          <div>
            <div class="label">Employee Name</div>
            <div class="value">${record.employeeName}</div>
          </div>
          <div>
            <div class="label">Employee ID</div>
            <div class="value">${record.employeeId}</div>
          </div>
          <div>
            <div class="label">Designation & Department</div>
            <div class="value">${record.role} (${record.department})</div>
          </div>
          <div>
            <div class="label">Pay Cycle Period</div>
            <div class="value">${record.payPeriod}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Earnings Description</th>
              <th class="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td class="text-right">₹${(record.baseSalary || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Performance Bonus & Allowances</td>
              <td class="text-right" style="color: #16a34a;">+₹${(record.bonus || 0).toLocaleString()}</td>
            </tr>
            <tr style="font-weight: 700; background: #fafafa;">
              <td>Total Gross Earnings</td>
              <td class="text-right">₹${((record.baseSalary || 0) + (record.bonus || 0)).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Deductions Description</th>
              <th class="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Income Tax (TDS / PF Withholdings)</td>
              <td class="text-right" style="color: #dc2626;">-₹${(record.taxDeduction || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Health & Medical Insurance Plan</td>
              <td class="text-right" style="color: #dc2626;">-₹${(record.healthDeduction || 0).toLocaleString()}</td>
            </tr>
            <tr style="font-weight: 700; background: #fafafa;">
              <td>Total Deductions</td>
              <td class="text-right" style="color: #dc2626;">-₹${((record.taxDeduction || 0) + (record.healthDeduction || 0)).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-label">NET PAYABLE DISBURSED</div>
          <div class="total-amount">₹${(record.netPay || 0).toLocaleString()}</div>
        </div>

        <div class="footer">
          This is a computer-generated payslip issued by Kenzo Infosystems HR Administration. No signature required.
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(payslipHtml);
    printWindow.document.close();
  } else {
    const blob = new Blob([payslipHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${record.employeeName.replace(/\s+/g, '_')}_${record.payPeriod.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
