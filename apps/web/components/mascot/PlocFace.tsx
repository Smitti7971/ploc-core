import { motion } from 'framer-motion';

interface PlocFaceProps {
  isSleeping: boolean;
  isPissed: boolean;
  isHurt: boolean;
}

export function PlocFace({ isSleeping, isPissed, isHurt }: PlocFaceProps) {
  // Variação de cores reativas baseadas no humor do Ploc (Azul Ploc vs Vermelho Ira/Dor)
  const isRed = isPissed || isHurt;

  // Cores dinâmicas com tonalidades de azul escuras e nítidas
  const lashColor = isRed ? '#7f1d1d' : '#082f49';     // Cílios/Sobrancelha: Vermelho escuro vs Azul Meia-Noite Super Escuro (nítido)
  const creaseColor = isRed ? '#ef4444' : '#0284c7';   // Sombra Eyelid Superior: Vermelho vivo vs Azul Ploc Médio-Escuro
  const pupilColor = isRed ? '#450a0a' : '#031e2f';    // Pupila: Sangue escuro vs Azul profundo sobrio

  return (
    <>
      {/* Olhos Julgadores Ampliados com Sobrancelhas Escuras e Sombreado de Olheira por Gradiente */}
      {/* gap de 14% mantido (posição original perfeita dos olhos) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14%',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 2
      }}>
        {[0, 1].map((i) => {
          // Deslocamento assimétrico de 14px unificado para ANDAREM JUNTOS (Sombra + Traço)
          // Olho esquerdo (i === 0) desloca para a direita (+14), olho direito (i === 1) para a esquerda (-14)
          const dx = 14;
          const shiftX = i === 0 ? dx : -dx;

          return (
            <div
              key={`eye-group-${i}`}
              style={{
                position: 'relative',
                width: '20%',
                height: '32%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Globo Ocular SVG Integrado */}
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
                    {/* Gradiente Vetorial Suave para o Sombreado Perfeito da Olheira (Sem Bugs de Blur) */}
                    <linearGradient id={`eye-bag-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lashColor} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={lashColor} stopOpacity="0.0" />
                    </linearGradient>

                    {/* Máscara Vetorial (clipPath) idêntica à esclera branca para blindar a pupila e sombras de vazamentos */}
                    <clipPath id={`eye-clip-${i}`}>
                      <motion.path
                        d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                        animate={{
                          scaleY: isSleeping ? 0.05 : 1,
                          originY: 0.32,
                        }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                      />
                    </clipPath>
                  </defs>

                  {/* Sobrancelha Superior Caída/Tired - Curvatura relaxada nas pontas para simular exaustão */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 20 Q 50 24 86 20" // Sobrancelha caída nas pontas (tired/sleepy)
                      fill="none"
                      stroke={lashColor} // Unificado com a cor escura dos cílios
                      strokeWidth="4" // Engrossado para máxima definição
                      strokeLinecap="round"
                      animate={{
                        y: isHurt ? 6 : (isPissed ? 4 : 0),
                        rotate: isHurt ? -4 : (isPissed ? (i === 0 ? 5 : -5) : 0),
                        originX: i === 0 ? "80%" : "20%",
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    />
                  )}

                  {/* Esclera Branca Interna (Fundo do Olho) - Achatada superiormente (y: 42) para olho semi-cerrado/cansado */}
                  <motion.path
                    d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                    fill="#ffffff"
                    animate={{
                      scaleY: isSleeping ? 0.05 : 1,
                      originY: 0.32,
                    }}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                  />

                  {/* Pupila em Cápsula Vertical Reativa - CLIPADA ao globo ocular para evitar QUALQUER vazamento superior */}
                  {!isSleeping && (
                    <motion.rect
                      x="41"
                      y="30"
                      width="18"
                      height="32"
                      rx="9"
                      fill={pupilColor}
                      clipPath={`url(#eye-clip-${i})`} // Blindagem absoluta contra vazamento!
                      animate={{
                        scaleY: isHurt ? 0.5 : (isPissed ? 0.7 : 1),
                        scaleX: isHurt ? 0.5 : (isPissed ? 0.75 : 1),
                        y: isHurt ? 4 : (isPissed ? 6 : 0),
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                    />
                  )}

                  {/* Sombra da Pálpebra Superior (Eyelid Shadow) - Ajustada para olho semi-cerrado e também clipada */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 42 C 14 42, 50 42, 86 42 C 86 52, 72 52, 50 52 C 28 52, 14 52, 14 42 Z"
                      fill={creaseColor}
                      opacity={0.16}
                      clipPath={`url(#eye-clip-${i})`} // Clipado para alinhar perfeitamente com a curva externa
                      animate={{
                        scaleY: isHurt ? 0.7 : (isPissed ? 0.8 : 1),
                        originY: 0.32,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Sombra da Pálpebra Inferior (Lower Eyelid Shadow) - Preta a 16% cortando a base da pupila/globo e clipada */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 64 C 14 64, 50 64, 86 64 C 86 64, 72 76, 50 76 C 28 76, 14 64, 14 64 Z"
                      fill="#000000" // Preta sólida para profundidade óptica neutra
                      opacity={0.16} // Opacidade de sombra real
                      clipPath={`url(#eye-clip-${i})`} // Clipado
                      animate={{
                        y: isHurt ? 2 : 0,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Sombreado das Olheiras (Soft Shadow Under Eyes) - Sincronizado perfeitamente em 14px em direção ao nariz (+dx/-dx) */}
                  {!isSleeping && (
                    <motion.path
                      d={`M ${20 + shiftX} 71 Q ${50 + shiftX} 77 ${80 + shiftX} 71 Q ${50 + shiftX} 150 ${20 + shiftX} 71 Z`}
                      fill={`url(#eye-bag-grad-${i})`} // Preenchimento com o degradê suave e nítido
                      animate={{
                        y: isHurt ? 2 : 0,
                        opacity: isSleeping ? 0 : 1,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Linha da Bolsa das Olheiras (Dark Circle Crease) - Sincronizada perfeitamente em 14px em direção ao nariz (+dx/-dx) */}
                  {!isSleeping && (
                    <motion.path
                      d={`M ${20 + shiftX} 76 Q ${50 + shiftX} 81 ${76 + shiftX} 76`} // Posição colada abaixo da base dos olhos
                      fill="none"
                      stroke={lashColor} // Unificado com a cor escura dos cílios
                      strokeWidth="4.5" // Engrossado para 4.5px para definição absoluta
                      opacity={1.0} // 100% sólido e nítido
                      animate={{
                        y: isHurt ? 2 : (isPissed ? 1 : 0),
                        opacity: isSleeping ? 0 : 1.0,
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    />
                  )}

                  {/* Linha Grossa Superior / Cílio 010 (Thick Lash Line) - Descida para y: 42 no centro para olho semi-cerrado */}
                  <motion.path
                    d={i === 0
                      ? "M 4 52 C 4 52, 12 42, 50 42 C 88 42, 96 44, 96 44"
                      : "M 4 44 C 4 44, 12 42, 50 42 C 88 42, 96 52, 96 52"
                    }
                    fill="none"
                    stroke={lashColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                      y: isSleeping ? 18 : 0,
                      scaleY: isSleeping ? 0.15 : 1,
                    }}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>
          );
        })}
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
      }} />
    </>
  );
}
