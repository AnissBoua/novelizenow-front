export const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export const progressLabels = { ongoing: 'En cours', paused: 'En pause', completed: 'Terminé' };

export function formatPublishAt(value) {
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
}

export function rhythmLabel(rhythm, releaseDay) {
  const day = weekDays[releaseDay - 1];
  if (rhythm === 'weekly') return day ? `chaque ${day}` : 'chaque semaine';
  if (rhythm === 'biweekly') return day ? `un ${day} sur deux` : 'deux fois par mois';
  if (rhythm === 'irregular') return 'irrégulier';
  return '';
}
