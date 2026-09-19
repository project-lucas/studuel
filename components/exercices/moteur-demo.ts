// -----------------------------------------------------------------------------
// LE MOTEUR DE DÉMONSTRATION — un exercice jouable SANS base ni compte.
//
// Pour l'aperçu de développement (/dev/exercices) : on relit un exercice écrit
// dans contenu/exercices, on le joue comme un élève, et on vérifie à l'œil que
// chaque carte se touche, que chaque réponse juste est déclarée juste. Les
// règles sont celles de lib/exercices (juger, bilan), miroirs de la base.
//
// ⚠️ Les clés sont ici CÔTÉ CLIENT : ce moteur ne sert qu'en développement.
// En production, le joueur passe par les actions serveur, et la clé ne quitte
// jamais la base.
// -----------------------------------------------------------------------------

import { juger } from '@/lib/exercices/juger'
import { bilan, GEMMES_PAR_ETOILES, XP_PAR_ETOILES, type EtatQuestion } from '@/lib/exercices/progression'
import type { CleQuestion, Etoiles } from '@/lib/exercices/types'
import type { MoteurExercice } from './Joueur'

export function moteurDemo(cles: CleQuestion[], etoiles: Etoiles): MoteurExercice {
  const passages = new Map<string, EtatQuestion[]>()
  let n = 0
  return {
    async commencer() {
      n += 1
      const id = `demo-${n}`
      passages.set(
        id,
        cles.map(() => ({ essais: 0, juste: false })),
      )
      return { ok: true, passage: id }
    },
    async verifier(passage, i, reponse) {
      const etats = passages.get(passage)
      const cle = cles[i]
      if (!etats || !cle) return { ok: false, raison: 'introuvable' }
      const e = etats[i]
      let verdict = { juste: e.juste, bons: 0, total: 0 }
      if (!e.juste && e.essais < 2) {
        verdict = juger(cle.cle, reponse as never)
        etats[i] = { essais: e.essais + 1, juste: verdict.juste }
      }
      const fin = etats[i]
      const fini = fin.juste || fin.essais >= 2
      await new Promise((r) => setTimeout(r, 180))
      return {
        ok: true,
        juste: fin.juste,
        essais: fin.essais,
        fini,
        bons: verdict.bons,
        total: verdict.total,
        correction: fini ? { cle: cle.cle, explication: cle.explication, ...(cle.affichage ? { affichage: cle.affichage } : {}) } : null,
      }
    },
    async terminer(passage) {
      const etats = passages.get(passage)
      if (!etats) return { ok: false, raison: 'introuvable' }
      const b = bilan(etats)
      return {
        ok: true,
        ...b,
        gemmes: b.reussi ? GEMMES_PAR_ETOILES[etoiles] : 0,
        xp: b.reussi ? XP_PAR_ETOILES[etoiles] : 0,
        deja: false,
      }
    },
  }
}
