/**
 * ============================================================================
 * Rosto do Ploc - PlocFace.tsx
 * ============================================================================
 * Descrição: Renderiza de forma dinâmica as expressões faciais do Ploc.
 * 
 * Principais responsabilidades:
 * - Desenha os olhos e bocas com base no estado de humor e emoção.
 * - Anima a boca quando o mascote está falando.
 * - Adapta a dilatação das pupilas e posicionamento das sobrancelhas conforme o nível de dor/raiva.
 * ============================================================================
 */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PlocFaceProps {
  isSleeping: boolean;
  isPissed: boolean;
  isHurt: boolean;
  isSpeaking?: boolean;
  appearance?: {
    eyes?: 'bored' | 'cute' | 'anime' | 'nerd' | 'sparkle' | 'spiral';
    mouth?: 'none' | 'smile' | 'straight' | 'masculine' | 'feminine' | 'shock' | 'sad' | 'wavy' | 'rage';
  };
  angerLevel?: number;
  angerPercentage?: number;
  isHit?: boolean;
  isPositiveHit?: boolean;
  isDizzy?: boolean;
}

// Componente que renderiza SVGs animados representando o rosto do personagem
export function PlocFace({
  isSleeping,
  isPissed,
  isHurt,
  isSpeaking = false,
  appearance = { eyes: 'bored', mouth: 'straight' },
  angerLevel = 0,
  angerPercentage = 0,
  isHit = false,
  isPositiveHit = false,
  isDizzy = false,
}: PlocFaceProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Adia a primeira verificação para evitar renderização em cascata síncrona
    const timer = setTimeout(() => {
      setIsMobile(window.innerWidth < 768);
    }, 0);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  const activeEyes = isDizzy ? 'spiral' : (isEyeClosed ? 'sleeping' : (appearance.eyes || 'bored'));

  let activeMouth = 'straight';
  if (isSleeping) {
    activeMouth = 'none';
  } else if (isDizzy) {
    activeMouth = 'wavy';
  } else if (isHurt || isHit) {
    activeMouth = 'sad';
  } else if (isPositiveHit) {
    activeMouth = 'smile';
  } else {
    // Reage deterministícamente ao nível de raiva
    switch (angerLevel) {
      case 1:
        activeMouth = 'straight';
        break;
      case 2:
        activeMouth = 'sad';
        break;
      case 3:
        activeMouth = 'wavy';
        break;
      case 4:
        activeMouth = 'shock';
        break;
      case 5:
        activeMouth = 'rage';
        break;
      default:
        if (angerPercentage > 0) {
          activeMouth = 'straight';
        } else {
          activeMouth = appearance.mouth || 'straight';
        }
        break;
    }
  }

  // Override dinâmico para animação de fala (Speaking Mouth State)
  const isAngryOrHurtState = angerLevel >= 1 || isPissed || isHurt || isHit || (angerLevel === 0 && angerPercentage > 0);

  if (isSpeaking && activeMouth !== 'none') {
    if (isAngryOrHurtState) {
      // Mantemos a boca irritada correspondente ('straight', 'sad', 'wavy', 'shock', 'rage')
      // e o renderMouth cuidará de animá-la de forma condizente com a fala!
    } else {
      activeMouth = appearance.mouth === 'feminine' ? 'feminine' : 'masculine';
    }
  }

  // Escala de pupilas baseada em dor ou nível de raiva (constrição por estresse)
  let pupilScaleX = 1;
  let pupilScaleY = 1;

  if (isHurt) {
    pupilScaleX = 0.5;
    pupilScaleY = 0.5;
  } else {
    switch (angerLevel) {
      case 1:
        pupilScaleX = 0.9;
        pupilScaleY = 0.9;
        break;
      case 2:
        pupilScaleX = 0.8;
        pupilScaleY = 0.8;
        break;
      case 3:
        pupilScaleX = 0.7;
        pupilScaleY = 0.7;
        break;
      case 4:
        pupilScaleX = 0.55;
        pupilScaleY = 0.55;
        break;
      case 5:
        pupilScaleX = 0.4;
        pupilScaleY = 0.4; // pupilas minúsculas de loucura
        break;
      default:
        pupilScaleX = 1.0;
        pupilScaleY = 1.0;
        break;
    }
  }

  // Cálculo reativo das sobrancelhas com base em angerLevel e isHurt
  let eyebrowY = 0;
  let eyebrowRotate = 0;

  if (isHurt) {
    eyebrowY = 6;
    eyebrowRotate = -4; // Expressão de dor / preocupação
  } else {
    switch (angerLevel) {
      case 1:
        eyebrowY = 1.5;
        eyebrowRotate = 6;
        break;
      case 2:
        eyebrowY = 3.5;
        eyebrowRotate = 14;
        break;
      case 3:
        eyebrowY = 5.5;
        eyebrowRotate = 22;
        break;
      case 4:
        eyebrowY = 7.5;
        eyebrowRotate = 28;
        break;
      case 5:
        eyebrowY = 9.5;
        eyebrowRotate = 35; // Extremo furioso
        break;
      default:
        if (isPissed) {
          eyebrowY = 4;
          eyebrowRotate = 8;
        } else {
          eyebrowY = 0;
          eyebrowRotate = 0;
        }
        break;
    }
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
                scale: pupilScaleX,
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            />
            <motion.circle
              cx="43"
              cy="41"
              r="5"
              fill="#ffffff"
              animate={{
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
              }}
            />
            <motion.circle
              cx="57"
              cy="59"
              r="2.5"
              fill="#ffffff"
              animate={{
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
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
                scaleY: pupilScaleY,
                scaleX: pupilScaleX,
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            />
            {/* Brilho estrela interna */}
            <motion.path
              d="M 50 35 Q 50 45 40 45 Q 50 45 50 55 Q 50 45 60 45 Q 50 45 50 35 Z"
              fill="#ffffff"
              animate={{
                scale: [1, 1.15, 1],
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
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
                scale: pupilScaleX,
                rotate: [0, 8, 0],
                y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
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
          <g style={{ transformOrigin: '50px 50px', transform: 'scale(1.15)' }}>
            <g>
              <path
                d="M 50 50 A 5 5 0 0 1 60 50 A 15 15 0 0 1 30 50 A 25 25 0 0 1 80 50 A 35 35 0 0 1 10 50"
                fill="none"
                stroke={lashColor}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </g>
          </g>
        );
      case 'nerd':
      case 'bored':
      default:
        return (
          <motion.rect
            x="30"
            y="30"
            width="32"
            height="32"
            rx="9"
            fill={pupilColor}
            clipPath={`url(#eye-clip-${i})`}
            animate={{
              scaleY: pupilScaleY,
              scaleX: pupilScaleX,
              y: isHurt ? 4 : (angerLevel === 5 ? 6 : 0),
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
              strokeLinejoin="round"
              fill={isSpeaking ? "#3b0712" : "none"}
              animate={isSpeaking
                ? {
                  d: [
                    "M 22 36 Q 40 18 58 36 Q 40 18 22 36 Z",
                    "M 22 36 Q 40 18 58 36 Q 40 46 22 36 Z",
                    "M 22 36 Q 40 18 58 36 Q 40 18 22 36 Z"
                  ]
                }
                : {
                  y: [0, 1.5, 0],
                }
              }
              transition={isSpeaking ? { duration: 0.45, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'shock':
        return (
          <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none" className="overflow-visible">
            <motion.g
              animate={isSpeaking ? {
                x: [0, -1.5, 1.5, -1, 1, -1.5, 1.5, 0],
                y: [0, 1, -1, 1.5, -1.5, 1, -1, 0],
                scaleY: [0.85, 1.15, 0.9, 1.1, 0.85]
              } : {
                x: [0, -1, 1, -1.2, 1.2, -0.8, 0.8, 0],
                y: [0, 0.8, -0.8, 1, -1, 0.8, -0.8, 0],
                scale: [1, 1.03, 1]
              }}
              transition={isSpeaking ? {
                duration: 0.22,
                repeat: Infinity,
                ease: "easeInOut"
              } : {
                duration: 0.16,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Contorno da boca de dentes cerrados */}
              <rect
                x="18"
                y="18"
                width="44"
                height="24"
                rx="6"
                fill="#ffffff"
                stroke={lashColor}
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              {/* Linha horizontal divisória dos dentes */}
              <line
                x1="18"
                y1="30"
                x2="62"
                y2="30"
                stroke={lashColor}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Divisórias verticais dos dentes */}
              <line x1="29" y1="18" x2="29" y2="42" stroke={lashColor} strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="18" x2="40" y2="42" stroke={lashColor} strokeWidth="3" strokeLinecap="round" />
              <line x1="51" y1="18" x2="51" y2="42" stroke={lashColor} strokeWidth="3" strokeLinecap="round" />
            </motion.g>
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
              initial={{ d: "M 20 30 Q 27 22 34 30 T 47 30 T 60 30" }}
              animate={isSpeaking ? {
                d: [
                  "M 20 30 Q 27 22 34 30 T 47 30 T 60 30",
                  "M 20 30 Q 27 34 34 26 T 47 34 T 60 30",
                  "M 20 30 Q 27 22 34 30 T 47 30 T 60 30"
                ],
                y: [0, -3, 3, 0],
                scaleY: [1, 1.25, 0.85, 1],
              } : {
                y: [0, -2, 0, 2, 0],
                rotate: [0, -2, 0, 2, 0]
              }}
              transition={isSpeaking ? {
                duration: 0.35,
                repeat: Infinity,
                ease: "easeInOut"
              } : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
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
      case 'rage':
        return (
          <motion.div
            style={{
              width: '120%',
              height: '120%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
            animate={isSpeaking ? {
              x: [0, -2, 2, -1, 1, 0],
              y: [0, 1, -1, 1, -1, 0],
              scale: [1.2, 1.3, 1.15, 1.25, 1.2],
              scaleY: [0.85, 1.15, 0.9, 1.1, 0.85]
            } : {
              x: [0, -2, 2, -1, 1, 0],
              y: [0, 1, -1, 1, -1, 0],
              scale: [1.2, 1.25, 1.2],
            }}
            transition={isSpeaking ? {
              duration: 0.25,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              duration: 0.15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 80 60" className="overflow-visible">
              <defs>
                <clipPath id="rage-mouth-clip">
                  <path d="M 12 20 C 8 35, 18 56, 40 56 C 62 56, 72 35, 68 20 C 68 12, 12 12, 12 20 Z" />
                </clipPath>
              </defs>
              <path
                d="M 12 20 C 8 35, 18 56, 40 56 C 62 56, 72 35, 68 20 C 68 12, 12 12, 12 20 Z"
                fill="#1e0505"
                stroke={lashColor}
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              <g clipPath="url(#rage-mouth-clip)">
                {/* Dentes Superiores Afiados */}
                <path d="M 16 15 L 24 15 L 20 28 Z" fill="#ffffff" />
                <path d="M 56 15 L 64 15 L 60 28 Z" fill="#ffffff" />
                <path d="M 28 15 L 34 15 L 31 22 Z" fill="#ffffff" />
                <path d="M 37 15 L 43 15 L 40 22 Z" fill="#ffffff" />
                <path d="M 46 15 L 52 15 L 49 22 Z" fill="#ffffff" />

                {/* Dentes Inferiores Afiados */}
                <path d="M 22 57 L 28 57 L 25 46 Z" fill="#ffffff" />
                <path d="M 52 57 L 58 57 L 55 46 Z" fill="#ffffff" />
                <path d="M 34 57 L 40 57 L 37 49 Z" fill="#ffffff" />
                <path d="M 43 57 L 49 57 L 46 49 Z" fill="#ffffff" />

                {/* Língua trêmula */}
                <motion.path
                  d="M 20 48 Q 40 38 60 48 C 60 55, 20 55, 20 48 Z"
                  fill="#f43f5e"
                  animate={{
                    y: [0, -2, 1, -1, 0],
                    scaleY: [1, 1.15, 0.9, 1],
                  }}
                  transition={{
                    duration: 0.12,
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
            <motion.path
              d="M 30 30 L 50 30"
              fill={isSpeaking ? "#3b0712" : "none"}
              stroke={lashColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={isSpeaking
                ? {
                  d: [
                    "M 28 30 C 28 30, 40 30, 52 30 L 52 30 C 52 30, 40 30, 28 30 Z",
                    "M 28 25 C 28 25, 40 22, 52 25 L 52 35 C 52 35, 40 38, 28 35 Z",
                    "M 28 30 C 28 30, 40 30, 52 30 L 52 30 C 52 30, 40 30, 28 30 Z"
                  ]
                }
                : {}
              }
              transition={isSpeaking ? { duration: 0.4, repeat: Infinity } : {}}
            />
          </svg>
        );
    }
  };

  const isAlertEye = activeEyes === 'cute' || activeEyes === 'anime' || activeEyes === 'sparkle';
  const escleraScaleY = isSleeping ? 0.05 : (isAlertEye ? 1.25 : 1);
  const isSpiral = activeEyes === 'spiral';

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
                        transition={{ duration: 2.2, ease: "easeInOut" }}
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
                  {!isSleeping && !isSpiral && (
                    <motion.path
                      d="M 14 20 Q 50 24 86 20"
                      fill="none"
                      stroke={lashColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{
                        y: eyebrowY,
                        rotate: isHurt ? eyebrowRotate : (i === 0 ? eyebrowRotate : -eyebrowRotate),
                        originX: i === 0 ? "80%" : "20%",
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    />
                  )}

                  {/* Esclera Branca Interna */}
                  {!isSpiral && (
                    <motion.path
                      d="M 14 42 C 14 42, 50 42, 86 42 C 86 62, 72 76, 50 76 C 28 76, 14 62, 14 42 Z"
                      fill="#ffffff"
                      animate={{
                        scaleY: escleraScaleY,
                        originY: 0.32,
                      }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                    />
                  )}

                  {/* Renderizador de Pupila Personalizado */}
                  {!isSleeping && renderPupil(activeEyes, i)}

                  {/* Sombra da Pálpebra Superior */}
                  {!isSleeping && !isSpiral && (
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
                  {!isSleeping && !isSpiral && (
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
                  {!isSleeping && !isSpiral && (
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
                  {!isSleeping && !isSpiral && (
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
                  {!isSpiral && (
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
                  )}

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
          bottom: isMobile ? '6%' : '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '36px' : '54px',
          height: isMobile ? '28px' : '40px',
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
