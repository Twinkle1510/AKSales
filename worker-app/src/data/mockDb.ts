export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Worker' | 'Accountant';
  department: string;
  status: 'Active' | 'Inactive';
  baseRate: number; // For pieces/KG rates
  phone: string;
  email: string;
  joinedDate: string;
  
  // PRD Additions
  employeeCode: string;
  address: string;
  payrollModel: 'Per KG' | 'Per Piece' | 'Fixed Salary' | 'Fixed + Incentive';
  fixedSalaryAmount?: number;
  incentiveRate?: number;
  profilePhoto?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Raw Material' | 'Finished Good';
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
  
  // PRD Additions
  materialCode: string;
  batchNumber?: string;
  storageLocation: string;
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
  photo?: string;
}

export interface ProductionLog {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantityProduced: number;
  workerId: string;
  workerName: string;
  date: string;
  status: 'Pending Approval' | 'Approved';
  approvedDate?: string;
  materialConsumedId?: string;
  materialConsumedName?: string;
  materialConsumedQty?: number;
  materialPhoto?: string;
  productPhoto?: string;
  
  // PRD Additions
  wastageQty?: number;
  efficiency?: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  period: string;
  baseRate: number;
  approvedBatchesCount: number;
  totalQtyProduced: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  paymentStatus: 'Pending' | 'Paid';
  processedDate: string;
}

// Initial mock data with piece-rate (e.g. Sunita earns ₹35 per Valve produced)
const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 'EMP-001', 
    name: 'Arjun Kumar', 
    role: 'Admin', 
    department: 'Administration', 
    status: 'Active', 
    baseRate: 150, 
    phone: '+91 98765 43210', 
    email: 'arjun@aksales.com', 
    joinedDate: '2025-01-10',
    employeeCode: 'AK-001',
    address: 'GIDC Industrial Area, Plot 42, Ahmedabad',
    payrollModel: 'Fixed Salary',
    fixedSalaryAmount: 50000
  },
  { 
    id: 'EMP-002', 
    name: 'Rajesh Sharma', 
    role: 'Manager', 
    department: 'Operations', 
    status: 'Active', 
    baseRate: 120, 
    phone: '+91 98765 43211', 
    email: 'rajesh@aksales.com', 
    joinedDate: '2025-02-15',
    employeeCode: 'AK-002',
    address: 'Vastrapur, Sector 3, Ahmedabad',
    payrollModel: 'Fixed Salary',
    fixedSalaryAmount: 35000
  },
  { 
    id: 'EMP-003', 
    name: 'Sunita Patel', 
    role: 'Worker', 
    department: 'Production Line A', 
    status: 'Active', 
    baseRate: 35, 
    phone: '+91 87654 32109', 
    email: 'sunita@aksales.com', 
    joinedDate: '2025-04-01',
    employeeCode: 'AK-003',
    address: 'Bapunagar Labor Colony, Block B, Ahmedabad',
    payrollModel: 'Per Piece',
    incentiveRate: 35
  },
  { 
    id: 'EMP-004', 
    name: 'Amit Verma', 
    role: 'Worker', 
    department: 'Production Line B', 
    status: 'Active', 
    baseRate: 30, 
    phone: '+91 76543 21098', 
    email: 'amit@aksales.com', 
    joinedDate: '2025-05-12',
    employeeCode: 'AK-004',
    address: 'Naroda GIDC Quarter 105, Ahmedabad',
    payrollModel: 'Fixed + Incentive',
    fixedSalaryAmount: 12000,
    incentiveRate: 10
  },
  { 
    id: 'EMP-005', 
    name: 'Priya Nair', 
    role: 'Accountant', 
    department: 'Finance', 
    status: 'Active', 
    baseRate: 100, 
    phone: '+91 65432 10987', 
    email: 'priya@aksales.com', 
    joinedDate: '2025-03-20',
    employeeCode: 'AK-005',
    address: 'Satellite Road, Ahmedabad',
    payrollModel: 'Fixed Salary',
    fixedSalaryAmount: 28000
  },
  { 
    id: 'EMP-006', 
    name: 'Vikram Singh', 
    role: 'Worker', 
    department: 'Production Line A', 
    status: 'Active', 
    baseRate: 32, 
    phone: '+91 90123 45678', 
    email: 'vikram@aksales.com', 
    joinedDate: '2025-06-01',
    employeeCode: 'AK-006',
    address: 'Odhav GIDC block 12, Ahmedabad',
    payrollModel: 'Per KG',
    incentiveRate: 32
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-RAW-001', name: 'Steel Sheets (2mm)', type: 'Raw Material', quantity: 1500, unit: 'pcs', minThreshold: 300, lastUpdated: '2026-08-18', materialCode: 'MAT-STL-01', batchNumber: 'B-201', storageLocation: 'Warehouse Block A' },
  { id: 'INV-RAW-002', name: 'Aluminum Alloy Bars', type: 'Raw Material', quantity: 240, unit: 'kg', minThreshold: 200, lastUpdated: '2026-08-19', materialCode: 'MAT-ALM-02', batchNumber: 'B-202', storageLocation: 'Warehouse Block B' },
  { id: 'INV-RAW-003', name: 'Copper Wires (Heavy Duty)', type: 'Raw Material', quantity: 80, unit: 'meters', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'MAT-CPR-03', batchNumber: 'B-203', storageLocation: 'Warehouse Block C' },
  { id: 'INV-RAW-004', name: 'Industrial Paint (Blue)', type: 'Raw Material', quantity: 45, unit: 'liters', minThreshold: 50, lastUpdated: '2026-08-15', materialCode: 'MAT-PNT-04', batchNumber: 'B-204', storageLocation: 'Storage Room 3' },
  { id: 'INV-FIN-001', name: 'AK Heavy Duty Valves', type: 'Finished Good', quantity: 420, unit: 'pcs', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'VAL-HDV-01', storageLocation: 'Finished Goods Bay 1' },
  { id: 'INV-FIN-002', name: 'Standard Coupling Joint B2', type: 'Finished Good', quantity: 75, unit: 'pcs', minThreshold: 80, lastUpdated: '2026-08-18', materialCode: 'CPL-JNT-02', storageLocation: 'Finished Goods Bay 2' }
];

const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Steel Sheets (2mm)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 120, date: '2026-08-18', remarks: 'Batch #B-201 Valves' },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Aluminum Alloy Bars', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 50, date: '2026-08-19', remarks: 'For custom coupling joints' }
];

const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-201', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 45, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Approved', 
    approvedDate: '2026-08-18',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Steel Sheets (2mm)',
    materialConsumedQty: 30,
    wastageQty: 3,
    efficiency: 90,
    materialPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="10" x2="90" y2="10" stroke="%2394a3b8" stroke-width="4"/><circle cx="20" cy="50" r="5" fill="%23cbd5e1"/><circle cx="80" cy="50" r="5" fill="%23cbd5e1"/><text x="25" y="85" fill="%23cbd5e1" font-size="10" font-family="sans-serif">RAW MATERIAL</text></svg>`,
    productPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="50" cy="50" r="25" fill="%23ef4444" stroke="%23dc2626" stroke-width="4"/><rect x="42" y="10" width="16" height="30" fill="%23475569"/><rect x="25" y="42" width="50" height="16" fill="%2394a3b8"/><text x="20" y="90" fill="%2310b981" font-size="10" font-family="sans-serif">FINISHED GOOD</text></svg>`
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-202', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 12, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-19', 
    status: 'Pending Approval',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Aluminum Alloy Bars',
    materialConsumedQty: 8,
    wastageQty: 1,
    efficiency: 88,
    materialPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="10" x2="90" y2="10" stroke="%2394a3b8" stroke-width="4"/><circle cx="20" cy="50" r="5" fill="%23cbd5e1"/><circle cx="80" cy="50" r="5" fill="%23cbd5e1"/><text x="25" y="85" fill="%23cbd5e1" font-size="10" font-family="sans-serif">RAW MATERIAL</text></svg>`,
    productPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="50" cy="50" r="25" fill="%23ef4444" stroke="%23dc2626" stroke-width="4"/><rect x="42" y="10" width="16" height="30" fill="%23475569"/><rect x="25" y="42" width="50" height="16" fill="%2394a3b8"/><text x="20" y="90" fill="%2310b981" font-size="10" font-family="sans-serif">FINISHED GOOD</text></svg>`
  }
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
