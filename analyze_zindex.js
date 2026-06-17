const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/web');

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        getFiles(fullPath, filesList);
      }
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);
const results = [];

const zIndexRegex = /(zIndex:\s*-?\d+)|(z-index:\s*-?\d+)|(\bz-\[?-?\d+\]?\b)|(\bz-(auto|0|10|20|30|40|50)\b)/g;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = zIndexRegex.exec(line)) !== null) {
      results.push({
        file: file.replace(__dirname + '\\', '').replace(__dirname + '/', ''),
        line: i + 1,
        match: match[0],
        content: line.trim().substring(0, 100)
      });
    }
  }
}

// Group by z-index value
const grouped = {};
for (const r of results) {
  let val = r.match;
  if (!grouped[val]) grouped[val] = [];
  grouped[val].push(r);
}

// Sort by z-index numeric value if possible
function extractNumber(str) {
  const num = str.match(/-?\d+/);
  return num ? parseInt(num[0], 10) : 0;
}

const sortedKeys = Object.keys(grouped).sort((a, b) => extractNumber(b) - extractNumber(a));

let output = '# Z-Index Analysis\n\n';
for (const key of sortedKeys) {
  output += `## ${key} (${grouped[key].length} occurrences)\n`;
  const uniqueFiles = new Set(grouped[key].map(x => x.file));
  for (const file of uniqueFiles) {
    output += `- ${file}\n`;
  }
  output += '\n';
}

fs.writeFileSync(path.join(__dirname, 'z-index-report.md'), output, 'utf8');
console.log('Analysis complete. Found', results.length, 'occurrences.');
