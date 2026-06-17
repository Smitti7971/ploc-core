/**
 * Rosto Estático do Ploc - PlocFace.tsx
 */

import React from 'react';

export function PlocFace() {
  const lashColor = '#082f49';     // Azul Meia-Noite Super Escuro
  const creaseColor = '#0284c7';   // Azul Ploc Médio-Escuro
  const pupilColor = '#031e2f';    // Azul profundo sobrio

  return (
    <>
      {/* Olhos Julgadores Ampliados com Sobrancelhas Escuras e Sombreado de Olheira por Gradiente */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14%',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 500 /* mascot */,
        opacity: 0.2,
      }}>
        {[0, 1].map((i) => {
          const dx = 14;
          const shiftX = i === 0 ? dx : -dx;

          return (
            <div
              key={`eye-group-${i}`}
              style={{
                display: 'flex',
                position: 'relative',
                width: '20%',
                height: '32%',
                alignItems: 'start',
              }}
            >
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <svg
                  viewBox="0 0 100 100"
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    display: 'block'
                  }}
                >
                  <defs>
                    <linearGradient id={`eye-bag-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lashColor} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={lashColor} stopOpacity="0.0" />
                    </linearGradient>

                    <clipPath id={`eye-clip-${i}`}>
                      <path d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z" />
                    </clipPath>
                  </defs>

                  {/* Sobrancelha Superior */}
                  <path
                    d="M 14 20 Q 50 24 86 20"
                    fill="none"
                    stroke={lashColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Esclera Branca Interna */}
                  <path
                    d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                    fill="#ffffff"
                  />

                  {/* Pupila Base (Bored/Cute) */}
                  <rect
                    x="30"
                    y="30"
                    width="32"
                    height="32"
                    rx="9"
                    fill={pupilColor}
                    clipPath={`url(#eye-clip-${i})`}
                  />

                  {/* Sombra da Pálpebra Superior */}
                  <path
                    d="M 14 42 C 14 42, 50 42, 86 42 C 86 52, 72 52, 50 52 C 28 52, 14 52, 14 42 Z"
                    fill={creaseColor}
                    opacity={0.16}
                    clipPath={`url(#eye-clip-${i})`}
                  />

                  {/* Sombra da Pálpebra Inferior */}
                  <path
                    d="M 14 64 C 14 64, 50 64, 86 64 C 86 64, 72 76, 50 76 C 28 76, 14 64, 14 64 Z"
                    fill="#000000"
                    opacity={1}
                    clipPath={`url(#eye-clip-${i})`}
                  />

                  {/* Sombreado das Olheiras */}
                  <path
                    d={`M ${20 + shiftX} 71 Q ${50 + shiftX} 77 ${80 + shiftX} 71 Q ${50 + shiftX} 150 ${20 + shiftX} 71 Z`}
                    fill={`url(#eye-bag-grad-${i})`}
                  />

                  {/* Linha da Bolsa das Olheiras */}
                  <path
                    d={`M ${20 + shiftX} 76 Q ${50 + shiftX} 81 ${76 + shiftX} 76`}
                    fill="none"
                    stroke={lashColor}
                    strokeWidth="4.5"
                  />

                  {/* Cílio Superior 010 */}
                  <path
                    d={
                      i === 0
                        ? "M 4 52 C 4 52, 12 42, 50 42 C 88 42, 96 44, 96 44"
                        : "M 4 44 C 4 44, 12 42, 50 42 C 88 42, 96 52, 96 52"
                    }
                    fill="none"
                    stroke={lashColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boca Dinâmica Absolute Centered - ESTÁTICO (Straight) */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '54px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500 /* mascot */
      }}>
        <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none">
          <path
            d="M 26 28 Q 40 34 54 28 Q 40 34 26 28 Z"
            fill="none"
            stroke={lashColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brilho Superior (Efeito Poring 3D de Gelatina) */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '18%',
        width: '25%',
        height: '18%',
        background: 'rgba(255,255,255,0.32)',
        borderRadius: '50%',
        filter: 'blur(3px)',
        transform: 'rotate(-25deg)',
        pointerEvents: 'none'
      }} />
    </>
  );
}
