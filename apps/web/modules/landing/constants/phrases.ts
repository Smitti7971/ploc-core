export interface ChallengePhrase {
  text: string;
  highlight: string;
  color: 'blue' | 'emerald' | 'gold' | 'violet';
}

export const CHALLENGE_PHRASES: ChallengePhrase[] = [
  { text: "QUAL A SUA  BOLHA?", highlight: "BOLHA", color: "blue" },
  { text: "CONHEÇA A SÍ MESMO", highlight: "SÍ", color: "gold" },
  { text: "NÃO SE SABOTE.", highlight: "SABOTE", color: "violet" },
  { text: "MANTENHA O CONTROLE.", highlight: "CONTROLE", color: "emerald" },
  { text: "SEU FOCO É REAL?", highlight: "FOCO", color: "blue" },
  { text: "VAMOS MUDAR HOJE?", highlight: "HOJE", color: "violet" },
  { text: "ISSO É O SEU MELHOR?", highlight: "MELHOR", color: "gold" },
  { text: "SUA MENTE OBEDECE?", highlight: "OBEDECE", color: "emerald" },
  { text: "AGUENTA O TRANCO?", highlight: "AGUENTA", color: "violet" }
];
