const fs = require('fs');

let css = fs.readFileSync('worker-app/src/index.css', 'utf-8');

// 1. Update root variables
css = css.replace(
  /:root \{[\s\S]*?--shadow:.*?\n\}/,
  `:root {
  --android-font: 'Plus Jakarta Sans', sans-serif;
  
  /* Material Android Theme */
  --bg-android: #0e1320;
  --bg-screen: #f8fafc;
  --bg-card: #ffffff;
  
  --primary: #4338ca;
  --primary-hover: #3730a3;
  --primary-light: #e0e7ff;
  --accent: #10b981;
  --accent-light: #d1fae5;
  
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  
  --color-green: #10b981;
  --color-orange: #f59e0b;
  --color-danger: #ef4444;
  
  --border: #e2e8f0;
  
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}`
);

// 2. Update status-bar
css = css.replace(
  /\.status-bar \{[\s\S]*?z-index: 90;\n  user-select: none;\n\}/,
  `.status-bar {
  height: 38px;
  background-color: var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  border-bottom: none;
  z-index: 90;
  user-select: none;
}`
);

// 3. Update app-header
css = css.replace(
  /\.app-header \{[\s\S]*?position: relative;\n\}/,
  `.app-header {
  background: var(--primary);
  color: #ffffff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}`
);

// 4. Update mobile-btn and add mobile-btn-success
css = css.replace(
  /\.mobile-btn-primary \{[\s\S]*?\}\n/,
  `.mobile-btn-primary {
  background-color: var(--primary);
  color: #ffffff;
}

.mobile-btn-primary:active {
  background-color: var(--primary-hover);
}

.mobile-btn-success {
  background-color: var(--color-green);
  color: #ffffff;
}

.mobile-btn-success:active {
  background-color: #059669;
}
`
);

// 5. Add badge and worker-card classes
if (!css.includes('.badge {')) {
  css += `

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}
.badge-pending {
  background-color: #fef3c7;
  color: #d97706;
}
.badge-success {
  background-color: #d1fae5;
  color: #059669;
}
.badge-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Worker Cards */
.worker-card {
  background-color: #ffffff;
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.task-item {
  border-left: none;
  padding-left: 16px;
}
.task-item.completed {
  border-left: none;
}
`;
}

fs.writeFileSync('worker-app/src/index.css', css);

let appTsx = fs.readFileSync('worker-app/src/App.tsx', 'utf-8');

// Update Submit Production button to be green
appTsx = appTsx.replace(
  /className="mobile-btn mobile-btn-primary" style=\{\{ marginTop: '8px' \}\}>\n\s*Log Completed Batch/,
  `className="mobile-btn mobile-btn-success" style={{ marginTop: '16px' }}>
                    Submit Production`
);

// Update status bar icons in login screen to not be colored if we have a dark status bar (already using white text)
// The icons might need color="white" but they inherit color anyway.

// Replace "Log Daily Production" to "Production Entry" (as in image)
appTsx = appTsx.replace(
  /Log Daily Production/,
  `Production Entry`
);

// Replace Confirm Receipt Button class if needed. "Verify Stock Photo" -> "Confirm Receipt"
appTsx = appTsx.replace(
  /<Camera size=\{12\} \/> Verify Stock Photo/,
  `<Camera size={12} /> Confirm Receipt`
);

fs.writeFileSync('worker-app/src/App.tsx', appTsx);

console.log("UI updated!");
