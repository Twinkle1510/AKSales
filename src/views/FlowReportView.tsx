import React, { useState } from 'react';
import { Calendar, ArrowRight, Printer, CheckCircle } from 'lucide-react';
import type { Employee, MaterialIssue, ProductionLog } from '../data/mockDb';

interface FlowReportProps {
  employees: Employee[];
  issues: MaterialIssue[];
  production: ProductionLog[];
}

export const FlowReportView: React.FC<FlowReportProps> = ({ employees, issues, production }) => {
  const workers = employees.filter(emp => emp.role === 'Worker');
  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || '');

  const selectedWorker = employees.find(emp => emp.id === selectedWorkerId);

  // Filter production runs for the selected worker
  // Every production log acts as a direct link between input SS sheets consumed and finished kitchen outputs.
  const workerProduction = production.filter(prod => prod.workerId === selectedWorkerId);

  const totalSheetsTaken = issues
    .filter(issue => issue.issuedToId === selectedWorkerId)
    .reduce((sum, i) => sum + i.quantity, 0);

  const totalEquipmentProduced = workerProduction.reduce((sum, p) => sum + p.quantityProduced, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Panel */}
      <div className="top-header no-print">
        <div>
          <h1 className="page-title">SS Sheets Flow & Fabrication Ledger</h1>
          <p className="page-subtitle">Track raw sheets input (KG) vs fabricated commercial kitchen platforms, sinks, and tables side-by-side.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: 700 }}>Select Fabricator:</label>
          <select 
            className="form-control" 
            value={selectedWorkerId} 
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            style={{ width: '220px' }}
          >
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.employeeCode || w.id})</option>
            ))}
          </select>

          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Ledger
          </button>
        </div>
      </div>

      {selectedWorker ? (
        <>
          {/* Summary Banner */}
          <div className="card" style={{ padding: '20px', borderLeft: '5px solid var(--primary)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
              Fabricator Sheet Ledger: {selectedWorker.name}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Code: <strong>{selectedWorker.employeeCode || 'N/A'}</strong> | Department: <strong>{selectedWorker.department}</strong> | Station: <strong>{selectedWorker.address || 'Fabrication Floor'}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL SS SHEETS TAKEN</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-orange)' }}>{totalSheetsTaken} KG</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL EQUIPMENT PRODUCED</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-green)' }}>{totalEquipmentProduced} Pcs</span>
              </div>
              {/* Commented out as requested
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL STEEL SCRAP / WASTE</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-danger)' }}>{totalWaste} KG</span>
              </div>
              */}
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>SHEET UTILIZATION EFFICIENCY</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                  {workerProduction.length > 0 
                    ? `${Math.round(workerProduction.reduce((sum, p) => sum + (p.efficiency || 0), 0) / workerProduction.length)}%`
                    : '100%'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Side-by-Side Flow Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {workerProduction.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active sheet fabrication logs recorded for this worker.
              </div>
            ) : (
              workerProduction.map(log => (
                <div key={log.id} className="card" style={{ padding: '20px' }}>
                  
                  {/* Job Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Calendar size={15} />
                      <span>Job Date: <strong>{log.date}</strong></span>
                      <span style={{ margin: '0 4px' }}>|</span>
                      <span>Batch Code: <strong>{log.batchNumber}</strong></span>
                    </div>
                    
                    <span className="badge" style={{ 
                      backgroundColor: log.status === 'Approved' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                      color: log.status === 'Approved' ? '#10b981' : '#f59e0b',
                      fontSize: '11px',
                      padding: '4px 10px',
                      fontWeight: 700
                    }}>
                      {log.status}
                    </span>
                  </div>

                  {/* Flow columns: Input Sheets vs Output finished products */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr', gap: '24px', alignItems: 'center' }}>
                    
                    {/* Raw Material Input */}
                    <div style={{ padding: '16px', backgroundColor: 'rgba(249, 115, 22, 0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Raw Material Input (Allocated Sheets)
                      </div>
                      
                      <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                        {log.materialConsumedQty} KG Issued
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', height: '18px', overflow: 'hidden' }}>
                        {log.materialConsumedName}
                      </p>

                      {/* Photo Box */}
                      <div style={{ width: '100%', height: '150px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {log.materialPhoto ? (
                          <img src={log.materialPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SS Raw Sheets" />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', fontSize: '11px', color: 'var(--text-muted)' }}>No Sheet Image</div>
                        )}
                      </div>
                    </div>

                    {/* Central Arrow */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={24} className="text-secondary" />
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center', fontWeight: 600 }}>FABRICATED TO</span>
                    </div>

                    {/* Fabricated Product Output */}
                    <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Finished Product Output (Kitchen Equipment)
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px', color: 'var(--color-green)' }}>
                        {log.quantityProduced} Pcs Fabricated
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', height: '18px', overflow: 'hidden' }}>
                        {log.productName}
                      </p>

                      {/* Photo Box */}
                      <div style={{ width: '100%', height: '150px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {log.productPhoto ? (
                          <img src={log.productPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SS Finished Table" />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', fontSize: '11px', color: 'var(--text-muted)' }}>No Product Image</div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Flow Footer Metrics */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed var(--border)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      {/* Commented out as requested
                      <span>Metal scrap / wastage: <strong style={{ color: 'var(--color-danger)' }}>{log.wastageQty || 0} KG</strong></span>
                      */}
                      <span>Conversion Index: <strong>{log.quantityProduced && log.materialConsumedQty ? (log.quantityProduced / log.materialConsumedQty).toFixed(3) : 0} pcs/KG</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}>
                      <CheckCircle size={15} />
                      <span>Yield Utilization: {log.efficiency || 100}%</span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          Please select a fabricator from the dropdown list.
        </div>
      )}

    </div>
  );
};
