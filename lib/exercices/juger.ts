// -----------------------------------------------------------------------------
// LE JUGEMENT D'UNE RÉPONSE — miroir EXACT de la fonction SQL `exercice_juger`
// (migration 372).
//
// C'est le SERVEUR qui juge : la clé d'une question ne quitte jamais la base,
// et les gemmes d'un exercice réussi ne se versent que sur son verdict. Ce
// module existe pour deux raisons : valider le contenu écrit (une clé
// injugeable — une option qui n'existe pas, un trou sans réponse — est refusée
// avant d'arriver en base), et épingler, par les mêmes cas de test qu'en SQL,
// ce que « juste » veut dire.
//
// Tout-ou-rien, mais PAS muet : `bons/total` dit combien d'éléments d'une
// réponse composée (des paires, des trous, un ordre) sont justes. L'écran s'en
// sert pour le coup de pouce (« 3 paires sur 5 sont justes ») sans dire
// lesquelles — sinon le second essai serait gratuit.
// -----------------------------------------------------------------------------

import { normaliser } from './normaliser'
import type { Cle, Reponse, Verdict } from './types'

/** Écart toléré sur un nombre, en plus de la tolérance écrite (arrondis flottants). */
const EPSILON = 1e-9

const faux = (total: number): Verdict => ({ juste: false, bons: 0, total })

function listeIds(r: Reponse): string[] | null {
  if (!('ids' in r) || !Array.isArray(r.ids)) return null
  return r.ids.filter((x): x is string => typeof x === 'string')
}

export function juger(cle: Cle, reponse: Reponse | null | undefined): Verdict {
  const r = reponse ?? ({} as Reponse)
  switch (cle.type) {
    case 'choix':
    case 'zone': {
      const attendus = new Set(cle.ids)
      const donnes = new Set(listeIds(r) ?? [])
      let bons = 0
      for (const id of donnes) if (attendus.has(id)) bons += 1
      const juste = bons === attendus.size && donnes.size === attendus.size
      return { juste, bons, total: attendus.size }
    }
    case 'ordre': {
      const donnes = listeIds(r) ?? []
      let bons = 0
      cle.ids.forEach((id, i) => {
        if (donnes[i] === id) bons += 1
      })
      const juste = donnes.length === cle.ids.length && bons === cle.ids.length
      return { juste, bons, total: cle.ids.length }
    }
    case 'nombre': {
      // Un NOMBRE JSON, et rien d'autre : ni « 12 » en chaîne, ni true. Le
      // client envoie toujours un nombre ; la même règle tient en SQL.
      const v = 'valeur' in r && typeof r.valeur === 'number' ? r.valeur : NaN
      if (!Number.isFinite(v)) return faux(1)
      const juste = Math.abs(v - cle.valeur) <= cle.tolerance + EPSILON
      return { juste, bons: juste ? 1 : 0, total: 1 }
    }
    case 'texte': {
      const t = 'texte' in r && typeof r.texte === 'string' ? normaliser(r.texte) : ''
      const juste = t !== '' && cle.acceptes.includes(t)
      return { juste, bons: juste ? 1 : 0, total: 1 }
    }
    case 'association':
    case 'categories': {
      const attendu = cle.type === 'association' ? cle.paires : cle.items
      const donne =
        cle.type === 'association'
          ? 'paires' in r && r.paires && typeof r.paires === 'object'
            ? r.paires
            : {}
          : 'items' in r && r.items && typeof r.items === 'object'
            ? r.items
            : {}
      const cles = Object.keys(attendu)
      let bons = 0
      for (const k of cles) {
        const d: unknown = (donne as Record<string, unknown>)[k]
        if (typeof d === 'string' && d === attendu[k]) bons += 1
      }
      return { juste: bons === cles.length, bons, total: cles.length }
    }
    case 'trous': {
      const donnes = 'trous' in r && Array.isArray(r.trous) ? r.trous : []
      let bons = 0
      cle.trous.forEach((acceptes, i) => {
        const d = typeof donnes[i] === 'string' ? normaliser(donnes[i]) : ''
        if (d !== '' && acceptes.includes(d)) bons += 1
      })
      return { juste: bons === cle.trous.length, bons, total: cle.trous.length }
    }
  }
}
