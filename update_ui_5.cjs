const fs = require('fs');
let content = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// 1. Remove unused imports
content = content.replace(
  `import { 
  ClipboardList, 
  TrendingUp, 
  CircleDollarSign, 
  DollarSign, 
  Bell, 
  Camera, 
  Wifi, 
  Battery, 
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';`,
  `import { 
  ClipboardList, 
  TrendingUp, 
  CircleDollarSign,
  DollarSign, 
  Bell, 
  Camera, 
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';`
);

// Remove unused state
content = content.replace(
  `const [systemTime, setSystemTime] = useState('15:22');

  // Load from shared storage`,
  `// Load from shared storage`
);

content = content.replace(
  `const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setSystemTime(\`\${hrs}:\${mins}\`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);`,
  ``
);

// 2. Replace mobile-card with worker-card
content = content.replace(/className="mobile-card"/g, 'className="worker-card"');
content = content.replace(/className={\`mobile-card /g, 'className={`worker-card ');

// 3. Fix the Earnings tab
content = content.replace(
  /<div className="earnings-box">([\s\S]*?)<\/div>/,
  `<div className="worker-progress-card" style={{ margin: '0 0 24px 0', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>$1</div>`
);
content = content.replace('className="earnings-label"', 'style={{ fontSize: "12px", opacity: 0.9 }}');
content = content.replace('className="earnings-amount"', 'style={{ fontSize: "28px", fontWeight: 700, margin: "4px 0" }}');
content = content.replace(/className="earnings-subtext"/g, 'style={{ fontSize: "11px", opacity: 0.8 }}');


// 4. Update the login UI Wrapper
const oldLoginWrapperOpen = `<div className="device-container">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="status-bar">
              <span>{systemTime}</span>
              <div className="status-bar-icons">
                <Wifi size={12} />
                <Battery size={14} />
              </div>
            </div>

            <div className="login-screen">`;
            
const newLoginWrapperOpen = `<div className="worker-app-container" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="worker-header" style={{ padding: '40px 24px 60px 24px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
          <h1 className="worker-greeting" style={{ textAlign: 'center', fontSize: '28px', margin: 0 }}>AKSales Floor</h1>
          <p className="worker-subtitle" style={{ textAlign: 'center', margin: '8px auto 0 auto', maxWidth: '100%', opacity: 0.9 }}>Employee Production App</p>
        </div>
        <div className="worker-main" style={{ marginTop: '-30px', position: 'relative', zIndex: 2 }}>
          <div className="login-screen" style={{ background: 'transparent' }}>`;
content = content.replace(oldLoginWrapperOpen, newLoginWrapperOpen);

const oldLoginWrapperClose = `              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
const newLoginWrapperClose = `              </div>
            </div>
          </div>
        </div>
    );
  }`;
content = content.replace(oldLoginWrapperClose, newLoginWrapperClose);


// 5. Update the main app Wrapper (After login)
const oldMainWrapperOpen = `return (
    <div className="device-container">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          <div className="status-bar">
            <span>{systemTime}</span>
            <div className="status-bar-icons">
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>

          {activeTab === 'tasks' && (`;
          
const newMainWrapperOpen = `return (
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

          {activeTab === 'tasks' && (`;
content = content.replace(oldMainWrapperOpen, newMainWrapperOpen);

const oldMainWrapperClose = `        </div>
      </div>
    </div>
  );
}`;
const newMainWrapperClose = `        </div>
    </div>
  );
}`;
content = content.replace(oldMainWrapperClose, newMainWrapperClose);

// 6. Replace bottom nav (which also contains the unclickable <a> tags that caused the issue)
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
