// -----------------------------------------------------------------------------
// DU CONTENU ÉCRIT À CE QUI PART VERS L'ÉLÈVE — la compilation d'un exercice.
//
// On écrit un exercice avec ses réponses à côté des questions (types.ts,
// ExerciceSource). Ce module en tire deux choses :
//
//   · l'exercice PUBLIC : documents et questions, sans réponse ni explication.
//     Les options sont mélangées (une graine par question : le mélange est le
//     même à chaque compilation), et chaque identifiant qui pourrait trahir la
//     bonne réponse est remplacé — les options s'appellent a, b, c DANS L'ORDRE
//     OÙ ELLES S'AFFICHENT, les éléments touchables d'un schéma z1, z2… ;
//   · les CLÉS : une par question, avec ce qu'on affiche une fois la question
//     finie. Elles vont dans exercices_cles, que seul le serveur lit.
//
// Pur et déterministe : scripts/exercices-sql.ts s'en sert pour écrire les
// migrations, et le rejouer ne change pas une virgule.
// -----------------------------------------------------------------------------

import { motsMarques, texteDuBloc } from './mots'
import { formaterNombre, normaliser } from './normaliser'
import type {
  CleQuestion,
  Document,
  ExercicePublic,
  ExerciceSource,
  OptionPublique,
  QuestionPublique,
  QuestionSource,
} from './types'

// ------------------------------------------------------------- le hasard fixe

/** FNV-1a 32 bits : une graine stable depuis une chaîne. */
export function hacher(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32 : un générateur pseudo-aléatoire minuscule et reproductible. */
function alea(graine: number): () => number {
  let a = graine
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * L'ordre d'affichage (une permutation des indices 0..n-1), fixé par la graine.
 * `derange` : jamais l'ordre d'origine (un ordre à retrouver qui s'affiche déjà
 * dans le bon ordre n'est plus un exercice).
 */
export function melanger(n: number, graine: string, derange = false): number[] {
  const ordre = Array.from({ length: n }, (_, i) => i)
  const r = alea(hacher(graine))
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[ordre[i], ordre[j]] = [ordre[j], ordre[i]]
  }
  if (derange && n > 1 && ordre.every((v, i) => v === i)) {
    return [...ordre.slice(1), ordre[0]]
  }
  return ordre
}

const LETTRES = 'abcdefghijklmnopqrstuvwxyz'
const lettre = (i: number) => LETTRES[i] ?? `x${i}`

// --------------------------------------------------- les documents, nettoyés

/** Les mots-cibles d'un texte ou d'un dialogue : groupe → numéros de mots. */
type GroupesMots = Map<string, number[]>

type DocumentsCompiles = {
  documents: Document[]
  /** doc → (identifiant écrit → identifiant neutre). */
  renommages: Map<string, Map<string, string>>
  /** doc → groupes de mots marqués. */
  mots: Map<string, GroupesMots>
}

/** Remplace les identifiants écrits par des identifiants neutres (z1, z2…). */
function neutraliser(docs: Document[]): DocumentsCompiles {
  let compteur = 0
  const renommages = new Map<string, Map<string, string>>()
  const mots = new Map<string, GroupesMots>()
  const neutre = (doc: string, id: string | undefined): string | undefined => {
    if (id === undefined) return undefined
    const table = renommages.get(doc) ?? new Map<string, string>()
    renommages.set(doc, table)
    const deja = table.get(id)
    if (deja) return deja
    compteur += 1
    const z = `z${compteur}`
    table.set(id, z)
    return z
  }

  const documents = docs.map((doc): Document => {
    switch (doc.type) {
      case 'texte': {
        const { nettoyees, groupes } = motsMarques(doc.blocs.map(texteDuBloc))
        mots.set(doc.id, groupes)
        return {
          ...doc,
          blocs: doc.blocs.map((b, i) =>
            typeof b === 'string'
              ? nettoyees[i]
              : 'replique' in b
                ? { personnage: b.personnage, replique: nettoyees[i] }
                : { didascalie: nettoyees[i] },
          ),
        }
      }
      case 'dialogue': {
        const { nettoyees, groupes } = motsMarques(doc.repliques.map((r) => r.texte))
        mots.set(doc.id, groupes)
        return { ...doc, repliques: doc.repliques.map((r, i) => ({ qui: r.qui, texte: nettoyees[i] })) }
      }
      case 'carte':
        return {
          ...doc,
          lieux: doc.lieux?.map((l) => ({ ...l, id: neutre(doc.id, l.id) as string })),
          traits: doc.traits?.map((t) => ({ ...t, id: neutre(doc.id, t.id) })),
          aires: doc.aires?.map((a) => ({ ...a, id: neutre(doc.id, a.id) })),
        }
      case 'schema':
        return { ...doc, elements: doc.elements.map((e) => ({ ...e, id: neutre(doc.id, e.id) })) }
      case 'chaine': {
        const noeuds = doc.noeuds.map((n) => ({ ...n, id: neutre(doc.id, n.id) as string }))
        const table = renommages.get(doc.id)
        return {
          ...doc,
          noeuds,
          liens: doc.liens.map((l) => ({ ...l, de: table?.get(l.de) ?? l.de, a: table?.get(l.a) ?? l.a })),
        }
      }
      case 'frise':
        return {
          ...doc,
          periodes: doc.periodes?.map((p) => ({ ...p, id: neutre(doc.id, p.id) })),
          evenements: doc.evenements?.map((e) => ({ ...e, id: neutre(doc.id, e.id) as string })),
        }
      case 'fiche':
        return {
          ...doc,
          lignes: doc.lignes.map((l) => ('separateur' in l ? l : { ...l, id: neutre(doc.id, l.id) })),
        }
      case 'scratch': {
        const renommer = (blocs: import('./types').BlocScratch[]): import('./types').BlocScratch[] =>
          blocs.map((b) => ({
            ...b,
            id: neutre(doc.id, b.id),
            interieur: b.interieur ? renommer(b.interieur) : undefined,
            sinon: b.sinon ? renommer(b.sinon) : undefined,
          }))
        return { ...doc, scripts: doc.scripts.map(renommer) }
      }
      case 'figure':
        // Les POINTS gardent leur nom : il est écrit sur la figure. Le reste
        // (segments, polygones, angles, droites) prend un identifiant neutre.
        return {
          ...doc,
          segments: doc.segments?.map((s) => ({ ...s, id: neutre(doc.id, s.id) })),
          droites: doc.droites?.map((d) => ({ ...d, id: neutre(doc.id, d.id) })),
          demiDroites: doc.demiDroites?.map((d) => ({ ...d, id: neutre(doc.id, d.id) })),
          cercles: doc.cercles?.map((c) => ({ ...c, id: neutre(doc.id, c.id) })),
          angles: doc.angles?.map((a) => ({ ...a, id: neutre(doc.id, a.id) })),
          polygones: doc.polygones?.map((p) => ({ ...p, id: neutre(doc.id, p.id) })),
        }
      case 'droite':
        return { ...doc, points: doc.points?.map((p) => ({ ...p, id: neutre(doc.id, p.id) as string })) }
      case 'circuit':
        return { ...doc, branches: doc.branches.map((b) => ({ ...b, id: neutre(doc.id, b.id) })) }
      default:
        return doc
    }
  })
  return { documents: nettoyerUndefined(documents), renommages, mots }
}

/** JSON sans les clés `undefined` (le seed, et les tests, comparent des JSON). */
function nettoyerUndefined<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

/**
 * Traduit une cible écrite d'une question « zone » en identifiant public :
 * un groupe de mots devient ses numéros (`m12`), un identifiant renommé son
 * identifiant neutre ; les identifiants positionnels (k0, r1c2, v2.5, codes de
 * région, noms de points) passent tels quels.
 */
function ciblesPubliques(q: Extract<QuestionSource, { type: 'zone' }>, compiles: DocumentsCompiles): string[] {
  const groupes = compiles.mots.get(q.document)
  const table = compiles.renommages.get(q.document)
  const ids: string[] = []
  for (const cible of q.reponse) {
    if (groupes) {
      for (const n of groupes.get(cible) ?? []) ids.push(`m${n}`)
    } else {
      ids.push(table?.get(cible) ?? cible)
    }
  }
  return [...new Set(ids)]
}

// ---------------------------------------------------------------- questions

function compilerQuestion(
  q: QuestionSource,
  graine: string,
  compiles: DocumentsCompiles,
): { publique: QuestionPublique; cle: CleQuestion } {
  const base = { enonce: q.enonce, ...(q.aide ? { aide: q.aide } : {}) }
  const explication = q.explication
  switch (q.type) {
    case 'choix': {
      const ordre = q.ordreFixe ? q.options.map((_, i) => i) : melanger(q.options.length, graine)
      const options: OptionPublique[] = ordre.map((src, i) => ({ id: lettre(i), texte: q.options[src] }))
      const bonnes = new Set(Array.isArray(q.reponse) ? q.reponse : [q.reponse])
      const ids = ordre.flatMap((src, i) => (bonnes.has(src) ? [lettre(i)] : []))
      return {
        publique: { ...base, type: 'choix', options, multiple: Array.isArray(q.reponse) },
        cle: { cle: { type: 'choix', ids }, explication },
      }
    }
    case 'nombre':
      return {
        publique: { ...base, type: 'nombre', ...(q.unite ? { unite: q.unite } : {}) },
        cle: {
          cle: { type: 'nombre', valeur: q.reponse, tolerance: Math.abs(q.tolerance ?? 0) },
          affichage: `${formaterNombre(q.reponse)}${q.unite ? ` ${q.unite}` : ''}`,
          explication,
        },
      }
    case 'texte':
      return {
        publique: { ...base, type: 'texte', ...(q.placeholder ? { placeholder: q.placeholder } : {}) },
        cle: {
          cle: { type: 'texte', acceptes: [...new Set(q.reponse.map(normaliser).filter(Boolean))] },
          affichage: q.reponse[0],
          explication,
        },
      }
    case 'zone': {
      const ids = ciblesPubliques(q, compiles)
      return {
        publique: {
          ...base,
          type: 'zone',
          document: q.document,
          multiple: q.multiple ?? ids.length > 1,
          ...(q.portee ? { portee: q.portee } : {}),
        },
        cle: { cle: { type: 'zone', ids }, explication },
      }
    }
    case 'ordre': {
      const ordre = melanger(q.items.length, graine, true)
      const items = ordre.map((src, i) => ({ id: lettre(i), texte: q.items[src] }))
      // La clé : les identifiants dans l'ordre JUSTE (celui où c'est écrit).
      const idDe = new Map(ordre.map((src, i) => [src, lettre(i)] as const))
      return {
        publique: { ...base, type: 'ordre', items },
        cle: { cle: { type: 'ordre', ids: q.items.map((_, src) => idDe.get(src) as string) }, explication },
      }
    }
    case 'association': {
      const gauche = q.paires.map(([g], i) => ({ id: `g${i}`, texte: g }))
      const ordre = melanger(q.paires.length, graine, true)
      const droite = ordre.map((src, i) => ({ id: `d${i}`, texte: q.paires[src][1] }))
      const paires: Record<string, string> = {}
      ordre.forEach((src, i) => {
        paires[`g${src}`] = `d${i}`
      })
      return {
        publique: { ...base, type: 'association', gauche, droite },
        cle: { cle: { type: 'association', paires }, explication },
      }
    }
    case 'categories': {
      const categories = q.categories.map((nom, i) => ({ id: `c${i}`, texte: nom }))
      const ordre = melanger(q.items.length, graine, true)
      const items = ordre.map((src, i) => ({ id: `i${i}`, texte: q.items[src][0] }))
      const rangement: Record<string, string> = {}
      ordre.forEach((src, i) => {
        rangement[`i${i}`] = `c${q.items[src][1]}`
      })
      return {
        publique: { ...base, type: 'categories', categories, items },
        cle: { cle: { type: 'categories', items: rangement }, explication },
      }
    }
    case 'trous': {
      const morceaux = q.texte.split('___')
      const segments: (string | number)[] = []
      morceaux.forEach((m, i) => {
        if (m) segments.push(m)
        if (i < morceaux.length - 1) segments.push(i)
      })
      const banque = q.banque
        ? melanger(q.banque.length, graine).map((i) => (q.banque as string[])[i])
        : undefined
      return {
        publique: { ...base, type: 'trous', segments, ...(banque ? { banque } : {}) },
        cle: {
          cle: { type: 'trous', trous: q.reponses.map((r) => [...new Set(r.map(normaliser).filter(Boolean))]) },
          affichage: q.reponses.map((r) => r[0]).join(' · '),
          explication,
        },
      }
    }
  }
}

/** L'exercice public et ses clés. */
export function compilerExercice(ex: ExerciceSource): { public: ExercicePublic; cles: CleQuestion[] } {
  const compiles = neutraliser(ex.documents)
  const questions: QuestionPublique[] = []
  const cles: CleQuestion[] = []
  ex.questions.forEach((q, i) => {
    const { publique, cle } = compilerQuestion(q, `${ex.chapitre}:${ex.position}:${i}`, compiles)
    questions.push(publique)
    cles.push(cle)
  })
  return {
    public: nettoyerUndefined({
      titre: ex.titre,
      competence: ex.competence,
      situation: ex.situation,
      documents: compiles.documents,
      questions,
    }),
    cles: nettoyerUndefined(cles),
  }
}
