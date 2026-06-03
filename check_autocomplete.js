const fs = require('fs');
const path = require('path');

const autofillKeywords = ['name', 'email', 'password', 'search', 'username', 'tel', 'phone', 'address', 'city', 'zip', 'country', 'title', 'desc', 'time', 'goal', 'limit', 'cost'];

function checkFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        checkFiles(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const inputRegex = /<input([^>]*?)>/g;
      let match;
      while ((match = inputRegex.exec(content)) !== null) {
        const attrs = match[1];
        if (!attrs.includes('autoComplete')) {
          const idMatch = attrs.match(/id=["']([^"']+)["']/);
          const nameMatch = attrs.match(/name=["']([^"']+)["']/);
          
          const id = idMatch ? idMatch[1].toLowerCase() : '';
          const name = nameMatch ? nameMatch[1].toLowerCase() : '';
          
          if (autofillKeywords.some(k => id.includes(k) || name.includes(k))) {
            console.log(`Missing autocomplete in ${fullPath}: id="${id}" name="${name}"`);
          }
        }
      }
    }
  }
}
checkFiles('apps/web/modules/dashboard');
checkFiles('apps/web/app/settings');
checkFiles('apps/web/components');
