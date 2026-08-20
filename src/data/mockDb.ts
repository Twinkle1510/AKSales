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

// Kitchen Equipment Interface
export interface KitchenEquipment {
  id: string;
  name: string;
  type: 'Fryer' | 'Steamer' | 'Wok' | 'Oven' | 'Griddle';
  status: 'Active Cooking' | 'Idle' | 'Under Maintenance';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  allocatedMaterialName: string;
  allocatedQtyKg: number; // Raw sheets/ingredients allocated in KG
  actualOutputName: string;
  actualOutputQty: number; // Plates/pcs produced
  outputUnit: 'pcs' | 'plates' | 'packs';
  temperatureSettings?: string;
  lastCleanedDate: string;
  photo?: string;
}

// Kitchen Staff setup
const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 'EMP-001', 
    name: 'Arjun Kumar', 
    role: 'Admin', 
    department: 'Fabrication Administration', 
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
    department: 'Floor Management', 
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
    department: 'Sheet Metal Cutting', 
    status: 'Active', 
    baseRate: 50, 
    phone: '+91 87654 32109', 
    email: 'sunita@aksales.com', 
    joinedDate: '2025-04-01',
    employeeCode: 'AK-003',
    address: 'Bapunagar Labor Colony, Block B, Ahmedabad',
    payrollModel: 'Per Piece',
    incentiveRate: 5
  },
  { 
    id: 'EMP-004', 
    name: 'Amit Verma', 
    role: 'Worker', 
    department: 'Welding & Finishing', 
    status: 'Active', 
    baseRate: 120, 
    phone: '+91 76543 21098', 
    email: 'amit@aksales.com', 
    joinedDate: '2025-05-12',
    employeeCode: 'AK-004',
    address: 'Naroda GIDC Quarter 105, Ahmedabad',
    payrollModel: 'Fixed + Incentive',
    fixedSalaryAmount: 15000,
    incentiveRate: 20
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
    department: 'Bending & Assembling', 
    status: 'Active', 
    baseRate: 80, 
    phone: '+91 90123 45678', 
    email: 'vikram@aksales.com', 
    joinedDate: '2025-06-01',
    employeeCode: 'AK-006',
    address: 'Odhav GIDC block 12, Ahmedabad',
    payrollModel: 'Per Piece',
    incentiveRate: 80
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-RAW-001', name: 'Stainless Steel Sheets (SS 304 / 18-Gauge)', type: 'Raw Material', quantity: 1450, unit: 'kg', minThreshold: 300, lastUpdated: '2026-08-18', materialCode: 'RAW-SS304-18G', batchNumber: 'SS-101', storageLocation: 'Bay A Sheet Rack' },
  { id: 'INV-RAW-002', name: 'Stainless Steel Sheets (SS 202 / 20-Gauge)', type: 'Raw Material', quantity: 980, unit: 'kg', minThreshold: 200, lastUpdated: '2026-08-19', materialCode: 'RAW-SS202-20G', batchNumber: 'SS-202', storageLocation: 'Bay B Sheet Rack' },
  { id: 'INV-RAW-003', name: 'SS Square Tubes & Angled Pipes', type: 'Raw Material', quantity: 640, unit: 'kg', minThreshold: 150, lastUpdated: '2026-08-19', materialCode: 'RAW-SS-PIPES', batchNumber: 'PP-303', storageLocation: 'Pipe Yard Slot 3' },
  { id: 'INV-RAW-004', name: 'Welding Rods & Grinding Discs', type: 'Raw Material', quantity: 180, unit: 'packs', minThreshold: 40, lastUpdated: '2026-08-15', materialCode: 'RAW-WELD- rods', batchNumber: 'WL-404', storageLocation: 'Tool Room Cabinet C' },
  
  // 14 Unique Fabricated Steel Kitchen Equipment Goods
  { id: 'INV-FIN-001', name: 'Stainless Steel Work Table (with Under-shelf)', type: 'Finished Good', quantity: 45, unit: 'pcs', minThreshold: 10, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-TABLE-U', storageLocation: 'Loading Dock A' },
  { id: 'INV-FIN-002', name: 'SS Compartment Tray (Dining Plates)', type: 'Finished Good', quantity: 800, unit: 'pcs', minThreshold: 150, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-PLATES', storageLocation: 'Small Parts Warehouse' },
  { id: 'INV-FIN-003', name: 'Fabricated Storage Rack (4-Tier)', type: 'Finished Good', quantity: 30, unit: 'pcs', minThreshold: 5, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-RACK-4T', storageLocation: 'Loading Dock B' },
  { id: 'INV-FIN-004', name: 'Commercial Double Sink Unit', type: 'Finished Good', quantity: 20, unit: 'pcs', minThreshold: 4, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-SINK-DBL', storageLocation: 'Warehouse Deck C' },
  { id: 'INV-FIN-005', name: 'Stainless Steel Exhaust Hood', type: 'Finished Good', quantity: 15, unit: 'pcs', minThreshold: 3, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-HOOD', storageLocation: 'Finished Assembly Section' },
  { id: 'INV-FIN-006', name: 'Mobile Kitchen Trolley (3-Tier)', type: 'Finished Good', quantity: 35, unit: 'pcs', minThreshold: 8, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-TROLLEY', storageLocation: 'Loading Dock B' },
  { id: 'INV-FIN-007', name: 'SS Preparation Table (with Splashback)', type: 'Finished Good', quantity: 25, unit: 'pcs', minThreshold: 6, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-TABLE-SP', storageLocation: 'Loading Dock A' },
  { id: 'INV-FIN-008', name: 'SS GN Pan (Gastronorm Container)', type: 'Finished Good', quantity: 340, unit: 'pcs', minThreshold: 50, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-GNPAN', storageLocation: 'Small Parts Warehouse' },
  { id: 'INV-FIN-009', name: 'SS Dishwashing Table', type: 'Finished Good', quantity: 12, unit: 'pcs', minThreshold: 3, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-DISH-TAB', storageLocation: 'Warehouse Deck C' },
  { id: 'INV-FIN-010', name: 'SS Bain Marie Counter', type: 'Finished Good', quantity: 8, unit: 'pcs', minThreshold: 2, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-BAIN-MARIE', storageLocation: 'Heavy Equipment Area' },
  { id: 'INV-FIN-011', name: 'SS Storage Cabinet (with Sliding Doors)', type: 'Finished Good', quantity: 14, unit: 'pcs', minThreshold: 3, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-CABINET', storageLocation: 'Finished Assembly Section' },
  { id: 'INV-FIN-012', name: 'SS Wall Mounted Shelf', type: 'Finished Good', quantity: 55, unit: 'pcs', minThreshold: 12, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-WALL-SHELF', storageLocation: 'Loading Dock A' },
  { id: 'INV-FIN-013', name: 'SS Masala Box Utility Rack', type: 'Finished Good', quantity: 120, unit: 'pcs', minThreshold: 20, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-MASALA-RCK', storageLocation: 'Small Parts Warehouse' },
  { id: 'INV-FIN-014', name: 'Industrial Griddle Plate Base', type: 'Finished Good', quantity: 18, unit: 'pcs', minThreshold: 4, lastUpdated: '2026-08-19', materialCode: 'FIN-SS-GRIDDLE-BASE', storageLocation: 'Heavy Equipment Area' }
];

// REAL High-Definition Steel Fabrication Photography URLs from public folder
const IMG_SS_SHEET_304 = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_TABLE_FINISHED = '/work_table.png?v=3'; // Commercial kitchen stainless steel table you uploaded
const IMG_PREP_TABLE_FINISHED = '/prep_table.png?v=4'; // Prep table with splashback you uploaded

const IMG_SS_PLATES_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_PLATES_FINISHED = '/work_table.png?v=3'; // Fallback to work table

const IMG_PIPES_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_RACK_FINISHED = '/work_table.png?v=3'; // Fallback to work table

const IMG_SINK_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_SINK_FINISHED = '/work_table.png?v=3'; // Fallback to work table

const IMG_WELDING_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_HOOD_FINISHED = '/exhaust_hood.png?v=4'; // Commercial kitchen exhaust hood you uploaded

const IMG_TROLLEY_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_TROLLEY_FINISHED = '/work_table.png?v=3'; // Fallback to work table

const IMG_GNPAN_RAW = '/single_sheet.png?v=3'; // Single diagonal brushed steel sheet you uploaded
const IMG_GNPAN_FINISHED = '/work_table.png?v=3';

// Initial Kitchen Equipment Data (4 active fabrication machines / shear brakes)
const INITIAL_EQUIPMENT: KitchenEquipment[] = [
  {
    id: 'EQ-001',
    name: 'Hydraulic Shear Cutting Station',
    type: 'Fryer', // Kept type structure to avoid compilation issues, renamed UI name
    status: 'Active Cooking',
    assignedWorkerId: 'EMP-003',
    assignedWorkerName: 'Sunita Patel',
    allocatedMaterialName: 'SS 304 Sheet Metal (KG)',
    allocatedQtyKg: 120,
    actualOutputName: 'Stainless Steel Work Table',
    actualOutputQty: 8,
    outputUnit: 'pcs',
    temperatureSettings: 'Pressure: 200 Bar',
    lastCleanedDate: '2026-08-18',
    photo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'EQ-002',
    name: 'Press Brake Bending Deck',
    type: 'Steamer',
    status: 'Active Cooking',
    assignedWorkerId: 'EMP-006',
    assignedWorkerName: 'Vikram Singh',
    allocatedMaterialName: 'SS 202 Sheet Metal (KG)',
    allocatedQtyKg: 90,
    actualOutputName: 'Fabricated Storage Rack (4-Tier)',
    actualOutputQty: 6,
    outputUnit: 'pcs',
    temperatureSettings: 'Angle Set: 90 Deg',
    lastCleanedDate: '2026-08-19',
    photo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'EQ-003',
    name: 'Heavy Duty Welding Bay C',
    type: 'Wok',
    status: 'Idle',
    assignedWorkerId: 'EMP-004',
    assignedWorkerName: 'Amit Verma',
    allocatedMaterialName: 'SS Square Tubes & Rods (KG)',
    allocatedQtyKg: 50,
    actualOutputName: 'Commercial Double Sink Unit',
    actualOutputQty: 4,
    outputUnit: 'pcs',
    temperatureSettings: 'Welding Amp: 140A',
    lastCleanedDate: '2026-08-19',
    photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'EQ-004',
    name: 'TIG Welding & Buffing Station',
    type: 'Oven',
    status: 'Active Cooking',
    assignedWorkerId: 'EMP-004',
    assignedWorkerName: 'Amit Verma',
    allocatedMaterialName: 'SS 304 Sheets (KG)',
    allocatedQtyKg: 75,
    actualOutputName: 'Stainless Steel Exhaust Hood',
    actualOutputQty: 3,
    outputUnit: 'pcs',
    temperatureSettings: 'Argon Flow: 10L/m',
    lastCleanedDate: '2026-08-19',
    photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80'
  }
];

// Chronological Material Issues Feed (14 unique records)
const INITIAL_ISSUES: MaterialIssue[] = [
  { id: 'ISS-001', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 150, date: '2026-08-10', remarks: 'Work Table Top Cutting', photo: IMG_SS_SHEET_304 },
  { id: 'ISS-002', materialId: 'INV-RAW-002', materialName: 'Stainless Steel Sheets (SS 202)', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 110, date: '2026-08-11', remarks: '4-Tier Rack bend lines', photo: IMG_SS_PLATES_RAW },
  { id: 'ISS-003', materialId: 'INV-RAW-003', materialName: 'SS Square Tubes & Angled Pipes', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 90, date: '2026-08-12', remarks: 'Frame structure welding', photo: IMG_PIPES_RAW },
  { id: 'ISS-004', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 120, date: '2026-08-13', remarks: 'Double Sink Bowl pressing', photo: IMG_SINK_RAW },
  { id: 'ISS-005', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 80, date: '2026-08-14', remarks: 'Exhaust Hood bend templates', photo: IMG_WELDING_RAW },
  { id: 'ISS-006', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 100, date: '2026-08-15', remarks: 'Mobile Trolley frame sheets', photo: IMG_TROLLEY_RAW },
  { id: 'ISS-007', materialId: 'INV-RAW-004', materialName: 'Welding Rods & Grinding Discs', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 8, date: '2026-08-16', remarks: 'Preparation table welding', photo: IMG_WELDING_RAW },
  { id: 'ISS-008', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 65, date: '2026-08-17', remarks: 'GN Pans stamping sheets', photo: IMG_GNPAN_RAW },
  { id: 'ISS-009', materialId: 'INV-RAW-004', materialName: 'Welding Rods & Grinding Discs', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 10, date: '2026-08-18', remarks: 'Dishwashing Table assembly', photo: IMG_WELDING_RAW },
  { id: 'ISS-010', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 220, date: '2026-08-19', remarks: 'Heavy Bain Marie fabrication', photo: IMG_SS_SHEET_304 },
  { id: 'ISS-011', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-003', issuedToName: 'Sunita Patel', quantity: 130, date: '2026-08-20', remarks: 'Storage Cabinets panels', photo: IMG_SS_SHEET_304 },
  { id: 'ISS-012', materialId: 'INV-RAW-004', materialName: 'Welding Rods & Grinding Discs', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 12, date: '2026-08-21', remarks: 'Wall Shelves welds', photo: IMG_WELDING_RAW },
  { id: 'ISS-013', materialId: 'INV-RAW-003', materialName: 'SS Square Tubes & Angled Pipes', issuedToId: 'EMP-006', issuedToName: 'Vikram Singh', quantity: 70, date: '2026-08-22', remarks: 'Utility Rack weld frames', photo: IMG_PIPES_RAW },
  { id: 'ISS-014', materialId: 'INV-RAW-001', materialName: 'Stainless Steel Sheets (SS 304)', issuedToId: 'EMP-004', issuedToName: 'Amit Verma', quantity: 140, date: '2026-08-23', remarks: 'Griddle plate sheet bending', photo: IMG_SS_SHEET_304 }
];

// Chronological Production Output Logs (14 completely unique fabricated kitchen products!)
const INITIAL_PRODUCTION: ProductionLog[] = [
  { 
    id: 'PROD-001', 
    batchNumber: 'B-501', 
    productId: 'INV-FIN-001', 
    productName: 'Stainless Steel Work Table (with Under-shelf)', 
    quantityProduced: 8, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-10', 
    status: 'Approved', 
    approvedDate: '2026-08-10',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 150,
    wastageQty: 15, 
    efficiency: 90,
    materialPhoto: IMG_SS_SHEET_304,
    productPhoto: IMG_TABLE_FINISHED
  },
  { 
    id: 'PROD-002', 
    batchNumber: 'B-502', 
    productId: 'INV-FIN-002', 
    productName: 'SS Compartment Tray (Dining Plates)', 
    quantityProduced: 120, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-11', 
    status: 'Approved',
    approvedDate: '2026-08-11',
    materialConsumedId: 'INV-RAW-002',
    materialConsumedName: 'Stainless Steel Sheets (SS 202)',
    materialConsumedQty: 110,
    wastageQty: 11,
    efficiency: 90,
    materialPhoto: IMG_SS_PLATES_RAW,
    productPhoto: IMG_PLATES_FINISHED
  },
  { 
    id: 'PROD-003', 
    batchNumber: 'B-503', 
    productId: 'INV-FIN-003', 
    productName: 'Fabricated Storage Rack (4-Tier)', 
    quantityProduced: 6, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-12', 
    status: 'Approved', 
    approvedDate: '2026-08-12',
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'SS Square Tubes & Angled Pipes',
    materialConsumedQty: 90,
    wastageQty: 9,
    efficiency: 90,
    materialPhoto: IMG_PIPES_RAW,
    productPhoto: IMG_RACK_FINISHED
  },
  { 
    id: 'PROD-004', 
    batchNumber: 'B-504', 
    productId: 'INV-FIN-004', 
    productName: 'Commercial Double Sink Unit', 
    quantityProduced: 4, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-13', 
    status: 'Approved', 
    approvedDate: '2026-08-13',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 120,
    wastageQty: 12,
    efficiency: 90,
    materialPhoto: IMG_SINK_RAW,
    productPhoto: IMG_SINK_FINISHED
  },
  { 
    id: 'PROD-005', 
    batchNumber: 'B-505', 
    productId: 'INV-FIN-005', 
    productName: 'Stainless Steel Exhaust Hood', 
    quantityProduced: 3, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-14', 
    status: 'Approved', 
    approvedDate: '2026-08-14',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 80,
    wastageQty: 8,
    efficiency: 90,
    materialPhoto: IMG_SS_SHEET_304,
    productPhoto: IMG_HOOD_FINISHED
  },
  { 
    id: 'PROD-006', 
    batchNumber: 'B-506', 
    productId: 'INV-FIN-006', 
    productName: 'Mobile Kitchen Trolley (3-Tier)', 
    quantityProduced: 5, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-15', 
    status: 'Approved', 
    approvedDate: '2026-08-15',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 100,
    wastageQty: 15,
    efficiency: 85,
    materialPhoto: IMG_TROLLEY_RAW,
    productPhoto: IMG_TROLLEY_FINISHED
  },
  { 
    id: 'PROD-007', 
    batchNumber: 'B-507', 
    productId: 'INV-FIN-007', 
    productName: 'SS Preparation Table (with Splashback)', 
    quantityProduced: 4, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-16', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Welding Rods & Grinding Discs',
    materialConsumedQty: 8,
    wastageQty: 0.8,
    efficiency: 90,
    materialPhoto: IMG_WELDING_RAW,
    productPhoto: IMG_PREP_TABLE_FINISHED
  },
  { 
    id: 'PROD-008', 
    batchNumber: 'B-508', 
    productId: 'INV-FIN-008', 
    productName: 'SS GN Pan (Gastronorm Container)', 
    quantityProduced: 50, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-17', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 65,
    wastageQty: 6,
    efficiency: 90,
    materialPhoto: IMG_GNPAN_RAW,
    productPhoto: IMG_GNPAN_FINISHED
  },
  { 
    id: 'PROD-009', 
    batchNumber: 'B-509', 
    productId: 'INV-FIN-009', 
    productName: 'SS Dishwashing Table', 
    quantityProduced: 2, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-18', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Welding Rods & Grinding Discs',
    materialConsumedQty: 10,
    wastageQty: 1,
    efficiency: 90,
    materialPhoto: IMG_WELDING_RAW,
    productPhoto: IMG_TABLE_FINISHED
  },
  { 
    id: 'PROD-010', 
    batchNumber: 'B-510', 
    productId: 'INV-FIN-010', 
    productName: 'SS Bain Marie Counter', 
    quantityProduced: 2, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-19', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 220,
    wastageQty: 20,
    efficiency: 90,
    materialPhoto: IMG_SS_SHEET_304,
    productPhoto: IMG_TABLE_FINISHED
  },
  { 
    id: 'PROD-011', 
    batchNumber: 'B-511', 
    productId: 'INV-FIN-011', 
    productName: 'SS Storage Cabinet (with Sliding Doors)', 
    quantityProduced: 3, 
    workerId: 'EMP-003', 
    workerName: 'Sunita Patel', 
    date: '2026-08-20', 
    status: 'Approved', 
    approvedDate: '2026-08-20',
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 130,
    wastageQty: 10,
    efficiency: 92,
    materialPhoto: IMG_SS_SHEET_304,
    productPhoto: IMG_TABLE_FINISHED
  },
  { 
    id: 'PROD-012', 
    batchNumber: 'B-512', 
    productId: 'INV-FIN-012', 
    productName: 'SS Wall Mounted Shelf', 
    quantityProduced: 15, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-21', 
    status: 'Approved', 
    approvedDate: '2026-08-21',
    materialConsumedId: 'INV-RAW-004',
    materialConsumedName: 'Welding Rods & Grinding Discs',
    materialConsumedQty: 12,
    wastageQty: 1,
    efficiency: 91,
    materialPhoto: IMG_WELDING_RAW,
    productPhoto: IMG_TABLE_FINISHED
  },
  { 
    id: 'PROD-013', 
    batchNumber: 'B-513', 
    productId: 'INV-FIN-013', 
    productName: 'SS Masala Box Utility Rack', 
    quantityProduced: 20, 
    workerId: 'EMP-006', 
    workerName: 'Vikram Singh', 
    date: '2026-08-22', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-003',
    materialConsumedName: 'SS Square Tubes & Angled Pipes',
    materialConsumedQty: 70,
    wastageQty: 7,
    efficiency: 90,
    materialPhoto: IMG_PIPES_RAW,
    productPhoto: IMG_RACK_FINISHED
  },
  { 
    id: 'PROD-014', 
    batchNumber: 'B-514', 
    productId: 'INV-FIN-014', 
    productName: 'Industrial Griddle Plate Base', 
    quantityProduced: 4, 
    workerId: 'EMP-004', 
    workerName: 'Amit Verma', 
    date: '2026-08-23', 
    status: 'Pending Approval', 
    materialConsumedId: 'INV-RAW-001',
    materialConsumedName: 'Stainless Steel Sheets (SS 304)',
    materialConsumedQty: 140,
    wastageQty: 14,
    efficiency: 90,
    materialPhoto: IMG_SS_SHEET_304,
    productPhoto: IMG_TABLE_FINISHED
  }
];

// Helper to initialize and retrieve from localStorage
const getFromStorage = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(`aksales_v8_${key}`);
  if (!data) {
    localStorage.setItem(`aksales_v8_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(`aksales_v8_${key}`, JSON.stringify(value));
};

export const getEmployees = (): Employee[] => getFromStorage('employees', INITIAL_EMPLOYEES);
export const saveEmployees = (employees: Employee[]) => setToStorage('employees', employees);

export const getInventory = (): InventoryItem[] => getFromStorage('inventory', INITIAL_INVENTORY);
export const saveInventory = (inventory: InventoryItem[]) => setToStorage('inventory', inventory);

export const getMaterialIssues = (): MaterialIssue[] => getFromStorage('issues', INITIAL_ISSUES);
export const saveMaterialIssues = (issues: MaterialIssue[]) => setToStorage('issues', issues);

export const getProductionLogs = (): ProductionLog[] => getFromStorage('production', INITIAL_PRODUCTION);
export const saveProductionLogs = (production: ProductionLog[]) => setToStorage('production', production);

export const getEquipment = (): KitchenEquipment[] => getFromStorage('equipment', INITIAL_EQUIPMENT);
export const saveEquipment = (equipment: KitchenEquipment[]) => setToStorage('equipment', equipment);

export const resetDb = () => {
  localStorage.removeItem('aksales_v8_employees');
  localStorage.removeItem('aksales_v8_inventory');
  localStorage.removeItem('aksales_v8_issues');
  localStorage.removeItem('aksales_v8_production');
  localStorage.removeItem('aksales_v8_equipment');
  window.location.reload();
};
