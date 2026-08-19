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
    baseRate: 2, 
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
    baseRate: 30, 
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
    baseRate: 20, 
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
  
  // 14 Unique Finished Goods
  { id: 'INV-FIN-001', name: 'Classic Samosa (Standard)', type: 'Finished Good', quantity: 800, unit: 'pcs', minThreshold: 200, lastUpdated: '2026-08-19', materialCode: 'FIN-SAMOSA', storageLocation: 'Hot Case Bay A' },
  { id: 'INV-FIN-002', name: 'Steamed Veg Momos', type: 'Finished Good', quantity: 400, unit: 'pcs', minThreshold: 100, lastUpdated: '2026-08-19', materialCode: 'FIN-MOMOS', storageLocation: 'Steamer Box B' },
  { id: 'INV-FIN-003', name: 'Hakka Noodles Plate', type: 'Finished Good', quantity: 150, unit: 'plates', minThreshold: 30, lastUpdated: '2026-08-19', materialCode: 'FIN-NOODLES', storageLocation: 'Wok Assembly Station' },
  { id: 'INV-FIN-004', name: 'French Fries (1kg Pack)', type: 'Finished Good', quantity: 120, unit: 'packs', minThreshold: 45, lastUpdated: '2026-08-19', materialCode: 'FIN-FRIES', storageLocation: 'Freezer Shelf 2' },
  { id: 'INV-FIN-005', name: 'Crispy Spring Rolls', type: 'Finished Good', quantity: 300, unit: 'pcs', minThreshold: 50, lastUpdated: '2026-08-19', materialCode: 'FIN-ROLLS', storageLocation: 'Hot Cabinet 2' },
  { id: 'INV-FIN-006', name: 'Veg Burger Patty', type: 'Finished Good', quantity: 240, unit: 'pcs', minThreshold: 60, lastUpdated: '2026-08-19', materialCode: 'FIN-PATTY', storageLocation: 'Freezer Shelf 3' },
  { id: 'INV-FIN-007', name: 'Paneer Tikka Roll', type: 'Finished Good', quantity: 180, unit: 'pcs', minThreshold: 30, lastUpdated: '2026-08-19', materialCode: 'FIN-TIKKA', storageLocation: 'Assembly Line 3' },
  { id: 'INV-FIN-008', name: 'Chilli Garlic Potatoes', type: 'Finished Good', quantity: 90, unit: 'plates', minThreshold: 20, lastUpdated: '2026-08-19', materialCode: 'FIN-CHILLI', storageLocation: 'Prep Kitchen C' },
  { id: 'INV-FIN-009', name: 'Cheese Garlic Bread', type: 'Finished Good', quantity: 110, unit: 'pcs', minThreshold: 25, lastUpdated: '2026-08-19', materialCode: 'FIN-BREAD', storageLocation: 'Bakery Deck 1' },
  { id: 'INV-FIN-010', name: 'Aloo Tikki Chaat', type: 'Finished Good', quantity: 95, unit: 'plates', minThreshold: 15, lastUpdated: '2026-08-19', materialCode: 'FIN-CHAAT', storageLocation: 'Chaat Station 4' },
  { id: 'INV-FIN-011', name: 'Masala Dosa', type: 'Finished Good', quantity: 70, unit: 'pcs', minThreshold: 10, lastUpdated: '2026-08-19', materialCode: 'FIN-DOSA', storageLocation: 'Griddle Station 1' },
  { id: 'INV-FIN-012', name: 'Paneer Butter Masala', type: 'Finished Good', quantity: 85, unit: 'packs', minThreshold: 15, lastUpdated: '2026-08-19', materialCode: 'FIN-PANEER-CURRY', storageLocation: 'Cold Room C' },
  { id: 'INV-FIN-013', name: 'Veg Biryani Bowl', type: 'Finished Good', quantity: 60, unit: 'plates', minThreshold: 10, lastUpdated: '2026-08-19', materialCode: 'FIN-BIRYANI', storageLocation: 'Hot Case Bay B' },
  { id: 'INV-FIN-014', name: 'Crispy Onion Pakoda', type: 'Finished Good', quantity: 110, unit: 'pcs', minThreshold: 20, lastUpdated: '2026-08-19', materialCode: 'FIN-PAKODA', storageLocation: 'Hot Case Bay C' }
];

// REAL High-Definition Photography URLs from Unsplash
const IMG_SAMOSA_RAW = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80';
const IMG_SAMOSA_COOKED = 'https://images.unsplash.com/photo-1601050690597-df056fb49785?w=400&auto=format&fit=crop&q=80';

const IMG_MOMOS_RAW = 'https://images.unsplash.com/photo-1608833970687-14372a302517?w=400&auto=format&fit=crop&q=80';
const IMG_MOMOS_COOKED = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80';

const IMG_NOODLES_RAW = 'https://images.unsplash.com/photo-1612966608967-312ba5791026?w=400&auto=format&fit=crop&q=80';
const IMG_NOODLES_COOKED = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80';

const IMG_POTATOES = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80';
const IMG_FRIES = 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&auto=format&fit=crop&q=80';

const IMG_OIL = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80';
const IMG_ROLLS = 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80';

const IMG_PATTY_RAW = 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80';
const IMG_PATTY_COOKED = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80';

const IMG_TIKKA_RAW = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80';
const IMG_TIKKA_COOKED = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80';

const IMG_CHILLI_RAW = 'https://images.unsplash.com/photo-1596450514944-a302251a37c9?w=400&auto=format&fit=crop&q=80';
const IMG_CHILLI_COOKED = 'https://images.unsplash.com/photo-1600147190474-0f2c4cb757a2?w=400&auto=format&fit=crop&q=80';

const IMG_BREAD_RAW = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80';
const IMG_BREAD_COOKED = 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&auto=format&fit=crop&q=80';

const IMG_CHAAT_RAW = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80';
const IMG_CHAAT_COOKED = 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&auto=format&fit=crop&q=80';

// Added 4 new Unsplash raw & cooked food photo pairs
const IMG_DOSA_RAW = 'https://images.unsplash.com/photo-1601050690597-df056fb49785?w=400&auto=format&fit=crop&q=80';
const IMG_DOSA_COOKED = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80';

const IMG_PANEER_RAW = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80';
const IMG_PANEER_COOKED = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80'; // Paneer Curry

const IMG_BIRYANI_RAW = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80';
const IMG_BIRYANI_COOKED = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80';

const IMG_PAKODA_RAW = 'https://images.unsplash.com/photo-1508747703725-719ae2cc29d4?w=400&auto=format&fit=crop&q=80';
const IMG_PAKODA_COOKED = 'https://images.unsplash.com/photo-1601050690597-df056fb49785?w=400&auto=format&fit=crop&q=80';

// Chronological Material Issues Feed (14 unique records)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-10', remarks: 'Samosa Batch #S01', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Raw Momo Wrapper & Veg Stuffing', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 15, date: '2026-08-11', remarks: 'Steamed Momos #M02', photo: IMG_MOMOS_RAW },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'Uncooked Noodle Strands', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 20, date: '2026-08-12', remarks: 'Hakka noodles run', photo: IMG_NOODLES_RAW },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 12, date: '2026-08-13', remarks: 'French Fries packaging', photo: IMG_POTATOES },
  { id: 'ISS-005', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 15, date: '2026-08-14', remarks: 'Spring rolls dough', photo: IMG_SAMOSA_RAW },
  { id: 'ISS-006', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 10, date: '2026-08-15', remarks: 'Veg Burger patties', photo: IMG_PATTY_RAW },
  { id: 'ISS-007', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Spice Seasonings', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 8, date: '2026-08-16', remarks: 'Paneer marination', photo: IMG_OIL },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 8, date: '2026-08-17', remarks: 'Chilli Garlic prep', photo: IMG_CHILLI_RAW },
  { id: 'ISS-009', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Spice Seasonings', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-18', remarks: 'Garlic bread deck', photo: IMG_OIL },
  { id: 'ISS-010', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 25, date: '2026-08-19', remarks: 'Mega Chaat prep', photo: IMG_CHAAT_RAW },
  { id: 'ISS-011', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 18, date: '2026-08-20', remarks: 'Dosa Griddle Setup', photo: IMG_DOSA_RAW },
  { id: 'ISS-012', materialId: 'INV-RAW-004', materialName: 'Refined Oil & Spice Seasonings', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 14, date: '2026-08-21', remarks: 'Paneer butter curry preparation', photo: IMG_PANEER_RAW },
  { id: 'ISS-013', materialId: 'INV-RAW-003', materialName: 'Uncooked Noodle Strands', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 22, date: '2026-08-22', remarks: 'Biryani Basmati rice allotment', photo: IMG_BIRYANI_RAW },
  { id: 'ISS-014', materialId: 'INV-RAW-001', materialName: 'Raw Potatoes & Flour Dough', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 15, date: '2026-08-23', remarks: 'Onion Pakoda prep', photo: IMG_PAKODA_RAW }
];

// Chronological Production Output Logs (14 completely unique food finished goods!)
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
    materialPhoto: IMG_PATTY_RAW,
    productPhoto: IMG_PATTY_COOKED
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
    materialPhoto: IMG_TIKKA_RAW,
    productPhoto: IMG_TIKKA_COOKED
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
    materialPhoto: IMG_CHILLI_RAW,
    productPhoto: IMG_CHILLI_COOKED
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
    materialPhoto: IMG_BREAD_RAW,
    productPhoto: IMG_BREAD_COOKED
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
    materialPhoto: IMG_CHAAT_RAW,
    productPhoto: IMG_CHAAT_COOKED
  },
  { 
    id: 'PROD-011', 
    batchNumber: 'B-511', 
    productId: 'INV-FIN-011', 
    productName: 'Masala Dosa', 
    quantityProduced: 60, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-20', 
    status: 'Approved', 
    approvedDate: '2026-08-20',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 18,
    wastageQty: 1.5,
    efficiency: 91,
    materialPhoto: IMG_DOSA_RAW,
    productPhoto: IMG_DOSA_COOKED
  },
  { 
    id: 'PROD-012', 
    batchNumber: 'B-512', 
    productId: 'INV-FIN-012', 
    productName: 'Paneer Butter Masala', 
    quantityProduced: 30, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-21', 
    status: 'Approved', 
    approvedDate: '2026-08-21',
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Refined Oil & Spice Seasonings',
    materialConsumedQty: 14,
    wastageQty: 0.8,
    efficiency: 94,
    materialPhoto: IMG_PANEER_RAW,
    productPhoto: IMG_PANEER_COOKED
  },
  { 
    id: 'PROD-013', 
    batchNumber: 'B-513', 
    productId: 'INV-FIN-013', 
    productName: 'Veg Biryani Bowl', 
    quantityProduced: 50, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-22', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'Uncooked Noodle Strands',
    materialConsumedQty: 22,
    wastageQty: 1.8,
    efficiency: 91,
    materialPhoto: IMG_BIRYANI_RAW,
    productPhoto: IMG_BIRYANI_COOKED
  },
  { 
    id: 'PROD-014', 
    batchNumber: 'B-514', 
    productId: 'INV-FIN-014', 
    productName: 'Crispy Onion Pakoda', 
    quantityProduced: 80, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-23', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Raw Potatoes & Flour Dough',
    materialConsumedQty: 15,
    wastageQty: 1,
    efficiency: 93,
    materialPhoto: IMG_PAKODA_RAW,
    productPhoto: IMG_PAKODA_COOKED
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
