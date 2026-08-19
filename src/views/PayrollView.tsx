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
    // Workers: paid baseRate per finished unit produced.
    // Managers/Admin/Accountants: Standard monthly salary model = baseRate * 160 hours.
    
    let hoursWorked = 0;
    let approvedBatchesCount = 0;
    let totalQtyProduced = 0;

    if (emp.role === 'Worker') {
      const approvedBatches = production.filter(
        p => p.workerId === emp.id && p.status === 'Approved'
      );
      approvedBatchesCount = approvedBatches.length;
      totalQtyProduced = approvedBatches.reduce((sum, p) => sum + p.quantityProduced, 0);
      hoursWorked = approvedBatchesCount * 8; // kept for logs
    } else {
      hoursWorked = 160; // Standard full-time hours
    }

    const grossPay = emp.role === 'Worker' 
      ? emp.baseRate * totalQtyProduced // Piece-Rate: ₹ per unit completed
      : emp.baseRate * 160;            // Standard Full-time hourly salary

    const deductions = Math.round(grossPay * 0.12); // 12% PF / taxes deduction
    const netPay = grossPay - deductions;
    const paymentStatus = paymentStatusMap[emp.id] || 'Pending';

    return {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      baseRate: emp.baseRate,
      hoursWorked,
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
      'Employee ID': row.employeeId,
      'Name': row.name,
      'Role': row.role,
      'Department': row.department,
      'Pay Rate (₹)': row.role === 'Worker' ? `${row.baseRate}/pc` : `${row.baseRate}/hr`,
      'Total Output Qty': row.role === 'Worker' ? row.totalQtyProduced : 'N/A',
      'Approved Batches': row.approvedBatchesCount,
      'Gross Pay (₹)': row.grossPay,
      'Deductions (₹)': row.deductions,
      'Net Pay (₹)': row.netPay,
      'Status': row.paymentStatus
    }));

    exportToCSV(dataToExport, `AKSales_Payroll_${selectedPeriod.replace(' ', '_')}`);
  };

  const handleExportPDF = () => {
    const headers = [
      'Emp ID', 'Name', 'Role', 'Rate', 'Output / Hours', 'Batches', 'Gross (₹)', 'Deductions (₹)', 'Net Pay (₹)', 'Status'
    ];

    const rows = payrollRows.map(row => [
      row.employeeId,
      row.name,
      row.role,
      row.role === 'Worker' ? `₹${row.baseRate}/pc` : `₹${row.baseRate}/hr`,
      row.role === 'Worker' ? `${row.totalQtyProduced} units` : `${row.hoursWorked} hrs`,
      row.role === 'Worker' ? row.approvedBatchesCount : 'N/A (Salary)',
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

  // Computations for totals card
  const totalPayrollCost = payrollRows.reduce((sum, r) => sum + r.netPay, 0);
  const totalWagesQty = payrollRows.reduce((sum, r) => sum + r.totalQtyProduced, 0);
  const paidCount = payrollRows.filter(r => r.paymentStatus === 'Paid').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Payroll Desk</h1>
          <p className="page-subtitle">Automatically calculate salary sheets, log piece-rate wages, and export reporting tables.</p>
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
        <div className="card-title">Salary & Wage Ledger Sheet (Piece Rate & Hourly)</div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee</th>
                <th>Role / Department</th>
                <th>Wage Rate</th>
                <th>Logged Quantity / Hours</th>
                <th>Approved Batches</th>
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
                  <td><strong>{row.employeeId}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                  </td>
                  <td>
                    <div>{row.role}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.department}</div>
                  </td>
                  <td>
                    {row.role === 'Worker' ? (
                      <strong>₹{row.baseRate}/piece</strong>
                    ) : (
                      <span>₹{row.baseRate}/hour</span>
                    )}
                  </td>
                  <td>
                    {row.role === 'Worker' ? (
                      <span style={{ fontWeight: 700, color: 'var(--color-green)' }}>{row.totalQtyProduced} units</span>
                    ) : (
                      <span>{row.hoursWorked} hrs</span>
                    )}
                  </td>
                  <td>
                    {row.role === 'Worker' ? (
                      <span className="badge badge-success" style={{ borderRadius: '4px' }}>
                        {row.approvedBatchesCount} batches
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>N/A (Salary)</span>
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
