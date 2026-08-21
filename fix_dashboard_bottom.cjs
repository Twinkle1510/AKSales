const fs = require('fs');

let dashboardCode = fs.readFileSync('src/views/DashboardView.tsx', 'utf8');

// 1. Fix the chart section
const chartStartMarker = '              <div className="chart-container" style={{ height: \'140px\' }}>';
const chartEndMarker = '            </div>\n          </div>'; // End of the Yield Output bar div
const chartStartIndex = dashboardCode.indexOf(chartStartMarker);
const chartEndIndex = dashboardCode.indexOf(chartEndMarker);

if (chartStartIndex !== -1 && chartEndIndex !== -1) {
  const newChartContent = `
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginTop: '24px' }}>
                {workerStats.map((stat, idx) => {
                  const heightPct = (stat.amount / maxVal) * 80 + 10;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '48px', gap: '8px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>{stat.amount}</div>
                      <div 
                        style={{ width: '32px', height: \`\${heightPct}%\`, backgroundColor: 'var(--color-green)', borderRadius: '6px 6px 0 0', opacity: 0.9 }}
                      ></div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
`;
  dashboardCode = dashboardCode.substring(0, chartStartIndex) + newChartContent + dashboardCode.substring(chartEndIndex);
} else {
  console.log("Could not find chart markers");
}

// 2. Fix the buttons section
const btnStartMarker = '          <div className="quick-actions" style={{ marginBottom: \'16px\' }}>';
const btnEndMarker = '          {/* Warnings list */}';
const btnStartIndex = dashboardCode.indexOf(btnStartMarker);
const btnEndIndex = dashboardCode.indexOf(btnEndMarker);

if (btnStartIndex !== -1 && btnEndIndex !== -1) {
  const newBtnContent = `
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', marginTop: '16px' }}>
            <button 
              className="btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => onOpenQuickAction('add_employee')}
            >
              <Users size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Add Employee</span>
            </button>
            <button 
              className="btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => onOpenQuickAction('issue_material')}
            >
              <PackageOpen size={24} style={{ color: 'var(--color-orange)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Issue Material</span>
            </button>
            <button 
              className="btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => onOpenQuickAction('log_production')}
            >
              <TrendingUp size={24} style={{ color: 'var(--color-green)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Log Batch</span>
            </button>
            <button 
              className="btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setCurrentTab('payroll')}
            >
              <Plus size={24} style={{ color: 'var(--color-purple)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Run Payroll</span>
            </button>
          </div>

`;
  dashboardCode = dashboardCode.substring(0, btnStartIndex) + newBtnContent + dashboardCode.substring(btnEndIndex);
} else {
  console.log("Could not find button markers");
}

fs.writeFileSync('src/views/DashboardView.tsx', dashboardCode);
console.log("Fixed dashboard bottom section.");
