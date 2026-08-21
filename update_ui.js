import fs from 'fs';

let content = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// Replace mobile-card
content = content.replace(/className="mobile-card"/g, 'className="worker-card"');
content = content.replace(/className={\`mobile-card /g, 'className={`worker-card ');

// Replace button primary with worker-btn-verify for Log Output
content = content.replace(
  'className="mobile-btn mobile-btn-primary"',
  'className="worker-btn-verify" style={{ width: "100%", justifyContent: "center", marginTop: "16px", padding: "12px", fontSize: "14px", backgroundColor: "#6366f1" }}'
);

// Replace Earnings banner
content = content.replace(
  /<div className="earnings-box">([\s\S]*?)<\/div>/,
  `<div className="worker-progress-card" style={{ margin: '0 0 24px 0', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>$1</div>`
);
content = content.replace('className="earnings-label"', 'style={{ fontSize: "12px", opacity: 0.9 }}');
content = content.replace('className="earnings-amount"', 'style={{ fontSize: "28px", fontWeight: 700, margin: "4px 0" }}');
content = content.replace(/className="earnings-subtext"/g, 'style={{ fontSize: "11px", opacity: 0.8 }}');

// Replace Notifications border colors to match new palette
content = content.replace(/borderLeft: '4px solid var\(--color-green\)'/g, "borderLeft: '4px solid #10b981', padding: '16px'");
content = content.replace(/borderLeft: '4px solid var\(--color-orange\)'/g, "borderLeft: '4px solid #f97316', padding: '16px'");

// Replace bottom nav
const oldNav = `<div className="bottom-nav">
            <a className={\`bottom-nav-item \${activeTab === 'tasks' ? 'active' : ''}\`} onClick={() => setActiveTab('tasks')}>
              <ClipboardList />
              <span>Tasks</span>
            </a>
            <a className={\`bottom-nav-item \${activeTab === 'log_output' ? 'active' : ''}\`} onClick={() => setActiveTab('log_output')}>
              <TrendingUp />
              <span>Log Output</span>
            </a>
            <a className={\`bottom-nav-item \${activeTab === 'earnings' ? 'active' : ''}\`} onClick={() => setActiveTab('earnings')}>
              <CircleDollarSign />
              <span>Earnings</span>
            </a>
            <a className={\`bottom-nav-item \${activeTab === 'notifications' ? 'active' : ''}\`} onClick={() => setActiveTab('notifications')} style={{ position: 'relative' }}>
              <Bell />
              <span>Alerts</span>
              {(workerIssues.length > 0 || workerProduction.filter(p => p.status === 'Approved').length > 0) && (
                <div className="notification-dot"></div>
              )}
            </a>
          </div>`;
          
const newNav = `<div className="worker-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', padding: '12px 0 24px 0', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 10, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
            <button className={\`worker-nav-item \${activeTab === 'tasks' ? 'active' : ''}\`} onClick={() => setActiveTab('tasks')}>
              <div className="worker-nav-icon-wrapper">
                <ClipboardList size={20} />
              </div>
              <span>Tasks</span>
            </button>
            <button className={\`worker-nav-item \${activeTab === 'log_output' ? 'active' : ''}\`} onClick={() => setActiveTab('log_output')}>
              <div className="worker-nav-icon-wrapper">
                <TrendingUp size={20} />
              </div>
              <span>Log Output</span>
            </button>
            <button className={\`worker-nav-item \${activeTab === 'earnings' ? 'active' : ''}\`} onClick={() => setActiveTab('earnings')}>
              <div className="worker-nav-icon-wrapper">
                <DollarSign size={20} />
              </div>
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
          </div>`;

content = content.replace(oldNav, newNav);

fs.writeFileSync('worker-app/src/App.tsx', content);
