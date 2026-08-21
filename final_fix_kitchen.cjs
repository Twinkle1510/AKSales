const fs = require('fs');
let code = fs.readFileSync('src/views/KitchenEquipmentView.tsx', 'utf8');

// 1. Remove misplaced export default
code = code.replace(");\n};\n\nexport default KitchenEquipmentView;\n", ");\n};\n");
// And add it correctly at the EOF if not present
if (!code.trimEnd().endsWith('export default KitchenEquipmentView;')) {
  code = code.trimEnd() + '\n\nexport default KitchenEquipmentView;\n';
}

// 2. Define setStatus if not present
if (!code.includes('const setStatus =')) {
  const setStatusCode = `
  const setStatus = (id: string, newStatus: any) => {
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, status: newStatus } : eq));
  };
`;
  code = code.replace(
    /const handleAddEquipment = \(e: React.FormEvent\) => \{/,
    setStatusCode.trim() + "\n\n  const handleAddEquipment = (e: React.FormEvent) => {"
  );
}

// 3. Fix the table property names
code = code.replace(/eq\.assignedOperator/g, 'eq.assignedWorkerName');
code = code.replace(/eq\.allocatedMaterialCode/g, 'eq.allocatedMaterialName');

fs.writeFileSync('src/views/KitchenEquipmentView.tsx', code);
console.log('Final fixes applied successfully.');
