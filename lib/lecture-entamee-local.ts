// -----------------------------------------------------------------------------
// LE COURS ENTAMÉ, CÔTÉ NAVIGATEUR (28/10/2026) — le stock de lib/lecture-entamee
// dans `localStorage`. Importé par des composants clients : ni lib/catalog ni
// lib/supabase ici.
// -----------------------------------------------------------------------------

import { creerStockLocal } from '@/lib/stock-local'
import {
  avecLecture,
  parserStockLectures,
  sansLecture,
  type LectureEntamee,
  type StockLectures,
} from '@/lib/lecture-entamee'

export const CLE_LECTURES = 'studuel_lectures_entamees'

const VIDE: StockLectures = Object.freeze({})

export const stockLectures = creerStockLocal<StockLectures>(CLE_LECTURES, parserStockLectures, VIDE)

export function avancerLecture(l: LectureEntamee): void {
  stockLectures.ecrire(avecLecture(stockLectures.lire(), l))
}

export function oublierLecture(lessonId: string): void {
  const stock = stockLectures.lire()
  if (lessonId in stock) stockLectures.ecrire(sansLecture(stock, lessonId))
}
