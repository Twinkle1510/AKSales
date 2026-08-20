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
  getProductionLogs,
  saveInventory
} from './data/mockDb';

function App() {
  // Navigation & session state
  const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'notifications'>('tasks');
  const [currentWorker, setCurrentWorker] = useState<Employee | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  
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

  // Raw material consumption states
  const [logMaterialIssueId, setLogMaterialIssueId] = useState('');
  const [logMaterialQty, setLogMaterialQty] = useState<number>(0);
  const [logWastageQty, setLogWastageQty] = useState<number>(0);

  // System time clock simulator
  const [systemTime, setSystemTime] = useState('15:22');

  // Load from shared storage
  useEffect(() => {
    // Clear old sparse localStorage if found to seed rich client demo dataset
    const cachedProd = localStorage.getItem('aksales_production');
    if (cachedProd && (JSON.parse(cachedProd).length < 12 || cachedProd.includes('Samosa') || cachedProd.includes('Momo') || cachedProd.includes('Potato'))) {
      localStorage.removeItem('aksales_employees');
      localStorage.removeItem('aksales_inventory');
      localStorage.removeItem('aksales_issues');
      localStorage.removeItem('aksales_production');
      window.location.reload();
      return;
    }
    setEmployees(getEmployees());
    setInventory(getInventory());
    setIssues(getMaterialIssues());
    setProduction(getProductionLogs());

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

  // Reset consumption selector when worker changes
  useEffect(() => {
    setLogMaterialIssueId('');
    setLogMaterialQty(0);
    setLogWastageQty(0);
  }, [currentWorker]);

  // Filter issues and production logs for current worker
  const workerIssues = currentWorker 
    ? issues.filter(issue => issue.issuedToId === currentWorker.id)
    : [];

  const workerProduction = currentWorker 
    ? production.filter(p => p.workerId === currentWorker.id)
    : [];

  // Initialize default material issue selection
  useEffect(() => {
    if (workerIssues.length > 0 && !logMaterialIssueId) {
      setLogMaterialIssueId(workerIssues[0].id);
    }
  }, [workerIssues, logMaterialIssueId]);

  // Calculate worker earnings based on approved production records and pieces produced
  const approvedRuns = workerProduction.filter(p => p.status === 'Approved');
  const totalApprovedQty = approvedRuns.reduce((sum, p) => sum + p.quantityProduced, 0);
  
  let totalEarnings = 0;
  if (currentWorker) {
    const model = currentWorker.payrollModel || 'Per Piece';
    if (model === 'Fixed Salary') {
      totalEarnings = currentWorker.fixedSalaryAmount || 15000;
    } else if (model === 'Fixed + Incentive') {
      const fixed = currentWorker.fixedSalaryAmount || 12000;
      const incentive = currentWorker.incentiveRate || 10;
      totalEarnings = fixed + (totalApprovedQty * incentive);
    } else { // 'Per Piece' or 'Per KG'
      totalEarnings = totalApprovedQty * currentWorker.baseRate;
    }
  }

  // Open simulated camera
  const handleOpenCamera = (target: 'material' | 'product', issueId?: string) => {
    setCameraTarget(target);
    if (issueId) setTargetIssueId(issueId);
    setIsCameraOpen(true);
  };

  // Capture simulated picture
  const handleCapturePhoto = () => {
    if (cameraTarget === 'material' && targetIssueId) {
      const materialSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="10" x2="90" y2="10" stroke="%2394a3b8" stroke-width="4"/><circle cx="20" cy="50" r="5" fill="%23cbd5e1"/><circle cx="80" cy="50" r="5" fill="%23cbd5e1"/><text x="25" y="85" fill="%23cbd5e1" font-size="10" font-family="sans-serif">RAW MATERIAL</text></svg>`;
      setMaterialPhotos(prev => ({
        ...prev,
        [targetIssueId]: materialSvg
      }));
    } else if (cameraTarget === 'product') {
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

    // Retrieve consumption details if mapped
    const selectedIssue = issues.find(issue => issue.id === logMaterialIssueId);
    const verifiedPhoto = selectedIssue ? materialPhotos[selectedIssue.id] : undefined;

    // Calculate efficiency % = ((materialConsumedQty - wastageQty) / materialConsumedQty) * 100
    let calculatedEfficiency = 100;
    if (logMaterialQty > 0) {
      calculatedEfficiency = Math.round(((logMaterialQty - logWastageQty) / logMaterialQty) * 100);
    }

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
      materialConsumedId: selectedIssue?.materialId,
      materialConsumedName: selectedIssue?.materialName,
      materialConsumedQty: logMaterialQty > 0 ? Number(logMaterialQty) : undefined,
      materialPhoto: verifiedPhoto, // automatically bundle the raw material photo!
      productPhoto: loggedProductPhoto || undefined,
      wastageQty: logWastageQty > 0 ? Number(logWastageQty) : undefined,
      efficiency: calculatedEfficiency
    };

    // Simulate inventory consumption deduction
    if (selectedIssue && logMaterialQty > 0) {
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedIssue.materialId) {
          return {
            ...item,
            quantity: Math.max(0, item.quantity - Number(logMaterialQty)),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      setInventory(updatedInventory);
      saveInventory(updatedInventory);
    }

    const updatedProd = [newRecord, ...production];
    setProduction(updatedProd);
    saveProductionLogs(updatedProd);

    // Reset logger states
    setLogQty(0);
    setLogMaterialQty(0);
    setLogWastageQty(0);
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
            <div className="status-bar">
              <span>{systemTime}</span>
              <div className="status-bar-icons">
                <Wifi size={12} />
                <Battery size={14} />
              </div>
            </div>

            <div className="login-screen">
              <div className="login-logo" style={{ overflow: 'hidden', borderRadius: '50%', width: '70px', height: '70px', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzhqZjFpdHloYTdxdTRrdGtzNXN1MHc1bTBvZnNnYjhsbDdkMXo5MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9AI3DOykfAH1UXOP1c/giphy.gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Laser cutting logo" />
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
                            {w.department} • Model: {w.payrollModel || 'Per Piece'}
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
          
          <div className="status-bar">
            <span>{systemTime}</span>
            <div className="status-bar-icons">
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>

          {/* App Header */}
          <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzhqZjFpdHloYTdxdTRrdGtzNXN1MHc1bTBvZnNnYjhsbDdkMXo5MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9AI3DOykfAH1UXOP1c/giphy.gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Laser loop badge" />
              </div>
              <div>
                <div className="app-title">AKSales App</div>
                <div className="app-subtitle" style={{ fontSize: '10px' }}>{currentWorker.department}</div>
              </div>
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
                  
                  {/* Batch Details */}
                  <div className="form-group">
                    <label>Batch Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      disabled
                      value={logBatchNum} 
                    />
                  </div>

                  {/* Materials consumed selector */}
                  <div style={{ border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-orange)' }}>
                      Consumed Material (Ledger Link)
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label>Select Issued Material</label>
                      <select
                        className="form-input"
                        value={logMaterialIssueId}
                        onChange={(e) => setLogMaterialIssueId(e.target.value)}
                      >
                        <option value="">-- Self Supplied / None --</option>
                        {workerIssues.map(issue => (
                          <option key={issue.id} value={issue.id}>
                            {issue.materialName} ({issue.quantity} available)
                          </option>
                        ))}
                      </select>
                    </div>

                    {logMaterialIssueId && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '8px' }}>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                          <label>Qty Consumed</label>
                          <input
                            type="number"
                            className="form-input"
                            min="1"
                            value={logMaterialQty || ''}
                            onChange={(e) => setLogMaterialQty(Number(e.target.value))}
                            placeholder="e.g. 10"
                          />
                        </div>
                        {/* Commented out as requested
                        <div className="form-group" style={{ marginBottom: '0' }}>
                          <label>Scrap / Wastage</label>
                          <input
                            type="number"
                            className="form-input"
                            min="0"
                            value={logWastageQty || ''}
                            onChange={(e) => setLogWastageQty(Number(e.target.value))}
                            placeholder="e.g. 2"
                          />
                        </div>
                        */}
                      </div>
                    )}
                  </div>

                  {/* Finished Goods Output */}
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
                    <label>Quantity Completed (Output)</label>
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

                  {/* Snapshot of product */}
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
                {/* Piece rate earnings card banner */}
                <div className="earnings-box">
                  <span className="earnings-label">ACCUMULATED EARNINGS ({currentWorker.payrollModel || 'Piece Rate'})</span>
                  <div className="earnings-amount">₹{totalEarnings.toLocaleString()}</div>
                  
                  {currentWorker.payrollModel === 'Fixed Salary' && (
                    <span className="earnings-subtext">
                      Fixed monthly payout: ₹{currentWorker.fixedSalaryAmount?.toLocaleString()}
                    </span>
                  )}
                  {currentWorker.payrollModel === 'Fixed + Incentive' && (
                    <span className="earnings-subtext">
                      Base: ₹{currentWorker.fixedSalaryAmount?.toLocaleString()} + ₹{currentWorker.incentiveRate}/piece ({totalApprovedQty} units approved)
                    </span>
                  )}
                  {(currentWorker.payrollModel === 'Per Piece' || currentWorker.payrollModel === 'Per KG') && (
                    <span className="earnings-subtext">
                      Calculated at ₹{currentWorker.baseRate} per unit ({totalApprovedQty} total units approved)
                    </span>
                  )}
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
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {p.productName}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--color-green)', fontSize: '14px' }}>
                          {p.status === 'Approved' ? (
                            currentWorker.payrollModel === 'Fixed Salary' ? (
                              'Salary Credit'
                            ) : currentWorker.payrollModel === 'Fixed + Incentive' ? (
                              `+₹${(p.quantityProduced * (currentWorker.incentiveRate || 10)).toLocaleString()}`
                            ) : (
                              `+₹${(p.quantityProduced * currentWorker.baseRate).toLocaleString()}`
                            )
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Approval</span>
                          )}
                        </span>
                      </div>

                      {/* Structured Input vs Output details card */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '11px', marginBottom: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: 700, marginBottom: '2px', fontSize: '9px' }}>INPUT (SS SHEETS)</span>
                          <strong style={{ fontSize: '14px', color: 'var(--color-orange)' }}>
                            {p.materialConsumedQty} kg
                          </strong>
                          <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {p.materialConsumedName}
                          </div>
                        </div>

                        <div style={{ borderLeft: '1px dashed var(--border)', paddingLeft: '8px', minWidth: 0 }}>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: 700, marginBottom: '2px', fontSize: '9px' }}>OUTPUT (PRODUCT)</span>
                          <strong style={{ fontSize: '14px', color: 'var(--color-green)' }}>
                            {p.quantityProduced} pcs
                          </strong>
                          <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {p.productName}
                          </div>
                        </div>
                      </div>

                      {p.efficiency !== undefined && (
                        <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Yield Material Utilization:</span>
                          <span>{p.efficiency}%</span>
                        </div>
                      )}

                      {/* Side-by-side Photo thumbnails if present */}
                      {(p.materialPhoto || p.productPhoto) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                          {p.materialPhoto && (
                            <div className="photo-thumbnail-container" style={{ height: '60px', cursor: 'pointer' }} onClick={() => setZoomImage(p.materialPhoto || null)}>
                              <img src={p.materialPhoto} className="photo-thumbnail-img" alt="Material consumed" />
                              <span style={{ position: 'absolute', bottom: '2px', left: '4px', fontSize: '8px', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1px 3px', borderRadius: '2px' }}>Material (Click)</span>
                            </div>
                          )}
                          {p.productPhoto && (
                            <div className="photo-thumbnail-container" style={{ height: '60px', cursor: 'pointer' }} onClick={() => setZoomImage(p.productPhoto || null)}>
                              <img src={p.productPhoto} className="photo-thumbnail-img" alt="Finished item" />
                              <span style={{ position: 'absolute', bottom: '2px', left: '4px', fontSize: '8px', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1px 3px', borderRadius: '2px' }}>Product (Click)</span>
                            </div>
                          )}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {workerProduction.filter(p => p.status === 'Approved').map(p => (
                    <div key={p.id} className="mobile-card" style={{ borderLeft: '4px solid var(--color-green)' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--color-green)', padding: '8px', borderRadius: '50%' }}>
                          <CheckCircle size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>Batch {p.batchNumber} Approved</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Wages added to your ledger sheet.</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {workerIssues.map(issue => (
                    <div key={issue.id} className="mobile-card" style={{ borderLeft: '4px solid var(--color-orange)' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--color-orange)', padding: '8px', borderRadius: '50%' }}>
                          <ClipboardList size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>New SS Sheets Assigned</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {issue.quantity} kg of {issue.materialName} allocated.
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
              {(workerIssues.length > 0 || workerProduction.filter(p => p.status === 'Approved').length > 0) && (
                <div className="notification-dot"></div>
              )}
            </a>
          </div>

          {/* Lightbox Zoom Overlay inside the Phone Screen */}
          {zoomImage && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.92)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px'
              }}
              onClick={() => setZoomImage(null)}
            >
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <img 
                  src={zoomImage} 
                  style={{ width: '100%', maxHeight: '60vh', borderRadius: '12px', border: '3px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
                  alt="Zoomed view" 
                />
                <button 
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: '2px solid white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    lineHeight: 1
                  }}
                  onClick={() => setZoomImage(null)}
                >
                  ×
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
