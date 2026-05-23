'use client';

/**
 * ============================================================================
 * Vinheta Escura - Vignette.tsx
 * ============================================================================
 * Descrição: Efeito visual de escurecimento nas bordas da tela (Vinheta).
 * Usado para focar a visão do usuário no centro e dar volume à interface.
 * ============================================================================
 */import React from 'react';
// Retorna uma sombra interna que cria o efeito de vinheta nas bordas
export function Vignette() {
  return (
    <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-10" />
  );
}
