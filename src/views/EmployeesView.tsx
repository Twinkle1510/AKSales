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
  
  // PRD States
  const [employeeCode, setEmployeeCode] = useState('');
  const [address, setAddress] = useState('');
  const [payrollModel, setPayrollModel] = useState<'Per KG' | 'Per Piece' | 'Fixed Salary' | 'Fixed + Incentive'>('Per Piece');
  const [fixedSalaryAmount, setFixedSalaryAmount] = useState(15000);
  const [incentiveRate, setIncentiveRate] = useState(10);

  const openAddModal = () => {
    setEditingEmployee(null);
    setName('');
    setRole('Worker');
    setDepartment('Production Line A');
    setBaseRate(30);
    setPhone('');
    setEmail('');
    setEmployeeCode(`AK-${String(employees.length + 1).padStart(3, '0')}`);
    setAddress('');
    setPayrollModel('Per Piece');
    setFixedSalaryAmount(15000);
    setIncentiveRate(10);
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
    setEmployeeCode(emp.employeeCode || `AK-${emp.id.split('-')[1]}`);
    setAddress(emp.address || '');
    setPayrollModel(emp.payrollModel || 'Per Piece');
    setFixedSalaryAmount(emp.fixedSalaryAmount || 15000);
    setIncentiveRate(emp.incentiveRate || 10);
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
            email,
            employeeCode,
            address,
            payrollModel,
            fixedSalaryAmount: payrollModel === 'Fixed Salary' || payrollModel === 'Fixed + Incentive' ? Number(fixedSalaryAmount) : undefined,
            incentiveRate: payrollModel === 'Fixed + Incentive' || payrollModel === 'Per Piece' || payrollModel === 'Per KG' ? Number(incentiveRate) : undefined
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
        joinedDate: new Date().toISOString().split('T')[0],
        employeeCode,
        address,
        payrollModel,
        fixedSalaryAmount: payrollModel === 'Fixed Salary' || payrollModel === 'Fixed + Incentive' ? Number(fixedSalaryAmount) : undefined,
        incentiveRate: payrollModel === 'Fixed + Incentive' || payrollModel === 'Per Piece' || payrollModel === 'Per KG' ? Number(incentiveRate) : undefined
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
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="top-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">Configure employee accounts, register worker profiles, configure payroll structures, and adjust piece-incentives.</p>
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
              placeholder="Search by name, role, department, or employee code..." 
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
              <th>Code / ID</th>
              <th>Employee Profile</th>
              <th>Role</th>
              <th>Department / Address</th>
              <th>Payroll Model</th>
              <th>Wage Setup</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No employees found matching the search.
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{emp.employeeCode || 'N/A'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ref: {emp.id}</div>
                  </td>
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
                  <td>
                    <div>{emp.department}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={emp.address}>
                      {emp.address || 'No Address Listed'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ padding: '4px 8px', borderRadius: '4px' }}>
                      {emp.payrollModel || 'Per Piece'}
                    </span>
                  </td>
                  <td>
                    {emp.payrollModel === 'Fixed Salary' && (
                      <strong>₹{emp.fixedSalaryAmount?.toLocaleString()}/mo</strong>
                    )}
                    {emp.payrollModel === 'Fixed + Incentive' && (
                      <div>
                        <strong>₹{emp.fixedSalaryAmount?.toLocaleString()}/mo</strong>
                        <div style={{ fontSize: '11px', color: 'var(--color-green)' }}>+₹{emp.incentiveRate}/unit</div>
                      </div>
                    )}
                    {emp.payrollModel === 'Per Piece' && (
                      <strong>₹{emp.baseRate}/piece</strong>
                    )}
                    {emp.payrollModel === 'Per KG' && (
                      <strong>₹{emp.baseRate}/KG</strong>
                    )}
                  </td>
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
          <form className="modal-content" onSubmit={handleSubmit} style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingEmployee ? 'Edit Employee Info' : 'Register New Employee'}</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Employee Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={employeeCode} 
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="e.g. AK-101"
                />
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
            </div>

            {/* PRD Payroll configuration */}
            <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', marginBottom: '14px', marginTop: '4px' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                Production-Linked Payroll Configuration
              </h4>
              
              <div className="form-group">
                <label>Payroll Model</label>
                <select
                  className="form-control"
                  value={payrollModel}
                  onChange={(e) => {
                    const model = e.target.value as any;
                    setPayrollModel(model);
                    if (model === 'Per Piece' || model === 'Per KG') {
                      setBaseRate(model === 'Per Piece' ? 35 : 30);
                    }
                  }}
                >
                  <option value="Per Piece">Per Piece Production</option>
                  <option value="Per KG">Per KG Production</option>
                  <option value="Fixed Salary">Fixed Monthly Salary</option>
                  <option value="Fixed + Incentive">Fixed Salary + Production Incentive</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {(payrollModel === 'Per Piece' || payrollModel === 'Per KG') && (
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Rate (₹ per Unit / KG)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={baseRate} 
                      onChange={(e) => {
                        setBaseRate(Number(e.target.value));
                        setIncentiveRate(Number(e.target.value));
                      }}
                    />
                  </div>
                )}

                {(payrollModel === 'Fixed Salary' || payrollModel === 'Fixed + Incentive') && (
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Fixed Salary (₹ / month)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={fixedSalaryAmount} 
                      onChange={(e) => setFixedSalaryAmount(Number(e.target.value))}
                    />
                  </div>
                )}

                {payrollModel === 'Fixed + Incentive' && (
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Incentive Rate (₹ / piece)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={incentiveRate} 
                      onChange={(e) => setIncentiveRate(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Home Address</label>
              <textarea 
                className="form-control" 
                rows={2}
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full physical address details..."
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
