import { useExerciseDatabaseStore } from '../store/useExerciseDatabaseStore';

export const equipmentImages: Record<string, string> = {
  // Geradas pela IA
  'Banco reto': '/equip/banco_reto.png',
  'Banco inclinado': '/equip/banco_inclinado.png',
  'Banco declinado': '/equip/banco_declinado.png',
  'Barra fixa': '/equip/barra.png',
  'Barra olímpica': '/equip/barra.png',
  'Barra reta': '/equip/barra.png',
  'Barra W': '/equip/barra.png',
  'Barra': '/equip/barra.png',
  'Halteres': '/equip/halteres.png',

  // Peitoral
  'Chest Press': '/equip/chest_press.png',
  'Supino Articulado': '/equip/supino_articulado.png',
  'Peck Deck': '/equip/peck_deck.png',
  'Crossover': '/equip/crossover.png',
  'Máquina de Supino Inclinado': '/equip/supino_inclinado_maq.png',

  // Costas
  'Puxador Frontal': '/equip/puxador_frontal.png',
  'Puxador Articulado': '/equip/puxador_articulado.png',
  'Remada Baixa': '/equip/remada_baixa.png',
  'Remada Cavalinho': '/equip/remada_cavalinho.png',
  'Remada Articulada': '/equip/remada_articulada.png',

  // Ombros
  'Desenvolvimento Articulado': '/equip/desenvolvimento_articulado.png',
  'Elevação Lateral Máquina': '/equip/elevacao_lateral_maq.png',

  // Bíceps & Tríceps
  'Rosca Scott Máquina': '/equip/rosca_scott_maq.png',
  'Polia Baixa': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200&auto=format&fit=crop',
  'Polia Alta': 'https://images.unsplash.com/photo-1534438097544-adbfde91ea3c?q=80&w=200&auto=format&fit=crop',
  'Tríceps Máquina': 'https://images.unsplash.com/photo-1574680178050-55c6c06a3e5e?q=80&w=200&auto=format&fit=crop',
  'Pegadores de força': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=200&auto=format&fit=crop',

  // Abdômen & Lombar
  'Máquina Abdominal': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200&auto=format&fit=crop',
  'Banco Abdominal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop',
  'Colchonete': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200&auto=format&fit=crop',
  'Banco Romano': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=200&auto=format&fit=crop',
  'Máquina Lombar': 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=200&auto=format&fit=crop',

  // Pernas / Glúteos
  'Glúteo Máquina': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop',
  'Smith': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop',
  'Leg Press': 'https://images.unsplash.com/photo-1534438097544-adbfde91ea3c?q=80&w=200&auto=format&fit=crop',
  'Cadeira Extensora': 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=200&auto=format&fit=crop',
  'Hack Machine': 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=200&auto=format&fit=crop',
  'Mesa Flexora': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop',
  'Cadeira Flexora': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop',
  'Flexora em Pé': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=200&auto=format&fit=crop',
  'Panturrilha Sentado': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop',
  'Panturrilha em Pé': 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=200&auto=format&fit=crop',
  'Step': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200&auto=format&fit=crop',

  // Cardio
  'Esteira': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=200&auto=format&fit=crop',
  'Bicicleta Vertical': 'https://images.unsplash.com/photo-1507398941214-5a10cb23119c?q=80&w=200&auto=format&fit=crop',
  'Bicicleta Horizontal': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200&auto=format&fit=crop',
  'Elíptico': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200&auto=format&fit=crop',
  'Air Bike': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop',
  'Máquina de Remo': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop',
  'Escada Infinita': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=200&auto=format&fit=crop',
  'Kettlebell': 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?q=80&w=200&auto=format&fit=crop',
  'Corda': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=200&auto=format&fit=crop',
  'Elástico': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=200&auto=format&fit=crop',
  'Paralelas': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=200&auto=format&fit=crop',
  'Argolas': 'https://images.unsplash.com/photo-1533681436852-0bb156b16d1f?q=80&w=200&auto=format&fit=crop'
};

export const getEquipmentImage = (eqName: string) => {
  // 1. Try to find in custom equipments
  const customEq = useExerciseDatabaseStore.getState().customEquipments.find(e => e.name === eqName);
  if (customEq && customEq.image) return customEq.image;

  // 2. Try static dictionary
  if (equipmentImages[eqName]) return equipmentImages[eqName];

  const lower = eqName.toLowerCase();
  if (lower.includes('halter')) return '/equip/halteres.png';
  if (lower.includes('barra') || lower.includes('smith')) return '/equip/barra.png';
  if (lower.includes('esteira') || lower.includes('bicicleta') || lower.includes('remo') || lower.includes('elíptico')) return 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=200&auto=format&fit=crop';
  if (lower.includes('colchonete') || lower.includes('corda') || lower.includes('elástico') || lower.includes('step')) return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop'; // Default machine
};

export const getExerciseImage = (exName: string, equipment?: string) => {
  // Try to use the specific generated exercise image if it exists
  const specificExImage = `/exercicios/ex_${exName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
  
  // For now, only ex_chest_1 exists since quota exhausted
  if (exName === 'Supino Inclinado com Halteres') return '/exercicios/ex_chest_1.png';

  // Fallback to equipment image
  const eq = equipment || 'Colchonete';
  return getEquipmentImage(eq);
};
