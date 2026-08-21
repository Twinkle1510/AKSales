import sys

with open('worker-app/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { \n  ClipboardList, \n  TrendingUp, \n  CircleDollarSign, \n  Bell, \n  Camera, \n  Wifi, \n  Battery, \n  ArrowLeft,\n  X,\n  CheckCircle,\n  AlertCircle\n} from 'lucide-react';",
    "import { ClipboardList, TrendingUp, CircleDollarSign, Bell, Camera, Wifi, Battery, ArrowLeft, X, CheckCircle, AlertCircle, User, Search } from 'lucide-react';\nimport Swal from 'sweetalert2';"
)

# 2. Active Tab State
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'notifications'>('tasks');",
    "const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'profile'>('tasks');"
)

# 3. Header Titles
content = content.replace(
    "{activeTab === 'notifications' && 'Notifications'}",
    "{activeTab === 'profile' && 'Worker Profile'}"
)
content = content.replace(
    "{activeTab === 'notifications' && 'Recent updates and alerts'}",
    "{activeTab === 'profile' && 'Your profile and settings'}"
)

# 4. Header Bell Button
content = content.replace(
    '<button style={{ background: \'none\', border: \'none\', color: \'white\', padding: \'4px\', cursor: \'pointer\', position: \'relative\' }}>',
    '<button style={{ background: \'none\', border: \'none\', color: \'white\', padding: \'4px\', cursor: \'pointer\', position: \'relative\' }} onClick={() => Swal.fire({ title: \'Notifications\', text: \'You have no new alerts.\', icon: \'info\', confirmButtonColor: \'var(--primary)\', background: \'#F4F7FE\' })}>'
)

# 5. Tasks Tab (Left Borders)
content = content.replace(
    '<div key={issue.id} className="worker-card">',
    '<div key={issue.id} className="worker-card" style={{ borderLeft: `4px solid ${!hasPhoto ? \'var(--color-orange)\' : \'var(--color-green)\'}` }}>'
)

# 6. Production Tab
content = content.replace(
    '<div className="worker-card" style={{ padding: \'20px\' }}>\n                  <div style={{ display: \'flex\', alignItems: \'center\', gap: \'8px\', marginBottom: \'20px\', color: \'var(--color-green)\' }}>',
    '<div className="worker-card" style={{ padding: \'20px\', borderLeft: \'4px solid var(--primary)\' }}>\n                  <div style={{ display: \'flex\', alignItems: \'center\', gap: \'8px\', marginBottom: \'20px\', color: \'var(--color-green)\' }}>'
)
content = content.replace(
    '<div className="worker-card" style={{ padding: \'20px\' }}>\n                  <label style={{ fontSize: \'12px\', fontWeight: 700, color: \'var(--text-primary)\', marginBottom: \'12px\', display: \'block\' }}>',
    '<div className="worker-card" style={{ padding: \'20px\', borderLeft: \'4px solid var(--color-teal)\' }}>\n                  <label style={{ fontSize: \'12px\', fontWeight: 700, color: \'var(--text-primary)\', marginBottom: \'12px\', display: \'block\' }}>'
)

# 7. Earnings Tab (The map function)
old_earnings_block = """                    workerProduction.map(p => (
                      <div key={p.id} className="worker-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.date}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Batch: {p.batchNumber}</div>
                          </div>
                          <span className={`badge ${p.status === 'Approved' ? 'badge-success' : 'badge-pending'}`}>
                            {p.status === 'Approved' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Product (Item)</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.productName}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Quantity Yield</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-green)' }}>{p.quantityProduced} Units</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fixed Wage Rate</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>₹ {currentWorker.baseRate} / Unit</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Calculation</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{p.quantityProduced} x ₹{currentWorker.baseRate}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Earned</div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>₹ {(p.quantityProduced * currentWorker.baseRate).toLocaleString()}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{p.status === 'Approved' ? `Approved on ${p.approvedDate || p.date}` : 'Pending supervisor approval'}</div>
                      </div>
                    ))"""

new_earnings_block = """                    workerProduction.map(p => (
                      <div key={p.id} className="worker-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: `4px solid ${p.status === 'Approved' ? 'var(--color-green)' : 'var(--color-orange)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.date}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Batch: {p.batchNumber}</div>
                          </div>
                          <span className={`badge ${p.status === 'Approved' ? 'badge-success' : 'badge-pending'}`}>
                            {p.status === 'Approved' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        
                        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Product (Item)</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right', color: 'var(--text-primary)' }}>{p.productName}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Quantity Yield</span>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-green)' }}>{p.quantityProduced} Units</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fixed Wage Rate</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>₹ {currentWorker.baseRate} / Unit</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calculation</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{p.quantityProduced} x ₹{currentWorker.baseRate}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Earned</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-green)' }}>₹ {(p.quantityProduced * currentWorker.baseRate).toLocaleString()}</div>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.status === 'Approved' ? `Approved on ${p.approvedDate || p.date}` : 'Pending supervisor approval'}</div>
                        </div>
                      </div>
                    ))"""

content = content.replace(old_earnings_block, new_earnings_block)

# 8. Notifications Tab -> Profile Tab
old_notifications_tab = """            {activeTab === 'notifications' && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p>No new notifications.</p>
              </div>
            )}"""

new_profile_tab = """            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
                <div className="worker-card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '40px', backgroundColor: 'var(--primary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto',
                    fontSize: '32px', fontWeight: 'bold', color: '#fff'
                  }}>
                    {currentWorker.name.charAt(0)}
                  </div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: 'var(--text-primary)' }}>{currentWorker.name}</h2>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {currentWorker.employeeCode} • {currentWorker.department}
                  </div>
                  <span className="badge badge-success" style={{ marginTop: '12px', display: 'inline-block' }}>
                    Active Employee
                  </span>
                </div>

                <div className="worker-card" style={{ borderLeft: '4px solid var(--color-teal)' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Work Details</h3>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Role</span>
                      <strong style={{ fontSize: '13px' }}>{currentWorker.role}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Payroll Model</span>
                      <strong style={{ fontSize: '13px' }}>{currentWorker.payrollModel || 'Per Piece'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Base Rate</span>
                      <strong style={{ fontSize: '13px' }}>₹ {currentWorker.baseRate}</strong>
                    </div>
                  </div>
                </div>

                <div className="worker-card" style={{ borderLeft: '4px solid var(--color-orange)' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Preferences</h3>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Notifications</span>
                      <span style={{ color: 'var(--color-green)', fontSize: '13px', fontWeight: 600 }}>Enabled</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Language</span>
                      <strong style={{ fontSize: '13px' }}>English</strong>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '14px', marginTop: '10px', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', background: 'transparent' }}
                  onClick={() => {
                    Swal.fire({
                      title: 'Logged Out',
                      text: 'You have been successfully logged out.',
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false
                    }).then(() => {
                      setCurrentWorker(null);
                      setActiveTab('tasks');
                    });
                  }}
                >
                  Log Out
                </button>
              </div>
            )}"""

content = content.replace(old_notifications_tab, new_profile_tab)

# 9. Bottom Nav Notifications -> Profile
old_nav = """            <div className={`bottom-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <Bell size={22} />
              <span>Profile</span>
              {(workerIssues.length > 0) && (
                <div className="notification-dot"></div>
              )}
            </div>"""

new_nav = """            <div className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={22} />
              <span>Profile</span>
            </div>"""

content = content.replace(old_nav, new_nav)
# In case it was still using "Notifications" text
old_nav_2 = """            <div className={`bottom-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <Bell size={22} />
              <span>Notifications</span>
              {(workerIssues.length > 0) && (
                <div className="notification-dot"></div>
              )}
            </div>"""
content = content.replace(old_nav_2, new_nav)

# 10. Fix submit production alert
content = content.replace(
    "alert(`Logged Output for Batch ${newRecord.batchNumber} successfully submitted!`);",
    "Swal.fire({ title: 'Success!', text: `Logged Output for Batch ${newRecord.batchNumber} successfully submitted!`, icon: 'success', confirmButtonColor: 'var(--color-green)' });"
)

with open('worker-app/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully rebuilt worker-app App.tsx")
