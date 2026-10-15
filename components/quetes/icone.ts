import type { QueteServie } from '@/lib/quests'

/** Le dessin d'une quête : celui de la tuile de chapitre ou de l'onglet où elle se joue. */
export function iconeQuete(q: Pick<QueteServie, 'id' | 'pilier'>): string {
  if (q.id.startsWith('exercice')) return '/images/supports/exercice.webp'
  // Revenir chaque jour : la flamme de la série (577).
  if (q.pilier === 'revenir') return '/images/serie/flamme-v3-fixe.webp'
  if (q.pilier === 'apprendre') return '/images/supports/cours.webp'
  if (q.pilier === 'tester') return '/images/supports/quiz.webp'
  return '/images/nav/defi.webp'
}
