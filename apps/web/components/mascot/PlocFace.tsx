import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PlocFaceProps {
  isSleeping: boolean;
  isPissed: boolean;
  isHurt: boolean;
  isSpeaking?: boolean;
  appearance?: {
    eyes?: 'bored' | 'cute' | 'anime' | 'nerd' | 'sparkle' | 'spiral';
    mouth?: 'none' | 'smile' | 'straight' | 'masculine' | 'feminine' | 'shock' | 'sad' | 'wavy';
  };
  angerLevel?: number;
  isHit?: boolean;
  isPositiveHit?: boolean;
}

export function PlocFace({
  isSleeping,
  isPissed,
  isHurt,
  isSpeaking = false,
  appearance = { eyes: 'bored', mouth: 'straight' },
  angerLevel = 0,
  isHit = false,
  isPositiveHit = false,
}: PlocFaceProps) {
  // Variação de cores reativas baseadas no humor do Ploc (Azul Ploc vs Vermelho Ira/Dor)
  const isRed = isPissed || isHurt;

  // Cores dinâmicas com tonalidades de azul escuras e nítidas
  const lashColor = isRed ? '#7f1d1d' : '#082f49';     // Cílios/Sobrancelha: Vermelho escuro vs Azul Meia-Noite Super Escuro (nítido)
  const creaseColor = isRed ? '#ef4444' : '#0284c7';   // Sombra Eyelid Superior: Vermelho vivo vs Azul Ploc Médio-Escuro
  const pupilColor = isRed ? '#450a0a' : '#031e2f';    // Pupila: Sangue escuro vs Azul profundo sobrio

  // -------------------------------------------------------------
  // Efeito Visual de Piscada Natural (Natural Eye Blinking)
  // -------------------------------------------------------------
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const blinkLoop = () => {
      const nextBlink = Math.random() * 4000 + 2000; // Pisca a cada 2-6 segundos
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkLoop();
        }, 150); // Olho fechado por 150ms
      }, nextBlink);
    };
    blinkLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  // -------------------------------------------------------------
  // Determinação das Expressões Dinâmicas de Olhos e Boca
  // -------------------------------------------------------------
  const isEyeClosed = isSleeping || isHit || isPositiveHit || isBlinking;
  const activeEyes = isEyeClosed ? 'sleeping' : (appearance.eyes || 'bored');

  let activeMouth = isSleeping ? 'none' : (isHurt || isHit ? 'sad' : isPositiveHit ? 'smile' : isPissed ? 'wavy' : (appearance.mouth || 'straight'));

  // Override dinâmico para animação de fala (Speaking Mouth State)
  if (isSpeaking && activeMouth !== 'none') {
    activeMouth = appearance.mouth === 'feminine' ? 'feminine' : 'masculine';
  }

  // -------------------------------------------------------------
  // Renderizador de Pupilas Customizáveis
  // -------------------------------------------------------------
  const renderPupil = (style: string, i: number) => {
    switch (style) {
      case 'cute':
        return (
          <g clipPath={`url(#eye-clip-${i})`}>
            <motion.circle
              cx="50"
              cy="50"
              r="20"
              fill={pupilColor}
              animate={{
                scale: isHurt ? 0.5 : (isPissed ? 0.8 : 1),
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            />
            <motion.circle
              cx="43"
              cy="41"
              r="5"
              fill="#ffffff"
              animate={{
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
            />
            <motion.circle
              cx="57"
              cy="59"
              r="2.5"
              fill="#ffffff"
              animate={{
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
            />
          </g>
        );
      case 'anime':
        return (
          <g clipPath={`url(#eye-clip-${i})`}>
            <motion.ellipse
              cx="50"
              cy="50"
              rx="18"
              ry="25"
              fill={`url(#anime-eye-grad-${i})`}
              animate={{
                scaleY: isHurt ? 0.5 : (isPissed ? 0.7 : 1),
                scaleX: isHurt ? 0.5 : (isPissed ? 0.75 : 1),
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            />
            {/* Brilho estrela interna */}
            <motion.path
              d="M 50 35 Q 50 45 40 45 Q 50 45 50 55 Q 50 45 60 45 Q 50 45 50 35 Z"
              fill="#ffffff"
              animate={{
                scale: [1, 1.15, 1],
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="56" cy="55" r="2" fill="#ffffff" />
          </g>
        );
      case 'sparkle':
        return (
          <g clipPath={`url(#eye-clip-${i})`}>
            <motion.path
              d="M 50 25 Q 50 50 25 50 Q 50 50 50 75 Q 50 50 75 50 Q 50 50 50 25 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
              animate={{
                scale: isHurt ? 0.5 : (isPissed ? 0.7 : [1, 1.15, 1]),
                rotate: [0, 8, 0],
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
              transition={{
                scale: { type: 'spring', stiffness: 220, damping: 16 },
                rotate: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </g>
        );
      case 'spiral':
        return (
          <g clipPath={`url(#eye-clip-${i})`}>
            <motion.path
              d="M 50 50 M 50 50 A 5 5 0 0 1 45 45 A 10 10 0 0 1 55 35 A 15 15 0 0 1 35 55 A 20 20 0 0 1 70 30"
              fill="none"
              stroke={lashColor}
              strokeWidth="4"
              strokeLinecap="round"
              animate={{
                rotate: 360,
                y: isHurt ? 4 : (isPissed ? 6 : 0),
              }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            />
          </g>
        );
      case 'nerd':
      case 'bored':
      default:
        return (
          <motion.rect
            x="41"
            y="30"
            width="18"
            height="32"
            rx="9"
            fill={pupilColor}
            clipPath={`url(#eye-clip-${i})`}
            animate={{
              scaleY: isHurt ? 0.5 : (isPissed ? 0.7 : 1),
              scaleX: isHurt ? 0.5 : (isPissed ? 0.75 : 1),
              y: isHurt ? 4 : (isPissed ? 6 : 0),
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          />
        );
    }
  };

  // -------------------------------------------------------------
  // Renderizador de Bocas Dinâmicas
  // -------------------------------------------------------------
  const renderMouth = (style: string) => {
    switch (style) {
      case 'smile':
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none" className="overflow-visible">
            <motion.path
              d="M 22 25 Q 40 46 58 25"
              stroke={lashColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              animate={{
                y: [0, -1.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'sad':
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none" className="overflow-visible">
            <motion.path
              d="M 22 36 Q 40 18 58 36"
              stroke={lashColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              animate={{
                y: [0, 1.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'shock':
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none">
            <motion.ellipse
              cx="40"
              cy="30"
              rx="11"
              ry="15"
              stroke={lashColor}
              strokeWidth="6.5"
              fill="none"
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'wavy':
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none" className="overflow-visible">
            <motion.path
              d="M 20 30 Q 27 22 34 30 T 47 30 T 60 30"
              stroke={lashColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: [
                  "M 20 30 Q 27 22 34 30 T 47 30 T 60 30",
                  "M 20 30 Q 27 38 34 30 T 47 30 T 60 30",
                  "M 20 30 Q 27 22 34 30 T 47 30 T 60 30"
                ]
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'masculine':
        return (
          <motion.div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            animate={isSpeaking ? {
              scaleY: [0.35, 1.15, 0.45, 1.25, 0.55, 1.05, 0.35],
              scaleX: [0.95, 1.05, 0.98, 1.03, 0.97, 1.02, 0.95]
            } : { scaleY: 0.3, scaleX: 0.9 }}
            transition={isSpeaking ? {
              duration: 0.55,
              repeat: Infinity,
              ease: "easeInOut"
            } : { type: 'spring', stiffness: 90, damping: 20 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 76 52" className="overflow-visible">
              <defs>
                <clipPath id="masc-mouth-clip">
                  <path d="M 12 18 C 12 18, 38 8, 64 18 C 64 35, 52 48, 38 48 C 24 48, 12 35, 12 18 Z" />
                </clipPath>
              </defs>
              <path
                d="M 12 18 C 12 18, 38 8, 64 18 C 64 35, 52 48, 38 48 C 24 48, 12 35, 12 18 Z"
                fill="#4c0519"
                stroke={lashColor}
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <g clipPath="url(#masc-mouth-clip)">
                {/* Dentes Superiores Masculinos Contínuos e Elegantes */}
                <rect x="18" y="10" width="40" height="9.5" rx="3.5" fill="#ffffff" />
                <line x1="38" y1="10" x2="38" y2="19.5" stroke="#cbd5e1" strokeWidth="1.3" />

                {/* Língua Pulsante */}
                <motion.ellipse
                  cx="38"
                  cy="42"
                  rx="18"
                  ry="12"
                  fill="#f43f5e"
                  animate={{
                    scaleY: [0.9, 1.12, 0.9],
                    scaleX: [0.95, 1.05, 0.95],
                    y: [0, -1.5, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </g>
            </svg>
          </motion.div>
        );
      case 'feminine':
        return (
          <motion.div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            animate={isSpeaking ? {
              scaleY: [0.3, 1.2, 0.4, 1.15, 0.5, 1.0, 0.3],
              scaleX: [0.9, 1.08, 0.95, 1.04, 0.93, 1.02, 0.9]
            } : { scaleY: 0.25, scaleX: 0.85 }}
            transition={isSpeaking ? {
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            } : { type: 'spring', stiffness: 90, damping: 20 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 72 50" className="overflow-visible">
              <defs>
                <clipPath id="fem-mouth-clip">
                  <path d="M 15 16 C 25 12, 47 12, 57 16 C 60 30, 48 46, 36 46 C 24 46, 12 30, 15 16 Z" />
                </clipPath>
              </defs>
              <path
                d="M 15 16 C 25 12, 47 12, 57 16 C 60 30, 48 46, 36 46 C 24 46, 12 30, 15 16 Z"
                fill="#5c0624"
                stroke={lashColor}
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <g clipPath="url(#fem-mouth-clip)">
                {/* Dentes Superiores Femininos Contínuos e Delicados */}
                <rect x="19" y="10" width="34" height="8.5" rx="2.5" fill="#ffffff" />
                <line x1="36" y1="10" x2="36" y2="18.5" stroke="#cbd5e1" strokeWidth="1" />

                {/* Língua Pulsante Suave */}
                <motion.ellipse
                  cx="36"
                  cy="40"
                  rx="15"
                  ry="10"
                  fill="#fda4af"
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    y: [0, -1, 0]
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </g>
            </svg>
          </motion.div>
        );
      case 'straight':
      default:
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none">
            <path
              d="M 30 30 L 50 30"
              stroke={lashColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  const isAlertEye = activeEyes === 'cute' || activeEyes === 'anime' || activeEyes === 'sparkle';
  const escleraScaleY = isSleeping ? 0.05 : (isAlertEye ? 1.25 : 1);

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
        zIndex: 2
      }}>
        {[0, 1].map((i) => {
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
                      <motion.path
                        d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                        animate={{
                          scaleY: escleraScaleY,
                          originY: 0.32,
                        }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                      />
                    </clipPath>

                    {/* Anime Eye Internal Gradient */}
                    <linearGradient id={`anime-eye-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="60%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#312e81" />
                    </linearGradient>
                  </defs>

                  {/* Sobrancelha Superior Caída/Tired */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 20 Q 50 24 86 20"
                      fill="none"
                      stroke={lashColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{
                        y: isHurt ? 6 : (isPissed ? 4 : 0),
                        rotate: isHurt ? -4 : (isPissed ? (i === 0 ? 5 : -5) : 0),
                        originX: i === 0 ? "80%" : "20%",
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    />
                  )}

                  {/* Esclera Branca Interna */}
                  <motion.path
                    d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                    fill="#ffffff"
                    animate={{
                      scaleY: escleraScaleY,
                      originY: 0.32,
                    }}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                  />

                  {/* Renderizador de Pupila Personalizado */}
                  {!isSleeping && renderPupil(activeEyes, i)}

                  {/* Sombra da Pálpebra Superior */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 42 C 14 42, 50 42, 86 42 C 86 52, 72 52, 50 52 C 28 52, 14 52, 14 42 Z"
                      fill={creaseColor}
                      opacity={0.16}
                      clipPath={`url(#eye-clip-${i})`}
                      animate={{
                        scaleY: isHurt ? 0.7 : (isPissed ? 0.8 : 1),
                        originY: 0.32,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Sombra da Pálpebra Inferior */}
                  {!isSleeping && (
                    <motion.path
                      d="M 14 64 C 14 64, 50 64, 86 64 C 86 64, 72 76, 50 76 C 28 76, 14 64, 14 64 Z"
                      fill="#000000"
                      opacity={0.16}
                      clipPath={`url(#eye-clip-${i})`}
                      animate={{
                        y: isHurt ? 2 : 0,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Sombreado das Olheiras */}
                  {!isSleeping && (
                    <motion.path
                      d={`M ${20 + shiftX} 71 Q ${50 + shiftX} 77 ${80 + shiftX} 71 Q ${50 + shiftX} 150 ${20 + shiftX} 71 Z`}
                      fill={`url(#eye-bag-grad-${i})`}
                      animate={{
                        y: isHurt ? 2 : 0,
                        opacity: isSleeping ? 0 : 1,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                  )}

                  {/* Linha da Bolsa das Olheiras */}
                  {!isSleeping && (
                    <motion.path
                      d={`M ${20 + shiftX} 76 Q ${50 + shiftX} 81 ${76 + shiftX} 76`}
                      fill="none"
                      stroke={lashColor}
                      strokeWidth="4.5"
                      opacity={1.0}
                      animate={{
                        y: isHurt ? 2 : (isPissed ? 1 : 0),
                        opacity: isSleeping ? 0 : 1.0,
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    />
                  )}

                  {/* Cílio Superior 010 */}
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

                  {/* Óculos Nerd */}
                  {!isSleeping && activeEyes === 'nerd' && (
                    <g>
                      <circle
                        cx="50"
                        cy="50"
                        r="33"
                        stroke="#0f172a"
                        strokeWidth="5.5"
                        fill="none"
                      />
                      <path
                        d={i === 0 ? "M 83 50 Q 94 44 105 50" : "M 17 50 Q 6 44 -5 50"}
                        stroke="#0f172a"
                        strokeWidth="5.5"
                        fill="none"
                      />
                    </g>
                  )}
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boca Dinâmica Absolute Centered */}
      {!isSleeping && activeMouth !== 'none' && (
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
          zIndex: 3
        }}>
          {renderMouth(activeMouth)}
        </div>
      )}

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
