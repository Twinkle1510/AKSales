import React, { useState } from 'react';
import { CircleDollarSign, Table, FileSpreadsheet, Printer } from 'lucide-react';
import type { Employee, ProductionLog } from '../data/mockDb';
import { exportToCSV, exportToPDF } from '../utils/exports';

interface PayrollProps {
  employees: Employee[];
  production: ProductionLog[];
}

export const PayrollView: React.FC<PayrollProps> = ({ employees, production }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('August 2026');
  const [paymentStatusMap, setPaymentStatusMap] = useState<Record<string, 'Paid' | 'Pending'>>({});

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
    setPaymentStatusMap(prev => ({
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

    exportToCSV(dataToExport, `AKSales_Payroll_${selectedPeriod.replace(' ', '_')}`);
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
      row.role === 'Worker' ? `${row.totalQtyProduced} units` : 'N/A',
      `₹${row.grossPay}`,
      `₹${row.deductions}`,
      `₹${row.netPay}`,
      row.paymentStatus
    ]);

    exportToPDF(
      `Payroll Statement - ${selectedPeriod}`,
      headers,
      rows,
      `AKSales_Payroll_${selectedPeriod.replace(' ', '_')}`
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

      {/* Payroll spreadsheet style table */}
      <div className="card">
        <div className="card-title">Salary & Wage Ledger Sheet (Production-Linked Models)</div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Employee</th>
                <th>Role / Department</th>
                <th>Payroll Model</th>
                <th>Wage Configuration</th>
                <th>Total Yield (Units)</th>
                <th>Gross Pay</th>
                <th>Deductions</th>
                <th>Net Wage</th>
                <th>Status</th>
                <th>Disburse Action</th>
              </tr>
            </thead>
            <tbody>
              {payrollRows.map(row => (
                <tr key={row.employeeId}>
                  <td><strong>{row.employeeCode}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                  </td>
                  <td>
                    <div>{row.role}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.department}</div>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ borderRadius: '4px' }}>
                      {row.payrollModel}
                    </span>
                  </td>
                  <td>
                    {row.payrollModel === 'Per Piece' && <span>₹{row.baseRate}/piece</span>}
                    {row.payrollModel === 'Per KG' && <span>₹{row.baseRate}/KG</span>}
                    {row.payrollModel === 'Fixed Salary' && <span>₹{row.fixedSalaryAmount?.toLocaleString()}/mo</span>}
                    {row.payrollModel === 'Fixed + Incentive' && (
                      <div style={{ fontSize: '12px' }}>
                        <span>₹{row.fixedSalaryAmount?.toLocaleString()}/mo</span>
                        <div style={{ color: 'var(--color-green)', fontSize: '11px' }}>+₹{row.incentiveRate}/unit</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {row.role === 'Worker' ? (
                      <span style={{ fontWeight: 700, color: 'var(--color-green)' }}>{row.totalQtyProduced} units</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>N/A (Salary)</span>
                    )}
                  </td>
                  <td>₹{row.grossPay.toLocaleString()}</td>
                  <td style={{ color: 'var(--danger)' }}>-₹{row.deductions.toLocaleString()}</td>
                  <td>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>
                      ₹{row.netPay.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${row.paymentStatus === 'Paid' ? 'badge-success' : 'badge-pending'}`}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn ${row.paymentStatus === 'Paid' ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => togglePaymentStatus(row.employeeId)}
                    >
                      {row.paymentStatus === 'Paid' ? 'Revert to Pending' : 'Mark as Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
