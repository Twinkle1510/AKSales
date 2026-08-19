import React, { useState } from 'react';
import { Calendar, ArrowDownCircle, ArrowUpCircle, Printer, AlertCircle } from 'lucide-react';
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

  // Filter issues & production for selected worker
  const workerIssues = issues.filter(issue => issue.issuedToId === selectedWorkerId);
  const workerProduction = production.filter(prod => prod.workerId === selectedWorkerId);

  // Combine into chronological timeline
  interface TimelineEvent {
    id: string;
    type: 'receipt' | 'production';
    date: string;
    title: string;
    materialName: string;
    qty: number;
    unit?: string;
    photo?: string;
    wastageQty?: number;
    efficiency?: number;
    status: string;
    batchNumber?: string;
  }

  const timelineEvents: TimelineEvent[] = [
    ...workerIssues.map(issue => ({
      id: issue.id,
      type: 'receipt' as const,
      date: issue.date,
      title: 'Raw Material Taken (Input)',
      materialName: issue.materialName,
      qty: issue.quantity,
      unit: 'units',
      photo: issue.photo || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><text x="15" y="55" fill="%23cbd5e1" font-size="10">RAW MATERIAL</text></svg>`,
      status: 'Verified Receipt'
    })),
    ...workerProduction.map(prod => ({
      id: prod.id,
      type: 'production' as const,
      date: prod.date,
      title: 'Finished Product Manufactured (Output)',
      materialName: prod.productName,
      qty: prod.quantityProduced,
      unit: 'pcs',
      photo: prod.productPhoto || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><text x="15" y="55" fill="%2310b981" font-size="10">FINISHED GOOD</text></svg>`,
      wastageQty: prod.wastageQty,
      efficiency: prod.efficiency,
      status: prod.status,
      batchNumber: prod.batchNumber
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first

  const totalTaken = workerIssues.reduce((sum, i) => sum + i.quantity, 0);
  const totalProduced = workerProduction.reduce((sum, p) => sum + p.quantityProduced, 0);
  const totalWaste = workerProduction.reduce((sum, p) => sum + (p.wastageQty || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Panel */}
      <div className="top-header no-print">
        <div>
          <h1 className="page-title">Material Flow Ledger</h1>
          <p className="page-subtitle">Track chronological records of when workers took materials vs when they logged production.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: 700 }}>Select Worker:</label>
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
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {selectedWorker ? (
        <>
          {/* Summary Banner */}
          <div className="card" style={{ padding: '20px', borderLeft: '5px solid var(--primary)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
              Ledger Summary: {selectedWorker.name}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Employee Code: <strong>{selectedWorker.employeeCode || 'N/A'}</strong> | Department: <strong>{selectedWorker.department}</strong> | Address: <strong>{selectedWorker.address || 'No Address Listed'}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL MATERIAL TAKEN</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-orange)' }}>{totalTaken} units</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL GOODS PRODUCED</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-green)' }}>{totalProduced} pcs</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>TOTAL WASTE LOGGED</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-danger)' }}>{totalWaste} units</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>AVG YIELD EFFICIENCY</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                  {workerProduction.length > 0 
                    ? `${Math.round(workerProduction.reduce((sum, p) => sum + (p.efficiency || 0), 0) / workerProduction.length)}%`
                    : '100%'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
            {/* Center line decoration */}
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '8px', width: '2px', backgroundColor: 'var(--border)' }}></div>

            {timelineEvents.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No material issues or production logs recorded for this worker.
              </div>
            ) : (
              timelineEvents.map(event => (
                <div key={event.id} className="card" style={{ padding: '18px', display: 'grid', gridTemplateColumns: '1fr 3.5fr', gap: '20px', position: 'relative' }}>
                  
                  {/* Timeline dot identifier */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: '-20px', 
                      top: '24px', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: event.type === 'receipt' ? 'var(--color-orange)' : 'var(--color-green)',
                      border: '2px solid #ffffff',
                      boxShadow: '0 0 4px rgba(0,0,0,0.1)'
                    }}
                  ></div>

                  {/* Left Column: Date & Metadata */}
                  <div style={{ borderRight: '1px solid var(--border)', paddingRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>

                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: event.type === 'receipt' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: event.type === 'receipt' ? 'var(--color-orange)' : 'var(--color-green)',
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}
                    >
                      {event.type === 'receipt' ? 'INPUT RECEIVED' : 'OUTPUT MADE'}
                    </span>

                    {event.batchNumber && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        Batch: <strong>{event.batchNumber}</strong>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Descriptions & Attached Photo Side-by-Side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                    
                    {/* Event detail description */}
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {event.type === 'receipt' ? (
                          <ArrowDownCircle size={16} style={{ color: 'var(--color-orange)' }} />
                        ) : (
                          <ArrowUpCircle size={16} style={{ color: 'var(--color-green)' }} />
                        )}
                        {event.title}
                      </h3>

                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                        {event.type === 'receipt' ? (
                          <span>Took <strong>{event.qty} {event.unit}</strong> of <span style={{ color: 'var(--color-orange)' }}>{event.materialName}</span></span>
                        ) : (
                          <span>Manufactured <strong>{event.qty} {event.unit}</strong> of <span style={{ color: 'var(--color-green)' }}>{event.materialName}</span></span>
                        )}
                      </div>

                      {/* Yield metrics for production outputs */}
                      {event.type === 'production' && (
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Wastage: </span>
                            <strong style={{ color: 'var(--color-danger)' }}>{event.wastageQty || 0} units</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Yield Efficiency: </span>
                            <strong style={{ color: 'var(--color-green)' }}>{event.efficiency || 100}%</strong>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: 'var(--text-primary)' }}>{event.status}</strong>
                      </div>
                    </div>

                    {/* Image Box */}
                    <div style={{ width: '100%', height: '110px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {event.photo ? (
                        <img src={event.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Flow snapshot" />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          <AlertCircle size={18} style={{ margin: '0 auto 4px auto' }} />
                          <span style={{ fontSize: '10px' }}>No Photo</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          Please select a worker from the dropdown list.
        </div>
      )}

    </div>
  );
};
