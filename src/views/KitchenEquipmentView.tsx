import React, { useState } from 'react';
import { Plus, Search, Thermometer, Layers, PlayCircle, UserCheck } from 'lucide-react';
import type { KitchenEquipment, Employee } from '../data/mockDb';

interface KitchenEquipmentProps {
  equipment: KitchenEquipment[];
  setEquipment: (equipment: KitchenEquipment[]) => void;
  employees: Employee[];
}

export const KitchenEquipmentView: React.FC<KitchenEquipmentProps> = ({ equipment, setEquipment, employees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState('');

  // Equipment Form states
  const [eqName, setEqName] = useState('');
  const [eqType, setEqType] = useState<'Fryer' | 'Steamer' | 'Wok' | 'Oven' | 'Griddle'>('Fryer');
  const [tempSettings, setTempSettings] = useState('180°C');

  // Allocation Form states
  const [assignedWorkerId, setAssignedWorkerId] = useState('');
  const [allocatedMaterialName, setAllocatedMaterialName] = useState('Raw Potatoes & Flour Dough (Sheets)');
  const [allocatedQtyKg, setAllocatedQtyKg] = useState(10);
  const [actualOutputName, setActualOutputName] = useState('Classic Samosa (Standard)');
  const [actualOutputQty, setActualOutputQty] = useState(50);
  const [outputUnit, setOutputUnit] = useState<'pcs' | 'plates' | 'packs'>('pcs');

  const workers = employees.filter(e => e.role === 'Worker');

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName.trim()) return;

    const newEq: KitchenEquipment = {
      id: `EQ-${String(equipment.length + 1).padStart(3, '0')}`,
      name: eqName,
      type: eqType,
      status: 'Idle',
      allocatedMaterialName: '',
      allocatedQtyKg: 0,
      actualOutputName: '',
      actualOutputQty: 0,
      outputUnit: 'pcs',
      temperatureSettings: tempSettings,
      lastCleanedDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...equipment, newEq];
    setEquipment(updated);
    setIsModalOpen(false);
    
    // Clear inputs
    setEqName('');
    setTempSettings('180°C');
  };

  const handleAllocateSheets = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find(w => w.id === assignedWorkerId);

    const updated = equipment.map(eq => {
      if (eq.id === selectedEqId) {
        return {
          ...eq,
          status: 'Active Cooking' as const,
          assignedWorkerId,
          assignedWorkerName: worker?.name || 'Unknown',
          allocatedMaterialName,
          allocatedQtyKg: Number(allocatedQtyKg),
          actualOutputName,
          actualOutputQty: Number(actualOutputQty),
          outputUnit
        };
      }
      return eq;
    });

    setEquipment(updated);
    setIsAllocationModalOpen(false);
  };

  const setStatus = (id: string, status: 'Active Cooking' | 'Idle' | 'Under Maintenance') => {
    const updated = equipment.map(eq => {
      if (eq.id === id) {
        return {
          ...eq,
          status,
          // Clear allocations if going idle
          ...(status === 'Idle' ? {
            assignedWorkerId: undefined,
            assignedWorkerName: undefined,
            allocatedQtyKg: 0,
            actualOutputQty: 0
          } : {})
        };
      }
      return eq;
    });
    setEquipment(updated);
  };

  const filtered = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.assignedWorkerName && eq.assignedWorkerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Panel */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Kitchen Stations & Equipment</h1>
          <p className="page-subtitle">Track commercial kitchen stations. Allocate flour sheets / raw materials (KG) and log finished plates/pcs yields.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Register Station
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search station, equipment name, or assigned worker..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} active stations
          </div>
        </div>
      </div>

      {/* Equipment Monitor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
        {filtered.map(eq => (
          <div key={eq.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', borderLeft: `6px solid ${
            eq.status === 'Active Cooking' ? 'var(--color-green)' :
            eq.status === 'Idle' ? 'var(--primary)' : 'var(--color-danger)'
          }` }}>
            
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '10px', padding: '2px 6px', display: 'inline-block', marginBottom: '4px' }}>
                  {eq.id} | {eq.type.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{eq.name}</h3>
              </div>
              <span className={`badge ${
                eq.status === 'Active Cooking' ? 'badge-success' :
                eq.status === 'Idle' ? 'badge-primary' : 'badge-danger'
              }`}>
                {eq.status}
              </span>
            </div>

            {/* Photo & Temp details */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {eq.photo ? (
                <img src={eq.photo} style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} alt={eq.name} />
              ) : (
                <div style={{ width: '80px', height: '60px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>Station</div>
              )}
              
              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={14} className="text-secondary" /> Settings: <strong>{eq.temperatureSettings || 'Standard'}</strong>
                </span>
                <span>Last cleaned: <strong>{eq.lastCleanedDate}</strong></span>
              </div>
            </div>

            {/* Sheet Allocation Card Details */}
            {eq.status === 'Active Cooking' ? (
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UserCheck size={14} color="var(--primary)" />
                  <span>Chef: <strong>{eq.assignedWorkerName}</strong></span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Allocated (Input):</span>
                    <strong>{eq.allocatedQtyKg} kg Sheets</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Yield (Output):</span>
                    <strong style={{ color: 'var(--color-green)' }}>{eq.actualOutputQty} {eq.outputUnit} {eq.actualOutputName}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                No active raw sheet allocations.
              </div>
            )}

            {/* Quick Actions Footer */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: 'auto' }}>
              {eq.status !== 'Active Cooking' && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '6px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  onClick={() => {
                    setSelectedEqId(eq.id);
                    setIsAllocationModalOpen(true);
                  }}
                >
                  <Layers size={12} /> Allocate sheets
                </button>
              )}
              
              {eq.status === 'Active Cooking' && (
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '6px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  onClick={() => setStatus(eq.id, 'Idle')}
                >
                  <PlayCircle size={12} /> Complete Cook Run
                </button>
              )}

              <select 
                className="form-control" 
                style={{ width: '110px', padding: '2px 4px', fontSize: '11px' }}
                value={eq.status}
                onChange={(e) => setStatus(eq.id, e.target.value as any)}
              >
                <option value="Active Cooking">Active</option>
                <option value="Idle">Idle</option>
                <option value="Under Maintenance">Maintenance</option>
              </select>
            </div>

          </div>
        ))}
      </div>

      {/* Sheets Allocation vs Plates Yield Analysis Table */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800 }}>Dough Sheets vs. Plates Yield Ledger</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Analysis table linking input dough sheets (KG) to output plates / pieces cooked across all stations.</p>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Cooking Station</th>
                <th>Assigned worker</th>
                <th>Material Input</th>
                <th>Quantity Issued (KG)</th>
                <th>Product Output</th>
                <th>Quantity Produced</th>
                <th>Conversion Index</th>
                <th>Station Temp</th>
                <th>Cleaned</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(eq => (
                <tr key={eq.id}>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>{eq.name}</strong>
                  </td>
                  <td>{eq.assignedWorkerName || <span className="text-secondary">Unassigned</span>}</td>
                  <td>{eq.allocatedMaterialName || <span className="text-secondary">-</span>}</td>
                  <td>
                    {eq.allocatedQtyKg > 0 ? (
                      <span className="badge badge-warning" style={{ fontSize: '12px', fontWeight: 700 }}>
                        {eq.allocatedQtyKg} KG
                      </span>
                    ) : '-'}
                  </td>
                  <td>{eq.actualOutputName || <span className="text-secondary">-</span>}</td>
                  <td>
                    {eq.actualOutputQty > 0 ? (
                      <span className="badge badge-success" style={{ fontSize: '12px', fontWeight: 700 }}>
                        {eq.actualOutputQty} {eq.outputUnit}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    {eq.allocatedQtyKg > 0 && eq.actualOutputQty > 0 ? (
                      <strong>{(eq.actualOutputQty / eq.allocatedQtyKg).toFixed(1)} items/KG</strong>
                    ) : '-'}
                  </td>
                  <td>{eq.temperatureSettings || 'Standard'}</td>
                  <td>{eq.lastCleanedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Station */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleAddEquipment} style={{ maxWidth: '450px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">Register Station</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Station / Equipment Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={eqName} 
                onChange={(e) => setEqName(e.target.value)}
                placeholder="e.g. Bamboo Steamer Box B"
              />
            </div>

            <div className="form-group">
              <label>Equipment Type</label>
              <select className="form-control" value={eqType} onChange={(e) => setEqType(e.target.value as any)}>
                <option value="Fryer">Fryer</option>
                <option value="Steamer">Steamer</option>
                <option value="Wok">Wok / Stir-fry</option>
                <option value="Oven">Oven</option>
                <option value="Griddle">Griddle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Temperature Settings / Level</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={tempSettings} 
                onChange={(e) => setTempSettings(e.target.value)}
                placeholder="e.g. 180°C / Medium Flame"
              />
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Station</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Allocate Sheets */}
      {isAllocationModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleAllocateSheets} style={{ maxWidth: '480px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">Allocate Sheets & Materials</h2>
              <button type="button" className="modal-close" onClick={() => setIsAllocationModalOpen(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Select Chef / Worker</label>
              <select 
                className="form-control" 
                required 
                value={assignedWorkerId} 
                onChange={(e) => setAssignedWorkerId(e.target.value)}
              >
                <option value="">-- Choose Worker --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.employeeCode || w.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Allocated Sheets / Material (KG)</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={allocatedMaterialName} 
                onChange={(e) => setAllocatedMaterialName(e.target.value)}
                placeholder="e.g. Samosa Dough Sheets (KG)"
              />
            </div>

            <div className="form-group">
              <label>Quantity Issued (KG)</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={allocatedQtyKg} 
                onChange={(e) => setAllocatedQtyKg(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Expected Food Output</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={actualOutputName} 
                onChange={(e) => setActualOutputName(e.target.value)}
                placeholder="e.g. Crispy Samosas"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Yield Output Qty</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={actualOutputQty} 
                  onChange={(e) => setActualOutputQty(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Output Unit</label>
                <select className="form-control" value={outputUnit} onChange={(e) => setOutputUnit(e.target.value as any)}>
                  <option value="pcs">pcs</option>
                  <option value="plates">plates</option>
                  <option value="packs">packs</option>
                </select>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAllocationModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Allocate & Start Cooking</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
