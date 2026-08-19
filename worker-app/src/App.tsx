import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  TrendingUp, 
  CircleDollarSign, 
  Bell, 
  Camera, 
  Wifi, 
  Battery, 
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import type {
  Employee,
  InventoryItem,
  MaterialIssue,
  ProductionLog
} from './data/mockDb';
import {
  getEmployees,
  getInventory,
  getMaterialIssues,
  saveProductionLogs,
  getProductionLogs
} from './data/mockDb';

function App() {
  // Navigation & session state
  const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'notifications'>('tasks');
  const [currentWorker, setCurrentWorker] = useState<Employee | null>(null);
  
  // Database state copies
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [issues, setIssues] = useState<MaterialIssue[]>([]);
  const [production, setProduction] = useState<ProductionLog[]>([]);

  // Mobile simulated camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'material' | 'product' | null>(null);
  const [targetIssueId, setTargetIssueId] = useState<string | null>(null);
  
  // Form logger states
  const [logProductId, setLogProductId] = useState('');
  const [logQty, setLogQty] = useState<number>(0);
  const [logBatchNum, setLogBatchNum] = useState('');
  const [materialPhotos, setMaterialPhotos] = useState<Record<string, string>>({}); // issueId -> image
  const [loggedProductPhoto, setLoggedProductPhoto] = useState<string | null>(null);

  // System time clock simulator
  const [systemTime, setSystemTime] = useState('15:22');

  // Load from shared storage
  useEffect(() => {
    // Load local storage states
    setEmployees(getEmployees());
    setInventory(getInventory());
    setIssues(getMaterialIssues());
    setProduction(getProductionLogs());

    // Update phone time
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setSystemTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Poll database updates (simulate standard reactive sync)
  useEffect(() => {
    const handleStorageChange = () => {
      setEmployees(getEmployees());
      setInventory(getInventory());
      setIssues(getMaterialIssues());
      setProduction(getProductionLogs());
    };
    window.addEventListener('storage', handleStorageChange);
    // Polling interval just in case storage event doesn't trigger on same tab
    const pollInterval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  // Initialize form options
  useEffect(() => {
    if (inventory.length > 0 && !logProductId) {
      const finished = inventory.find(i => i.type === 'Finished Good');
      if (finished) setLogProductId(finished.id);
    }
    if (!logBatchNum) {
      setLogBatchNum(`B-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [inventory, logProductId, logBatchNum]);

  // Filter issues and production logs for current worker
  const workerIssues = currentWorker 
    ? issues.filter(issue => issue.issuedToId === currentWorker.id)
    : [];

  const workerProduction = currentWorker 
    ? production.filter(p => p.workerId === currentWorker.id)
    : [];

  // Calculate worker earnings based on approved production records
  // Formula: baseRate per hour * 8 hours per approved batch
  const approvedCount = workerProduction.filter(p => p.status === 'Approved').length;
  const workerHours = approvedCount * 8;
  const totalEarnings = currentWorker ? currentWorker.baseRate * workerHours : 0;

  // Open simulated camera
  const handleOpenCamera = (target: 'material' | 'product', issueId?: string) => {
    setCameraTarget(target);
    if (issueId) setTargetIssueId(issueId);
    setIsCameraOpen(true);
  };

  // Capture simulated picture
  const handleCapturePhoto = () => {
    if (cameraTarget === 'material' && targetIssueId) {
      // Simulate taking a photo of Steel sheets / bars
      const materialSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="10" x2="90" y2="10" stroke="%2394a3b8" stroke-width="4"/><circle cx="20" cy="50" r="5" fill="%23cbd5e1"/><circle cx="80" cy="50" r="5" fill="%23cbd5e1"/><text x="25" y="85" fill="%23cbd5e1" font-size="10" font-family="sans-serif">RAW MATERIAL</text></svg>`;
      setMaterialPhotos(prev => ({
        ...prev,
        [targetIssueId]: materialSvg
      }));
    } else if (cameraTarget === 'product') {
      // Simulate taking a photo of a heavy duty valve
      const productSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="50" cy="50" r="25" fill="%23ef4444" stroke="%23dc2626" stroke-width="4"/><rect x="42" y="10" width="16" height="30" fill="%23475569"/><rect x="25" y="42" width="50" height="16" fill="%2394a3b8"/><text x="20" y="90" fill="%2310b981" font-size="10" font-family="sans-serif">FINISHED GOOD</text></svg>`;
      setLoggedProductPhoto(productSvg);
    }
    
    setIsCameraOpen(false);
    setCameraTarget(null);
    setTargetIssueId(null);
  };

  // Submit batch logging form
  const handleLogProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorker || !logProductId || logQty <= 0) return;

    const product = inventory.find(i => i.id === logProductId);
    if (!product) return;

    const newRecord: ProductionLog = {
      id: `PROD-${String(production.length + 1).padStart(3, '0')}`,
      batchNumber: logBatchNum,
      productId: logProductId,
      productName: product.name,
      quantityProduced: Number(logQty),
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      productPhoto: loggedProductPhoto || undefined
    };

    const updatedProd = [newRecord, ...production];
    setProduction(updatedProd);
    saveProductionLogs(updatedProd);

    // Reset logger states
    setLogQty(0);
    setLoggedProductPhoto(null);
    setLogBatchNum(`B-${Math.floor(100 + Math.random() * 900)}`);
    alert(`Logged Output for Batch ${newRecord.batchNumber} successfully submitted!`);
    setActiveTab('earnings');
  };

  // Log in screen if no worker is active
  if (!currentWorker) {
    const activeWorkers = employees.filter(e => e.role === 'Worker' && e.status === 'Active');
    return (
      <div className="device-container">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            {/* Status bar */}
            <div className="status-bar">
              <span>{systemTime}</span>
              <div className="status-bar-icons">
                <Wifi size={12} />
                <Battery size={14} />
              </div>
            </div>

            <div className="login-screen">
              <div className="login-logo">
                <TrendingUp size={40} />
              </div>
              <div className="login-header-group">
                <h1 className="login-title">AKSales Floor</h1>
                <p className="login-subtitle">Employee Production App Simulator</p>
              </div>

              <div style={{ width: '100%' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Select Worker Account to Login:
                </p>
                
                {activeWorkers.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No active workers found in local database. Please register employees in the Admin Panel first.
                  </p>
                ) : (
                  <div className="worker-selection-list">
                    {activeWorkers.map(w => (
                      <div 
                        key={w.id} 
                        className="worker-select-card"
                        onClick={() => {
                          setCurrentWorker(w);
                          setActiveTab('tasks');
                        }}
                      >
                        <div className="worker-select-avatar">
                          {w.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{w.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {w.department} • Wage: ₹{w.baseRate}/hr
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="device-container">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          
          {/* Status bar */}
          <div className="status-bar">
            <span>{systemTime}</span>
            <div className="status-bar-icons">
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>

          {/* App Header */}
          <div className="app-header">
            <div>
              <div className="app-title">AKSales App</div>
              <div className="app-subtitle">{currentWorker.department}</div>
            </div>
            
            <div className="worker-profile-chip" onClick={() => setCurrentWorker(null)}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></div>
              <span>{currentWorker.name.split(' ')[0]}</span>
              <ArrowLeft size={12} style={{ transform: 'rotate(-90deg)' }} />
            </div>
          </div>

          {/* Main Screens router */}
          <div className="screen-content">
            {activeTab === 'tasks' && (
              <>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Material Assignments</h3>
                {workerIssues.length === 0 ? (
                  <div className="mobile-card" style={{ alignItems: 'center', padding: '32px' }}>
                    <ClipboardList size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      No raw material sheets issued to you yet. Ask Admin to issue stock.
                    </p>
                  </div>
                ) : (
                  workerIssues.map(issue => {
                    const hasPhoto = !!materialPhotos[issue.id];
                    return (
                      <div key={issue.id} className={`mobile-card task-item ${hasPhoto ? 'completed' : ''}`}>
                        <div className="task-item-header">
                          <div>
                            <div className="task-item-title">{issue.materialName}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {issue.materialId}</span>
                          </div>
                          <span className="task-item-qty">Qty: {issue.quantity}</span>
                        </div>

                        {issue.remarks && (
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Purpose: <strong>{issue.remarks}</strong>
                          </p>
                        )}

                        <div className="task-item-footer">
                          <span>Issued: {issue.date}</span>
                          
                          {hasPhoto ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-green)' }}>
                              <CheckCircle size={14} />
                              <span style={{ fontWeight: 700 }}>Photo Logged</span>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-primary"
                              onClick={() => handleOpenCamera('material', issue.id)}
                              style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                            >
                              <Camera size={12} /> Verify Stock Photo
                            </button>
                          )}
                        </div>

                        {hasPhoto && (
                          <div className="photo-thumbnail-container" style={{ marginTop: '8px', height: '100px' }}>
                            <img src={materialPhotos[issue.id]} className="photo-thumbnail-img" alt="Material photo" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'log_output' && (
              <>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Log Daily Production</h3>
                <form className="mobile-card" onSubmit={handleLogProduction}>
                  <div className="form-group">
                    <label>Batch Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      disabled
                      value={logBatchNum} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Manufactured Finished Good</label>
                    <select 
                      className="form-input"
                      value={logProductId}
                      onChange={(e) => setLogProductId(e.target.value)}
                    >
                      {inventory.filter(i => i.type === 'Finished Good').map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quantity Completed</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      required
                      min="1"
                      value={logQty || ''}
                      onChange={(e) => setLogQty(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label>Finished Product Snapshot</label>
                    
                    {loggedProductPhoto ? (
                      <div className="photo-thumbnail-container">
                        <img src={loggedProductPhoto} className="photo-thumbnail-img" alt="Product output" />
                        <button 
                          type="button" 
                          className="photo-thumbnail-remove"
                          onClick={() => setLoggedProductPhoto(null)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="mobile-btn mobile-btn-secondary"
                        onClick={() => handleOpenCamera('product')}
                        style={{ gap: '8px' }}
                      >
                        <Camera size={16} /> Snap Finished Photo
                      </button>
                    )}
                  </div>

                  <button type="submit" className="mobile-btn mobile-btn-primary" style={{ marginTop: '8px' }}>
                    Log Completed Batch
                  </button>
                </form>
              </>
            )}

            {activeTab === 'earnings' && (
              <>
                {/* Earnings card banner */}
                <div className="earnings-box">
                  <span className="earnings-label">ACCUMULATED EARNINGS</span>
                  <div className="earnings-amount">₹{totalEarnings.toLocaleString()}</div>
                  <span className="earnings-subtext">
                    Calculated from {approvedCount} approved manufacturing runs
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 2px 0' }}>Production History</h3>
                
                {workerProduction.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                    No production runs logged yet.
                  </p>
                ) : (
                  workerProduction.map(p => (
                    <div key={p.id} className="mobile-card" style={{ padding: '14px', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>Batch {p.batchNumber}</span>
                        <span 
                          className={`badge ${p.status === 'Approved' ? 'badge-success' : 'badge-pending'}`}
                          style={{ fontSize: '10px', padding: '2px 8px' }}
                        >
                          {p.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>{p.productName} ({p.quantityProduced} pcs)</span>
                        <span style={{ fontWeight: 700 }}>
                          {p.status === 'Approved' ? `+₹${(currentWorker.baseRate * 8).toLocaleString()}` : 'Pending wage'}
                        </span>
                      </div>

                      {p.productPhoto && (
                        <div className="photo-thumbnail-container" style={{ height: '70px', marginTop: '4px' }}>
                          <img src={p.productPhoto} className="photo-thumbnail-img" alt="Batch production" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Inbox Alerts</h3>
                
                {workerIssues.length === 0 && workerProduction.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '32px' }}>
                    No alerts received.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Approved outputs notifications */}
                    {workerProduction.filter(p => p.status === 'Approved').map(p => (
                      <div key={p.id} className="mobile-card notify-card success">
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>Batch Approved!</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Batch <strong>{p.batchNumber}</strong> has been approved by admin. 8 hours of labor wage (₹{currentWorker.baseRate * 8}) credited to your panel.
                        </p>
                        <div className="notify-time">{p.approvedDate}</div>
                      </div>
                    ))}

                    {/* Issued materials notifications */}
                    {workerIssues.map(issue => (
                      <div key={issue.id} className="mobile-card notify-card alert">
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>Raw Material Assigned</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Admin has issued {issue.quantity} {issue.remarks ? `for ${issue.remarks}` : ''} of {issue.materialName} to your assembly line.
                        </p>
                        <div className="notify-time">{issue.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Camera overlay simulator */}
          {isCameraOpen && (
            <div className="camera-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Floor Camera Simulator</span>
                <button 
                  onClick={() => { setIsCameraOpen(false); setCameraTarget(null); }}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="camera-viewfinder">
                <div className="camera-grid-lines"></div>
                <div style={{ color: '#ffffff', zIndex: 10, textAlign: 'center', padding: '16px' }}>
                  <AlertCircle size={32} style={{ color: 'var(--accent)', margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '12px' }}>Point camera at {cameraTarget === 'material' ? 'assigned materials sheet' : 'finished output batch'}</p>
                </div>
              </div>

              <div className="camera-controls">
                <div style={{ width: '40px' }}></div>
                <button className="shutter-btn" onClick={handleCapturePhoto}></button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          )}

          {/* Bottom Nav Bar tabs */}
          <div className="bottom-nav">
            <a className={`bottom-nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              <ClipboardList />
              <span>Tasks</span>
            </a>
            <a className={`bottom-nav-item ${activeTab === 'log_output' ? 'active' : ''}`} onClick={() => setActiveTab('log_output')}>
              <TrendingUp />
              <span>Log Output</span>
            </a>
            <a className={`bottom-nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
              <CircleDollarSign />
              <span>Earnings</span>
            </a>
            <a className={`bottom-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')} style={{ position: 'relative' }}>
              <Bell />
              <span>Alerts</span>
              {/* Alert indicator dot */}
              {(workerIssues.length > 0 || workerProduction.filter(p => p.status === 'Approved').length > 0) && (
                <div className="notification-dot"></div>
              )}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
