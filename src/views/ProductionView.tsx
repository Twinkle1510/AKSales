import React, { useState } from 'react';
import { Plus, Search, CheckCircle, Clock, Eye, ClipboardCheck } from 'lucide-react';
import type { Employee, InventoryItem, ProductionLog } from '../data/mockDb';

interface ProductionProps {
  production: ProductionLog[];
  inventory: InventoryItem[];
  employees: Employee[];
  onAddProduction: (log: { 
    batchNumber: string; 
    productId: string; 
    quantityProduced: number; 
    workerId: string;
    materialConsumedId?: string;
    materialConsumedName?: string;
    materialConsumedQty?: number;
    materialPhoto?: string;
    productPhoto?: string;
    wastageQty?: number;
    efficiency?: number;
  }) => void;
  onApproveProduction: (id: string) => void;
}

export const ProductionView: React.FC<ProductionProps> = ({
  production,
  inventory,
  employees,
  onAddProduction,
  onApproveProduction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<ProductionLog | null>(null);

  // Form states
  const [batchNumber, setBatchNumber] = useState('');
  const [productId, setProductId] = useState('');
  const [quantityProduced, setQuantityProduced] = useState(0);
  const [workerId, setWorkerId] = useState('');
  const [materialConsumedId, setMaterialConsumedId] = useState('');
  const [materialConsumedQty, setMaterialConsumedQty] = useState(0);
  const [wastageQty, setWastageQty] = useState(0);

  const finishedGoods = inventory.filter(item => item.type === 'Finished Good');
  const rawMaterials = inventory.filter(item => item.type === 'Raw Material');
  const activeWorkers = employees.filter(emp => emp.role === 'Worker' && emp.status === 'Active');

  const openAddModal = () => {
    setBatchNumber(`B-${Math.floor(100 + Math.random() * 900)}`);
    setProductId(finishedGoods[0]?.id || '');
    setQuantityProduced(0);
    setWorkerId(activeWorkers[0]?.id || '');
    setMaterialConsumedId(rawMaterials[0]?.id || '');
    setMaterialConsumedQty(0);
    setWastageQty(0);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !workerId || quantityProduced <= 0) return;

    const rawMat = rawMaterials.find(r => r.id === materialConsumedId);
    
    // Calculate efficiency % = ((materialConsumedQty - wastageQty) / materialConsumedQty) * 100
    let calculatedEfficiency = 100;
    if (materialConsumedQty > 0) {
      calculatedEfficiency = Math.round(((materialConsumedQty - wastageQty) / materialConsumedQty) * 100);
    }

    // Mock generic SVGs for manual logs
    const mockMatSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="10" x2="90" y2="10" stroke="%2394a3b8" stroke-width="4"/><text x="25" y="85" fill="%23cbd5e1" font-size="10" font-family="sans-serif">RAW MATERIAL</text></svg>`;
    const mockProdSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="50" cy="50" r="25" fill="%23ef4444" stroke="%23dc2626" stroke-width="4"/><text x="20" y="90" fill="%2310b981" font-size="10" font-family="sans-serif">FINISHED GOOD</text></svg>`;

    onAddProduction({
      batchNumber,
      productId,
      quantityProduced: Number(quantityProduced),
      workerId,
      materialConsumedId: materialConsumedId || undefined,
      materialConsumedName: rawMat?.name || undefined,
      materialConsumedQty: materialConsumedQty > 0 ? Number(materialConsumedQty) : undefined,
      materialPhoto: mockMatSvg,
      productPhoto: mockProdSvg,
      wastageQty: wastageQty > 0 ? Number(wastageQty) : undefined,
      efficiency: calculatedEfficiency
    });

    setIsModalOpen(false);
  };

  const filtered = production.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.materialConsumedName && p.materialConsumedName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Production & Approvals</h1>
          <p className="page-subtitle">Track manufacturing logs, monitor raw-to-finished ratios, verify photos, and approve payroll units.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Log Production Batch
        </button>
      </div>

      {/* Control filters */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by worker, product, batch, or consumed material..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} production logs
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Material Input</th>
              <th>Finished Output</th>
              <th>Wastage / Scrap</th>
              <th>Yield Efficiency %</th>
              <th>Worker</th>
              <th>Date Logged</th>
              <th>Photos & Details</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No production records found.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.batchNumber}</strong></td>
                  <td>
                    {p.materialConsumedName ? (
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-orange)' }}>
                          {p.materialConsumedQty}
                        </span>
                        <span style={{ fontSize: '12px', marginLeft: '4px', fontWeight: 600 }}>
                          {p.materialConsumedName}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not specified</span>
                    )}
                  </td>
                  <td>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-green)' }}>
                        {p.quantityProduced} pcs
                      </span>
                      <span style={{ fontSize: '12px', marginLeft: '4px', fontWeight: 600 }}>
                        {p.productName}
                      </span>
                    </div>
                  </td>
                  <td>
                    {p.wastageQty !== undefined ? (
                      <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>{p.wastageQty} units</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>0</span>
                    )}
                  </td>
                  <td>
                    {p.efficiency !== undefined ? (
                      <span 
                        style={{ 
                          fontWeight: 700, 
                          color: p.efficiency >= 90 ? 'var(--color-green)' : p.efficiency >= 80 ? 'var(--color-orange)' : 'var(--color-danger)'
                        }}
                      >
                        {p.efficiency}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>100%</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.workerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.workerId}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{p.date}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setSelectedAuditLog(p)}
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                  <td>
                    {p.status === 'Approved' ? (
                      <span className="badge badge-success">
                        <CheckCircle size={12} style={{ marginRight: '4px' }} /> Approved
                      </span>
                    ) : (
                      <span className="badge badge-pending">
                        <Clock size={12} style={{ marginRight: '4px' }} /> Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {p.status === 'Pending Approval' ? (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => onApproveProduction(p.id)}
                      >
                        ✓ Approve
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Approved {p.approvedDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Detail / Photos side-by-side Modal */}
      {selectedAuditLog && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardCheck size={20} style={{ color: 'var(--primary)' }} />
                Production Audit Summary (Batch {selectedAuditLog.batchNumber})
              </h2>
              <button type="button" className="modal-close" onClick={() => setSelectedAuditLog(null)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }}>
              {/* Left Column: Raw Material consumed */}
              <div className="card" style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--color-orange)', marginBottom: '8px' }}>← INPUT: Raw Material</h4>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
                  {selectedAuditLog.materialConsumedName || 'Unspecified Material'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Quantity Consumed: <strong>{selectedAuditLog.materialConsumedQty ?? 0} units</strong>
                </div>

                <div style={{ width: '100%', height: '180px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedAuditLog.materialPhoto ? (
                    <img src={selectedAuditLog.materialPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Material raw" />
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No Material Photo Captured</span>
                  )}
                </div>
              </div>

              {/* Right Column: Finished goods produced */}
              <div className="card" style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--color-green)', marginBottom: '8px' }}>→ OUTPUT: Finished Product</h4>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
                  {selectedAuditLog.productName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Quantity Produced: <strong>{selectedAuditLog.quantityProduced} pcs</strong>
                </div>

                <div style={{ width: '100%', height: '180px', backgroundColor: '#d1fae5', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedAuditLog.productPhoto ? (
                    <img src={selectedAuditLog.productPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product finished" />
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No Product Photo Captured</span>
                  )}
                </div>
              </div>
            </div>

            {/* Wastage and Efficiency Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', padding: '12px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>MATERIAL WASTAGE / SCRAP</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-danger)' }}>
                  {selectedAuditLog.wastageQty !== undefined ? `${selectedAuditLog.wastageQty} units` : '0 units (No waste logged)'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>YIELD EFFICIENCY PERCENTAGE</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-green)' }}>
                  {selectedAuditLog.efficiency !== undefined ? `${selectedAuditLog.efficiency}%` : '100%'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '12px' }}>
              <div>
                <strong>Worker Responsible:</strong> {selectedAuditLog.workerName} (ID: {selectedAuditLog.workerId})
              </div>
              <div>
                <strong>Log Date:</strong> {selectedAuditLog.date}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedAuditLog(null)}>
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Production Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit} style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">Log Production Batch</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Batch Number</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={batchNumber} 
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Select Manufactured Product</label>
                <select 
                  className="form-control" 
                  value={productId} 
                  onChange={(e) => setProductId(e.target.value)}
                >
                  {finishedGoods.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Produced</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={quantityProduced || ''} 
                  onChange={(e) => setQuantityProduced(Number(e.target.value))}
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Select Raw Material Consumed</label>
                <select 
                  className="form-control" 
                  value={materialConsumedId} 
                  onChange={(e) => setMaterialConsumedId(e.target.value)}
                >
                  <option value="">-- None --</option>
                  {rawMaterials.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Consumed</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={materialConsumedQty || ''} 
                  onChange={(e) => setMaterialConsumedQty(Number(e.target.value))}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Wastage / Scrap Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={wastageQty || ''} 
                  onChange={(e) => setWastageQty(Number(e.target.value))}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="form-group">
                <label>Worker Accountable</label>
                <select 
                  className="form-control" 
                  value={workerId} 
                  onChange={(e) => setWorkerId(e.target.value)}
                >
                  {activeWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.name} ({worker.department})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Log Batch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
