export function formatMinutes(totalMinutes: number | undefined): string {
  if (totalMinutes === undefined || isNaN(totalMinutes)) return '0 min';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
