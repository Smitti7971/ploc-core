const fs = require('fs');
const path = require('path');

const targetFiles = [
  'apps/web/modules/dashboard/components/tracker/components/TrackerOverlay.tsx',
  'apps/web/components/mascot/PlocChatInput.tsx',
  'apps/web/modules/dashboard/components/libertesse/components/ViceBubble.tsx',
  'apps/web/modules/dashboard/components/DashboardPage.tsx'
];

for (const fullPath of targetFiles) {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const inputRegex = /<(input|textarea|select)([^>]*?)>/g;
  let match;
  while ((match = inputRegex.exec(content)) !== null) {
    const attrs = match[2];
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    if (idMatch) {
      const id = idMatch[1];
      console.log('Found ID: ' + id + ' in ' + path.basename(fullPath));
    } else {
      console.log('NO ID: ' + match[0] + ' in ' + path.basename(fullPath));
    }
  }
}
