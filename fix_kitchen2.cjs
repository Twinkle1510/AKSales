const fs = require('fs');
let code = fs.readFileSync('src/views/KitchenEquipmentView.tsx', 'utf8');

// Fix 1: Add missing }; for handleAllocateSheets
code = code.replace(
  /setIsAllocationModalOpen\(false\);\s*const filtered =/m,
  "setIsAllocationModalOpen(false);\n  };\n\n  const filtered ="
);

// Fix 2: Add missing export at the end of the file
if (!code.includes('export default KitchenEquipmentView;')) {
  code = code.replace(
    /\s*\);\s*\};\s*$/m,
    "\n  );\n};\n\nexport default KitchenEquipmentView;\n"
  );
}

// Fix 3: Fix the broken table and replace kitchenEquipments with equipment
const badTableRegex = /<th>Last Inspected<\/th>[\s\S]*?<\/tbody>/m;

const goodTable = `<th>Last Inspected</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(eq => (
                <tr key={eq.id}>
                  <td>
                    <strong>{eq.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{eq.type}</div>
                  </td>
                  <td>{eq.assignedOperator || <span className="text-secondary">Unassigned</span>}</td>
                  <td>{eq.allocatedMaterialCode || <span className="text-secondary">-</span>}</td>
                  <td>
                    {eq.allocatedQtyKg > 0 ? (
                      <strong>{eq.allocatedQtyKg} KG</strong>
                    ) : '-'}
                  </td>
                  <td>{eq.actualOutputName || <span className="text-secondary">-</span>}</td>
                  <td>
                    {eq.actualOutputQty > 0 ? (
                      <span className="badge badge-success" style={{ fontSize: '12px', fontWeight: 700 }}>
                        {eq.actualOutputQty} {eq.outputUnit}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{eq.lastCleanedDate}</td>
                </tr>
              ))}
            </tbody>`;

code = code.replace(badTableRegex, goodTable);

fs.writeFileSync('src/views/KitchenEquipmentView.tsx', code);
console.log('Fixed KitchenEquipmentView.tsx perfectly');
