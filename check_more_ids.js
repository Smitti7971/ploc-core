const fs = require('fs');
const path = require('path');

const targetFiles = [
  'apps/web/modules/calendar/components/views/TaskModal.tsx',
  'apps/web/modules/calendar/components/views/LogEditModal.tsx',
  'apps/web/components/mascot/PlocFace.tsx',
  'apps/web/components/mascot/PlocBubbles.tsx',
  'apps/web/components/mascot/PlocAvatar.tsx',
  'apps/web/components/mascot/PlocChatInput.tsx'
];

for (const fullPath of targetFiles) {
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const inputRegex = /<(input|textarea|select)([^>]*?)>/g;
    let match;
    while ((match = inputRegex.exec(content)) !== null) {
      const attrs = match[2];
      const idMatch = attrs.match(/id=["']([^"']+)["']/);
      const nameMatch = attrs.match(/name=["']([^"']+)["']/);
      if (!idMatch && !nameMatch) {
        console.log('NO ID/NAME in ' + fullPath + ': ' + match[0]);
      } else {
        const id = idMatch ? idMatch[1] : '';
        const hasLabel = content.includes('htmlFor="' + id + '"') || content.includes('htmlFor=\'' + id + '\'');
        const hasAriaLabel = attrs.includes('aria-label=');
        if (!hasLabel && !hasAriaLabel) {
          console.log('Missing label for ID/Name ' + (id || (nameMatch ? nameMatch[1] : '')) + ' in ' + fullPath);
        }
      }
    }
  }
}
