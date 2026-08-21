import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  CircleDollarSign,
  History
} from 'lucide-react';
import Swal from 'sweetalert2';
import { resetDb } from '../data/mockDb';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasSub: false },
    { id: 'material_issue', label: 'Material Issuance', icon: ClipboardList, hasSub: false },
    { id: 'production', label: 'Production Log', icon: CheckSquare, hasSub: true },
    { id: 'flow_report', label: 'Material Flow Ledger', icon: History, hasSub: false },
    { id: 'payroll', label: 'Payroll Desk', icon: CircleDollarSign, hasSub: false },
  ];

  return (
    <div className="sidebar">
      {/* Brand Header with Animated Laser Sparks Logo */}
      <div className="brand">
        <div className="brand-logo-quadrant" style={{ width: '34px', height: '34px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
          {/* Animated Laser Sparks Spinner */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2.5px solid transparent',
            borderTopColor: '#f97316',
            borderRightColor: '#fbbf24',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#0f172a',
            border: '1.5px solid #1e293b',
            boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316', boxShadow: '0 0 6px #f97316' }} />
          </div>
        </div>
        <div className="brand-name">
          AKSales Admin
        </div>
      </div>

      {/* Profile Info block */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-name">Clyde Miles</div>
        <div className="sidebar-profile-email">clydemiles@elenor.us</div>
      </div>

      {/* Navigation List */}
      <ul className="nav-list">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <a 
                className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
                onClick={() => setCurrentTab(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Settings / Logout links */}
      <div className="sidebar-links-footer">
        <span onClick={() => resetDb()}>Settings</span>
        <span style={{ margin: '0 6px' }}>|</span>
        <span onClick={() => Swal.fire('Logged Out', 'Logged out successfully.', 'success')}>Logout</span>
      </div>

      {/* Bottom Building Peak Illustration */}
      <div className="sidebar-building-peak">
        <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <polygon points="100,10 20,120 180,120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <polygon points="100,10 60,120 140,120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="100" y1="10" x2="100" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          
          {/* Horizontal deck lines */}
          <line x1="90" y1="20" x2="110" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="80" y1="40" x2="120" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="70" y1="65" x2="130" y2="65" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="50" y1="95" x2="150" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      </div>

    </div>
  );
};
