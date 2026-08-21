const fs = require('fs');
const s = fs.readFileSync('src/views/KitchenEquipmentView.tsx', 'utf8');
let open = 0;
let lines = s.split('\n');
for(let i = 0; i < lines.length; i++) {
  // naïve removal of string literals so they don't mess up bracket counting
  let clean = lines[i].replace(/'.*?'/g, '').replace(/".*?"/g, '').replace(/\/\/.*$/g, '');
  let op = (clean.match(/\{/g) || []).length;
  let cl = (clean.match(/\}/g) || []).length;
  open += op - cl;
  if (op !== cl) {
    console.log(i + 1, 'depth:', open, lines[i].trim());
  }
}
console.log('Final open count:', open);
