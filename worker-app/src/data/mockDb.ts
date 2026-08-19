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

// Kitchen Staff setup
const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 'EMP-001', 
    name: 'Arjun Kumar', 
    role: 'Admin', 
    department: 'Kitchen Administration', 
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
    department: 'Kitchen Management', 
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
    department: 'Food Prep Section A', 
    status: 'Active', 
    baseRate: 35, 
    phone: '+91 87654 32109', 
    email: 'sunita@aksales.com', 
    joinedDate: '2025-04-01',
    employeeCode: 'AK-003',
    address: 'Bapunagar Labor Colony, Block B, Ahmedabad',
    payrollModel: 'Per KG',
    incentiveRate: 35
  },
  { 
    id: 'EMP-004', 
    name: 'Amit Verma', 
    role: 'Worker', 
    department: 'Frying & Packing Section', 
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
    department: 'Food Prep Section B', 
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
  { id: 'INV-RAW-001', name: 'Raw Potatoes (Russet)', type: 'Raw Material', quantity: 800, unit: 'kg', minThreshold: 150, lastUpdated: '2026-08-18', materialCode: 'RAW-POT-01', batchNumber: 'P-501', storageLocation: 'Cold Room A' },
  { id: 'INV-RAW-002', name: 'Refined Frying Oil', type: 'Raw Material', quantity: 240, unit: 'liters', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'RAW-OIL-02', batchNumber: 'O-102', storageLocation: 'Dry Storage Bay 1' },
  { id: 'INV-RAW-003', name: 'Peri-Peri Spice Mix', type: 'Raw Material', quantity: 45, unit: 'kg', minThreshold: 20, lastUpdated: '2026-08-19', materialCode: 'RAW-SPC-03', batchNumber: 'S-302', storageLocation: 'Spices Shelf' },
  { id: 'INV-RAW-004', name: 'Packaging Cartons', type: 'Raw Material', quantity: 1500, unit: 'pcs', minThreshold: 300, lastUpdated: '2026-08-15', materialCode: 'RAW-BOX-04', batchNumber: 'C-082', storageLocation: 'Packaging Area' },
  { id: 'INV-FIN-001', name: 'Classic French Fries (1kg Pack)', type: 'Finished Good', quantity: 310, unit: 'packs', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'FIN-FRS-01', storageLocation: 'Walk-In Freezer 1' },
  { id: 'INV-FIN-002', name: 'Peri-Peri Wedges (1kg Pack)', type: 'Finished Good', quantity: 145, unit: 'packs', minThreshold: 50, lastUpdated: '2026-08-18', materialCode: 'FIN-WDG-02', storageLocation: 'Walk-In Freezer 2' }
];

// Kitchen SVGs
const IMG_POTATOES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%237c2d12"/><path d="M20,60 Q50,15 80,60 Z" fill="%23b45309"/><ellipse cx="35" cy="55" rx="8" ry="6" fill="%23d97706"/><ellipse cx="65" cy="50" rx="10" ry="7" fill="%23d97706"/><ellipse cx="50" cy="70" rx="9" ry="6" fill="%23d97706"/><text x="18" y="90" fill="%23fef3c7" font-size="8" font-family="sans-serif">RAW POTATOES SACK</text></svg>`;
const IMG_OIL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23065f46"/><rect x="35" y="10" width="30" height="15" fill="%23f59e0b"/><path d="M25,25 L75,25 L85,85 L15,85 Z" fill="%23fbbf24"/><text x="22" y="92" fill="%23fef3c7" font-size="8" font-family="sans-serif">SUNFLOWER OIL</text></svg>`;
const IMG_SPICE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23991b1b"/><circle cx="50" cy="50" r="30" fill="%23dc2626"/><circle cx="50" cy="50" r="20" fill="%23ea580c"/><text x="25" y="90" fill="%23fee2e2" font-size="8" font-family="sans-serif">PERI-PERI SPICES</text></svg>`;
const IMG_CARTON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%2378350f"/><rect x="20" y="30" width="60" height="50" fill="%2392400e"/><polygon points="20,30 50,15 80,30 50,45" fill="%23d97706"/><text x="20" y="90" fill="%23fef3c7" font-size="8" font-family="sans-serif">PACKING BOXES</text></svg>`;

const IMG_FRIES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23991b1b"/><rect x="25" y="20" width="8" height="60" fill="%23fbbf24"/><rect x="38" y="10" width="8" height="70" fill="%23fbbf24"/><rect x="51" y="15" width="8" height="65" fill="%23fbbf24"/><rect x="64" y="25" width="8" height="55" fill="%23fbbf24"/><path d="M15,45 L85,45 L75,95 L25,95 Z" fill="%23dc2626"/><text x="18" y="90" fill="%23ffffff" font-size="8" font-family="sans-serif">GOLDEN FRIES</text></svg>`;
const IMG_WEDGES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><path d="M10,50 A40,40 0 0,0 90,50 Z" fill="%23d97706"/><path d="M20,40 Q50,10 80,40" stroke="%23b45309" stroke-width="8" fill="none"/><path d="M30,30 Q50,0 70,30" stroke="%23f59e0b" stroke-width="6" fill="none"/><text x="18" y="85" fill="%23ffffff" font-size="8" font-family="sans-serif">POTATO WEDGES</text></svg>`;

// Chronological Material Issues Feed (10 records)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes (Russet)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-10', remarks: 'Fries Batch #A1', photo: IMG_POTATOES },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Refined Frying Oil', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 15, date: '2026-08-11', remarks: 'Vat Frying Setup', photo: IMG_OIL },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'Peri-Peri Spice Mix', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 5, date: '2026-08-12', remarks: 'Masala seasoning', photo: IMG_SPICE },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes (Russet)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 20, date: '2026-08-13', remarks: 'Large fries run', photo: IMG_POTATOES },
  { id: 'ISS-005', materialId: 'INV-RAW-004', materialName: 'Packaging Cartons', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 50, date: '2026-08-14', remarks: 'Boxing Classic Fries', photo: IMG_CARTON },
  { id: 'ISS-006', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes (Russet)', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 15, date: '2026-08-15', remarks: 'Wedges cutting run', photo: IMG_POTATOES },
  { id: 'ISS-007', materialId: 'INV-RAW-003', materialName: 'Peri-Peri Spice Mix', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 8, date: '2026-08-16', remarks: 'Spicy Wedges seasoning', photo: IMG_SPICE },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes (Russet)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 12, date: '2026-08-17', remarks: 'Midnight batch fries', photo: IMG_POTATOES },
  { id: 'ISS-009', materialId: 'INV-RAW-002', materialName: 'Refined Frying Oil', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 25, date: '2026-08-18', remarks: 'Oil replenishment', photo: IMG_OIL },
  { id: 'ISS-010', materialId: 'INV-RAW-004', materialName: 'Packaging Cartons', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 30, date: '2026-08-19', remarks: 'Carton boxing', photo: IMG_CARTON }
];

// Chronological Production Output Logs (10 records)
const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-501', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 8, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-10', 
    status: 'Approved', 
    approvedDate: '2026-08-10',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes (Russet)',
    materialConsumedQty: 10,
    wastageQty: 1.5,
    efficiency: 85,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-502', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 11, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-11', 
    status: 'Approved',
    approvedDate: '2026-08-11',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes (Russet)',
    materialConsumedQty: 12,
    wastageQty: 1,
    efficiency: 92,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-003', 
    batchNumber: 'B-503', 
    productId: 'INV-FIN-002', 
    productName: 'Peri-Peri Wedges (1kg Pack)', 
    quantityProduced: 12, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-12', 
    status: 'Approved', 
    approvedDate: '2026-08-12',
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Peri-Peri Spice Mix',
    materialConsumedQty: 3,
    wastageQty: 0.2,
    efficiency: 93,
    materialPhoto: IMG_SPICE,
    productPhoto: IMG_WEDGES
  },
  { 
    id: 'PROD-004', 
    batchNumber: 'B-504', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 16, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-13', 
    status: 'Approved', 
    approvedDate: '2026-08-13',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes (Russet)',
    materialConsumedQty: 20,
    wastageQty: 3,
    efficiency: 85,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-005', 
    batchNumber: 'B-505', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 24, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-14', 
    status: 'Approved', 
    approvedDate: '2026-08-14',
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Packaging Cartons',
    materialConsumedQty: 25,
    wastageQty: 1,
    efficiency: 96,
    materialPhoto: IMG_CARTON,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-006', 
    batchNumber: 'B-506', 
    productId: 'INV-FIN-002', 
    productName: 'Peri-Peri Wedges (1kg Pack)', 
    quantityProduced: 11, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-15', 
    status: 'Approved', 
    approvedDate: '2026-08-15',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes (Russet)',
    materialConsumedQty: 13,
    wastageQty: 1.5,
    efficiency: 88,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_WEDGES
  },
  { 
    id: 'PROD-007', 
    batchNumber: 'B-507', 
    productId: 'INV-FIN-002', 
    productName: 'Peri-Peri Wedges (1kg Pack)', 
    quantityProduced: 6, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-16', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Peri-Peri Spice Mix',
    materialConsumedQty: 5,
    wastageQty: 0.4,
    efficiency: 92,
    materialPhoto: IMG_SPICE,
    productPhoto: IMG_WEDGES
  },
  { 
    id: 'PROD-008', 
    batchNumber: 'B-508', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 9, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-17', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes (Russet)',
    materialConsumedQty: 10,
    wastageQty: 1,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-009', 
    batchNumber: 'B-509', 
    productId: 'INV-FIN-001', 
    productName: 'Classic French Fries (1kg Pack)', 
    quantityProduced: 18, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Refined Frying Oil',
    materialConsumedQty: 20,
    wastageQty: 2,
    efficiency: 90,
    materialPhoto: IMG_OIL,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-010', 
    batchNumber: 'B-510', 
    productId: 'INV-FIN-002', 
    productName: 'Peri-Peri Wedges (1kg Pack)', 
    quantityProduced: 15, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-19', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Packaging Cartons',
    materialConsumedQty: 16,
    wastageQty: 1,
    efficiency: 94,
    materialPhoto: IMG_CARTON,
    productPhoto: IMG_WEDGES
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
