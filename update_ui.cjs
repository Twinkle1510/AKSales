const fs = require('fs');

let content = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// 1. Replace mobile-card with worker-card
content = content.replace(/className="mobile-card"/g, 'className="worker-card"');
content = content.replace(/className="mobile-card task-item/g, 'className="worker-card task-item');
content = content.replace(/className="mobile-card"/g, 'className="worker-card"'); // just in case

// 2. Replace earnings-box block
content = content.replace(/<div className="earnings-box">[\s\S]*?<\/div>/, `
                <div className="worker-progress-card" style={{ margin: '0 0 24px 0', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
                  <div className="worker-progress-info">
                    <div className="worker-progress-header" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', opacity: 0.9 }}>ACCUMULATED EARNINGS ({currentWorker.payrollModel || 'Piece Rate'})</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, margin: '4px 0' }}>₹{totalEarnings.toLocaleString()}</div>
                  </div>
                </div>
`);

// 3. Update the login UI Wrapper
// We want to replace `<div className="device-container">` with `<div className="worker-app-container">` for the login and main
content = content.replace(
  /<div className="device-container">[\s\S]*?<div className="login-screen">/,
  `<div className="worker-app-container" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="worker-header" style={{ padding: '40px 24px 60px 24px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
          <h1 className="worker-greeting" style={{ textAlign: 'center', fontSize: '28px' }}>AKSales Floor</h1>
          <p className="worker-subtitle" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '100%' }}>Employee Production App Simulator</p>
        </div>
        <div className="worker-main" style={{ marginTop: '-30px', position: 'relative', zIndex: 2 }}>
`
);

// Close it out properly for the login view
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/,
  `      </div>\n    </div>\n  );\n}`
);

// 4. Update the main app Wrapper (the one after login)
content = content.replace(
  /return \(\s*<div className="device-container">[\s\S]*?{activeTab === 'tasks'/,
  `return (
    <div className="worker-app-container" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <div className="worker-header" style={{ padding: '24px 24px 60px 24px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', position: 'relative' }}>
        <div className="worker-header-top">
          <Menu size={24} />
          <div className="worker-header-icons">
            <Bell size={20} />
            <div className="worker-profile-btn" onClick={() => setCurrentWorker(null)}>
              {currentWorker.name.charAt(0)}
              <div className="worker-profile-dot"></div>
            </div>
          </div>
        </div>
        <h1 className="worker-greeting">Good Morning, {currentWorker.name.split(' ')[0]} 👋</h1>
        <p className="worker-subtitle">Here's your material assignments for today.</p>
      </div>
      <div className="worker-main" style={{ padding: '0 24px', marginTop: '-30px', flexGrow: 1 }}>
        {activeTab === 'tasks'`
);

// Close out main app correctly
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*export default App;/g,
  `  </div>\n  );\n}\n\nexport default App;`
);

// 5. Update bottom nav
content = content.replace(
  /<div className="bottom-nav">[\s\S]*?<\/div>/,
  `
          <div className="worker-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', padding: '12px 0 24px 0', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 10, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
            <button className={\`worker-nav-item \${activeTab === 'tasks' ? 'active' : ''}\`} onClick={() => setActiveTab('tasks')}>
              <div className="worker-nav-icon-wrapper"><ClipboardList size={20} /></div>
              <span>Tasks</span>
            </button>
            <button className={\`worker-nav-item \${activeTab === 'log_output' ? 'active' : ''}\`} onClick={() => setActiveTab('log_output')}>
              <div className="worker-nav-icon-wrapper"><TrendingUp size={20} /></div>
              <span>Log Output</span>
            </button>
            <button className={\`worker-nav-item \${activeTab === 'earnings' ? 'active' : ''}\`} onClick={() => setActiveTab('earnings')}>
              <div className="worker-nav-icon-wrapper"><DollarSign size={20} /></div>
              <span>Earnings</span>
            </button>
            <button className={\`worker-nav-item \${activeTab === 'notifications' ? 'active' : ''}\`} onClick={() => setActiveTab('notifications')}>
              <div className="worker-nav-icon-wrapper" style={{ position: 'relative' }}>
                <Bell size={20} />
                {(workerIssues.length > 0 || workerProduction.filter(p => p.status === 'Approved').length > 0) && (
                  <div className="worker-nav-badge" style={{ top: '-4px', right: '-4px' }}>
                    {workerIssues.length + workerProduction.filter(p => p.status === 'Approved').length}
                  </div>
                )}
              </div>
              <span>Alerts</span>
            </button>
          </div>
  `
);

fs.writeFileSync('worker-app/src/App.tsx', content);
