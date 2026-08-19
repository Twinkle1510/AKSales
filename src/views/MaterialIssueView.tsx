import React, { useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import type { Employee, InventoryItem, MaterialIssue } from '../data/mockDb';

interface MaterialIssueProps {
  issues: MaterialIssue[];
  inventory: InventoryItem[];
  employees: Employee[];
  onAddIssue: (issue: { materialId: string; issuedToId: string; quantity: number; remarks: string }) => boolean;
}

export const MaterialIssueView: React.FC<MaterialIssueProps> = ({ 
  issues, 
  inventory, 
  employees,
  onAddIssue 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [materialId, setMaterialId] = useState('');
  const [issuedToId, setIssuedToId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dropdown list filtering
  const rawMaterials = inventory.filter(item => item.type === 'Raw Material');
  const activeWorkers = employees.filter(emp => emp.status === 'Active');

  const openAddModal = () => {
    setMaterialId(rawMaterials[0]?.id || '');
    setIssuedToId(activeWorkers[0]?.id || '');
    setQuantity(0);
    setRemarks('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!materialId || !issuedToId || quantity <= 0) {
      setErrorMessage('Please fill all mandatory fields and ensure quantity is positive.');
      return;
    }

    const success = onAddIssue({
      materialId,
      issuedToId,
      quantity: Number(quantity),
      remarks
    });

    if (success) {
      setIsModalOpen(false);
    } else {
      setErrorMessage('Insufficient stock available in raw materials inventory!');
    }
  };

  const filtered = issues.filter(issue => 
    issue.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.issuedToName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Material Issuance Log</h1>
          <p className="page-subtitle">Track raw materials handed out to employees for production batches.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Issue Raw Materials
        </button>
      </div>

      {/* Control panel */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by worker name, material name or remarks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} issues
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Material</th>
              <th>Issued To</th>
              <th>Quantity Given</th>
              <th>Date Issued</th>
              <th>Batch Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No materials issues logged yet.
                </td>
              </tr>
            ) : (
              filtered.map(issue => (
                <tr key={issue.id}>
                  <td><strong>{issue.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{issue.materialName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {issue.materialId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{issue.issuedToName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {issue.issuedToId}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{issue.quantity}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{issue.date}</td>
                  <td>{issue.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Issue Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title">Issue Raw Materials</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            {errorMessage && (
              <div 
                style={{ 
                  backgroundColor: 'rgba(244, 63, 94, 0.15)', 
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group">
              <label>Select Raw Material</label>
              <select 
                className="form-control" 
                value={materialId} 
                onChange={(e) => setMaterialId(e.target.value)}
              >
                {rawMaterials.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity} {item.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Issue To (Worker)</label>
              <select 
                className="form-control" 
                value={issuedToId} 
                onChange={(e) => setIssuedToId(e.target.value)}
              >
                {activeWorkers.map(worker => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} ({worker.role} - {worker.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity to Issue</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="e.g. 50"
              />
            </div>

            <div className="form-group">
              <label>Batch / Purpose Remarks</label>
              <input 
                type="text" 
                className="form-control" 
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Batch #B-205 Heavy Valves assembly"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Issue Material
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
