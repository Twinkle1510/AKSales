import React from 'react';
import { 
  Users, 
  PackageOpen, 
  Hourglass,
  TrendingUp,
  Plus,
  Globe,
  Percent
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
  


  // Group production, wastage and compute efficiency by worker
  const workerStats = employees
    .filter(e => e.role === 'Worker')
    .map(worker => {
      const workerApprovedLogs = production.filter(p => p.workerId === worker.id && p.status === 'Approved');
      const workerProd = workerApprovedLogs.reduce((sum, p) => sum + p.quantityProduced, 0);
      const workerWaste = workerApprovedLogs.reduce((sum, p) => sum + (p.wastageQty || 0), 0);
      
      // Calculate average efficiency
      const logsWithEfficiency = workerApprovedLogs.filter(p => p.efficiency !== undefined);
      const avgEfficiency = logsWithEfficiency.length > 0
        ? Math.round(logsWithEfficiency.reduce((sum, p) => sum + (p.efficiency || 0), 0) / logsWithEfficiency.length)
        : 100;

      return {
        id: worker.id,
        name: worker.name,
        amount: workerProd,
        waste: workerWaste,
        efficiency: avgEfficiency
      };
    });

  const maxVal = Math.max(...workerStats.map(w => w.amount), 1);
  const totalQty = workerStats.reduce((sum, w) => sum + w.amount, 0) || 1;

  // Average factory efficiency percentage
  const logsWithEff = production.filter(p => p.status === 'Approved' && p.efficiency !== undefined);
  const factoryAvgEfficiency = logsWithEff.length > 0
    ? Math.round(logsWithEff.reduce((sum, p) => sum + (p.efficiency || 0), 0) / logsWithEff.length)
    : 92;

  // Workforce percentage
  const workforcePct = employees.length > 0 ? Math.round((activeWorkers / employees.length) * 100) : 0;
  

  
  // Approval percentage (approved batches vs total batches)
  const approvedBatches = production.filter(p => p.status === 'Approved').length;
  const approvalPct = production.length > 0 ? Math.round((approvedBatches / production.length) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Dynamic PRD KPI Card metrics widgets */}
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

        {/* Commented out as requested
        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('inventory')}>
          <div className="stat-card">
            <span className="stat-title">Factory Wastage (Scrap)</span>
            <span className="stat-value">{totalWastage} units</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill orange" style={{ width: `${Math.min(100, (totalWastage / 200) * 100)}%` }}></div>
            </div>
            <span className="stat-subtitle">Total logged material scrap</span>
          </div>
          <div className="stat-icon-floating orange">
            <Trash2 size={20} />
          </div>
        </div>
        */}

        <div className="stat-card-wrapper" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('production')}>
          <div className="stat-card">
            <span className="stat-title">Avg Yield Efficiency</span>
            <span className="stat-value">{factoryAvgEfficiency}%</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill purple" style={{ width: `${factoryAvgEfficiency}%` }}></div>
            </div>
            <span className="stat-subtitle">Average raw-to-finish ratio</span>
          </div>
          <div className="stat-icon-floating purple">
            <Percent size={20} />
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

        <div className="content-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
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
                    <div className="contribution-role">Yield Efficiency: <strong>{w.efficiency}%</strong></div>
                  </div>
                </div>
                <div className="contribution-right">
                  <div className="contribution-value">{w.amount} units</div>
                  <div className="contribution-percent">{Math.round((w.amount / totalQty) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Bottom Grid: Output Chart, Wastage Chart & Control Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        
        {/* Output & Wastage Charts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Worker Performance Index</span>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Yield Output bar */}
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--color-green)', marginBottom: '8px', textAlign: 'center' }}>Completed Output (Units)</h4>
              <div className="chart-container" style={{ height: '140px' }}>
                {workerStats.map((stat, idx) => {
                  const heightPct = (stat.amount / maxVal) * 80 + 10;
                  return (
                    <div key={idx} className="chart-bar-wrapper">
                      <div 
                        className="chart-bar" 
                        style={{ height: `${heightPct}%`, backgroundColor: 'var(--color-green)' }}
                      >
                        <span className="chart-tooltip">{stat.amount} units</span>
                      </div>
                      <span className="chart-label">{stat.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wastage bar commented out as requested
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--color-danger)', marginBottom: '8px', textAlign: 'center' }}>Scrap / Wastage (Units)</h4>
              <div className="chart-container" style={{ height: '140px' }}>
                {workerStats.map((stat, idx) => {
                  const heightPct = (stat.waste / maxWaste) * 80 + 10;
                  return (
                    <div key={idx} className="chart-bar-wrapper">
                      <div 
                        className="chart-bar" 
                        style={{ height: `${heightPct}%`, backgroundColor: 'var(--color-danger)' }}
                      >
                        <span className="chart-tooltip">{stat.waste} scrap</span>
                      </div>
                      <span className="chart-label">{stat.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            */}
          </div>
        </div>

        {/* Quick Operations Control & Alerts */}
        <div className="card dashboard-ops-card">
          <div className="card-title">Operations Control & Stock Thresholds</div>
          <div className="quick-actions" style={{ marginBottom: '16px' }}>
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('add_employee')}>
              <Users size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Add Employee</span>
            </button>
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('issue_material')}>
              <PackageOpen size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Issue Material</span>
            </button>
            <button className="quick-action-btn" onClick={() => onOpenQuickAction('log_production')}>
              <TrendingUp size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Log Batch</span>
            </button>
            <button className="quick-action-btn" onClick={() => setCurrentTab('payroll')}>
              <Plus size={16} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Run Payroll</span>
            </button>
          </div>

          {/* Warnings list */}
          <div>
            <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Low Stock Threshold Alerts</h4>
            {lowStockItems.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--color-green)', fontWeight: 600 }}>✓ All raw materials above threshold.</p>
            ) : (
              <div className="card-list">
                {lowStockItems.map(item => (
                  <div key={item.id} className="list-item" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="list-item-title" style={{ fontSize: '12px', fontWeight: 600 }}>{item.name}</div>
                      <div className="list-item-subtitle" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Code: {item.materialCode} • Location: {item.storageLocation}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-danger" style={{ fontSize: '9px', padding: '2px 6px' }}>{item.quantity} {item.unit} left</span>
                    </div>
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
