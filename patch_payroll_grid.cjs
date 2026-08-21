const fs = require('fs');
let fileContent = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');

// The file got corrupted around line 189. Let's fix it by locating the end of stats-grid and inserting the cards.
const statsEndIndex = fileContent.indexOf('{/* History Modal */}');

if (statsEndIndex === -1) {
    console.error("Could not find History Modal");
    process.exit(1);
}

// We need to restore the stat card and insert the grid.
const beforeGrid = fileContent.substring(0, fileContent.indexOf('<div className="stat-icon">\\n              <CircleDollarSign size={20} />'));

// We will just replace everything from the first stats card to History Modal with our proper code.
// Actually, it's safer to just rewrite the render function entirely.

const startOfReturn = fileContent.indexOf('return (');
const endOfReturn = fileContent.lastIndexOf(');');

const renderContent = `return (
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

      {/* Payroll Cards Grid (Replacing old table) */}
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

      {/* History Modal */}` + fileContent.substring(statsEndIndex + 20, endOfReturn + 2);

const newFileContent = fileContent.substring(0, startOfReturn) + renderContent;

fs.writeFileSync('src/views/PayrollView.tsx', newFileContent);
console.log("Rewritten PayrollView grid!");
