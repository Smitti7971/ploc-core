const fs = require('fs');
const path = require('path');

const replacements = [
  { old: "'@/components/mascot/StoreModal'", new: "'@/modules/store/components/StoreModal'" },
  { old: "'@/components/mascot/InventoryModal'", new: "'@/modules/inventory/components/InventoryModal'" },
  { old: "'./usePlocSpeech'", new: "'@/modules/chat/hooks/usePlocSpeech'" },
  { old: "'./usePlocChat'", new: "'@/modules/chat/hooks/usePlocChat'" },
  { old: "'./usePlocSpeechRecognition'", new: "'@/modules/chat/hooks/usePlocSpeechRecognition'" },
  { old: "'./PlocSimulationCard'", new: "'@/modules/blackboard/components/PlocSimulationCard'" },
  { old: "'./PlocChatOverlay'", new: "'@/modules/chat/components/PlocChatOverlay'" },
  { old: "'./InventoryModal'", new: "'@/modules/inventory/components/InventoryModal'" },
  { old: "'./StoreModal'", new: "'@/modules/store/components/StoreModal'" },
  { old: "'./PlocToast'", new: "'@/components/ui/PlocToast'" },
  { old: "'../../../components/mascot/usePlocSpeech'", new: "'@/modules/chat/hooks/usePlocSpeech'" },
  { old: "'./TypewriterText'", new: "'@/components/ui/TypewriterText'" },
  { old: "'./plocPhrases'", new: "'../constants/plocPhrases'" },
  { old: "'@/components/mascot/usePlocSpeech'", new: "'@/modules/chat/hooks/usePlocSpeech'" },
  { old: "'@/components/mascot/DynamicIcon'", new: "'@/components/ui/DynamicIcon'" },
  { old: "'./DynamicIcon'", new: "'@/components/ui/DynamicIcon'" }
];

const filesToFix = [
  'app/lab/page.tsx',
  'components/mascot/PlocAvatar.tsx',
  'components/mascot/PlocAvatarClient.tsx',
  'components/ui/TypewriterText.tsx',
  'modules/blackboard/components/BlackboardActiveConsumption.tsx',
  'modules/blackboard/components/BlackboardPage.tsx',
  'modules/chat/components/PlocSpeechBubble.tsx',
  'modules/chat/hooks/usePlocChat.ts',
  'modules/dashboard/components/libertesse/components/ViceBubble.tsx',
  'modules/lab/components/LabDatabaseList.tsx',
  'modules/lab/components/LabItemEditor.tsx',
  'modules/store/components/StoreModal.tsx'
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    for (const r of replacements) {
      if (content.includes(r.old)) {
        content = content.replaceAll(r.old, r.new);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Fixed', file);
    }
  } else {
    console.log('Not found:', file);
  }
}
