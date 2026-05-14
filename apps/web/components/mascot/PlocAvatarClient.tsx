'use client';

/**
 * PlocAvatarClient.tsx — Wrapper que força renderização apenas no cliente.
 * Evita erros de hidratação SSR com o mascote (posição, localStorage, etc.)
 */

import dynamic from 'next/dynamic';

const PlocAvatarInner = dynamic(
  () => import('./PlocAvatar'),
  { ssr: false }
);

export function PlocAvatarClient() {
  return <PlocAvatarInner />;
}
