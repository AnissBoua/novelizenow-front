export function parseDate(value) {
  return new Date(String(value).replace(' ', 'T'));
}

export function relativeDay(value) {
  const days = Math.floor((Date.now() - parseDate(value).getTime()) / 86400000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} jours`;
  return `il y a ${Math.round(days / 30)} mois`;
}
