const fs = require('fs');

let dashboardCode = fs.readFileSync('src/views/DashboardView.tsx', 'utf8');

// 1. Fix the chart section
const chartStartMarker = '              <div className="chart-container" style={{ height: \'140px\' }}>';
const chartEndMarker = '              </div>\n            </div>\n\n            {/* Wastage bar commented out as requested';

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
`;
  dashboardCode = dashboardCode.substring(0, chartStartIndex) + newChartContent + dashboardCode.substring(chartEndIndex);
  fs.writeFileSync('src/views/DashboardView.tsx', dashboardCode);
  console.log("Fixed dashboard chart section.");
} else {
  console.log("Could not find chart markers");
}
