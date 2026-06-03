'use client';

/**
 * Wrapper Client - PlocAvatarClient.tsx
 * ============================================================================
 * Descrição: Wrapper que força a renderização do PlocAvatar estritamente no lado
 * do cliente (Client-Side).
 * 
 * Principais responsabilidades:
 * - Desativa a renderização SSR (Server-Side Rendering) para o mascote Ploc.
 * - Evita problemas de hidratação e discrepância de DOM (como leituras imediatas
 *   de localStorage ou posições físicas baseadas nas dimensões da janela).
 * ============================================================================
 */

import dynamic from 'next/dynamic';
import { PlocToast } from './PlocToast';

const PlocAvatarInner = dynamic(
  () => import('./PlocAvatar'),
  { ssr: false }
);

export function PlocAvatarClient({
  draggable = true,
  emotion = 'calm'
}: {
  draggable?: boolean;
  emotion?: 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy';
}) {
  return (
    <>
      <PlocToast />
      <PlocAvatarInner draggable={draggable} emotion={emotion} />
    </>
  );
}
