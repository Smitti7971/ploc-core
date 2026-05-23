'use client'; // Define o componente como Client Component no Next.js

// Bloco de imports do React
import React, { useState, useEffect } from 'react'; // Importa hooks do React

// Bloco de imports de componentes do sistema
import { AuthCapsule } from '@/modules/auth/components/AuthCapsule'; // Importa cápsula de autenticação
import {
  LandingStageOrchestrator,
  ExitGameButton,
  AmbientGlowBackground,
  Vignette,
  SodaWave
} from '@/modules/landing'; // Importa componentes da landing page

// Componente principal da página de Landing (não autenticado)
export default function LandingClient() {
  // Define o estado de montagem para evitar erros de hidratação (hydration mismatch)
  const [isMounted, setIsMounted] = useState(false); // isMounted inicia como falso

  // Hook de efeito que executa apenas uma vez no cliente após o carregamento inicial
  useEffect(() => {
    setIsMounted(true); // Atualiza isMounted para verdadeiro após a montagem do componente
  }, []); // Array de dependências vazio garante que rode apenas no mount

  // Se o componente ainda não foi montado no cliente, não renderiza nada
  if (!isMounted) return null; // Retorna nulo bloqueando a renderização no servidor

  // Retorna a estrutura principal da página de Landing
  return (
    <main className="h-full w-full max-w-full bg-[var(--ploc-background)] flex flex-col items-center justify-center fixed inset-0 overflow-hidden">
      {/* Contêiner principal que ocupa toda a tela, com fundo escuro e centralização */}

      {/* Renderiza as ondas animadas no fundo da tela */}
      <SodaWave /> {/* Componente visual de efervescência */}

      {/* Renderiza o botão no canto para sair da experiência do jogo de onboarding */}
      <ExitGameButton /> {/* Botão de saída */}

      {/* Removido: cápsula de autenticação/login, agora é global no layout */}

      {/* Renderiza um brilho ambiente no fundo da tela para estética */}
      <AmbientGlowBackground /> {/* Efeito de brilho de fundo */}

      {/* Renderiza o orquestrador principal que gerencia o fluxo, as frases e o Ploc */}
      <LandingStageOrchestrator /> {/* Orquestrador da landing */}

      {/* Aplica uma vinheta escura nas bordas da tela */}
      <Vignette /> {/* Efeito de sombra nas bordas */}
    </main>
  ); // Retorna a árvore JSX construída
}
