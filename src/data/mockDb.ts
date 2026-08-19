export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Worker' | 'Accountant';
  department: string;
  status: 'Active' | 'Inactive';
  baseRate: number; // Hourly rate or base day wage
  phone: string;
  email: string;
  joinedDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Raw Material' | 'Finished Good';
  quantity: number;
  unit: string; // e.g. kg, liters, pcs, meters
  minThreshold: number; // for low stock alerts
  lastUpdated: string;
}

export interface MaterialIssue {
  id: string;
  materialId: string;
  materialName: string;
  issuedToId: string;
  issuedToName: string;
  quantity: number;
  date: string;
  remarks: string;
}

export interface ProductionLog {
  id: string;
  batchNumber: string;
  productId: string; // references InventoryItem (Finished Good)
  productName: string;
  quantityProduced: number;
  workerId: string; // worker responsible
  workerName: string;
  date: string;
  status: 'Pending Approval' | 'Approved';
  approvedDate?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  period: string; // e.g., "August 2026"
  baseRate: number;
  approvedBatchesCount: number;
  totalQtyProduced: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  paymentStatus: 'Pending' | 'Paid';
  processedDate: string;
}

// Initial mock data to display when localStorage is empty
const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Arjun Kumar', role: 'Admin', department: 'Administration', status: 'Active', baseRate: 150, phone: '+91 98765 43210', email: 'arjun@aksales.com', joinedDate: '2025-01-10' },
  { id: 'EMP-002', name: 'Rajesh Sharma', role: 'Manager', department: 'Operations', status: 'Active', baseRate: 120, phone: '+91 98765 43211', email: 'rajesh@aksales.com', joinedDate: '2025-02-15' },
  { id: 'EMP-003', name: 'Sunita Patel', role: 'Worker', department: 'Production Line A', status: 'Active', baseRate: 60, phone: '+91 87654 32109', email: 'sunita@aksales.com', joinedDate: '2025-04-01' },
  { id: 'EMP-004', name: 'Amit Verma', role: 'Worker', department: 'Production Line B', status: 'Active', baseRate: 55, phone: '+91 76543 21098', email: 'amit@aksales.com', joinedDate: '2025-05-12' },
  { id: 'EMP-005', name: 'Priya Nair', role: 'Accountant', department: 'Finance', status: 'Active', baseRate: 100, phone: '+91 65432 10987', email: 'priya@aksales.com', joinedDate: '2025-03-20' },
  { id: 'EMP-006', name: 'Vikram Singh', role: 'Worker', department: 'Production Line A', status: 'Active', baseRate: 58, phone: '+91 90123 45678', email: 'vikram@aksales.com', joinedDate: '2025-06-01' }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  // Raw Materials
  { id: 'INV-RAW-001', name: 'Steel Sheets (2mm)', type: 'Raw Material', quantity: 1500, unit: 'pcs', minThreshold: 300, lastUpdated: '2026-08-18' },
  { id: 'INV-RAW-002', name: 'Aluminum Alloy Bars', type: 'Raw Material', quantity: 240, unit: 'kg', minThreshold: 200, lastUpdated: '2026-08-19' },
  { id: 'INV-RAW-003', name: 'Copper Wires (Heavy Duty)', type: 'Raw Material', quantity: 80, unit: 'meters', minThreshold: 100, lastUpdated: '2026-08-19' },
  { id: 'INV-RAW-004', name: 'Industrial Paint (Blue)', type: 'Raw Material', quantity: 45, unit: 'liters', minThreshold: 50, lastUpdated: '2026-08-15' },
  // Finished Goods
  { id: 'INV-FIN-001', name: 'AK Heavy Duty Valves', type: 'Finished Good', quantity: 420, unit: 'pcs', minThreshold: 100, lastUpdated: '2026-08-19' },
  { id: 'INV-FIN-002', name: 'Standard Coupling Joint B2', type: 'Finished Good', quantity: 75, unit: 'pcs', minThreshold: 80, lastUpdated: '2026-08-18' }
];

const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Steel Sheets (2mm)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 120, date: '2026-08-18', remarks: 'Batch #B-201 Valves' },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Aluminum Alloy Bars', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 50, date: '2026-08-19', remarks: 'For custom coupling joints' }
];

const INITIAL_PRODUCTION: ProductionLog[] = [
  { id: 'PROD-001', batchNumber: 'B-201', productId: 'INV-FIN-001', productName: 'AK Heavy Duty Valves', quantityProduced: 45, workerId: 'EMP-003', workerName: 'Sunita Patel', date: '2026-08-18', status: 'Approved', approvedDate: '2026-08-18' },
  { id: 'PROD-002', batchNumber: 'B-202', productId: 'INV-FIN-002', productName: 'Standard Coupling Joint B2', quantityProduced: 12, workerId: 'EMP-004', workerName: 'Amit Verma', date: '2026-08-19', status: 'Pending Approval' },
  { id: 'PROD-003', batchNumber: 'B-203', productId: 'INV-FIN-001', productName: 'AK Heavy Duty Valves', quantityProduced: 30, workerId: 'EMP-006', workerName: 'Vikram Singh', date: '2026-08-19', status: 'Pending Approval' }
];

// Helper to initialize and retrieve from localStorage
const getFromStorage = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(`aksales_${key}`);
  if (!data) {
    localStorage.setItem(`aksales_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(`aksales_${key}`, JSON.stringify(value));
};

export const getEmployees = (): Employee[] => getFromStorage('employees', INITIAL_EMPLOYEES);
export const saveEmployees = (employees: Employee[]) => setToStorage('employees', employees);

export const getInventory = (): InventoryItem[] => getFromStorage('inventory', INITIAL_INVENTORY);
export const saveInventory = (inventory: InventoryItem[]) => setToStorage('inventory', inventory);

export const getMaterialIssues = (): MaterialIssue[] => getFromStorage('issues', INITIAL_ISSUES);
export const saveMaterialIssues = (issues: MaterialIssue[]) => setToStorage('issues', issues);

export const getProductionLogs = (): ProductionLog[] => getFromStorage('production', INITIAL_PRODUCTION);
export const saveProductionLogs = (production: ProductionLog[]) => setToStorage('production', production);

export const getPayrollRecords = (): PayrollRecord[] => getFromStorage('payroll', []);
export const savePayrollRecords = (payroll: PayrollRecord[]) => setToStorage('payroll', payroll);

// Clear and reset database to default
export const resetDb = () => {
  localStorage.removeItem('aksales_employees');
  localStorage.removeItem('aksales_inventory');
  localStorage.removeItem('aksales_issues');
  localStorage.removeItem('aksales_production');
  localStorage.removeItem('aksales_payroll');
  window.location.reload();
};
