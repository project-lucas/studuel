import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { compilerExercice } from './compiler'
import { juger } from './juger'
import type { Cle, FichierExercices, Reponse } from './types'
import { validerFichier } from './valider'

// -----------------------------------------------------------------------------
// TOUT LE CONTENU DU CAHIER, RELU À CHAQUE `npm test`.
//
// Chaque fichier de contenu/exercices passe le validateur (lib/exercices/
// valider.ts), puis chaque exercice est COMPILÉ comme pour la migration, et
// chaque clé est rejouée : la bonne réponse, telle que l'écran l'enverrait,
// doit être jugée juste — et une réponse vide, jugée fausse. Un exercice qui
// déclarerait faux l'élève qui a juste ne passe pas.
// -----------------------------------------------------------------------------

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'contenu', 'exercices')

function fichiers(): string[] {
  if (!fs.existsSync(RACINE)) return []
  return fs.readdirSync(RACINE).flatMap((niveau) => {
    const dossier = path.join(RACINE, niveau)
    if (!fs.statSync(dossier).isDirectory()) return []
    return fs
      .readdirSync(dossier)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(niveau, f))
  })
}

/** La réponse parfaite, telle que l'écran l'enverrait, lue dans la clé. */
function bonneReponse(cle: Cle): Reponse {
  switch (cle.type) {
    case 'choix':
    case 'zone':
    case 'ordre':
      return { ids: cle.ids }
    case 'nombre':
      return { valeur: cle.valeur }
    case 'texte':
      return { texte: cle.acceptes[0] }
    case 'association':
      return { paires: cle.paires }
    case 'categories':
      return { items: cle.items }
    case 'trous':
      return { trous: cle.trous.map((t) => t[0]) }
  }
}

describe('contenu/exercices', () => {
  const liste = fichiers()

  it('les fichiers sont nommés <niveau>/<matière>[.<lot>].json et annoncent la même chose', () => {
    for (const f of liste) {
      const brut = JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8')) as FichierExercices
      const [niveau, nom] = f.split(path.sep)
      expect(brut.niveau, f).toBe(niveau)
      expect(brut.matiere, f).toBe(nom.replace(/\.json$/, '').split('.')[0])
    }
  })

  it('un chapitre n’a qu’un exercice par position, tous fichiers confondus', () => {
    const vus = new Map<string, string>()
    const doublons: string[] = []
    for (const f of liste) {
      const brut = JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8')) as FichierExercices
      for (const ex of brut.exercices) {
        const cle = `${ex.chapitre}:${ex.position}`
        const deja = vus.get(cle)
        if (deja) doublons.push(`${cle} dans ${deja} et ${f}`)
        vus.set(cle, f)
      }
    }
    expect(doublons).toEqual([])
  })

  for (const f of liste) {
    describe(f, () => {
      const fichier = JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8')) as FichierExercices

      it('passe le validateur', () => {
        const fautes = validerFichier(fichier, f)
        expect(fautes.map((x) => `${x.chemin} : ${x.message}`)).toEqual([])
      })

      it('chaque clé juge juste la bonne réponse et faux une réponse vide', () => {
        for (const [n, ex] of fichier.exercices.entries()) {
          const { public: pub, cles } = compilerExercice(ex)
          expect(cles.length, `${f} exercice ${n + 1}`).toBe(pub.questions.length)
          cles.forEach((c, i) => {
            const ou = `${f} · exercice ${n + 1} · question ${i + 1}`
            expect(juger(c.cle, bonneReponse(c.cle)).juste, ou).toBe(true)
            expect(juger(c.cle, {} as Reponse).juste, ou).toBe(false)
            expect(c.explication.length, ou).toBeGreaterThan(0)
          })
          // Aucune réponse ne fuit dans ce qui part vers l'élève.
          const json = JSON.stringify(pub)
          expect(json.includes('"reponse"') || json.includes('"explication"') || /\[\[[A-Za-z0-9_-]+\|/.test(json), f).toBe(false)
        }
      })
    })
  }
})
