const fs = require('fs');

let css = fs.readFileSync('worker-app/src/index.css', 'utf-8');

// Update Root Variables to match exactly
css = css.replace(
  /:root \{[\s\S]*?--shadow:.*?\n\}/,
  `:root {
  --android-font: 'Plus Jakarta Sans', sans-serif;
  
  --bg-android: #0f172a;
  --bg-screen: #f8fafc;
  --bg-card: #ffffff;
  
  --primary: #4338ca;
  --primary-hover: #3730a3;
  --primary-light: #e0e7ff;
  --primary-ultralight: #eff6ff;
  
  --accent: #10b981;
  --accent-light: #d1fae5;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --color-green: #10b981;
  --color-orange: #f59e0b;
  --color-danger: #ef4444;
  
  --border: #e2e8f0;
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}`
);

// Update status bar and app header
css = css.replace(
  /\/\* Status Bar \*\/[\s\S]*?position: relative;\n\}/,
  `/* Status Bar */
.status-bar {
  height: 44px;
  background-color: var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  border-bottom: none;
  z-index: 90;
  user-select: none;
}

.status-bar-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Navigation Drawer Header / Mobile app Header */
.app-header {
  background: var(--primary);
  color: #ffffff;
  padding: 12px 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}`
);

// Add modern forms and upload box
css += `
/* Modern Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  font-family: var(--android-font);
  font-size: 14px;
  color: var(--text-primary);
  background-color: #ffffff;
  transition: var(--transition);
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-ultralight);
}

.form-input:disabled {
  background-color: #f1f5f9;
  color: var(--text-secondary);
}

/* Upload Box */
.upload-box {
  border: 1.5px dashed var(--primary);
  background-color: var(--primary-ultralight);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  cursor: pointer;
  text-align: center;
  gap: 12px;
  transition: var(--transition);
}

.upload-box-success {
  border-color: var(--color-green);
  background-color: #f0fdf4;
}

.upload-box:hover {
  background-color: var(--primary-light);
}

.upload-icon-wrapper {
  background-color: #ffffff;
  padding: 14px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Professional Buttons */
.mobile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: var(--radius-sm);
  font-family: var(--android-font);
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
}
`;

fs.writeFileSync('worker-app/src/index.css', css);

let appTsx = fs.readFileSync('worker-app/src/App.tsx', 'utf-8');

// Replace standard Snap Finished Photo button with professional Dashed Upload Box
const snapPhotoOld = `{loggedProductPhoto ? (
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
                    )}`;

const snapPhotoNew = `{loggedProductPhoto ? (
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
                      <div 
                        className="upload-box upload-box-success"
                        onClick={() => handleOpenCamera('product')}
                      >
                        <div className="upload-icon-wrapper">
                          <Camera size={24} style={{ color: 'var(--color-green)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--color-green)', fontWeight: 700, fontSize: '14px' }}>Tap to Take Photo</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>or upload from gallery</span>
                        </div>
                      </div>
                    )}`;

appTsx = appTsx.replace(snapPhotoOld, snapPhotoNew);

// Improve Production Entry section layout to match Screen 5
appTsx = appTsx.replace(
  /<div style=\{\{ border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', backgroundColor: '#fafafa' \}\}>/g,
  `<div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-green)' }}>
                      <ClipboardList size={18} />
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>Production Details</span>
                    </div>`
);

// Remove the old inline header for Consumed material since we added the professional one
appTsx = appTsx.replace(
  /<div style=\{\{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var\(--color-orange\)' \}\}>\s*Consumed Material \(Ledger Link\)\s*<\/div>/,
  `<!-- Replaced header -->`
);

// Replace Confirm Receipt Button to match exactly (padding, margin, full width)
appTsx = appTsx.replace(
  /<button\s+className="mobile-btn mobile-btn-primary"\s+onClick=\{\(\) => handleOpenCamera\('material', issue\.id\)\}\s+style=\{\{ marginTop: '12px', width: '100%' \}\}\s*>\s*Confirm Receipt\s*<\/button>/g,
  `<button 
                              className="mobile-btn mobile-btn-primary"
                              onClick={() => handleOpenCamera('material', issue.id)}
                              style={{ marginTop: '16px', width: '100%' }}
                            >
                              Confirm Receipt
                            </button>`
);

fs.writeFileSync('worker-app/src/App.tsx', appTsx);
console.log("UI updated professionally!");
