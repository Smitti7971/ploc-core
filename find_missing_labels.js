const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        searchFiles(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const inputRegex = /<(input|textarea|select)([^>]*?)>/g;
      let match;
      while ((match = inputRegex.exec(content)) !== null) {
        const attrs = match[2];
        const idMatch = attrs.match(/id=["']([^"']+)["']/);
        if (idMatch) {
          const id = idMatch[1];
          const hasLabel = content.includes('htmlFor="' + id + '"') || content.includes('htmlFor=\'' + id + '\'');
          const hasAriaLabel = attrs.includes('aria-label=');
          // Some inputs are wrapped in label but let's just check htmlFor or aria-label first
          if (!hasLabel && !hasAriaLabel) {
            console.log('Missing label for ID ' + id + ' in ' + fullPath);
          }
        }
      }
    }
  }
}
searchFiles('apps/web/modules');
searchFiles('apps/web/components');
searchFiles('apps/web/app');
