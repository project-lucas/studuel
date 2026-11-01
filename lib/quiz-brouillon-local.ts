// -----------------------------------------------------------------------------
// LA MANCHE INACHEVÉE, CÔTÉ NAVIGATEUR (28/10/2026).
//
// Le stock des brouillons (lib/quiz-brouillon) dans `localStorage`, et sa
// recopie en base (migration 604) par la route `/api/quiz/brouillon` — une
// route et pas une Server Action : Next exécute les actions une par une, et une
// sauvegarde ferait la queue devant `recordTestSession` à la fin de la manche.
//
// Ce module est importé par des composants clients : il n'importe ni
// lib/catalog ni lib/supabase (règle du préchargement des onglets).
// -----------------------------------------------------------------------------

import { creerStockLocal } from '@/lib/stock-local'
import {
  avecBrouillon,
  avecClose,
  parserCloses,
  parserStockBrouillons,
  sansBrouillon,
  type BrouillonQuiz,
  type ManchesCloses,
  type StockBrouillons,
} from '@/lib/quiz-brouillon'

export const CLE_BROUILLONS = 'studuel_quiz_brouillons'

const VIDE: StockBrouillons = Object.freeze({})

export const stockBrouillons = creerStockLocal<StockBrouillons>(
  CLE_BROUILLONS,
  parserStockBrouillons,
  VIDE,
)

export function poserBrouillon(b: BrouillonQuiz): void {
  stockBrouillons.ecrire(avecBrouillon(stockBrouillons.lire(), b))
}

export const CLE_CLOSES = 'studuel_quiz_closes'

const CLOSES_VIDE: ManchesCloses = Object.freeze({})

/** Les manches closes sur cet appareil (cf. `copieEncoreValable`). */
export const stockCloses = creerStockLocal<ManchesCloses>(CLE_CLOSES, parserCloses, CLOSES_VIDE)

/** La manche est close : elle quitte le navigateur, et sa copie en base ne vaut plus. */
export function oublierBrouillon(quizId: string): void {
  const stock = stockBrouillons.lire()
  if (quizId in stock) stockBrouillons.ecrire(sansBrouillon(stock, quizId))
  stockCloses.ecrire(avecClose(stockCloses.lire(), quizId, new Date()))
}

export const ROUTE_BROUILLON = '/api/quiz/brouillon'

/**
 * Recopie la manche en base (ou l'efface, `brouillon: null`). `keepalive` :
 * l'envoi part au moment où l'élève QUITTE l'écran (onglet caché, retour) et
 * doit survivre à la page. Sans réponse attendue, jamais d'erreur visible :
 * le brouillon local reste, c'est lui qui sert sur cet appareil.
 */
export function recopierBrouillon(quizId: string, brouillon: BrouillonQuiz | null): void {
  try {
    void fetch(ROUTE_BROUILLON, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, brouillon }),
    }).catch(() => {})
  } catch {
    // `fetch` absent (test, très vieux navigateur) : le local suffit.
  }
}
