'use client'

import { useWorkTimer } from './useWorkTimer'

// Compteur de temps de travail INVISIBLE, monté sur l'espace Réviser (leçon +
// quiz). Il alimente le même /api/work-time que le chrono du Défi, pour que le
// temps passé à réviser compte dans l'espace parents. Aucun rendu.
export default function WorkTimer() {
  useWorkTimer()
  return null
}
