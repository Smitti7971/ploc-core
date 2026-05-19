// Pool de bolhas decorativas para o design da Landing Page (modo 'decor')
export const DECOR_CONCEPTS = [
  { word: 'd1', left: '10%', size: 45, duration: 19, delay: 0, theme: 'glass', maxOpacity: 0.45, zIndex: 18 },
  { word: 'd2', left: '20%', size: 65, duration: 22, delay: 2, theme: 'glass', maxOpacity: 0.5, zIndex: 20 },
  { word: 'd3', left: '35%', size: 35, duration: 17, delay: 4, theme: 'glass', maxOpacity: 0.35, zIndex: 14 },
  { word: 'd4', left: '50%', size: 70, duration: 21, delay: 6, theme: 'glass', maxOpacity: 0.5, zIndex: 20 },
  { word: 'd5', left: '65%', size: 50, duration: 20, delay: 8, theme: 'glass', maxOpacity: 0.4, zIndex: 18 },
  { word: 'd6', left: '80%', size: 40, duration: 23, delay: 10, theme: 'glass', maxOpacity: 0.35, zIndex: 14 },
  { word: 'd7', left: '92%', size: 60, duration: 18, delay: 12, theme: 'glass', maxOpacity: 0.45, zIndex: 18 },
  { word: 'd8', left: '15%', size: 38, duration: 20, delay: 14, theme: 'glass', maxOpacity: 0.35, zIndex: 14 },
  { word: 'd9', left: '42%', size: 55, duration: 21, delay: 16, theme: 'glass', maxOpacity: 0.45, zIndex: 18 },
  { word: 'd10', left: '72%', size: 68, duration: 20, delay: 18, theme: 'glass', maxOpacity: 0.5, zIndex: 20 }
] as const;

// Pool de bolhas do Minijogo Gamificado do Ploc (S1..S10, n1..n20)
export const BASE_CONCEPTS = [
  // ── A. Bolhas Positivas Especiais Raras (+2 pontos de categoria, Aura Dourada) ──
  { word: 'S1', left: '10%', size: 75, duration: 25, delay: 0, theme: 'gold', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S2', left: '30%', size: 75, duration: 28, delay: 2, theme: 'gold', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S3', left: '50%', size: 75, duration: 24, delay: 4, theme: 'gold', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S4', left: '70%', size: 75, duration: 27, delay: 6, theme: 'gold', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S5', left: '90%', size: 75, duration: 26, delay: 8, theme: 'gold', maxOpacity: 0.8, zIndex: 20 },

  // ── B. Bolhas Negativas Especiais Raras (-2 pontos de categoria, Aura Vermelha) ──
  { word: 'S6', left: '20%', size: 70, duration: 24, delay: 1, theme: 'rose', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S7', left: '40%', size: 70, duration: 27, delay: 3, theme: 'rose', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S8', left: '60%', size: 70, duration: 25, delay: 5, theme: 'rose', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S9', left: '80%', size: 70, duration: 29, delay: 7, theme: 'rose', maxOpacity: 0.8, zIndex: 20 },
  { word: 'S10', left: '95%', size: 70, duration: 26, delay: 9, theme: 'rose', maxOpacity: 0.8, zIndex: 20 },

  // ── C. Bolhas Positivas Normais (+1 ponto de subcategoria, Azul/Verde/Violeta) ──
  { word: 'n1', left: '15%', size: 60, duration: 20, delay: 0, theme: 'emerald', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n2', left: '25%', size: 60, duration: 22, delay: 2, theme: 'emerald', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n3', left: '35%', size: 60, duration: 19, delay: 4, theme: 'blue', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n4', left: '45%', size: 60, duration: 21, delay: 6, theme: 'blue', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n5', left: '55%', size: 60, duration: 18, delay: 8, theme: 'violet', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n6', left: '65%', size: 60, duration: 20, delay: 10, theme: 'violet', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n7', left: '75%', size: 60, duration: 23, delay: 12, theme: 'blue', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n8', left: '85%', size: 60, duration: 21, delay: 14, theme: 'blue', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n9', left: '92%', size: 60, duration: 22, delay: 16, theme: 'violet', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n10', left: '8%', size: 60, duration: 19, delay: 18, theme: 'violet', maxOpacity: 0.7, zIndex: 20 },

  // ── D. Bolhas Negativas Normais (-1 ponto de subcategoria, Vermelha) ──
  { word: 'n11', left: '18%', size: 55, duration: 21, delay: 1, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n12', left: '28%', size: 55, duration: 19, delay: 3, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n13', left: '38%', size: 55, duration: 22, delay: 5, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n14', left: '48%', size: 55, duration: 20, delay: 7, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n15', left: '58%', size: 55, duration: 18, delay: 9, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n16', left: '68%', size: 55, duration: 23, delay: 11, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n17', left: '78%', size: 55, duration: 21, delay: 13, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n18', left: '88%', size: 55, duration: 19, delay: 15, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n19', left: '94%', size: 55, duration: 22, delay: 17, theme: 'rose', maxOpacity: 0.7, zIndex: 20 },
  { word: 'n20', left: '12%', size: 55, duration: 20, delay: 19, theme: 'rose', maxOpacity: 0.7, zIndex: 20 }
] as const;
