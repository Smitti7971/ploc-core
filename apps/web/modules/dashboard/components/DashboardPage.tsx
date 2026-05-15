'use client';

/**
 * DashboardPage.tsx — Carrossel de slides horizontais
 * Design preservado: snap scroll, slide Laboratório como central, bento grid.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  CheckSquare, 
  Sparkles, 
  Moon, 
  Heart,
  ChevronRight,
  DollarSign,
  LucideIcon
} from 'lucide-react';
import { Dumbbell, Activity, Apple, Leaf } from 'lucide-react';
import { PillarPage } from '@/modules/routines/components/PillarPage';

// ── Slide: Placeholder genérico ──────────────────────────────────────────────
interface PlaceholderSlideProps {
  id: string;
  title: string;
  accentColor: string;
  icon: LucideIcon;
  hasLeft?: boolean;
  hasRight?: boolean;
}

function PlaceholderSlide({ id, title, accentColor, icon: Icon, hasLeft = true, hasRight = true }: PlaceholderSlideProps) {
  return (
    <section
      id={id}
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Texto Fantasma de Fundo */}
      <h2 style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(2rem, 15vw, 6rem)',
        fontWeight: 950,
        letterSpacing: '20px',
        color: '#fff',
        textTransform: 'uppercase',
        opacity: 0.03,
        filter: 'blur(1px)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        zIndex: 0
      }}>
        {title}
      </h2>

      {/* Conteúdo Centralizado */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 1
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: `${accentColor}1a`,
          border: `1px solid ${accentColor}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          boxShadow: `0 20px 40px rgba(0,0,0,0.4)`
        }}>
          <Icon size={40} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            color: '#fff', 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: 900, 
            letterSpacing: '2px' 
          }}>
            {title}
          </h3>
          <p style={{ 
            color: '#64748b', 
            margin: '5px 0 0', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Em Construção
          </p>
        </div>
      </div>

      {hasLeft && <ChevronHint side="left" />}
      {hasRight && <ChevronHint side="right" />}
    </section>
  );
}

// ── Slide: Laboratório (Central) ─────────────────────────────────────────────
function LabSlide() {
  const { user } = useAuthStore();

  const metrics = [
    { icon: 'task-square', label: 'Atividades', value: '12', unit: 'ATIVAS',  color: '#38bdf8', span: 2 },
    { icon: 'magic-star',  label: 'Dias em Foco', value: '07', unit: 'DIAS',  color: '#c084fc', span: 1 },
    { icon: 'moon',        label: 'Sono',          value: '85', unit: '%',     color: '#2dd4bf', span: 1 },
  ];

  return (
    <section
      id="slide-laboratorio"
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1.2rem',
        padding: '1.5rem 1rem 6rem',
        position: 'relative',
        background: '#000',
        overflowY: 'auto',
      }}
    >
      {/* Texto Fantasma de Fundo (Padrão Calendário) */}
      <h2 style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(2rem, 15vw, 6rem)',
        fontWeight: 950,
        letterSpacing: '20px',
        color: '#fff',
        textTransform: 'uppercase',
        opacity: 0.03,
        filter: 'blur(1px)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        zIndex: 0
      }}>
        ROTINAS
      </h2>

      {/* Header Simplificado */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '360px', paddingTop: '0.5rem', zIndex: 1 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={18} color="#fff" />
        </Link>
        <div style={{ width: '40px' }} />
      </div>

      {/* Conteúdo Centralizado (Placeholder Minimalista) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 1
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <Sparkles size={40} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            color: '#fff', 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: 900, 
            letterSpacing: '2px' 
          }}>
            ROTINAS
          </h3>
          <p style={{ 
            color: '#64748b', 
            margin: '5px 0 0', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Em Construção
          </p>
        </div>
      </div>

      <ChevronHint side="left" />
      <ChevronHint side="right" />
    </section>
  );
}

// ── Componentes Auxiliares ───────────────────────────────────────────────────
interface BentoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  span?: 1 | 2;
  layout?: 'row' | 'col';
}

function BentoCard({ icon, label, value, unit, color, span = 1, layout = 'col' }: BentoCardProps) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      background: `${color}1a`,
      border: `1px solid ${color}33`,
      borderRadius: '20px',
      padding: '1.2rem',
      display: 'flex',
      flexDirection: layout === 'row' ? 'row' : 'column',
      alignItems: layout === 'row' ? 'center' : 'flex-start',
      gap: layout === 'row' ? '1rem' : '0.5rem',
    }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${color}4d`, flexShrink: 0, color: '#fff' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{label}</h3>
        <div style={{ fontSize: layout === 'row' ? '1.5rem' : '1.4rem', fontWeight: 900, color: '#fff' }}>
          {value} <span style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>{unit}</span>
        </div>
      </div>
    </div>
  );
}

function ChevronHint({ side }: { side: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'absolute',
      [side]: '15px',
      top: '50%',
      transform: side === 'left' ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
      opacity: 0.2,
      animation: 'bounceX 2s infinite',
      pointerEvents: 'none',
    }}>
      <ChevronRight size={24} color="#fff" />
    </div>
  );
}

// ── Dashboard Principal ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Inicia no slide Central (Mente - índice 1 de 5)
  const handleCarouselLoad = (el: HTMLDivElement | null) => {
    if (el) {
      el.scrollLeft = window.innerWidth; // Começa na Mente
    }
  };

  return (
    <>
      <style>{`
        #dashboard-carousel::-webkit-scrollbar { display: none; }
        @keyframes bounceX {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translate(10px, -50%); }
        }
      `}</style>

      <div
        id="dashboard-carousel"
        ref={(el) => { carouselRef.current = el; handleCarouselLoad(el); }}
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <PillarPage pillarId="corpo" />
        <PillarPage pillarId="mente" />
        <PillarPage pillarId="vida" />
        <PillarPage pillarId="liberdade" />
        <PillarPage pillarId="proposito" />
      </div>
    </>
  );
}
