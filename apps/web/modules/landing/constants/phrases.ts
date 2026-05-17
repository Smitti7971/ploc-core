export interface ChallengePhrase {
  text: string;
  highlight: string;
  color: 'blue' | 'emerald' | 'gold' | 'violet';
}

export const CHALLENGE_PHRASES: ChallengePhrase[] = [
  { text: "PARE DE DESCULPAS.", highlight: "DESCULPAS", color: "gold" },
  { text: "ATÉ ONDE VOCÊ VAI?", highlight: "ATÉ ONDE", color: "gold" },
  { text: "NÃO SE SABOTE.", highlight: "SABOTE", color: "violet" },
  { text: "TENHA O CONTROLE.", highlight: "CONTROLE", color: "emerald" },
  { text: "SEU FOCO É REAL?", highlight: "FOCO", color: "blue" },
  { text: "JÁ ADIOU HOJE?", highlight: "JÁ ADIOU", color: "violet" },
  { text: "QUEM MANDA AQUI?", highlight: "QUEM MANDA", color: "violet" },
  { text: "VAI ENCARAR?", highlight: "ENCARAR", color: "blue" },
  { text: "ISSO É O SEU MELHOR?", highlight: "MELHOR", color: "gold" },
  { text: "PROVE O SEU VALOR.", highlight: "PROVE", color: "emerald" },
  { text: "SUA MENTE OBEDECE?", highlight: "OBEDECE", color: "emerald" },
  { text: "AGUENTA O TRANCO?", highlight: "AGUENTA", color: "violet" }
];
