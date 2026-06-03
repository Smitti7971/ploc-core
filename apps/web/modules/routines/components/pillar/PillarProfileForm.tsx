import React from 'react';

interface PillarProfileFormProps {
  pillarId: string;
  profile: any;
  handleInputChange: (field: string, value: string) => void;
}

export function PillarProfileForm({ pillarId, profile, handleInputChange }: PillarProfileFormProps) {
  const inputStyle = {
    display: 'flex',
    width: '50%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1px',
  };

  if (pillarId === 'corpo') {
    return (
      <div className="flex flex-col gap-2">
        <div style={formGroupStyle}>
          <label htmlFor="peso" style={labelStyle}>PESO (KG)</label>
          <input
            id="peso"
            name="peso"
            type="number"
            placeholder="Ex: 75"
            value={profile.peso || ''}
            onChange={e => handleInputChange('peso', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="altura" style={labelStyle}>ALTURA (CM)</label>
          <input
            id="altura"
            name="altura"
            type="number"
            placeholder="Ex: 180"
            value={profile.altura || ''}
            onChange={e => handleInputChange('altura', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="horasSono" style={labelStyle}>HORAS DE SONO DIÁRIAS</label>
          <input
            id="horasSono"
            name="horasSono"
            type="number"
            placeholder="Ex: 7h a 8h"
            value={profile.horasSono || ''}
            onChange={e => handleInputChange('horasSono', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="treinoFreq" style={labelStyle}>FREQUÊNCIA DE ACADEMIA / TREINO</label>
          <input
            id="treinoFreq"
            name="treinoFreq"
            type="text"
            placeholder="Ex: 3x na semana"
            value={profile.treinoFreq || ''}
            onChange={e => handleInputChange('treinoFreq', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="medidas" style={labelStyle}>TAMANHOS / MEDIDAS CORPORAIS</label>
          <input
            id="medidas"
            name="medidas"
            type="text"
            placeholder="Ex: Peito: 100cm, Cintura: 80cm, Bíceps: 38cm"
            value={profile.medidas || ''}
            onChange={e => handleInputChange('medidas', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="aguaLiters" style={labelStyle}>CONSUMO DE ÁGUA DIÁRIO</label>
          <input
            id="aguaLiters"
            name="aguaLiters"
            type="text"
            placeholder="Ex: 2.5 Litros"
            value={profile.aguaLiters || ''}
            onChange={e => handleInputChange('aguaLiters', e.target.value)}
            style={inputStyle}
            className="focus:border-red-500/50 focus:bg-white/[0.05]"
          />
        </div>
      </div>
    );
  }

  if (pillarId === 'mente') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div style={formGroupStyle}>
          <label htmlFor="estresse" style={labelStyle}>NÍVEL DE ESTRESSE</label>
          <select
            id="estresse"
            name="estresse"
            value={profile.estresse || ''}
            onChange={e => handleInputChange('estresse', e.target.value)}
            style={inputStyle}
            className="focus:border-sky-500/50 focus:bg-white/[0.05] appearance-none"
          >
            <option value="" disabled style={{ background: '#0d0f0d' }}>Selecione...</option>
            <option value="Baixo" style={{ background: '#0d0f0d' }}>Baixo</option>
            <option value="Médio" style={{ background: '#0d0f0d' }}>Médio</option>
            <option value="Alto" style={{ background: '#0d0f0d' }}>Alto</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="meditacao" style={labelStyle}>PRÁTICA DE MEDITAÇÃO</label>
          <select
            id="meditacao"
            name="meditacao"
            value={profile.meditacao || ''}
            onChange={e => handleInputChange('meditacao', e.target.value)}
            style={inputStyle}
            className="focus:border-sky-500/50 focus:bg-white/[0.05]"
          >
            <option value="" disabled style={{ background: '#0d0f0d' }}>Selecione...</option>
            <option value="Sim, Diariamente" style={{ background: '#0d0f0d' }}>Sim, Diariamente</option>
            <option value="Sim, Ocasionalmente" style={{ background: '#0d0f0d' }}>Sim, Ocasionalmente</option>
            <option value="Não pratico" style={{ background: '#0d0f0d' }}>Não pratico</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="horasTela" style={labelStyle}>HORAS DE TELA DIÁRIAS</label>
          <input
            id="horasTela"
            name="horasTela"
            type="text"
            placeholder="Ex: 5h"
            value={profile.horasTela || ''}
            onChange={e => handleInputChange('horasTela', e.target.value)}
            style={inputStyle}
            className="focus:border-sky-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="focoPrincipal" style={labelStyle}>FOCO PRINCIPAL ATUAL</label>
          <input
            id="focoPrincipal"
            name="focoPrincipal"
            type="text"
            placeholder="Ex: Controlar ansiedade / Manter foco nos estudos"
            value={profile.focoPrincipal || ''}
            onChange={e => handleInputChange('focoPrincipal', e.target.value)}
            style={inputStyle}
            className="focus:border-sky-500/50 focus:bg-white/[0.05]"
          />
        </div>
      </div>
    );
  }

  if (pillarId === 'vida') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div style={formGroupStyle}>
          <label htmlFor="alimentacao" style={labelStyle}>QUALIDADE DA ALIMENTAÇÃO</label>
          <input
            id="alimentacao"
            name="alimentacao"
            type="text"
            placeholder="Ex: Saudável, equilibrada"
            value={profile.alimentacao || ''}
            onChange={e => handleInputChange('alimentacao', e.target.value)}
            style={inputStyle}
            className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="lazerHoras" style={labelStyle}>TEMPO DE LAZER DIÁRIO</label>
          <input
            id="lazerHoras"
            name="lazerHoras"
            type="text"
            placeholder="Ex: 2 horas"
            value={profile.lazerHoras || ''}
            onChange={e => handleInputChange('lazerHoras', e.target.value)}
            style={inputStyle}
            className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="relacionamentos" style={labelStyle}>SATISFAÇÃO COM RELACIONAMENTOS</label>
          <input
            id="relacionamentos"
            name="relacionamentos"
            type="text"
            placeholder="Ex: Muito satisfeito com a família e círculo social"
            value={profile.relacionamentos || ''}
            onChange={e => handleInputChange('relacionamentos', e.target.value)}
            style={inputStyle}
            className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
          />
        </div>
      </div>
    );
  }

  if (pillarId === 'liberdade') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div style={formGroupStyle}>
          <label htmlFor="horasLivres" style={labelStyle}>HORAS LIVRES DIÁRIAS</label>
          <input
            id="horasLivres"
            name="horasLivres"
            type="text"
            placeholder="Ex: 4h livres"
            value={profile.horasLivres || ''}
            onChange={e => handleInputChange('horasLivres', e.target.value)}
            style={inputStyle}
            className="focus:border-amber-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="viciosAtivos" style={labelStyle}>VÍCIOS EM MONITORAMENTO</label>
          <input
            id="viciosAtivos"
            name="viciosAtivos"
            type="text"
            placeholder="Ex: Tabagismo, Redes Sociais"
            value={profile.viciosAtivos || ''}
            onChange={e => handleInputChange('viciosAtivos', e.target.value)}
            style={inputStyle}
            className="focus:border-amber-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="autonomia" style={labelStyle}>NÍVEL DE AUTONOMIA PESSOAL</label>
          <input
            id="autonomia"
            name="autonomia"
            type="text"
            placeholder="Ex: Consigo organizar meus horários de trabalho de forma flexível"
            value={profile.autonomia || ''}
            onChange={e => handleInputChange('autonomia', e.target.value)}
            style={inputStyle}
            className="focus:border-amber-500/50 focus:bg-white/[0.05]"
          />
        </div>
      </div>
    );
  }

  if (pillarId === 'proposito') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div style={formGroupStyle}>
          <label htmlFor="metaAno" style={labelStyle}>META PRINCIPAL DO ANO</label>
          <input
            id="metaAno"
            name="metaAno"
            type="text"
            placeholder="Ex: Passar na prova X / Lançar o produto Y"
            value={profile.metaAno || ''}
            onChange={e => handleInputChange('metaAno', e.target.value)}
            style={inputStyle}
            className="focus:border-purple-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="alinhamentoCarreira" style={labelStyle}>ALINHAMENTO COM CARREIRA</label>
          <input
            id="alinhamentoCarreira"
            name="alinhamentoCarreira"
            type="text"
            placeholder="Ex: Super alinhado com meus objetivos"
            value={profile.alinhamentoCarreira || ''}
            onChange={e => handleInputChange('alinhamentoCarreira', e.target.value)}
            style={inputStyle}
            className="focus:border-purple-500/50 focus:bg-white/[0.05]"
          />
        </div>
        <div style={formGroupStyle} className="sm:col-span-2">
          <label htmlFor="sentidoDirecao" style={labelStyle}>SENTIMENTO DE DIREÇÃO ATUAL</label>
          <input
            id="sentidoDirecao"
            name="sentidoDirecao"
            type="text"
            placeholder="Ex: Totalmente focado nas minhas conquistas diárias"
            value={profile.sentidoDirecao || ''}
            onChange={e => handleInputChange('sentidoDirecao', e.target.value)}
            style={inputStyle}
            className="focus:border-purple-500/50 focus:bg-white/[0.05]"
          />
        </div>
      </div>
    );
  }

  return null;
}
