import React from 'react';
import { 
  Users, 
  PackageOpen, 
  ShieldAlert, 
  Hourglass,
  TrendingUp,
  Boxes,
  Plus,
  Globe
} from 'lucide-react';
import type { Employee, InventoryItem, ProductionLog } from '../data/mockDb';

interface DashboardProps {
  employees: Employee[];
  inventory: InventoryItem[];
  production: ProductionLog[];
  setCurrentTab: (tab: string) => void;
  onOpenQuickAction: (action: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ 
  employees, 
  inventory, 
  production, 
  setCurrentTab,
  onOpenQuickAction
}) => {
  // Compute metrics
  const activeWorkers = employees.filter(e => e.status === 'Active').length;
  const lowStockItems = inventory.filter(item => item.quantity <= item.minThreshold);
  
  // Total finished goods produced (approved)
  const totalApprovedProduction = production
    .filter(p => p.status === 'Approved')
    .reduce((sum, p) => sum + p.quantityProduced, 0);

  // Group production by worker
  const workerStats = employees
    .filter(e => e.role === 'Worker')
    .map(worker => {
      const workerProd = production
        .filter(p => p.workerId === worker.id && p.status === 'Approved')
        .reduce((sum, p) => sum + p.quantityProduced, 0);
      return {
        id: worker.id,
        name: worker.name,
        amount: workerProd
      };
    });

  const maxVal = Math.max(...workerStats.map(w => w.amount), 1);
  const totalQty = workerStats.reduce((sum, w) => sum + w.amount, 0) || 1;

  // Workforce percentage
  const workforcePct = employees.length > 0 ? Math.round((activeWorkers / employees.length) * 100) : 0;
  
  // Inventory healthy stock percentage (items not low stock)
  const inventoryPct = inventory.length > 0 ? Math.round(((inventory.length - lowStockItems.length) / inventory.length) * 100) : 100;
  
  // Approval percentage (approved batches vs total batches)
  const approvedBatches = production.filter(p => p.status === 'Approved').length;
  const approvalPct = production.length > 0 ? Math.round((approvedBatches / production.length) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Stats Cards Row with horizontal progress bars and hanging badges */}
      <div className="stats-grid" style={{ gap: '28px' }}>
        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('employees')}>
          <div className="stat-card">
            <span className="stat-title">Active Workforce</span>
            <span className="stat-value">{activeWorkers} / {employees.length}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill green" style={{ width: `${workforcePct}%` }}></div>
            </div>
            <span className="stat-subtitle">{workforcePct}% capacity active</span>
          </div>
          <div className="stat-icon-floating green">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('inventory')}>
          <div className="stat-card">
            <span className="stat-title">Healthy Inventory</span>
            <span className="stat-value">{inventory.length - lowStockItems.length} / {inventory.length}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill orange" style={{ width: `${inventoryPct}%` }}></div>
            </div>
            <span className="stat-subtitle">{inventoryPct}% stock items normal</span>
          </div>
          <div className="stat-icon-floating orange">
            <Boxes size={20} />
          </div>
        </div>

        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('inventory')}>
          <div className="stat-card">
            <span className="stat-title">Low Stock Alerts</span>
            <span className="stat-value" style={{ color: lowStockItems.length > 0 ? 'var(--danger)' : 'inherit' }}>
              {lowStockItems.length} Items
            </span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill purple" style={{ width: `${lowStockItems.length > 0 ? 30 : 0}%` }}></div>
            </div>
            <span className="stat-subtitle">
              {lowStockItems.length > 0 ? 'Action required soon' : 'All items normal'}
            </span>
          </div>
          <div className="stat-icon-floating purple">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('production')}>
          <div className="stat-card">
            <span className="stat-title">Approvals Ratio</span>
            <span className="stat-value">{approvedBatches} / {production.length} Logged</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill teal" style={{ width: `${approvalPct}%` }}></div>
            </div>
            <span className="stat-subtitle">{approvalPct}% production approved</span>
          </div>
          <div className="stat-icon-floating teal">
            <Hourglass size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Map & List Side-by-Side */}
      <div className="card">
        <div className="card-title">
          <div>
            <span>Production Output by Worker</span>
            <p className="card-subtitle">Contribution of finished goods batches mapped dynamically</p>
          </div>
          <Globe size={18} style={{ color: 'var(--color-teal)' }} />
        </div>

        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left: Contributions List */}
          <div className="contribution-list">
            {workerStats.slice(0, 5).map((w) => (
              <div key={w.id} className="contribution-item">
                <div className="contribution-left">
                  <div className="contribution-avatar">
                    {w.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="contribution-name">{w.name}</div>
                    <div className="contribution-role">Worker • ID: {w.id}</div>
                  </div>
                </div>
                <div className="contribution-right">
                  <div className="contribution-value">{w.amount} units</div>
                  <div className="contribution-percent">{Math.round((w.amount / totalQty) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: SVG World Map Representation */}
          <div className="map-visual-placeholder">
            <svg viewBox="0 0 1000 480" className="world-map-svg">
              <path 
                fill="#e2e8f0" 
                stroke="#cbd5e1" 
                strokeWidth="1.5"
                d="M150,150 Q180,130 220,160 T300,140 T380,180 T400,240 T320,300 T240,320 T150,280 Z" 
              />
              <path 
                fill="#cffafe" 
                stroke="var(--color-teal)" 
                strokeWidth="2"
                d="M480,120 Q540,110 580,130 T640,150 T680,240 T580,320 T480,220 Z" 
              />
              <path 
                fill="#e2e8f0" 
                stroke="#cbd5e1" 
                strokeWidth="1.5"
                d="M720,280 Q780,290 820,320 T860,380 T760,400 Z" 
              />
              {/* Highlight Pins */}
              <circle cx="580" cy="180" r="6" fill="var(--color-purple)" />
              <circle cx="580" cy="180" r="14" fill="none" stroke="var(--color-purple)" strokeWidth="2" opacity="0.5" />
              
              <circle cx="240" cy="200" r="5" fill="var(--color-orange)" />
              <circle cx="510" cy="150" r="5" fill="var(--color-green)" />
            </svg>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Distribution Coverage Matrix
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Output Chart & Quick Tools */}
      <div className="content-grid">
        {/* Output Chart */}
        <div className="card">
          <div className="card-title">
            <span>Approved Output per Worker (Items)</span>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          </div>
          
          <div className="chart-container">
            {workerStats.map((stat, idx) => {
              const heightPct = (stat.amount / maxVal) * 80 + 10;
              return (
                <div key={idx} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${heightPct}%` }}
                  >
                    <span className="chart-tooltip">{stat.amount} units</span>
                  </div>
                  <span className="chart-label">{stat.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Total Factory Approved Output: <strong>{totalApprovedProduction} units</strong></span>
            <span>Based on approved production logs</span>
          </div>
        </div>

        {/* Quick Tools & Alerts */}
        <div className="card">
          <div className="card-title">Operations Control</div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('add_employee')}>
              <Users size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Add Employee</span>
            </button>
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('issue_material')}>
              <PackageOpen size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Issue Material</span>
            </button>
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('log_production')}>
              <TrendingUp size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Log Batch</span>
            </button>
            <button className="quick-action-btn" onClick={() => setCurrentTab('payroll')}>
              <Plus size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Run Payroll</span>
            </button>
          </div>

          {/* Warnings list */}
          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Stock Alerts</h4>
            {lowStockItems.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--color-green)', fontWeight: 600 }}>✓ All raw materials above threshold.</p>
            ) : (
              <div className="card-list">
                {lowStockItems.slice(0, 2).map(item => (
                  <div key={item.id} className="list-item" style={{ padding: '8px 12px' }}>
                    <div>
                      <div className="list-item-title" style={{ fontSize: '12px' }}>{item.name}</div>
                      <div className="list-item-subtitle" style={{ fontSize: '10px' }}>
                        {item.quantity} {item.unit} left
                      </div>
                    </div>
                    <span className="badge badge-danger" style={{ fontSize: '9px' }}>Low</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
