const fs = require('fs');

const w = fs.readFileSync('utils/workoutGenerator.ts', 'utf8');
const e = fs.readFileSync('utils/equipmentData.ts', 'utf8');

// extract equipments from workoutGenerator
const reqRegex = /requiredEquipment:\s*\[(.*?)\]/g;
let match;
const required = new Set();
while ((match = reqRegex.exec(w)) !== null) {
  const inner = match[1];
  const items = inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  items.forEach(i => required.add(i));
}

// extract equipments from equipmentData
const eqRegex = /'(.*?)':/g;
const available = new Set();
while ((match = eqRegex.exec(e)) !== null) {
  available.add(match[1]);
}

const missing = [...required].filter(req => !available.has(req));
console.log("MISSING:", missing);
