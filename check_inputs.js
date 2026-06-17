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
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);
const results = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Match <input, <select, <textarea tags
  const tagRegex = /<(input|select|textarea)([^>]+)>/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    const attrs = match[2];
    const hasId = /id=/.test(attrs);
    const hasName = /name=/.test(attrs);
    const isHidden = /type=["']hidden["']/.test(attrs);
    
    if ((!hasId || !hasName) && !isHidden) {
      results.push({
        file: file.replace(__dirname + '\\', ''),
        tag: match[0].substring(0, 100),
      });
    }
  }
}

console.log(JSON.stringify(results, null, 2));
console.log('Total violating elements:', results.length);
