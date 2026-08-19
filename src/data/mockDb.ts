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

// Reusable SVG Images to simulate upload photos
const IMG_STEEL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23475569"/><line x1="10" y1="20" x2="90" y2="20" stroke="%2394a3b8" stroke-width="4"/><line x1="10" y1="50" x2="90" y2="50" stroke="%2394a3b8" stroke-width="4"/><line x1="10" y1="80" x2="90" y2="80" stroke="%2394a3b8" stroke-width="4"/><text x="18" y="90" fill="%23cbd5e1" font-size="8" font-family="sans-serif">STEEL SHEETS</text></svg>`;
const IMG_ALUM = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%2364748b"/><rect x="20" y="20" width="60" height="15" rx="3" fill="%23cbd5e1"/><rect x="20" y="45" width="60" height="15" rx="3" fill="%23cbd5e1"/><rect x="20" y="70" width="60" height="15" rx="3" fill="%23cbd5e1"/><text x="15" y="90" fill="%23f1f5f9" font-size="8" font-family="sans-serif">ALUMINUM BARS</text></svg>`;
const IMG_COPPER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%237c2d12"/><circle cx="50" cy="50" r="30" fill="none" stroke="%23ea580c" stroke-width="8"/><circle cx="50" cy="50" r="20" fill="none" stroke="%23f97316" stroke-width="5"/><text x="20" y="90" fill="%23ffedd5" font-size="8" font-family="sans-serif">COPPER WIRE COIL</text></svg>`;
const IMG_PAINT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e3a8a"/><ellipse cx="50" cy="30" rx="30" ry="10" fill="%233b82f6"/><path d="M20,30 L20,80 A30,10 0 0,0 80,80 L80,30 Z" fill="%231d4ed8"/><text x="25" y="92" fill="%23dbeafe" font-size="8" font-family="sans-serif">PAINT CAN</text></svg>`;

const IMG_VALVE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="50" cy="50" r="22" fill="%23ef4444" stroke="%23b91c1c" stroke-width="4"/><rect x="44" y="15" width="12" height="25" fill="%23475569"/><rect x="30" y="44" width="40" height="12" fill="%2394a3b8"/><text x="18" y="90" fill="%2310b981" font-size="8" font-family="sans-serif">FINISHED VALVE</text></svg>`;
const IMG_JOINT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%230f172a"/><rect x="25" y="40" width="30" height="20" fill="%230284c7"/><rect x="45" y="40" width="30" height="20" fill="%230369a1"/><circle cx="45" cy="50" r="12" fill="%23bae6fd" opacity="0.8"/><text x="16" y="90" fill="%23bae6fd" font-size="8" font-family="sans-serif">COUPLING JOINT</text></svg>`;

// Chronological Material Issues Feed (10 records)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Steel Sheets (2mm)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 120, date: '2026-08-10', remarks: 'Batch #B-201 Valves', photo: IMG_STEEL },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Aluminum Alloy Bars', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 50, date: '2026-08-11', remarks: 'For custom coupling joints', photo: IMG_ALUM },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'Copper Wires (Heavy Duty)', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 90, date: '2026-08-12', remarks: 'Electrical Coil fitting', photo: IMG_COPPER },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Steel Sheets (2mm)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 150, date: '2026-08-13', remarks: 'Assembly Line A Valves', photo: IMG_STEEL },
  { id: 'ISS-005', materialId: 'INV-RAW-004', materialName: 'Industrial Paint (Blue)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 30, date: '2026-08-14', remarks: 'Finishing coating', photo: IMG_PAINT },
  { id: 'ISS-006', materialId: 'INV-RAW-002', materialName: 'Aluminum Alloy Bars', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 80, date: '2026-08-15', remarks: 'Cylinder fittings', photo: IMG_ALUM },
  { id: 'ISS-007', materialId: 'INV-RAW-003', materialName: 'Copper Wires (Heavy Duty)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 60, date: '2026-08-16', remarks: 'Internal Valve solenoids', photo: IMG_COPPER },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Steel Sheets (2mm)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 110, date: '2026-08-17', remarks: 'Batch B-208 Coupling flanges', photo: IMG_STEEL },
  { id: 'ISS-009', materialId: 'INV-RAW-002', materialName: 'Aluminum Alloy Bars', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 70, date: '2026-08-18', remarks: 'Valves structures', photo: IMG_ALUM },
  { id: 'ISS-010', materialId: 'INV-RAW-004', materialName: 'Industrial Paint (Blue)', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 20, date: '2026-08-19', remarks: 'Final coat spraying', photo: IMG_PAINT }
];

// Chronological Production Output Logs (10 records)
const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-201', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 45, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-10', 
    status: 'Approved', 
    approvedDate: '2026-08-10',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Steel Sheets (2mm)',
    materialConsumedQty: 30,
    wastageQty: 3,
    efficiency: 90,
    materialPhoto: IMG_STEEL,
    productPhoto: IMG_VALVE
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-202', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 12, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-11', 
    status: 'Approved',
    approvedDate: '2026-08-11',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Aluminum Alloy Bars',
    materialConsumedQty: 8,
    wastageQty: 1,
    efficiency: 88,
    materialPhoto: IMG_ALUM,
    productPhoto: IMG_JOINT
  },
  { 
    id: 'PROD-003', 
    batchNumber: 'B-203', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 30, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-12', 
    status: 'Approved', 
    approvedDate: '2026-08-12',
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Copper Wires (Heavy Duty)',
    materialConsumedQty: 25,
    wastageQty: 2,
    efficiency: 92,
    materialPhoto: IMG_COPPER,
    productPhoto: IMG_VALVE
  },
  { 
    id: 'PROD-004', 
    batchNumber: 'B-204', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 55, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-13', 
    status: 'Approved', 
    approvedDate: '2026-08-13',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Steel Sheets (2mm)',
    materialConsumedQty: 40,
    wastageQty: 4,
    efficiency: 90,
    materialPhoto: IMG_STEEL,
    productPhoto: IMG_VALVE
  },
  { 
    id: 'PROD-005', 
    batchNumber: 'B-205', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 18, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-14', 
    status: 'Approved', 
    approvedDate: '2026-08-14',
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Industrial Paint (Blue)',
    materialConsumedQty: 10,
    wastageQty: 0.5,
    efficiency: 95,
    materialPhoto: IMG_PAINT,
    productPhoto: IMG_JOINT
  },
  { 
    id: 'PROD-006', 
    batchNumber: 'B-206', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 22, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-15', 
    status: 'Approved', 
    approvedDate: '2026-08-15',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Aluminum Alloy Bars',
    materialConsumedQty: 16,
    wastageQty: 2,
    efficiency: 87,
    materialPhoto: IMG_ALUM,
    productPhoto: IMG_JOINT
  },
  { 
    id: 'PROD-007', 
    batchNumber: 'B-207', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 20, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-16', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Copper Wires (Heavy Duty)',
    materialConsumedQty: 15,
    wastageQty: 1,
    efficiency: 93,
    materialPhoto: IMG_COPPER,
    productPhoto: IMG_VALVE
  },
  { 
    id: 'PROD-008', 
    batchNumber: 'B-208', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 28, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-17', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Steel Sheets (2mm)',
    materialConsumedQty: 20,
    wastageQty: 3,
    efficiency: 85,
    materialPhoto: IMG_STEEL,
    productPhoto: IMG_JOINT
  },
  { 
    id: 'PROD-009', 
    batchNumber: 'B-209', 
    productId: 'INV-FIN-001', 
    productName: 'AK Heavy Duty Valves', 
    quantityProduced: 25, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Aluminum Alloy Bars',
    materialConsumedQty: 18,
    wastageQty: 1.5,
    efficiency: 91,
    materialPhoto: IMG_ALUM,
    productPhoto: IMG_VALVE
  },
  { 
    id: 'PROD-010', 
    batchNumber: 'B-210', 
    productId: 'INV-FIN-002', 
    productName: 'Standard Coupling Joint B2', 
    quantityProduced: 15, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-19', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Industrial Paint (Blue)',
    materialConsumedQty: 8,
    wastageQty: 1,
    efficiency: 87,
    materialPhoto: IMG_PAINT,
    productPhoto: IMG_JOINT
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

export const resetDb = () => {
  localStorage.removeItem('aksales_employees');
  localStorage.removeItem('aksales_inventory');
  localStorage.removeItem('aksales_issues');
  localStorage.removeItem('aksales_production');
  window.location.reload();
};
