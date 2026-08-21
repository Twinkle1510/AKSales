const fs = require('fs');

let fileContent = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');

// 1. Add X icon
fileContent = fileContent.replace(
  "import { CircleDollarSign, Table, FileSpreadsheet, Printer } from 'lucide-react';",
  "import { CircleDollarSign, Table, FileSpreadsheet, Printer, X, Eye } from 'lucide-react';"
);

// 2. Add history modal state
fileContent = fileContent.replace(
  "const [paymentStatusMap, setPaymentStatusMap] = useState<Record<string, 'Paid' | 'Pending'>>({});",
  "const [paymentStatusMap, setPaymentStatusMap] = useState<Record<string, 'Paid' | 'Pending'>>({});\n  const [historyModalEmployee, setHistoryModalEmployee] = useState<string | null>(null);"
);

// 3. Add view button in table
const nameTdOriginal = `                  <td>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                  </td>`;
const nameTdReplacement = `                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{row.name}</div>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
                        onClick={() => setHistoryModalEmployee(row.employeeId)}
                      >
                        <Eye size={12} /> View History
                      </button>
                    </div>
                  </td>`;
fileContent = fileContent.replace(nameTdOriginal, nameTdReplacement);

// 4. Add modal at the end before closing div
const modalContent = `
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
                    <th>Units Produced</th>
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
                    
                    // Mock attendance if no units
                    // Let's assume Sundays are off (day % 7 === 2 for August 2026 roughly)
                    const isSunday = day % 7 === 2;
                    let status = units > 0 ? 'Present' : (isSunday ? 'Weekly Off' : 'Absent');
                    
                    // Future dates
                    if (selectedPeriod.includes('August') && day > 21) {
                        status = 'Upcoming';
                    }

                    // Calculate daily earning
                    let earning = 0;
                    if (emp) {
                        const model = emp.payrollModel || 'Per Piece';
                        if (model === 'Fixed Salary') {
                            earning = Math.round((emp.fixedSalaryAmount || 15000) / 30);
                        } else if (model === 'Fixed + Incentive') {
                            earning = Math.round((emp.fixedSalaryAmount || 12000) / 30) + (units * (emp.incentiveRate || 10));
                        } else {
                            earning = units * (emp.baseRate || 30);
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
                        <td>
                          {units > 0 ? <strong style={{ color: 'var(--color-green)' }}>{units}</strong> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                        </td>
                        <td>
                          {earning > 0 ? \`₹\${earning}\` : '-'}
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
`;

fileContent = fileContent.replace(
  "    </div>\n  );\n};\n",
  modalContent + "    </div>\n  );\n};\n"
);

fs.writeFileSync('src/views/PayrollView.tsx', fileContent);
console.log('Fixed PayrollView');
