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
  
  // Find all form elements
  const tagRegex = /<(input|select|textarea)([^>]+)>/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    const attrs = match[2];
    
    // Skip hidden inputs
    if (/type=["']hidden["']/.test(attrs)) continue;

    // Check aria-label
    const hasAriaLabel = /aria-label=/.test(attrs);
    
    // Get id
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : null;

    // Check if there's an explicit label with htmlFor
    let hasMatchingLabel = false;
    if (id) {
      // Look for htmlFor="id"
      const labelRegex = new RegExp(`htmlFor=["']\\s*\\{?(?:\`|'|")?${id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`);
      // also check dynamic ids where the string matches the prefix... actually dynamic ids are hard
      // let's just check if htmlFor exists generally for this exact id, or if it has aria-label
      if (labelRegex.test(content) || content.includes(`htmlFor="${id}"`) || content.includes(`htmlFor={'${id}'}`)) {
        hasMatchingLabel = true;
      }
    }

    // Check if it's nested inside a label (very simple check: look for <label> immediately before)
    // This is imperfect but helps.
    const beforeContent = content.substring(0, match.index);
    const lastOpenLabel = beforeContent.lastIndexOf('<label');
    const lastCloseLabel = beforeContent.lastIndexOf('</label>');
    const isInsideLabel = lastOpenLabel > lastCloseLabel;

    if (!hasAriaLabel && !hasMatchingLabel && !isInsideLabel) {
      // It might be using a dynamic ID like id={`${item.id}-foo`}
      // Let's check if the ID contains a template literal
      if (id && id.includes('${')) {
        // Assume it has a matching label if there's ANY htmlFor with the same template string
        const templateStr = id.replace(/\$\{.*?\}/g, '.*');
        const dynamicRegex = new RegExp(`htmlFor={\`?${templateStr}\`?}`);
        if (dynamicRegex.test(content)) {
          hasMatchingLabel = true;
        }
      }
      
      if (!hasMatchingLabel) {
        results.push({
          file: file.replace(__dirname + '\\', ''),
          tag: match[0].substring(0, 100),
          id: id
        });
      }
    }
  }
}

console.log(JSON.stringify(results, null, 2));
console.log('Total violating elements:', results.length);
