const fs = require('fs');

const appTsxPath = 'worker-app/src/App.tsx';
let code = fs.readFileSync(appTsxPath, 'utf-8');

const returnIndex = code.lastIndexOf('  return (');
if (returnIndex === -1) {
  console.error("Could not find return statement");
  process.exit(1);
}

const logicPart = code.substring(0, returnIndex);

const newJSX = `  return (
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

          {/* App Header perfectly matching mockup */}
          <div className="app-header">
            <button style={{ background: 'none', border: 'none', color: 'white', padding: '4px', cursor: 'pointer' }} onClick={() => setCurrentWorker(null)}>
              <ArrowLeft size={20} />
            </button>
            <div className="header-center">
              <div className="app-title">
                {activeTab === 'tasks' && 'Material Assignment'}
                {activeTab === 'log_output' && 'Production Entry'}
                {activeTab === 'earnings' && 'Payroll Summary'}
                {activeTab === 'notifications' && 'Notifications'}
              </div>
              <div className="app-subtitle">
                {activeTab === 'tasks' && 'List of materials assigned to you'}
                {activeTab === 'log_output' && 'Enter production details'}
                {activeTab === 'earnings' && 'Your earnings and payroll details'}
                {activeTab === 'notifications' && 'Recent updates and alerts'}
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', padding: '4px', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              {(workerIssues.length > 0) && (
                <div style={{ position: 'absolute', top: '4px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '1px solid var(--primary)' }}></div>
              )}
            </button>
          </div>

          <div className="screen-content">
            {activeTab === 'tasks' && (
              <>
                <div className="search-box">
                  <Search size={16} color="var(--text-muted)" />
                  <input type="text" placeholder="Search material or batch..." />
                  <div style={{ paddingLeft: '8px', borderLeft: '1px solid var(--border)' }}>
                    <ClipboardList size={16} color="var(--text-secondary)" />
                  </div>
                </div>

                <div className="tabs-row">
                  <div className="tab-pill active">All ({workerIssues.length})</div>
                  <div className="tab-pill">Pending ({(workerIssues.filter(i => !materialPhotos[i.id])).length})</div>
                  <div className="tab-pill">Received ({(workerIssues.filter(i => materialPhotos[i.id])).length})</div>
                </div>

                {workerIssues.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <ClipboardList size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                    <p style={{ fontSize: '13px' }}>No raw material assigned to you.</p>
                  </div>
                ) : (
                  workerIssues.map(issue => {
                    const hasPhoto = !!materialPhotos[issue.id];
                    // Dynamic color assignment for mockups
                    const isWhite = issue.materialName.toLowerCase().includes('white');
                    const isSheet = issue.materialName.toLowerCase().includes('sheet') || issue.materialName.toLowerCase().includes('corrugated');
                    const iconColor = isWhite ? 'green' : isSheet ? 'orange' : 'default';

                    return (
                      <div key={issue.id} className="worker-card">
                        <div className="task-item-row">
                          <div className={\`task-icon-circle \${iconColor}\`}>
                            <ClipboardList size={20} />
                          </div>
                          
                          <div className="task-content">
                            <div className="task-header-row">
                              <div className="task-title">{issue.materialName}</div>
                              {hasPhoto ? (
                                <span className="badge badge-success">Received</span>
                              ) : (
                                <span className="badge badge-pending">Pending</span>
                              )}
                            </div>
                            
                            <div className="task-details">
                              <div className="task-detail-line">Batch No. : <strong style={{ color: 'var(--primary)' }}>{issue.materialId}</strong></div>
                              <div className="task-detail-line">Quantity : <strong>{issue.quantity} KG</strong></div>
                              <div className="task-detail-line">Issue Date : <strong>{issue.date}</strong></div>
                            </div>

                            {!hasPhoto ? (
                              <button className="link-btn" onClick={() => handleOpenCamera('material', issue.id)}>
                                View Details &gt;
                              </button>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-green)', fontSize: '12px', fontWeight: 600, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                                <CheckCircle size={14} /> Photo Logged
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'log_output' && (
              <form onSubmit={handleLogProduction} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="worker-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-green)' }}>
                    <ClipboardList size={18} />
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>Production Details</span>
                  </div>

                  <div className="form-group">
                    <label>Product Name <span className="required-star">*</span></label>
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
                    <label>Quantity Produced <span className="required-star">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        className="form-input" 
                        required
                        min="1"
                        value={logQty || ''}
                        onChange={(e) => setLogQty(Number(e.target.value))}
                        style={{ paddingRight: '40px' }}
                      />
                      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>KG</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Production Date <span className="required-star">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        disabled
                        value={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
                      />
                      <ClipboardList size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Remarks (Optional)</label>
                    <textarea 
                      className="form-input"
                      rows={3}
                      placeholder="Enter remarks..."
                      style={{ resize: 'none' }}
                    ></textarea>
                    <div style={{ textAlign: 'right', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>0/100</div>
                  </div>
                </div>

                <div className="worker-card" style={{ padding: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                    Upload Finished Product Photo <span className="required-star">*</span>
                  </label>
                  
                  {loggedProductPhoto ? (
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '16px' }}>
                      <img src={loggedProductPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Output" />
                      <button 
                        type="button" 
                        onClick={() => setLoggedProductPhoto(null)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-box upload-box-success" onClick={() => handleOpenCamera('product')}>
                      <div className="upload-icon-wrapper">
                        <Camera size={24} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-green)', fontWeight: 700, fontSize: '14px' }}>Tap to Take Photo</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>or upload from gallery</span>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="mobile-btn mobile-btn-success">
                    Submit Production
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'earnings' && (
              <>
                <div className="earnings-box">
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Current Earnings</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, margin: '6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ₹ {totalEarnings.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>May 2024</div>
                  </div>
                  <CircleDollarSign className="earnings-wallet-icon" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div className="worker-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total<br/>Production</div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{totalApprovedQty} KG</div>
                  </div>
                  <div className="worker-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', gap: '6px', borderTop: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rate</div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>₹ {currentWorker.baseRate} / KG</div>
                  </div>
                  <div className="worker-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', gap: '6px', borderTop: '4px solid var(--color-orange)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Incentive</div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>₹ 500</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Payroll History</h3>
                  <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>View All</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {workerProduction.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No history yet.</div>
                  ) : (
                    workerProduction.map(p => (
                      <div key={p.id} className="worker-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.date}</div>
                          <span className={\`badge \${p.status === 'Approved' ? 'badge-success' : 'badge-pending'}\`}>
                            {p.status === 'Approved' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Salary</div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>₹ {(p.quantityProduced * currentWorker.baseRate).toLocaleString()} <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>&gt;</span></div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Paid on 01 Jun 2024</div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p>No new notifications.</p>
              </div>
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
                <div style={{ color: '#ffffff', zIndex: 10, textAlign: 'center', padding: '16px' }}>
                  <Camera size={32} style={{ color: 'var(--accent)', margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '12px' }}>Point camera at {cameraTarget === 'material' ? 'assigned materials sheet' : 'finished output batch'}</p>
                </div>
              </div>

              <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button className="shutter-btn" onClick={handleCapturePhoto}></button>
              </div>
            </div>
          )}

          {/* Bottom Nav Bar */}
          <div className="bottom-nav">
            <div className={\`bottom-nav-item \${activeTab === 'tasks' ? 'active' : ''}\`} onClick={() => setActiveTab('tasks')}>
              <ClipboardList size={22} />
              <span>Dashboard</span>
            </div>
            <div className={\`bottom-nav-item \${activeTab === 'log_output' ? 'active' : ''}\`} onClick={() => setActiveTab('log_output')}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: activeTab === 'log_output' ? 'var(--primary)' : 'transparent', color: activeTab === 'log_output' ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: activeTab === 'log_output' ? '12px' : '0', transition: 'all 0.2s', border: activeTab === 'log_output' ? 'none' : '2px solid transparent' }}>
                <TrendingUp size={22} />
              </div>
              <span style={{ position: activeTab === 'log_output' ? 'absolute' : 'relative', bottom: activeTab === 'log_output' ? '8px' : 'auto' }}>Production</span>
            </div>
            <div className={\`bottom-nav-item \${activeTab === 'earnings' ? 'active' : ''}\`} onClick={() => setActiveTab('earnings')}>
              <CircleDollarSign size={22} />
              <span>Payroll</span>
            </div>
            <div className={\`bottom-nav-item \${activeTab === 'notifications' ? 'active' : ''}\`} onClick={() => setActiveTab('notifications')}>
              <Bell size={22} />
              <span>Profile</span>
              {(workerIssues.length > 0) && (
                <div className="notification-dot"></div>
              )}
            </div>
          </div>

          {/* Lightbox Zoom Overlay */}
          {zoomImage && (
            <div 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
              onClick={() => setZoomImage(null)}
            >
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <img 
                  src={zoomImage} 
                  style={{ width: '100%', maxHeight: '60vh', borderRadius: '12px', border: '3px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
                  alt="Zoomed view" 
                />
                <button 
                  style={{ position: 'absolute', top: '-15px', right: '-15px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: '2px solid white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', lineHeight: 1 }}
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
`;

fs.writeFileSync(appTsxPath, logicPart + newJSX);
console.log("App.tsx layout completely replaced successfully!");
