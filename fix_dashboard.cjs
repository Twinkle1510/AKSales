const fs = require('fs');

// 1. Fix DashboardView.tsx
let dashboardCode = fs.readFileSync('src/views/DashboardView.tsx', 'utf8');

const startMarker = '<div className="content-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'32px\' }}>';
const endMarker = '      {/* Bottom Grid: Output Chart, Wastage Chart & Control Panel */}';

const startIndex = dashboardCode.indexOf(startMarker);
const endIndex = dashboardCode.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `
        {/* Full Width Contributions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          {workerStats.slice(0, 5).map((w) => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                  {w.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{w.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Yield Efficiency: <strong style={{ color: w.efficiency >= 90 ? 'var(--color-green)' : 'var(--color-orange)' }}>{w.efficiency}%</strong></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{w.amount} units</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700, width: '48px', textAlign: 'right' }}>{Math.round((w.amount / totalQty) * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

`;
  dashboardCode = dashboardCode.substring(0, startIndex) + newContent + dashboardCode.substring(endIndex);
  fs.writeFileSync('src/views/DashboardView.tsx', dashboardCode);
  console.log("DashboardView updated successfully.");
} else {
  console.log("Could not find markers in DashboardView.tsx");
}

// 2. Fix index.css fake search bar appearing on all cards
let cssCode = fs.readFileSync('src/index.css', 'utf8');
cssCode = cssCode.replace('.card-title::after {', '.card-with-search .card-title::after {');
fs.writeFileSync('src/index.css', cssCode);

// Add 'card-with-search' to the specific card in PayrollView
let payrollCode = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');
payrollCode = payrollCode.replace('<div className="card">\\n        <div className="card-title">Salary & Wage Ledger Sheet', '<div className="card card-with-search">\\n        <div className="card-title">Salary & Wage Ledger Sheet');
// Use regex to be safe with newlines:
payrollCode = payrollCode.replace(/<div className="card">\s*<div className="card-title">Salary & Wage Ledger Sheet/, '<div className="card card-with-search">\\n        <div className="card-title">Salary & Wage Ledger Sheet');

fs.writeFileSync('src/views/PayrollView.tsx', payrollCode);

console.log("CSS fixes applied.");
