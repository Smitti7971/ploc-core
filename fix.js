const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { getAssetUrl }')) {
    if (content.includes("import { apiService } from '@/services/api';")) {
      content = content.replace("import { apiService } from '@/services/api';", "import { apiService } from '@/services/api';\nimport { getAssetUrl } from '@/lib/config';");
    } else {
      content = content.replace(/(import .*?;)/, "$1\nimport { getAssetUrl } from '@/lib/config';");
    }
  }

  content = content.replace(/url\(\$\{([^}]+)\}\)/g, (match, p1) => {
    if (p1.startsWith('getAssetUrl(')) return match;
    return `url(\${getAssetUrl(${p1})})`;
  });
  
  fs.writeFileSync(file, content);
}

processFile('apps/web/modules/dashboard/components/tracker/components/TrackerOverlay.tsx');
processFile('apps/web/modules/dashboard/components/tracker/components/TrackerStatusCard.tsx');
