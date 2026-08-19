import React, { useState } from 'react';
import { Plus, Search, Edit } from 'lucide-react';
import type { InventoryItem } from '../data/mockDb';

interface InventoryProps {
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
}

export const InventoryView: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Raw Material' | 'Finished Good'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'Raw Material' | 'Finished Good'>('Raw Material');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('pcs');
  const [minThreshold, setMinThreshold] = useState(100);
  
  // PRD States
  const [materialCode, setMaterialCode] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [batchNumber, setBatchNumber] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setType('Raw Material');
    setQuantity(0);
    setUnit('pcs');
    setMinThreshold(100);
    setMaterialCode(`MAT-${String(inventory.length + 1).padStart(3, '0')}`);
    setStorageLocation('Warehouse Block A');
    setBatchNumber('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setMinThreshold(item.minThreshold);
    setMaterialCode(item.materialCode || '');
    setStorageLocation(item.storageLocation || '');
    setBatchNumber(item.batchNumber || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      const updated = inventory.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name,
            type,
            quantity: Number(quantity),
            unit,
            minThreshold: Number(minThreshold),
            lastUpdated: new Date().toISOString().split('T')[0],
            materialCode,
            storageLocation,
            batchNumber: batchNumber || undefined
          };
        }
        return item;
      });
      setInventory(updated);
    } else {
      const prefix = type === 'Raw Material' ? 'INV-RAW-' : 'INV-FIN-';
      const count = inventory.filter(i => i.type === type).length + 1;
      const newId = `${prefix}${String(count).padStart(3, '0')}`;
      const newItem: InventoryItem = {
        id: newId,
        name,
        type,
        quantity: Number(quantity),
        unit,
        minThreshold: Number(minThreshold),
        lastUpdated: new Date().toISOString().split('T')[0],
        materialCode,
        storageLocation,
        batchNumber: batchNumber || undefined
      };
      setInventory([...inventory, newItem]);
    }
    setIsModalOpen(false);
  };

  const adjustStock = (id: string, amount: number) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity + amount),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    setInventory(updated);
  };

  const filtered = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.materialCode && item.materialCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Inventory Hub</h1>
          <p className="page-subtitle">Track raw materials and finished catalog items in real-time, configure storage bays, and monitor batch alerts.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Catalog Item
        </button>
      </div>

      {/* Control / Search Filters */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by inventory name, code, or material ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${filterType === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('All')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              All Items
            </button>
            <button 
              className={`btn ${filterType === 'Raw Material' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('Raw Material')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Raw Materials
            </button>
            <button 
              className={`btn ${filterType === 'Finished Good' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('Finished Good')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Finished Goods
            </button>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Material Name</th>
              <th>Type</th>
              <th>Available Qty</th>
              <th>Batch Ref</th>
              <th>Storage Location</th>
              <th>Safety Threshold</th>
              <th>Status</th>
              <th>Quick Adjust</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No catalog items found.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.materialCode || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {item.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated: {item.lastUpdated}</span>
                    </td>
                    <td>
                      <span className={`badge ${item.type === 'Raw Material' ? 'badge-pending' : 'badge-success'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '12px' }}>{item.batchNumber || 'N/A'}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{item.storageLocation || 'N/A'}</div>
                    </td>
                    <td>{item.minThreshold} {item.unit}</td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Healthy</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => adjustStock(item.id, 10)}>+10</button>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => adjustStock(item.id, -10)}>-10</button>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => openEditModal(item)}>
                        <Edit size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit} style={{ maxWidth: '560px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingItem ? 'Edit Catalog Item' : 'Add Catalog Item'}</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Material/Product Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={materialCode} 
                  onChange={(e) => setMaterialCode(e.target.value)}
                  placeholder="e.g. MAT-STL-01"
                />
              </div>

              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Steel Sheets (2mm)"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control" 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="Raw Material">Raw Material</option>
                  <option value="Finished Good">Finished Good</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unit of Measure</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. kg, pcs, meters"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Available Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Alert Threshold Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={minThreshold} 
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Batch Ref Number (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={batchNumber} 
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. B-901"
                />
              </div>

              <div className="form-group">
                <label>Warehouse Storage Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={storageLocation} 
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="e.g. Warehouse Bay 3"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Save Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
