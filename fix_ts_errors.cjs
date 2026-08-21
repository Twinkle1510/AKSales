const fs = require('fs');

// 1. EmployeesView.tsx
let empCode = fs.readFileSync('src/views/EmployeesView.tsx', 'utf8');
empCode = empCode.replace('setExpandedWorkers(prev => ({', 'setExpandedWorkers((prev: Record<string, boolean>) => ({');
fs.writeFileSync('src/views/EmployeesView.tsx', empCode);
console.log('Fixed EmployeesView');

// 2. PayrollView.tsx
let payrollCode = fs.readFileSync('src/views/PayrollView.tsx', 'utf8');
payrollCode = payrollCode.replace('setPaymentStatusMap(prev => ({', 'setPaymentStatusMap((prev: Record<string, string>) => ({');
fs.writeFileSync('src/views/PayrollView.tsx', payrollCode);
console.log('Fixed PayrollView');

// 3. FlowReportView.tsx
let flowCode = fs.readFileSync('src/views/FlowReportView.tsx', 'utf8');
flowCode = flowCode.replace("import { Calendar, ArrowRight, Printer, CheckCircle } from 'lucide-react';", "import { Calendar, Printer, CheckCircle } from 'lucide-react';");
fs.writeFileSync('src/views/FlowReportView.tsx', flowCode);
console.log('Fixed FlowReportView');
