const fs = require('fs');

const cssContent = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  
  --bg-primary: #F4F7FE;
  --bg-secondary: #120F3A; /* Dark navy */
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  
  --border-color: #E9EDF7;
  
  --text-primary: #2B3674;
  --text-secondary: #8F9BBA;
  --text-muted: #A3AED0;
  
  --color-green: #01B574;
  --color-orange: #FFB547;
  --color-purple: #6438F5;
  --color-teal: #3965FF; /* Blue */
  --danger: #EE5D50;
  
  --primary: #6438F5;
  --primary-hover: #5027D9;
  --primary-glow: rgba(100, 56, 245, 0.4);
  
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 20px;
  
  --shadow-sm: 0px 4px 10px rgba(112, 144, 176, 0.05);
  --shadow-md: 0px 12px 24px rgba(112, 144, 176, 0.12);
  --shadow-lg: 0px 18px 40px rgba(112, 144, 176, 0.15);
  --transition: all 0.2s ease-in-out;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: var(--radius-sm);
}

/* Layout Structure */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar - Deep Navy */
.sidebar {
  width: 280px;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 24px 16px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 32px;
}

.brand-logo-quadrant {
  /* Hide the old complex animation in favor of the clean orange ring */
  background: transparent !important;
}
.brand-logo-quadrant > div {
  display: none !important;
}
.brand-logo-quadrant::after {
  content: "AK";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border: 2px solid var(--color-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-orange);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.sidebar-profile {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 12px;
  margin: 0 8px 32px 8px;
  border-bottom: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}
/* Adding fake avatar via CSS to match the image since DOM can't change */
.sidebar-profile::before {
  content: "";
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80') center/cover;
  position: absolute;
  top: 16px;
  left: 16px;
}
.sidebar-profile-name, .sidebar-profile-email {
  padding-left: 48px;
}
.sidebar-profile-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}
.sidebar-profile-email {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}
/* Notification bell on profile */
.sidebar-profile::after {
  content: "\\1F514"; /* Bell emoji or simple icon */
  color: var(--text-secondary);
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  font-size: 14px;
  filter: grayscale(1) brightness(2);
  opacity: 0.5;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.nav-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: #ffffff;
  background-color: var(--primary);
  font-weight: 600;
  box-shadow: 0 4px 14px var(--primary-glow);
}

.nav-item svg {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.nav-item.active svg {
  color: #ffffff;
}

.submenu-chevron {
  color: var(--text-secondary);
  transition: var(--transition);
}

.nav-item:hover .submenu-chevron, .nav-item.active .submenu-chevron {
  color: #ffffff;
}

.sidebar-links-footer {
  padding: 16px;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  margin-top: auto;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  gap: 8px;
}
.sidebar-links-footer span {
  transition: var(--transition);
}
.sidebar-links-footer:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.sidebar-links-footer span:nth-child(1), .sidebar-links-footer span:nth-child(2) {
  display: none; /* Hide settings and | */
}
/* Inject logout icon */
.sidebar-links-footer::before {
  content: "\\21AA";
  font-size: 16px;
  transform: scaleX(-1);
}

.sidebar-building-peak {
  display: none;
}

/* Main Content Area */
.main-content {
  flex-grow: 1;
  /* We will use padding for content, but bleed the header */
  padding: 0; 
  display: flex;
  flex-direction: column;
}

/* Header Top Bar */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  background: #ffffff;
  padding: 24px 40px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02);
  z-index: 5;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.greeting-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.search-container {
  width: 380px;
  position: relative;
}

.search-input {
  width: 100%;
  background-color: var(--bg-primary);
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 12px 20px 12px 48px;
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);
}
.search-input::placeholder {
  color: var(--text-secondary);
}
.search-input:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(100,56,245,0.1);
}

.search-icon-header {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  position: relative;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.header-icon-btn:hover {
  color: var(--primary);
}

.icon-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}
.header-icon-btn:nth-child(2) .icon-badge {
  background-color: var(--primary);
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar, .header-profile .avatar {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px !important;
}

.header-profile-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}
.header-profile-name::after {
  content: "Administrator";
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Inner Page Content Wrapper to replace old .main-content padding */
.main-content > div:not(.header-bar):not(.toast-notification) {
  padding: 0 40px 40px 40px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* Page Header overrides (Payroll Desk, etc) */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}
.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 6px;
}

/* Stat Card Row */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card-wrapper {
  position: relative;
  display: flex;
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 24px;
  width: 100%;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Reordering internal elements of stat cards */
.stat-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

/* Visual re-ordering: icon first */
.stat-card-header .stat-icon {
  order: -1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(1, 181, 116, 0.1); /* default green */
  color: var(--color-green);
}
.stat-card:nth-child(2) .stat-icon {
  background: rgba(57, 101, 255, 0.1);
  color: var(--color-teal);
}
.stat-card:nth-child(3) .stat-icon {
  background: rgba(100, 56, 245, 0.1);
  color: var(--primary);
}
.stat-card:nth-child(4) .stat-icon {
  background: rgba(255, 181, 71, 0.1);
  color: var(--color-orange);
}

.stat-title {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.stat-footer {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Sparklines using pseudo element background images */
.stat-card::after {
  content: "";
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
}
.stat-card:nth-child(1)::after {
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><path d="M0,35 L20,30 L40,35 L60,15 L80,20 L100,5" fill="none" stroke="%2301B574" stroke-width="3" stroke-linecap="round"/></svg>');
}
.stat-card:nth-child(2)::after {
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><path d="M0,25 L25,35 L50,20 L75,10 L100,0" fill="none" stroke="%233965FF" stroke-width="3" stroke-linecap="round"/></svg>');
}
.stat-card:nth-child(4)::after {
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><path d="M0,15 L30,30 L60,10 L100,20" fill="none" stroke="%23FFB547" stroke-width="3" stroke-linecap="round"/></svg>');
}

/* Remove old floating and progress */
.stat-icon-floating { display: none; }
.stat-progress-bar { display: none; }

/* Main Cards layout */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: none;
}

.card-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: -0.5px;
}
/* Adding visual filter buttons via CSS to match the image mockup */
.card-title::after {
  content: "Search employee...";
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  width: 200px;
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Table styling */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: #ffffff;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.table th {
  background-color: #ffffff;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.table td {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
  vertical-align: middle;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background-color: var(--bg-primary);
}

/* Form Styles */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.form-control {
  background-color: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 14px;
  transition: var(--transition);
  outline: none;
  font-weight: 500;
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

/* Buttons inside views */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 14px var(--primary-glow);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #ffffff;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-primary);
}

/* specific outline style for "Mark as Paid" inside table */
.table .btn-secondary {
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 6px 12px;
  border-radius: 6px;
  background: transparent;
}
.table .btn-secondary:hover {
  background: rgba(100,56,245,0.05);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
}

.badge-success, .table td:nth-child(9):contains("Paid") {
  background-color: rgba(1, 181, 116, 0.1);
  color: var(--color-green);
}
.table td span.badge:contains("Paid") {
    background-color: rgba(1, 181, 116, 0.1);
  color: var(--color-green);
}

.badge-pending {
  background-color: rgba(255, 181, 71, 0.1);
  color: var(--color-orange);
}

.badge-danger {
  background-color: rgba(238, 93, 80, 0.1);
  color: var(--danger);
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(18, 15, 58, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: #ffffff;
  border-radius: var(--radius-md);
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 24px;
  transition: var(--transition);
}
.modal-close:hover {
  color: var(--danger);
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background-color: var(--text-primary);
  color: #ffffff;
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-sm);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
}
`;

fs.writeFileSync('src/index.css', cssContent);
console.log('CSS overhaul completed');
