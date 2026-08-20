import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { EmployeesView } from './views/EmployeesView';
import { InventoryView } from './views/InventoryView';
import { MaterialIssueView } from './views/MaterialIssueView';
import { ProductionView } from './views/ProductionView';
import { PayrollView } from './views/PayrollView';
import { FlowReportView } from './views/FlowReportView';
import { KitchenEquipmentView } from './views/KitchenEquipmentView';
import { Menu, Search, Bell, Mail, Settings } from 'lucide-react';

import type {
  Employee,
  InventoryItem,
  MaterialIssue,
  ProductionLog,
  KitchenEquipment
} from './data/mockDb';
import {
  getEmployees,
  saveEmployees,
  getInventory,
  saveInventory,
  getMaterialIssues,
  saveMaterialIssues,
  getProductionLogs,
  saveProductionLogs,
  getEquipment,
  saveEquipment
} from './data/mockDb';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Database state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [issues, setIssues] = useState<MaterialIssue[]>([]);
  const [production, setProduction] = useState<ProductionLog[]>([]);
  const [equipment, setEquipment] = useState<KitchenEquipment[]>([]);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    // Clear old sparse localStorage if found to seed rich client demo dataset
    const cachedProd = localStorage.getItem('aksales_production');
    if (cachedProd && (JSON.parse(cachedProd).length < 12 || cachedProd.includes('Samosa') || cachedProd.includes('Momo') || cachedProd.includes('Potato'))) {
      localStorage.removeItem('aksales_employees');
      localStorage.removeItem('aksales_inventory');
      localStorage.removeItem('aksales_issues');
      localStorage.removeItem('aksales_production');
      localStorage.removeItem('aksales_equipment');
      window.location.reload();
      return;
    }
    setEmployees(getEmployees());
    setInventory(getInventory());
    setIssues(getMaterialIssues());
    setProduction(getProductionLogs());
    setEquipment(getEquipment());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State save sync helpers
  const handleSetEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    saveEmployees(newEmployees);
    showToast('Employee ledger successfully updated.');
  };

  const handleSetInventory = (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    saveInventory(newInventory);
    showToast('Inventory stock list updated.');
  };

  const handleSetEquipment = (newEquipment: KitchenEquipment[]) => {
    setEquipment(newEquipment);
    saveEquipment(newEquipment);
    showToast('Kitchen equipment data successfully updated.');
  };

  // Add Material Issue
  const handleAddMaterialIssue = (newIssue: { 
    materialId: string; 
    issuedToId: string; 
    quantity: number; 
    remarks: string; 
  }): boolean => {
    const rawMaterial = inventory.find((i: InventoryItem) => i.id === newIssue.materialId);
    if (!rawMaterial || rawMaterial.quantity < newIssue.quantity) {
      return false;
    }

    const worker = employees.find((e: Employee) => e.id === newIssue.issuedToId);
    if (!worker) return false;

    // 1. Deduct stock
    const updatedInventory = inventory.map((item: InventoryItem) => {
      if (item.id === newIssue.materialId) {
        return {
          ...item,
          quantity: item.quantity - newIssue.quantity,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    // 2. Add issue log
    const newIssueRecord: MaterialIssue = {
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      materialId: newIssue.materialId,
      materialName: rawMaterial.name,
      issuedToId: newIssue.issuedToId,
      issuedToName: worker.name,
      quantity: newIssue.quantity,
      date: new Date().toISOString().split('T')[0],
      remarks: newIssue.remarks
    };

    setInventory(updatedInventory);
    saveInventory(updatedInventory);
    
    const updatedIssues = [newIssueRecord, ...issues];
    setIssues(updatedIssues);
    saveMaterialIssues(updatedIssues);

    showToast(`Issued ${newIssue.quantity} ${rawMaterial.unit} of ${rawMaterial.name} to ${worker.name}.`);
    return true;
  };

  // Add Production Log
  const handleAddProduction = (newLog: { 
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
  }) => {
    const product = inventory.find((i: InventoryItem) => i.id === newLog.productId);
    const worker = employees.find((e: Employee) => e.id === newLog.workerId);
    if (!product || !worker) return;

    const newRecord: ProductionLog = {
      id: `PROD-${String(production.length + 1).padStart(3, '0')}`,
      batchNumber: newLog.batchNumber,
      productId: newLog.productId,
      productName: product.name,
      quantityProduced: newLog.quantityProduced,
      workerId: newLog.workerId,
      workerName: worker.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      materialConsumedId: newLog.materialConsumedId,
      materialConsumedName: newLog.materialConsumedName,
      materialConsumedQty: newLog.materialConsumedQty,
      materialPhoto: newLog.materialPhoto,
      productPhoto: newLog.productPhoto,
      wastageQty: newLog.wastageQty,
      efficiency: newLog.efficiency
    };

    const updatedProd = [newRecord, ...production];
    setProduction(updatedProd);
    saveProductionLogs(updatedProd);

    showToast(`Logged production batch ${newLog.batchNumber} (Pending Admin approval).`);
  };

  // Approve Production
  const handleApproveProduction = (id: string) => {
    const log = production.find(p => p.id === id);
    if (!log || log.status === 'Approved') return;

    // 1. Mark approved
    const updatedProduction = production.map((p: ProductionLog) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Approved' as const,
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });

    // 2. Increment inventory stock for finished good & decrement raw material consumed
    const updatedInventory = inventory.map((item: InventoryItem) => {
      if (item.id === log.productId) {
        return {
          ...item,
          quantity: item.quantity + log.quantityProduced,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      if (log.materialConsumedId && item.id === log.materialConsumedId) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - (log.materialConsumedQty || 0)),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    setProduction(updatedProduction);
    saveProductionLogs(updatedProduction);

    setInventory(updatedInventory);
    saveInventory(updatedInventory);

    showToast(`Batch ${log.batchNumber} approved! Stock levels of ${log.productName} updated (+${log.quantityProduced}).`);
  };

  // Helper for quick action modals from Dashboard
  const handleOpenQuickAction = (action: string) => {
    if (action === 'add_employee') {
      setCurrentTab('employees');
      // trigger modal open is handled naturally inside view or we can route
    } else if (action === 'issue_material') {
      setCurrentTab('material_issue');
    } else if (action === 'log_production') {
      setCurrentTab('production');
    }
  };

  const renderView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView 
            employees={employees}
            inventory={inventory}
            production={production}
            setCurrentTab={setCurrentTab}
            onOpenQuickAction={handleOpenQuickAction}
          />
        );
      case 'employees':
        return (
          <EmployeesView 
            employees={employees}
            setEmployees={handleSetEmployees}
            production={production}
          />
        );
      case 'inventory':
        return (
          <InventoryView 
            inventory={inventory}
            setInventory={handleSetInventory}
          />
        );
      case 'material_issue':
        return (
          <MaterialIssueView 
            issues={issues}
            inventory={inventory}
            employees={employees}
            onAddIssue={handleAddMaterialIssue}
          />
        );
      case 'production':
        return (
          <ProductionView 
            production={production}
            inventory={inventory}
            employees={employees}
            onAddProduction={handleAddProduction}
            onApproveProduction={handleApproveProduction}
          />
        );
      case 'payroll':
        return (
          <PayrollView 
            employees={employees}
            production={production}
          />
        );
      case 'flow_report':
        return (
          <FlowReportView 
            employees={employees}
            issues={issues}
            production={production}
          />
        );
      case 'kitchen_equipment':
        return (
          <KitchenEquipmentView 
            equipment={equipment}
            setEquipment={handleSetEquipment}
            employees={employees}
          />
        );
      default:
        return <div>View not found.</div>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="main-content">
        {/* Top Header Bar */}
        <div className="header-bar">
          <div className="header-left">
            <button className="hamburger-btn">
              <Menu size={20} />
            </button>
            <h2 className="greeting-text">Greetings Arjun!</h2>
            <div className="search-container">
              <Search className="search-icon-header" size={16} />
              <input type="text" className="search-input" placeholder="Search..." />
            </div>
          </div>
          <div className="header-right">
            <button className="header-icon-btn">
              <Settings size={18} />
            </button>
            <button className="header-icon-btn">
              <Bell size={18} />
              <span className="icon-badge">3</span>
            </button>
            <button className="header-icon-btn">
              <Mail size={18} />
            </button>
            <div className="header-profile">
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px', boxShadow: 'none' }}>AK</div>
              <span className="header-profile-name">Arjun Kumar</span>
            </div>
          </div>
        </div>

        {renderView()}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <div 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)'
            }} 
          />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
