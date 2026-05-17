'use client';

import React from 'react';

export function Vignette() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 200px rgba(0,0,0,1)',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
}
