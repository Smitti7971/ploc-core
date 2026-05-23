/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/smitt/OneDrive/Área de Trabalho/ploc/apps/web/components/mascot';

const files = {
  'PlocActionMenu.tsx': 'Menu de ações rápidas (ex: brincar, acariciar, etc) do mascote Ploc.',
  'PlocBubbles.tsx': 'Efeito visual decorativo de bolhas flutuantes no fundo ou entorno do mascote.',
  'PlocFace.tsx': 'Renderiza o rosto do mascote (olhos, boca) e anima expressões faciais e piscadas.',
  'PlocLimbs.tsx': 'Renderiza os braços e pernas reativos do mascote Ploc.',
  'PlocSimulationCard.tsx': 'Painel de controle/simulação usado para testar estados e comportamentos do Ploc durante o desenvolvimento.',
  'TypewriterText.tsx': 'Componente auxiliar que cria um efeito de máquina de escrever para a revelação de textos.',
  'achievements.ts': 'Dados, lógicas e condições para o sistema de conquistas (achievements) do mascote.',
  'types.ts': 'Definições de interfaces e tipos TypeScript utilizados por todo o módulo do mascote.',
  'usePlocChat.ts': 'Hook para gerenciar o estado da conversa e o fluxo de mensagens entre o usuário e o Ploc.',
  'usePlocSpeech.ts': 'Hook que dita o que o Ploc vai falar baseado no contexto atual (fala automática e reações).',
  'usePlocState.ts': 'Hook que gerencia o estado físico e emocional do mascote (energia, felicidade, níveis de irritação).'
};

for (const [filename, description] of Object.entries(files)) {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove as descrições em barra dupla (//) do início para evitar duplicação (se for a primeira linha)
    let lines = content.split('\n');
    while(lines.length > 0 && lines[0].trim().startsWith('//')) {
      lines.shift();
    }
    content = lines.join('\n');

    if (!content.trim().startsWith('/**')) {
      const comment = `/**\n * @module ${filename.replace(/\.tsx?$/, '')}\n * @description ${description}\n */\n\n`;
      fs.writeFileSync(filePath, comment + content.trimStart());
      console.log('Forced comment update on ' + filename);
    }
  }
}
