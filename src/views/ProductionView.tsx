import React, { useState } from 'react';
import { Plus, Search, CheckCircle, Clock } from 'lucide-react';
import type { Employee, InventoryItem, ProductionLog } from '../data/mockDb';

interface ProductionProps {
  production: ProductionLog[];
  inventory: InventoryItem[];
  employees: Employee[];
  onAddProduction: (log: { batchNumber: string; productId: string; quantityProduced: number; workerId: string }) => void;
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

  // Form states
  const [batchNumber, setBatchNumber] = useState('');
  const [productId, setProductId] = useState('');
  const [quantityProduced, setQuantityProduced] = useState(0);
  const [workerId, setWorkerId] = useState('');

  const finishedGoods = inventory.filter(item => item.type === 'Finished Good');
  const activeWorkers = employees.filter(emp => emp.role === 'Worker' && emp.status === 'Active');

  const openAddModal = () => {
    setBatchNumber(`B-${Math.floor(100 + Math.random() * 900)}`);
    setProductId(finishedGoods[0]?.id || '');
    setQuantityProduced(0);
    setWorkerId(activeWorkers[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !workerId || quantityProduced <= 0) return;

    onAddProduction({
      batchNumber,
      productId,
      quantityProduced: Number(quantityProduced),
      workerId
    });

    setIsModalOpen(false);
  };

  const filtered = production.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Production & Approvals</h1>
          <p className="page-subtitle">Track manufacturing logs, submit output, and approve items to update inventory.</p>
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
              placeholder="Search by worker, product name, or batch..." 
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
              <th>Product / Output</th>
              <th>Quantity</th>
              <th>Worker Responsible</th>
              <th>Date Logged</th>
              <th>Status</th>
              <th>Manager Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No production records found.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.batchNumber}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.productName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Code: {p.productId}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>{p.quantityProduced}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.workerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.workerId}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.date}</td>
                  <td>
                    {p.status === 'Approved' ? (
                      <span className="badge badge-success">
                        <CheckCircle size={12} style={{ marginRight: '4px' }} /> Approved
                      </span>
                    ) : (
                      <span className="badge badge-pending">
                        <Clock size={12} style={{ marginRight: '4px' }} /> Pending Approval
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
                        ✓ Approve Batch
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Approved on {p.approvedDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Production Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit}>
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
                value={quantityProduced} 
                onChange={(e) => setQuantityProduced(Number(e.target.value))}
                placeholder="e.g. 25"
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
