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

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setType('Raw Material');
    setQuantity(0);
    setUnit('pcs');
    setMinThreshold(100);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setMinThreshold(item.minThreshold);
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
            lastUpdated: new Date().toISOString().split('T')[0]
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
        lastUpdated: new Date().toISOString().split('T')[0]
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
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Inventory Hub</h1>
          <p className="page-subtitle">Track raw materials and finished catalog items in real-time.</p>
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
              placeholder="Search by inventory name or code..." 
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
              <th>Item ID</th>
              <th>Catalog Name</th>
              <th>Type</th>
              <th>Available Stock</th>
              <th>Status Alert</th>
              <th>Min Threshold</th>
              <th>Last Updated</th>
              <th>Quick Stock Updates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No catalog items found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                    </td>
                    <td>
                      <span 
                        className="badge" 
                        style={{ 
                          backgroundColor: item.type === 'Raw Material' ? 'rgba(13, 148, 136, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: item.type === 'Raw Material' ? 'var(--primary)' : 'var(--accent)'
                        }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>
                        {item.quantity}
                      </span>{' '}
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {item.unit}
                      </span>
                    </td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Sufficient</span>
                      )}
                    </td>
                    <td>{item.minThreshold} {item.unit}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.lastUpdated}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => adjustStock(item.id, -10)}
                        >
                          -10
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => adjustStock(item.id, -1)}
                        >
                          -1
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => adjustStock(item.id, 1)}
                        >
                          +1
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => adjustStock(item.id, 10)}
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => openEditModal(item)}
                      >
                        <Edit size={12} /> Edit Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title">{editingItem ? 'Edit Catalog Item' : 'Create New Stock Item'}</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Item / Material Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Copper Pipe D-20"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Item Type</label>
                <select 
                  className="form-control" 
                  value={type} 
                  disabled={!!editingItem} // disable type edits for safety
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
                <label>Initial Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Low-Stock Alert Level</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={minThreshold} 
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Save Updates' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
