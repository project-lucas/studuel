'use client'

import { useState, useSyncExternalStore } from 'react'
import { lectureDe, type LectureEntamee } from '@/lib/lecture-entamee'
import { stockLectures } from '@/lib/lecture-entamee-local'

/**
 * Le cours ENTAMÉ d'une leçon (lib/lecture-entamee), lu dans le navigateur :
 * `null` côté serveur, à l'hydratation, et quand la leçon n'est pas entamée.
 * Sert au dossier de matière (« lu à 60 % » sur la fiche, la bannière qui dit
 * « Reprendre la lecture »).
 */
export function useLectureEntamee(lessonId: string | null | undefined): LectureEntamee | null {
  const stock = useSyncExternalStore(stockLectures.abonner, stockLectures.lire, stockLectures.serveur)
  // L'heure d'ouverture, figée : « moins d'un mois » se juge une fois.
  const [maintenant] = useState(() => Date.now())
  return lectureDe(stock, lessonId, maintenant)
}
