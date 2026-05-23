/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/smitt/OneDrive/Área de Trabalho/ploc/apps/web/components/mascot';

const files = {
  'PlocAchievementToast.tsx': 'Componente para exibir notificações (toasts) de conquistas do Ploc.',
  'PlocActionMenu.tsx': 'Menu de ações rápidas (ex: brincar, acariciar, etc) do mascote Ploc.',
  'PlocAvatarClient.tsx': 'Wrapper client-side para o PlocAvatar, garantindo que ele seja renderizado apenas no navegador (Next.js SSR).',
  'PlocBubbles.tsx': 'Efeito visual decorativo de bolhas flutuantes no fundo ou entorno do mascote.',
  'PlocChatOverlay.tsx': 'Overlay principal do chat, agregando controles, input e balões de fala do mascote.',
  'PlocCosmetics.tsx': 'Componentes visuais de customização do Ploc: roupas, chapéus, cabelos e auras.',
  'PlocFace.tsx': 'Renderiza o rosto do mascote (olhos, boca) e anima expressões faciais e piscadas.',
  'PlocHumorBar.tsx': 'Barra de humor/status visível que exibe os níveis das necessidades do Ploc.',
  'PlocLimbs.tsx': 'Renderiza os braços e pernas reativos do mascote Ploc.',
  'PlocShockwaveRings.tsx': 'Efeito visual de ondas de choque (anéis) emitidos pelo mascote em certas interações.',
  'PlocSimulationCard.tsx': 'Painel de controle/simulação usado para testar estados e comportamentos do Ploc durante o desenvolvimento.',
  'PlocSleepParticles.tsx': 'Efeito visual de partículas "Zzz" que sobem enquanto o mascote está dormindo.',
  'TypewriterText.tsx': 'Componente auxiliar que cria um efeito de máquina de escrever para a revelação de textos.',
  'achievements.ts': 'Dados, lógicas e condições para o sistema de conquistas (achievements) do mascote.',
  'plocPhrases.ts': 'Banco de falas, frases e resmungos do Ploc para diferentes situações e sentimentos.',
  'types.ts': 'Definições de interfaces e tipos TypeScript utilizados por todo o módulo do mascote.',
  'usePlocChat.ts': 'Hook para gerenciar o estado da conversa e o fluxo de mensagens entre o usuário e o Ploc.',
  'usePlocSpeech.ts': 'Hook que dita o que o Ploc vai falar baseado no contexto atual (fala automática e reações).',
  'usePlocState.ts': 'Hook que gerencia o estado físico e emocional do mascote (energia, felicidade, níveis de irritação).'
};

for (const [filename, description] of Object.entries(files)) {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim().startsWith('/**') && !content.trim().startsWith('//')) {
      const comment = `/**\n * @module ${filename.replace(/\.tsx?$/, '')}\n * @description ${description}\n */\n\n`;
      fs.writeFileSync(filePath, comment + content);
      console.log('Added comment to ' + filename);
    } else {
      console.log('Skipped (already has comment): ' + filename);
    }
  }
}
