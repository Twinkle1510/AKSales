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

// Helper to base64 encode SVGs for 100% bulletproof browser rendering
const svgToBase64 = (svgStr: string): string => {
  return 'data:image/svg+xml;base64,' + btoa(svgStr);
};

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
  { id: 'INV-RAW-001', name: 'Raw Potatoes & Flour Dough', type: 'Raw Material', quantity: 450, unit: 'kg', minThreshold: 100, lastUpdated: '2026-08-18', materialCode: 'RAW-POT-SAM', batchNumber: 'SM-101', storageLocation: 'Cold Room A' },
  { id: 'INV-RAW-002', name: 'Raw Momo Wrapper & Veg Stuffing', type: 'Raw Material', quantity: 200, unit: 'kg', minThreshold: 50, lastUpdated: '2026-08-19', materialCode: 'RAW-MM-STF', batchNumber: 'MM-202', storageLocation: 'Cold Room B' },
  { id: 'INV-RAW-003', name: 'Uncooked Noodle Strands', type: 'Raw Material', quantity: 180, unit: 'kg', minThreshold: 40, lastUpdated: '2026-08-19', materialCode: 'RAW-NDL-STR', batchNumber: 'ND-303', storageLocation: 'Dry Storage' },
  { id: 'INV-RAW-004', name: 'Refined Oil & Spice Seasonings', type: 'Raw Material', quantity: 120, unit: 'liters', minThreshold: 30, lastUpdated: '2026-08-15', materialCode: 'RAW-OIL-SPC', batchNumber: 'OL-404', storageLocation: 'Dry Storage' },
  
  // 10 Unique Finished Goods
  { id: 'INV-FIN-001', name: 'Classic Samosa (Standard)', type: 'Finished Good', quantity: 800, unit: 'pcs', minThreshold: 200, lastUpdated: '2026-08-19', materialCode: 'FIN-SAMOSA', storageLocation: 'Hot Case Bay A' },
  { id: 'INV-FIN-002', name: 'Steamed Veg Momos', type: 'Finished Good', quantity: 400, unit: 'pcs', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'FIN-MOMOS', storageLocation: 'Steamer Box B' },
  { id: 'INV-FIN-003', name: 'Hakka Noodles Plate', type: 'Finished Good', quantity: 150, unit: 'plates', minThreshold: 30, lastUpdated: '2026-08-19', materialCode: 'FIN-NOODLES', storageLocation: 'Wok Assembly Station' },
  { id: 'INV-FIN-004', name: 'French Fries (1kg Pack)', type: 'Finished Good', quantity: 120, unit: 'packs', minThreshold: 45, lastUpdated: '2026-08-19', materialCode: 'FIN-FRIES', storageLocation: 'Freezer Shelf 2' },
  { id: 'INV-FIN-005', name: 'Crispy Spring Rolls', type: 'Finished Good', quantity: 300, unit: 'pcs', minThreshold: 50, lastUpdated: '2026-08-19', materialCode: 'FIN-ROLLS', storageLocation: 'Hot Cabinet 2' },
  { id: 'INV-FIN-006', name: 'Veg Burger Patty', type: 'Finished Good', quantity: 240, unit: 'pcs', minThreshold: 60, lastUpdated: '2026-08-19', materialCode: 'FIN-PATTY', storageLocation: 'Freezer Shelf 3' },
  { id: 'INV-FIN-007', name: 'Paneer Tikka Roll', type: 'Finished Good', quantity: 180, unit: 'pcs', minThreshold: 30, lastUpdated: '2026-08-19', materialCode: 'FIN-TIKKA', storageLocation: 'Assembly Line 3' },
  { id: 'INV-FIN-008', name: 'Chilli Garlic Potatoes', type: 'Finished Good', quantity: 90, unit: 'plates', minThreshold: 20, lastUpdated: '2026-08-19', materialCode: 'FIN-CHILLI', storageLocation: 'Prep Kitchen C' },
  { id: 'INV-FIN-009', name: 'Cheese Garlic Bread', type: 'Finished Good', quantity: 110, unit: 'pcs', minThreshold: 25, lastUpdated: '2026-08-19', materialCode: 'FIN-BREAD', storageLocation: 'Bakery Deck 1' },
  { id: 'INV-FIN-010', name: 'Aloo Tikki Chaat', type: 'Finished Good', quantity: 95, unit: 'plates', minThreshold: 15, lastUpdated: '2026-08-19', materialCode: 'FIN-CHAAT', storageLocation: 'Chaat Station 4' }
];

// Raw Food material SVGs
const IMG_SAMOSA_RAW = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#eab308"/><circle cx="35" cy="50" r="14" fill="#fef08a"/><circle cx="65" cy="50" r="12" fill="#b45309"/><text x="12" y="88" fill="#78350f" font-size="8" font-family="sans-serif">DOUGH & POTATO MIX</text></svg>`);
const IMG_MOMOS_RAW = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#d1d5db"/><circle cx="35" cy="40" r="10" fill="#f3f4f6"/><circle cx="65" cy="40" r="10" fill="#f3f4f6"/><text x="16" y="90" fill="#374151" font-size="8" font-family="sans-serif">MOMO WRAP FLOUR</text></svg>`);
const IMG_NOODLES_RAW = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#451a03"/><path d="M10,20 Q30,10 50,20 T90,20" stroke="#fef08a" stroke-width="4" fill="none"/><text x="16" y="88" fill="#fef08a" font-size="8" font-family="sans-serif">DRY NOODLE STRANDS</text></svg>`);
const IMG_POTATOES = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#7c2d12"/><path d="M20,60 Q50,15 80,60 Z" fill="#b45309"/><text x="18" y="90" fill="#fef3c7" font-size="8" font-family="sans-serif">POTATOES SACK</text></svg>`);
const IMG_OIL = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#065f46"/><path d="M25,25 L75,25 L85,85 L15,85 Z" fill="#fbbf24"/><text x="22" y="92" fill="#fef3c7" font-size="8" font-family="sans-serif">SUNFLOWER OIL</text></svg>`);

// Finished Food product SVGs
const IMG_SAMOSA_COOKED = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#b45309"/><polygon points="50,15 15,75 85,75" fill="#f59e0b" stroke="#d97706" stroke-width="4"/><text x="14" y="90" fill="#fef3c7" font-size="9" font-family="sans-serif">CRISPY SAMOSAS</text></svg>`);
const IMG_MOMOS_COOKED = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#78350f"/><circle cx="50" cy="50" r="35" fill="#d97706"/><circle cx="35" cy="45" r="8" fill="#fafaf9"/><circle cx="65" cy="45" r="8" fill="#fafaf9"/><text x="14" y="92" fill="#fef3c7" font-size="8" font-family="sans-serif">STEAMED MOMOS</text></svg>`);
const IMG_NOODLES_COOKED = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#1e293b"/><path d="M20,60 A30,30 0 0,0 80,60 Z" fill="#b91c1c"/><path d="M15,40 Q50,90 85,40" stroke="#fbbf24" stroke-width="5" fill="none"/><text x="12" y="92" fill="#ffffff" font-size="8" font-family="sans-serif">HAKKA NOODLES</text></svg>`);
const IMG_FRIES = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#991b1b"/><rect x="25" y="20" width="8" height="60" fill="#fbbf24"/><rect x="51" y="15" width="8" height="65" fill="#fbbf24"/><path d="M15,45 L85,45 L75,95 L25,95 Z" fill="#dc2626"/><text x="18" y="90" fill="#ffffff" font-size="8" font-family="sans-serif">GOLDEN FRIES</text></svg>`);
const IMG_ROLLS = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#7c2d12"/><rect x="15" y="35" width="70" height="15" rx="5" fill="#f59e0b"/><rect x="15" y="60" width="70" height="15" rx="5" fill="#d97706"/><text x="18" y="90" fill="#ffffff" font-size="8" font-family="sans-serif">SPRING ROLLS</text></svg>`);
const IMG_PATTY = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#b45309"/><circle cx="50" cy="50" r="30" fill="#ea580c" stroke="#d97706" stroke-width="4"/><text x="22" y="90" fill="#ffffff" font-size="8" font-family="sans-serif">BURGER PATTY</text></svg>`);
const IMG_TIKKA = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#7f1d1d"/><rect x="30" y="30" width="40" height="40" fill="#f97316"/><rect x="40" y="40" width="20" height="20" fill="#fef08a"/><line x1="50" y1="10" x2="50" y2="90" stroke="#94a3b8" stroke-width="3"/><text x="18" y="88" fill="#ffffff" font-size="8" font-family="sans-serif">PANEER TIKKA</text></svg>`);
const IMG_CHILLI = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#b91c1c"/><circle cx="30" cy="50" r="8" fill="#ea580c"/><circle cx="50" cy="45" r="9" fill="#ea580c"/><circle cx="70" cy="55" r="7" fill="#ea580c"/><text x="14" y="90" fill="#ffffff" font-size="8" font-family="sans-serif">CHILLI POTATO</text></svg>`);
const IMG_BREAD = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#7c2d12"/><rect x="20" y="20" width="60" height="60" rx="10" fill="#f59e0b"/><rect x="25" y="25" width="50" height="50" rx="5" fill="#fef08a"/><circle cx="35" cy="35" r="3" fill="#16a34a"/><text x="16" y="92" fill="#ffffff" font-size="8" font-family="sans-serif">GARLIC BREAD</text></svg>`);
const IMG_CHAAT = svgToBase64(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#14532d"/><circle cx="50" cy="50" r="32" fill="#ea580c"/><path d="M30,30 Q50,45 70,30" stroke="#dc2626" stroke-width="4" fill="none"/><path d="M30,70 Q50,55 70,70" stroke="#16a34a" stroke-width="4" fill="none"/><text x="18" y="90" fill="#ffffff" font-size="8" font-family="sans-serif">TIKKI CHAAT</text></svg>`);

// Chronological Material Issues Feed (10 unique records)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-10', remarks: 'Samosa Batch #S01', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Raw Momo Wrapper & Veg Stuffing', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 15, date: '2026-08-11', remarks: 'Steamed Momos #M02', photo: IMG_MOMOS_RAW },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'Uncooked Noodle Strands', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 20, date: '2026-08-12', remarks: 'Hakka noodles run', photo: IMG_NOODLES_RAW },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 12, date: '2026-08-13', remarks: 'French Fries packaging', photo: IMG_POTATOES },
  { id: 'ISS-005', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 15, date: '2026-08-14', remarks: 'Spring rolls dough', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-006', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 10, date: '2026-08-15', remarks: 'Veg Burger patties', photo: IMG_POTATOES },
  { id: 'ISS-007', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Spice Seasonings', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 8, date: '2026-08-16', remarks: 'Paneer marination', photo: IMG_OIL },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 8, date: '2026-08-17', remarks: 'Chilli Garlic prep', photo: IMG_POTATOES },
  { id: 'ISS-009', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Spice Seasonings', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-18', remarks: 'Garlic bread deck', photo: IMG_OIL },
  { id: 'ISS-010', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 25, date: '2026-08-19', remarks: 'Mega Chaat prep', photo: IMG_POTATOES }
];

// Chronological Production Output Logs (10 completely unique food finished goods!)
const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-501', 
    productId: 'INV-FIN-001', 
    productName: 'Classic Samosa (Standard)', 
    quantityProduced: 50, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-10', 
    status: 'Approved', 
    approvedDate: '2026-08-10',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 10,
    wastageQty: 1, 
    efficiency: 90,
    materialPhoto: IMG_SAMOSA_RAW,
    productPhoto: IMG_SAMOSA_COOKED
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-502', 
    productId: 'INV-FIN-002', 
    productName: 'Steamed Veg Momos', 
    quantityProduced: 120, 
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
    quantityProduced: 40, 
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
    quantityProduced: 10, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-13', 
    status: 'Approved', 
    approvedDate: '2026-08-13',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 12,
    wastageQty: 1.2,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_FRIES
  },
  { 
    id: 'PROD-005', 
    batchNumber: 'B-505', 
    productId: 'INV-FIN-005', 
    productName: 'Crispy Spring Rolls', 
    quantityProduced: 60, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-14', 
    status: 'Approved', 
    approvedDate: '2026-08-14',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 8,
    wastageQty: 0.8,
    efficiency: 90,
    materialPhoto: IMG_SAMOSA_RAW,
    productPhoto: IMG_ROLLS
  },
  { 
    id: 'PROD-006', 
    batchNumber: 'B-506', 
    productId: 'INV-FIN-006', 
    productName: 'Veg Burger Patty', 
    quantityProduced: 45, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-15', 
    status: 'Approved', 
    approvedDate: '2026-08-15',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 10,
    wastageQty: 1.5,
    efficiency: 85,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_PATTY
  },
  { 
    id: 'PROD-007', 
    batchNumber: 'B-507', 
    productId: 'INV-FIN-007', 
    productName: 'Paneer Tikka Roll', 
    quantityProduced: 30, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-16', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Refined Oil & Spice Seasonings',
    materialConsumedQty: 5,
    wastageQty: 0.4,
    efficiency: 92,
    materialPhoto: IMG_OIL,
    productPhoto: IMG_TIKKA
  },
  { 
    id: 'PROD-008', 
    batchNumber: 'B-508', 
    productId: 'INV-FIN-008', 
    productName: 'Chilli Garlic Potatoes', 
    quantityProduced: 25, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-17', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 10,
    wastageQty: 1,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_CHILLI
  },
  { 
    id: 'PROD-009', 
    batchNumber: 'B-509', 
    productId: 'INV-FIN-009', 
    productName: 'Cheese Garlic Bread', 
    quantityProduced: 35, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Refined Oil & Spice Seasonings',
    materialConsumedQty: 6,
    wastageQty: 0.3,
    efficiency: 95,
    materialPhoto: IMG_OIL,
    productPhoto: IMG_BREAD
  },
  { 
    id: 'PROD-010', 
    batchNumber: 'B-510', 
    productId: 'INV-FIN-010', 
    productName: 'Aloo Tikki Chaat', 
    quantityProduced: 55, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-19', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 12,
    wastageQty: 1.2,
    efficiency: 90,
    materialPhoto: IMG_POTATOES,
    productPhoto: IMG_CHAAT
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
