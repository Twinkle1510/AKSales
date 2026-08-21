const fs = require('fs');

const fullCode = `import React, { useState } from 'react';
import { CircleDollarSign, Table, FileSpreadsheet, Printer, X, Eye } from 'lucide-react';
import type { Employee, ProductionLog } from '../data/mockDb';
import { exportToCSV, exportToPDF } from '../utils/exports';

interface PayrollProps {
  employees: Employee[];
  production: ProductionLog[];
}

export const PayrollView: React.FC<PayrollProps> = ({ employees, production }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('August 2026');
  const [paymentStatusMap, setPaymentStatusMap] = useState<Record<string, 'Paid' | 'Pending'>>({});
  const [historyModalEmployee, setHistoryModalEmployee] = useState<string | null>(null);

  // Generate payroll rows dynamically based on employees and their approved production output
  const payrollRows = employees.map(emp => {
    let approvedBatchesCount = 0;
    let totalQtyProduced = 0;

    if (emp.role === 'Worker') {
      const approvedBatches = production.filter(
        p => p.workerId === emp.id && p.status === 'Approved'
      );
      approvedBatchesCount = approvedBatches.length;
      totalQtyProduced = approvedBatches.reduce((sum, p) => sum + p.quantityProduced, 0);
    }

    // Dynamic Gross Pay Calculation based on configured PRD Payroll Models
    let grossPay = 0;
    const model = emp.payrollModel || 'Per Piece';
    
    if (emp.role === 'Worker') {
      if (model === 'Fixed Salary') {
        grossPay = emp.fixedSalaryAmount || 15000;
      } else if (model === 'Fixed + Incentive') {
        const fixed = emp.fixedSalaryAmount || 12000;
        const incentive = emp.incentiveRate || 10;
        grossPay = fixed + (totalQtyProduced * incentive);
      } else {
        // 'Per Piece' or 'Per KG'
        const rate = emp.baseRate || 30;
        grossPay = rate * totalQtyProduced;
      }
    } else {
      // Non-workers: paid standard fixed salary
      grossPay = emp.fixedSalaryAmount || (emp.baseRate * 160);
    }

    const deductions = Math.round(grossPay * 0.12); // 12% PF / taxes deduction
    const netPay = grossPay - deductions;
    const paymentStatus = paymentStatusMap[emp.id] || 'Pending';

    return {
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      payrollModel: model,
      baseRate: emp.baseRate,
      fixedSalaryAmount: emp.fixedSalaryAmount,
      incentiveRate: emp.incentiveRate,
      approvedBatchesCount,
      totalQtyProduced,
      grossPay,
      deductions,
      netPay,
      paymentStatus
    };
  });

  const togglePaymentStatus = (empId: string) => {
    setPaymentStatusMap((prev: Record<string, string>) => ({
      ...prev,
      [empId]: prev[empId] === 'Paid' ? 'Pending' : 'Paid'
    }));
  };

  const handleExportExcel = () => {
    const dataToExport = payrollRows.map(row => ({
      'Employee Code': row.employeeCode,
      'Name': row.name,
      'Role': row.role,
      'Department': row.department,
      'Payroll Model': row.payrollModel,
      'Output (Units)': row.totalQtyProduced,
      'Gross Pay (₹)': row.grossPay,
      'Deductions (₹)': row.deductions,
      'Net Pay (₹)': row.netPay,
      'Status': row.paymentStatus
    }));

    exportToCSV(dataToExport, \`AKSales_Payroll_\${selectedPeriod.replace(' ', '_')}\`);
  };

  const handleExportPDF = () => {
    const headers = [
      'Code', 'Name', 'Role', 'Model', 'Output Qty', 'Gross (₹)', 'Deductions (₹)', 'Net Pay (₹)', 'Status'
    ];

    const rows = payrollRows.map(row => [
      row.employeeCode,
      row.name,
      row.role,
      row.payrollModel,
      row.role === 'Worker' ? \`\${row.totalQtyProduced} units\` : 'N/A',
      \`₹\${row.grossPay}\`,
      \`₹\${row.deductions}\`,
      \`₹\${row.netPay}\`,
      row.paymentStatus
    ]);

    exportToPDF(
      \`Payroll Statement - \${selectedPeriod}\`,
      headers,
      rows,
      \`AKSales_Payroll_\${selectedPeriod.replace(' ', '_')}\`
    );
  };

  const totalPayrollCost = payrollRows.reduce((sum, r) => sum + r.netPay, 0);
  const totalWagesQty = payrollRows.reduce((sum, r) => sum + r.totalQtyProduced, 0);
  const paidCount = payrollRows.filter(r => r.paymentStatus === 'Paid').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Payroll Desk</h1>
          <p className="page-subtitle">Automatically calculate salary sheets, compile custom payroll models (piece/KG/fixed/incentive), and export reports.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="form-control" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>

          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Excel (CSV)
          </button>
          
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <Printer size={16} /> PDF Invoice
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Net Pay Outflow</span>
            <div className="stat-icon">
              <CircleDollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">₹{totalPayrollCost.toLocaleString()}</div>
          <div className="stat-footer">
            Total wages for {selectedPeriod}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Piece Output Logged</span>
            <div className="stat-icon">
              <Table size={20} />
            </div>
          </div>
          <div className="stat-value">{totalWagesQty} units</div>
          <div className="stat-footer">
            Combined approved worker production
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Disbursement Status</span>
            <div className="stat-icon">
              <CircleDollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">{paidCount} / {employees.length} Paid</div>
          <div className="stat-footer">
            Wages transferred status
          </div>
        </div>
      </div>

      {/* Payroll Cards Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Salary & Wage Ledger</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {payrollRows.map(row => (
          <div key={row.employeeId} className="card" style={{ 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            borderLeft: \`4px solid \${row.paymentStatus === 'Paid' ? 'var(--color-green)' : 'var(--color-orange)'}\`
          }}>
            {/* Header: Name, Code, Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{row.employeeCode} • {row.department}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{row.name}</h3>
                <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px' }}>{row.role}</div>
              </div>
              <span className={\`badge \${row.paymentStatus === 'Paid' ? 'badge-success' : 'badge-pending'}\`}>
                {row.paymentStatus}
              </span>
            </div>

            {/* Wage Config Info */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Model</span>
                <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 6px' }}>{row.payrollModel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Rate</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>
                  {row.payrollModel === 'Per Piece' && \`₹\${row.baseRate}/piece\`}
                  {row.payrollModel === 'Per KG' && \`₹\${row.baseRate}/KG\`}
                  {row.payrollModel === 'Fixed Salary' && \`₹\${row.fixedSalaryAmount?.toLocaleString()}/mo\`}
                  {row.payrollModel === 'Fixed + Incentive' && \`₹\${row.fixedSalaryAmount?.toLocaleString()}/mo + ₹\${row.incentiveRate}/unit\`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Output</span>
                {row.role === 'Worker' ? (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-green)' }}>{row.totalQtyProduced} units</span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>N/A (Salary)</span>
                )}
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Gross Pay</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>₹{row.grossPay.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deductions</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-danger)' }}>-₹{row.deductions.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Net Wage</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>₹{row.netPay.toLocaleString()}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => setHistoryModalEmployee(row.employeeId)}
              >
                <Eye size={14} /> View History
              </button>
              <button 
                className={\`btn \${row.paymentStatus === 'Paid' ? 'btn-secondary' : 'btn-primary'}\`}
                style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                onClick={() => togglePaymentStatus(row.employeeId)}
              >
                {row.paymentStatus === 'Paid' ? 'Revert Status' : 'Mark as Paid'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* History Modal */}
      {historyModalEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', width: '600px', maxHeight: '80vh',
            borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
                  Attendance & Production History
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {employees.find(e => e.id === historyModalEmployee)?.name} - {selectedPeriod}
                </div>
              </div>
              <button 
                onClick={() => setHistoryModalEmployee(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Product</th>
                    <th>Units Produced</th>
                    <th>Wage Rate</th>
                    <th>Earnings (Est)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const dateStr = \`2026-\${selectedPeriod.includes('August') ? '08' : selectedPeriod.includes('July') ? '07' : '06'}-\${String(day).padStart(2, '0')}\`;
                    const emp = employees.find(e => e.id === historyModalEmployee);
                    
                    // Filter production for this day
                    const dayLogs = production.filter(p => p.workerId === historyModalEmployee && p.date === dateStr && p.status === 'Approved');
                    const units = dayLogs.reduce((sum, p) => sum + p.quantityProduced, 0);
                    const productNames = [...new Set(dayLogs.map(p => p.productName))].join(', ');
                    
                    // Mock attendance if no units
                    const isSunday = day % 7 === 2;
                    let status = units > 0 ? 'Present' : (isSunday ? 'Weekly Off' : 'Absent');
                    
                    // Future dates
                    if (selectedPeriod.includes('August') && day > 21) {
                        status = 'Upcoming';
                    }

                    // Calculate daily earning
                    let earning = 0;
                    let wageText = '-';
                    if (emp) {
                        const model = emp.payrollModel || 'Per Piece';
                        if (model === 'Fixed Salary') {
                            earning = Math.round((emp.fixedSalaryAmount || 15000) / 30);
                            wageText = \`Fixed (₹\${emp.fixedSalaryAmount}/mo)\`;
                        } else if (model === 'Fixed + Incentive') {
                            earning = Math.round((emp.fixedSalaryAmount || 12000) / 30) + (units * (emp.incentiveRate || 10));
                            wageText = \`₹\${emp.fixedSalaryAmount}/mo + ₹\${emp.incentiveRate}/unit\`;
                        } else {
                            earning = units * (emp.baseRate || 30);
                            wageText = \`₹\${emp.baseRate} / unit\`;
                        }
                    }
                    if (status === 'Absent' || status === 'Upcoming' || status === 'Weekly Off') earning = 0;

                    return (
                      <tr key={day}>
                        <td><strong>{day} {selectedPeriod.split(' ')[0]}</strong></td>
                        <td>
                          <span className={\`badge \${status === 'Present' ? 'badge-success' : status === 'Absent' ? 'badge-danger' : status === 'Weekly Off' ? 'badge-pending' : ''}\`} style={{ opacity: status === 'Upcoming' ? 0.5 : 1 }}>
                            {status}
                          </span>
                        </td>
                        <td>{units > 0 ? productNames || 'Various' : '-'}</td>
                        <td>
                          {units > 0 ? <strong style={{ color: 'var(--color-green)' }}>{units}</strong> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                        </td>
                        <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{wageText}</span></td>
                        <td>
                          {earning > 0 ? <strong style={{ color: 'var(--accent)' }}>₹{earning.toLocaleString()}</strong> : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;
fs.writeFileSync('src/views/PayrollView.tsx', fullCode);
console.log('Complete rewrite of PayrollView.tsx successful.');
