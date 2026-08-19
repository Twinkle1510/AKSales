import React, { useState } from 'react';
import { Plus, Search, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import type { Employee } from '../data/mockDb';

interface EmployeesProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

export const EmployeesView: React.FC<EmployeesProps> = ({ employees, setEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Worker' | 'Accountant'>('Worker');
  const [department, setDepartment] = useState('');
  const [baseRate, setBaseRate] = useState(60);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const openAddModal = () => {
    setEditingEmployee(null);
    setName('');
    setRole('Worker');
    setDepartment('Production Line A');
    setBaseRate(60);
    setPhone('');
    setEmail('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setRole(emp.role);
    setDepartment(emp.department);
    setBaseRate(emp.baseRate);
    setPhone(emp.phone);
    setEmail(emp.email);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingEmployee) {
      // Edit
      const updated = employees.map(emp => {
        if (emp.id === editingEmployee.id) {
          return {
            ...emp,
            name,
            role,
            department,
            baseRate: Number(baseRate),
            phone,
            email
          };
        }
        return emp;
      });
      setEmployees(updated);
    } else {
      // Add new
      const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
      const newEmp: Employee = {
        id: newId,
        name,
        role,
        department,
        status: 'Active',
        baseRate: Number(baseRate),
        phone,
        email,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, newEmp]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        return {
          ...emp,
          status: (emp.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive'
        };
      }
      return emp;
    });
    setEmployees(updated);
  };

  const filtered = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">Add workers, edit salaries/wage rates, and manage roles.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Control bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="control-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name, role, or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} employees
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Base Rate (₹/Hr)</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No employees found matching the search.
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id}>
                  <td><strong>{emp.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Joined: {emp.joinedDate}</div>
                  </td>
                  <td>
                    <span 
                      className="badge" 
                      style={{ 
                        backgroundColor: emp.role === 'Admin' ? 'rgba(59, 130, 246, 0.15)' : 
                                         emp.role === 'Manager' ? 'rgba(139, 92, 246, 0.15)' : 
                                         emp.role === 'Accountant' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: emp.role === 'Admin' ? '#3b82f6' : 
                               emp.role === 'Manager' ? '#8b5cf6' : 
                               emp.role === 'Accountant' ? '#ec4899' : 'var(--text-primary)'
                      }}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td>{emp.department}</td>
                  <td>₹{emp.baseRate}/hr</td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{emp.email}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.phone}</div>
                  </td>
                  <td>
                    <span 
                      className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleStatus(emp.id)}
                      title="Click to toggle status"
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => openEditModal(emp)}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button 
                        className={`btn ${emp.status === 'Active' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => toggleStatus(emp.id)}
                      >
                        {emp.status === 'Active' ? <XCircle size={12} /> : <CheckCircle2 size={12} />} 
                        <span style={{ marginLeft: '4px' }}>{emp.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title">{editingEmployee ? 'Edit Employee Info' : 'Register New Employee'}</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Role</label>
                <select 
                  className="form-control" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="Worker">Worker</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Base Wage (₹ / hr)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={baseRate} 
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Department / Production Line</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Line A Assembly"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 99999 88888"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@aksales.com"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingEmployee ? 'Save Changes' : 'Register Employee'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
