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

// Define how we want to replace things based on file or exact string.
// We will use regex replacements.
const replacements = [
  { rx: /zIndex:\s*2147483647/g, to: 'zIndex: 1000 /* tooltip */' },
  { rx: /z-\[2147483647\]/g, to: 'z-tooltip' },

  { rx: /zIndex:\s*9999999/g, to: 'zIndex: 900 /* toast */' },
  { rx: /z-\[9999999\]/g, to: 'z-toast' },

  { rx: /z-\[2000000\]/g, to: 'z-modal' },
  { rx: /z-\[1000010\]/g, to: 'z-modal' },
  { rx: /z-\[1000006\]/g, to: 'z-modal' },
  { rx: /z-\[1000005\]/g, to: 'z-modal' },

  { rx: /z-\[999999\]/g, to: 'z-modal' },
  { rx: /zIndex:\s*999999/g, to: 'zIndex: 700 /* modal */' },
  
  { rx: /zIndex:\s*999998/g, to: 'zIndex: 300 /* fixed */' }, // DockMenu

  { rx: /z-\[100005\]/g, to: 'z-hud' },
  { rx: /z-\[100002\]/g, to: 'z-hud' },
  { rx: /z-\[100001\]/g, to: 'z-hud' },
  
  { rx: /z-\[100000\]/g, to: 'z-modal' },
  { rx: /z-\[99999\]/g, to: 'z-hud' },

  { rx: /z-\[9999\]/g, to: 'z-fixed' },
  { rx: /zIndex:\s*9999/g, to: 'zIndex: 300 /* fixed */' },

  { rx: /zIndex:\s*1000/g, to: 'zIndex: 200 /* sticky */' },

  { rx: /z-\[999\]/g, to: 'z-popover' },

  { rx: /z-\[400\]/g, to: 'z-hud' },
  { rx: /z-\[300\]/g, to: 'z-hud' },
  { rx: /z-\[100\]/g, to: 'z-base' },

  { rx: /zIndex:\s*100/g, to: 'zIndex: 0 /* base */' },
  { rx: /zIndex:\s*20/g, to: 'zIndex: 0 /* base */' },
  
  { rx: /zIndex:\s*10/g, to: 'zIndex: 500 /* mascot */' },
  { rx: /z-\[10\]/g, to: 'z-base' },

  { rx: /z-\[5\]/g, to: 'z-base' },
  
  { rx: /zIndex:\s*3/g, to: 'zIndex: 500 /* mascot */' },
  { rx: /zIndex:\s*2/g, to: 'zIndex: 500 /* mascot */' },
  
  { rx: /z-\[2\]/g, to: 'z-base' },
  { rx: /z-\[1\]/g, to: 'z-base' },

  { rx: /zIndex:\s*1/g, to: 'zIndex: 0 /* base */' },
  { rx: /zIndex:\s*0/g, to: 'zIndex: 0 /* base */' },
];

let changedFilesCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const rep of replacements) {
    if (rep.rx.test(content)) {
      content = content.replace(rep.rx, rep.to);
      changed = true;
    }
  }

  // Also replace z-50, z-40, z-30, z-20, z-10 if they are used as modals or overlays, but let's be careful.
  // Many z-50 are used correctly for simple overlaps, but some like z-[999999] are the main target.
  // For safety, we replace the absurd ones mostly.

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file.replace(__dirname + '\\', '')}`);
    changedFilesCount++;
  }
}

console.log(`Refactored z-indexes in ${changedFilesCount} files.`);
