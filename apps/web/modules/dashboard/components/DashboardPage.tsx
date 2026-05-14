'use client';

/**
 * DashboardPage.tsx — Carrossel de slides horizontais
 * Design preservado: snap scroll, slide Laboratório como central, bento grid.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// ── Slide: Placeholder genérico ──────────────────────────────────────────────
interface PlaceholderSlideProps {
  id: string;
  title: string;
  accentColor: string;
  hasLeft?: boolean;
  hasRight?: boolean;
}

function PlaceholderSlide({ id, title, accentColor, hasLeft = true, hasRight = true }: PlaceholderSlideProps) {
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
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at center, ${accentColor}0d 0%, transparent 70%)`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <h2 style={{
        fontSize: 'clamp(2rem, 8vw, 3.5rem)',
        fontWeight: 950,
        letterSpacing: '15px',
        color: '#fff',
        textTransform: 'uppercase',
        opacity: 0.15,
        filter: 'blur(1px)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}>
        {title}
      </h2>
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
        background: 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.08) 0%, transparent 50%)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '360px', paddingTop: '0.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#fff' }}>arrow_back</span>
        </Link>
        <h1 style={{ color: '#38bdf8', letterSpacing: '4px', fontSize: '0.9rem', fontWeight: 900, opacity: 0.8, margin: 0 }}>
          LABORATÓRIO
        </h1>
        <div style={{ width: '40px' }} />
      </div>

      {/* Bento Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        width: '100%',
        maxWidth: '360px',
      }}>
        {/* Card fullwidth: Atividades */}
        <BentoCard
          icon="task-square" label="Atividades" value="12" unit="ATIVAS"
          color="#38bdf8" span={2}
          layout="row"
        />

        {/* Card: Foco */}
        <BentoCard icon="magic-star" label="Dias em Foco" value="07" unit="DIAS" color="#c084fc" />

        {/* Card: Sono */}
        <BentoCard icon="moon" label="Sono" value="85" unit="%" color="#2dd4bf" />

        {/* Card fullwidth: Saúde */}
        <div style={{
          gridColumn: 'span 2',
          background: 'rgba(251, 113, 133, 0.1)',
          border: '1px solid rgba(251, 113, 133, 0.2)',
          borderRadius: '20px',
          padding: '1.2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Saúde e Corpo</h3>
            <i className="icon-heart" style={{ color: '#fb7185', fontSize: '1.2rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[{ label: 'PESO', value: '78.5', unit: 'KG' }, { label: 'IMC', value: '24.2', unit: 'IDEAL' }].map((stat) => (
              <div key={stat.label} style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '0.8rem', textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.6rem', fontWeight: 700, marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ color: '#fff', fontWeight: 900 }}>{stat.value} <span style={{ fontSize: '0.6rem', color: '#fb7185' }}>{stat.unit}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChevronHint side="left" />
      <ChevronHint side="right" />
    </section>
  );
}

// ── Componentes Auxiliares ───────────────────────────────────────────────────
interface BentoCardProps {
  icon: string;
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
      <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${color}4d`, flexShrink: 0 }}>
        <i className={`icon-${icon}`} style={{ color: '#fff', fontSize: '1.5rem' }} />
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
      <span className="material-symbols-rounded" style={{ fontSize: '1.5rem', color: '#fff' }}>chevron_right</span>
    </div>
  );
}

// ── Dashboard Principal ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Inicia no slide Laboratório (índice 1)
  const handleCarouselLoad = (el: HTMLDivElement | null) => {
    if (el) {
      el.scrollLeft = window.innerWidth;
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
        <PlaceholderSlide id="slide-financas"  title="FINANÇAS" accentColor="#22c55e" hasLeft={false} />
        <LabSlide />
        <PlaceholderSlide id="slide-treino"    title="TREINO"   accentColor="#38bdf8" />
        <PlaceholderSlide id="slide-saude"     title="SAÚDE"    accentColor="#ef4444" />
        <PlaceholderSlide id="slide-dieta"     title="DIETA"    accentColor="#f97316" />
        <PlaceholderSlide id="slide-botanica"  title="BOTÂNICA" accentColor="#10b981" hasRight={false} />
      </div>
    </>
  );
}
