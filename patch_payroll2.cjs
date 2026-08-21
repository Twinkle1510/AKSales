const fs = require('fs');

let fileContent = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');

const replacement = `              <button 
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

const lastBracket = fileContent.lastIndexOf('};');
fileContent = fileContent.substring(0, lastBracket) + replacement;

fs.writeFileSync('src/views/PayrollView.tsx', fileContent);
console.log("Restored PayrollView modal!");
