import sys
import re
import os

print("Starting UI premium upgrade...")

# --- 1. Update index.css for premium look ---
css_path = 'worker-app/src/index.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Fix bottom nav
css = css.replace("height: 64px;", "height: 72px; box-shadow: 0 -4px 25px rgba(0,0,0,0.06);")
css = css.replace("gap: 4px;", "gap: 6px;")
css = css.replace("font-size: 10px;", "font-size: 11px;")
css = css.replace("width: 60px;", "width: 75px;")

# Add Premium Card Styles
premium_card = """
.premium-card {
  background-color: #ffffff;
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0,0,0,0.02);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.premium-card:active {
  transform: scale(0.98);
}
.premium-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 6px;
  background-color: var(--card-highlight, var(--primary));
}
.premium-btn {
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #6d28d9);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}
.premium-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 5px rgba(139, 92, 246, 0.3);
}
"""
css += premium_card

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

# --- 2. Update App.tsx for premium look ---
app_path = 'worker-app/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

# Replace old worker-card with premium-card and set --card-highlight
app = app.replace(
    """<div key={issue.id} className="worker-card" style={{ borderLeft: `4px solid ${!hasPhoto ? 'var(--color-orange)' : 'var(--color-green)'}` }}>""",
    """<div key={issue.id} className="premium-card" style={{ '--card-highlight': !hasPhoto ? 'var(--color-orange)' : 'var(--color-green)' } as any}>"""
)

app = app.replace(
    """<div className="worker-card" style={{ borderLeft: '4px solid var(--primary)' }}>""",
    """<div className="premium-card" style={{ '--card-highlight': 'var(--primary)' } as any}>"""
)

app = app.replace(
    """<div className="worker-card" style={{ padding: '20px', borderLeft: '4px solid var(--color-teal)' }}>""",
    """<div className="premium-card" style={{ '--card-highlight': 'var(--accent)' } as any}>"""
)

# Upgrade the flat Verify Photo button
old_btn = """<button 
                            onClick={() => {
                              setSelectedMaterial(issue.materialId);
                              setCameraActive(true);
                            }}
                            style={{ width: '100%', padding: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >"""
new_btn = """<button 
                            className="premium-btn"
                            onClick={() => {
                              setSelectedMaterial(issue.materialId);
                              setCameraActive(true);
                            }}
                            style={{ marginTop: '16px', background: 'linear-gradient(135deg, var(--bg-surface), #f1f5f9)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                          >"""
app = app.replace(old_btn, new_btn)

old_submit = """<button 
                    onClick={handleSubmitProduction}
                    className="mobile-btn mobile-btn-primary" 
                    style={{ width: '100%', padding: '14px', fontSize: '14px' }}
                  >"""
new_submit = """<button 
                    onClick={handleSubmitProduction}
                    className="premium-btn" 
                    style={{ marginTop: '8px' }}
                  >"""
app = app.replace(old_submit, new_submit)

# Fix bottom Nav: Replace 'Alerts' with 'Profile'
old_alerts_nav = """<div 
            className={`bottom-nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell />
            <span>Alerts</span>
          </div>"""
new_profile_nav = """<div 
            className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User />
            <span>Profile</span>
          </div>"""
app = app.replace(old_alerts_nav, new_profile_nav)

# Fix the render content for Profile tab (since we are replacing 'alerts')
app = app.replace("case 'alerts':", "case 'profile':")
app = app.replace("return <div className=\"screen-content\"><div className=\"worker-card\"><h3>Alerts</h3><p>No new alerts.</p></div></div>;", "return renderProfileTab();")

# Ensure renderProfileTab function exists, if not, append it inside the component.
# Wait, if we checked out from main, renderProfileTab DOES NOT EXIST!
# We MUST add it!
profile_fn = """
  const renderProfileTab = () => {
    return (
      <div className="screen-content" style={{ padding: '0', backgroundColor: 'var(--bg-screen)' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #3e276e 100%)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', color: '#fff', boxShadow: '0 10px 25px rgba(67, 56, 202, 0.2)' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '45px', backgroundColor: '#fff', color: 'var(--primary)', fontSize: '36px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
            {currentWorker?.name.charAt(0)}
          </div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700' }}>{currentWorker?.name}</h2>
          <span style={{ fontSize: '13px', opacity: 0.8 }}>ID: {currentWorker?.id}</span>
        </div>
        
        <div style={{ padding: '24px 20px' }}>
          <div className="premium-card" style={{ '--card-highlight': 'var(--accent)' } as any}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent)" /> Work Details
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Role</span>
              <span style={{ fontWeight: '600' }}>{currentWorker?.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Base Rate</span>
              <span style={{ fontWeight: '600', color: 'var(--color-green)' }}>₹{currentWorker?.baseRate}/hr</span>
            </div>
          </div>
          
          <button onClick={() => { setCurrentWorkerId(null); setActiveTab('tasks'); }} className="premium-btn" style={{ background: '#fff', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', boxShadow: 'none', marginTop: '20px' }}>
            Log Out
          </button>
        </div>
      </div>
    );
  };
"""
if "renderProfileTab" not in app:
    # Insert it right before the render block: `const renderContent = () => {`
    app = app.replace("const renderContent = () => {", profile_fn + "\n  const renderContent = () => {")

# Also import User icon
if "User" not in app[:500]:
    app = app.replace("Bell,", "Bell, User,")

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)

print("Premium upgrade completed successfully.")
