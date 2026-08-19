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
    baseRate: 2, // ₹2 per piece
    phone: '+91 87654 32109', 
    email: 'sunita@aksales.com', 
    joinedDate: '2025-04-01',
    employeeCode: 'AK-003',
    address: 'Bapunagar Labor Colony, Block B, Ahmedabad',
    payrollModel: 'Per Piece',
    incentiveRate: 2
  },
  { 
    id: 'EMP-004', 
    name: 'Amit Verma', 
    role: 'Worker', 
    department: 'Frying & Packing Section', 
    status: 'Active', 
    baseRate: 30, // ₹30 per pack
    phone: '+91 76543 21098', 
    email: 'amit@aksales.com', 
    joinedDate: '2025-05-12',
    employeeCode: 'AK-004',
    address: 'Naroda GIDC Quarter 105, Ahmedabad',
    payrollModel: 'Fixed + Incentive',
    fixedSalaryAmount: 12000,
    incentiveRate: 5
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
    department: 'Noodles & Momo Section', 
    status: 'Active', 
    baseRate: 20, // ₹20 per plate/pack
    phone: '+91 90123 45678', 
    email: 'vikram@aksales.com', 
    joinedDate: '2025-06-01',
    employeeCode: 'AK-006',
    address: 'Odhav GIDC block 12, Ahmedabad',
    payrollModel: 'Per Piece',
    incentiveRate: 20
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-RAW-001', name: 'Raw Potatoes & Dough', type: 'Raw Material', quantity: 450, unit: 'kg', minThreshold: 100, lastUpdated: '2026-08-18', materialCode: 'RAW-POT-SAM', batchNumber: 'SM-101', storageLocation: 'Cold Room A' },
  { id: 'INV-RAW-002', name: 'Raw Momo Wrapper & Veg Stuffing', type: 'Raw Material', quantity: 200, unit: 'kg', minThreshold: 50, lastUpdated: '2026-08-19', materialCode: 'RAW-MM-STF', batchNumber: 'MM-202', storageLocation: 'Cold Room B' },
  { id: 'INV-RAW-003', name: 'Uncooked Noodle Strands', type: 'Raw Material', quantity: 180, unit: 'kg', minThreshold: 40, lastUpdated: '2026-08-19', materialCode: 'RAW-NDL-STR', batchNumber: 'ND-303', storageLocation: 'Dry Storage' },
  { id: 'INV-RAW-004', name: 'Refined Oil & Seasoning', type: 'Raw Material', quantity: 120, unit: 'liters', minThreshold: 30, lastUpdated: '2026-08-15', materialCode: 'RAW-OIL-SPC', batchNumber: 'OL-404', storageLocation: 'Dry Storage' },
  { id: 'INV-FIN-001', name: 'Crispy Samosa (Standard)', type: 'Finished Good', quantity: 800, unit: 'pcs', minThreshold: 200, lastUpdated: '2026-08-19', materialCode: 'FIN-SAMOSA', storageLocation: 'Hot Case Bay A' },
  { id: 'INV-FIN-002', name: 'Steamed Veg Momos', type: 'Finished Good', quantity: 400, unit: 'pcs', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'FIN-MOMOS', storageLocation: 'Steamer Box B' },
  { id: 'INV-FIN-003', name: 'Hakka Noodles Plate', type: 'Finished Good', quantity: 150, unit: 'plates', minThreshold: 30, lastUpdated: '2026-08-19', materialCode: 'FIN-NOODLES', storageLocation: 'Wok Assembly Station' },
  { id: 'INV-FIN-004', name: 'French Fries (1kg Pack)', type: 'Finished Good', quantity: 120, unit: 'packs', minThreshold: 45, lastUpdated: '2026-08-19', materialCode: 'FIN-FRIES', storageLocation: 'Freezer Shelf 2' }
];

// Food SVG Vector Graphics
const IMG_SAMOSA_RAW = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23eab308"/><circle cx="35" cy="50" r="14" fill="%23fef08a"/><circle cx="65" cy="50" r="12" fill="%23b45309"/><text x="12" y="88" fill="%2378350f" font-size="8" font-family="sans-serif">DOUGH & POTATO MIX</text></svg>`;
const IMG_SAMOSA_COOKED = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23b45309"/><polygon points="50,15 15,75 85,75" fill="%23f59e0b" stroke="%23d97706" stroke-width="4"/><polygon points="40,30 25,70 75,70" fill="%23d97706" opacity="0.6"/><text x="14" y="90" fill="%23fef3c7" font-size="9" font-family="sans-serif">CRISPY SAMOSAS</text></svg>`;

const IMG_MOMOS_RAW = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23d1d5db"/><circle cx="35" cy="40" r="10" fill="%23f3f4f6"/><circle cx="65" cy="40" r="10" fill="%23f3f4f6"/><circle cx="50" cy="65" r="10" fill="%23f3f4f6"/><text x="16" y="90" fill="%23374151" font-size="8" font-family="sans-serif">UNCOOKED MOMO FLOUR</text></svg>`;
const IMG_MOMOS_COOKED = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%2378350f"/><circle cx="50" cy="50" r="35" fill="%23d97706"/><circle cx="35" cy="45" r="8" fill="%23fafaf9" stroke="%23e7e5e4"/><circle cx="65" cy="45" r="8" fill="%23fafaf9" stroke="%23e7e5e4"/><circle cx="50" cy="65" r="8" fill="%23fafaf9" stroke="%23e7e5e4"/><text x="14" y="92" fill="%23fef3c7" font-size="8" font-family="sans-serif">STEAMED BAMBOO MOMOS</text></svg>`;

const IMG_NOODLES_RAW = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23451a03"/><path d="M10,20 Q30,10 50,20 T90,20" stroke="%23fef08a" stroke-width="4" fill="none"/><path d="M10,40 Q30,30 50,40 T90,40" stroke="%23fef08a" stroke-width="4" fill="none"/><path d="M10,60 Q30,50 50,60 T90,60" stroke="%23fef08a" stroke-width="4" fill="none"/><text x="16" y="88" fill="%23fef08a" font-size="8" font-family="sans-serif">DRY RAW NOODLES</text></svg>`;
const IMG_NOODLES_COOKED = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%231e293b"/><path d="M20,60 A30,30 0 0,0 80,60 Z" fill="%23b91c1c"/><path d="M15,40 Q50,90 85,40" stroke="%23fbbf24" stroke-width="5" fill="none"/><path d="M25,30 Q50,75 75,30" stroke="%23f59e0b" stroke-width="4" fill="none"/><line x1="85" y1="10" x2="35" y2="70" stroke="%2378350f" stroke-width="4"/><text x="12" y="92" fill="%23ffffff" font-size="8" font-family="sans-serif">HOT HAKKA NOODLES</text></svg>`;

const IMG_POTATOES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%237c2d12"/><path d="M20,60 Q50,15 80,60 Z" fill="%23b45309"/><ellipse cx="35" cy="55" rx="8" ry="6" fill="%23d97706"/><ellipse cx="65" cy="50" rx="10" ry="7" fill="%23d97706"/><text x="18" y="90" fill="%23fef3c7" font-size="8" font-family="sans-serif">RAW POTATOES SACK</text></svg>`;
const IMG_FRIES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23991b1b"/><rect x="25" y="20" width="8" height="60" fill="%23fbbf24"/><rect x="38" y="10" width="8" height="70" fill="%23fbbf24"/><rect x="51" y="15" width="8" height="65" fill="%23fbbf24"/><path d="M15,45 L85,45 L75,95 L25,95 Z" fill="%23dc2626"/><text x="18" y="90" fill="%23ffffff" font-size="8" font-family="sans-serif">GOLDEN FRIES</text></svg>`;

const IMG_OIL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23065f46"/><rect x="35" y="10" width="30" height="15" fill="%23f59e0b"/><path d="M25,25 L75,25 L85,85 L15,85 Z" fill="%23fbbf24"/><text x="22" y="92" fill="%23fef3c7" font-size="8" font-family="sans-serif">SUNFLOWER OIL</text></svg>`;

// Chronological Material Issues Feed (10 records matching food products)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-10', remarks: 'Samosa Batch #S01', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Raw Momo Wrapper & Veg Stuffing', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 15, date: '2026-08-11', remarks: 'Steamed Momos #M02', photo: IMG_MOMOS_RAW },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'Uncooked Noodle Strands', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 20, date: '2026-08-12', remarks: 'Dinner Noodles batch', photo: IMG_NOODLES_RAW },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 12, date: '2026-08-13', remarks: 'Fries production run', photo: IMG_POTATOES },
  { id: 'ISS-005', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 15, date: '2026-08-14', remarks: 'Samosa Batch #S05', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-006', materialId: 'INV-RAW-002', materialName: 'Raw Momo Wrapper & Veg Stuffing', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 10, date: '2026-08-15', remarks: 'Momos lunch prep', photo: IMG_MOMOS_RAW },
  { id: 'ISS-007', materialId: 'INV-RAW-003', materialName: 'Uncooked Noodle Strands', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 15, date: '2026-08-16', remarks: 'Hakka Spicy run', photo: IMG_NOODLES_RAW },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 8, date: '2026-08-17', remarks: 'Crispy French Fries run', photo: IMG_POTATOES },
  { id: 'ISS-009', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Seasoning', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-18', remarks: 'Oil refill for fryer', photo: IMG_OIL },
  { id: 'ISS-010', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Dough', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 25, date: '2026-08-19', remarks: 'Samosa mega-run', photo: IMG_SAMOSA_RAW }
];

// Chronological Production Output Logs (10 records - samosa, fries, momos, noodles)
const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-501', 
    productId: 'INV-FIN-001', 
    productName: 'Crispy Samosa (Standard)', 
    quantityProduced: 50, // 10kg dough yielded 50 pcs samosas
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-10', 
    status: 'Approved', 
    approvedDate: '2026-08-10',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Dough',
    materialConsumedQty: 10,
    wastageQty: 1, // 1kg waste
    efficiency: 90,
    materialPhoto: IMG_SAMOSA_RAW,
    productPhoto: IMG_SAMOSA_COOKED
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-502', 
    productId: 'INV-FIN-002', 
    productName: 'Steamed Veg Momos', 
    quantityProduced: 120, // 15kg raw momo mix yielded 120 pcs momos
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-11', 
    status: 'Approved',
    approvedDate: '2026-08-11',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Raw Momo Wrapper & Veg Stuffing',
    materialConsumedQty: 15,
    wastageQty: 1.5,
    efficiency: 90,
    materialPhoto: IMG_MOMOS_RAW,
    productPhoto: IMG_MOMOS_COOKED
  },
  { 
    id: 'PROD-003', 
    batchNumber: 'B-503', 
    productId: 'INV-FIN-003', 
    productName: 'Hakka Noodles Plate', 
    quantityProduced: 40, // 20kg uncooked noodles yielded 40 plates
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-12', 
    status: 'Approved', 
    approvedDate: '2026-08-12',
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Uncooked Noodle Strands',
    materialConsumedQty: 20,
    wastageQty: 2,
    efficiency: 90,
    materialPhoto: IMG_NOODLES_RAW,
    productPhoto: IMG_NOODLES_COOKED
  },
  { 
    id: 'PROD-004', 
    batchNumber: 'B-504', 
    productId: 'INV-FIN-004', 
    productName: 'French Fries (1kg Pack)', 
    quantityProduced: 10, // 12kg potatoes yielded 10 packs fries
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-13', 
    status: 'Approved', 
    approvedDate: '2026-08-13',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Dough',
    materialConsumedQty: 12,
    wastageQty: 1.2,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-005', 
    batchNumber: 'B-505', 
    productId: 'INV-FIN-001', 
    productName: 'Crispy Samosa (Standard)', 
    quantityProduced: 70, // 15kg raw potatoes/dough yielded 70 pcs samosas
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-14', 
    status: 'Approved', 
    approvedDate: '2026-08-14',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Dough',
    materialConsumedQty: 15,
    wastageQty: 0.9,
    efficiency: 94,
    materialPhoto: IMG_SAMOSA_RAW,
    productPhoto: IMG_SAMOSA_COOKED
  },
  { 
    id: 'PROD-006', 
    batchNumber: 'B-506', 
    productId: 'INV-FIN-002', 
    productName: 'Steamed Veg Momos', 
    quantityProduced: 80, // 10kg raw mix yielded 80 momos
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-15', 
    status: 'Approved', 
    approvedDate: '2026-08-15',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Raw Momo Wrapper & Veg Stuffing',
    materialConsumedQty: 10,
    wastageQty: 1.2,
    efficiency: 88,
    materialPhoto: IMG_MOMOS_RAW,
    productPhoto: IMG_MOMOS_COOKED
  },
  { 
    id: 'PROD-007', 
    batchNumber: 'B-507', 
    productId: 'INV-FIN-003', 
    productName: 'Hakka Noodles Plate', 
    quantityProduced: 30, // 15kg raw noodle yielded 30 plates
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-16', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Uncooked Noodle Strands',
    materialConsumedQty: 15,
    wastageQty: 1,
    efficiency: 93,
    materialPhoto: IMG_NOODLES_RAW,
    productPhoto: IMG_NOODLES_COOKED
  },
  { 
    id: 'PROD-008', 
    batchNumber: 'B-508', 
    productId: 'INV-FIN-004', 
    productName: 'French Fries (1kg Pack)', 
    quantityProduced: 7, // 8kg potatoes yielded 7 packs fries
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-17', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Dough',
    materialConsumedQty: 8,
    wastageQty: 0.8,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-009', 
    batchNumber: 'B-509', 
    productId: 'INV-FIN-001', 
    productName: 'Crispy Samosa (Standard)', 
    quantityProduced: 120, // 25kg yielded 120 samosas
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Dough',
    materialConsumedQty: 25,
    wastageQty: 2.5,
    efficiency: 90,
    materialPhoto: IMG_SAMOSA_RAW,
    productPhoto: IMG_SAMOSA_COOKED
  },
  { 
    id: 'PROD-010', 
    batchNumber: 'B-510', 
    productId: 'INV-FIN-002', 
    productName: 'Steamed Veg Momos', 
    quantityProduced: 160, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-19', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Raw Momo Wrapper & Veg Stuffing',
    materialConsumedQty: 20,
    wastageQty: 2,
    efficiency: 90,
    materialPhoto: IMG_MOMOS_RAW,
    productPhoto: IMG_MOMOS_COOKED
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
