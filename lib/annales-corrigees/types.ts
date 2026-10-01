// Les annales corrigées : un SUJET OFFICIEL (le PDF du ministère, habillé aux
// couleurs de Studuel) et son CORRIGÉ STUDUEL, écrit par nous, partie par
// partie.
//
// À ne pas confondre avec ses voisines :
//  · `lib/annales.ts` — « cette année finit-elle par un examen ? » ;
//  · `lib/exam-papers.ts` — la STRUCTURE d'une épreuve (durée, barème,
//    parties), lue en base (migrations 236/237).
// Ici : des sujets réellement tombés, et leur correction.
//
// Le contenu vit en JSON dans `contenu/annales/<id>.json`, comme le cahier
// d'exercices, et PAS en base : il est le même pour tous et ne change jamais.
// Il n'est lu que côté serveur — le corpus ne descend jamais dans le
// navigateur, seul le corrigé ouvert est rendu.
//
// ⚠️ LES CORRIGÉS SONT ÉCRITS PAR STUDUEL. Aucun corrigé d'un tiers n'est
// repris, même reformulé : le guide est `docs/annales-corrigees.md`.

export type Niveau = 'Tle' | '1re' | '3e'
export type Examen = 'bac' | 'bac-anticipe' | 'brevet'

/**
 * Le texte courant d'un bloc accepte un balisage minimal, rendu par
 * `lib/annales-corrigees/texte.ts` :
 *   **gras** · *italique* · `code` · $formule KaTeX$
 * Rien d'autre : ni HTML, ni lien, ni titre markdown.
 */
export type Bloc =
  /** Intertitre à l'intérieur d'une partie (« I. Le bonheur… », « Partie A »). */
  | { type: 'titre'; texte: string }
  | { type: 'texte'; texte: string }
  | { type: 'liste'; items: string[]; ordonnee?: boolean }
  /** Équation centrée, en TeX (KaTeX), sans les `$`. */
  | { type: 'formule'; tex: string }
  | { type: 'code'; langage: 'python' | 'sql' | 'texte'; code: string }
  | { type: 'tableau'; entetes: string[]; lignes: string[][] }
  | { type: 'citation'; texte: string; source?: string }
  /** « Le conseil Studuel » : une méthode qui resservira. */
  | { type: 'astuce'; texte: string }
  /** « Le piège » : l'erreur que font beaucoup de copies. */
  | { type: 'piege'; texte: string }
  /** « Ce que le correcteur attend » : les points du barème. */
  | { type: 'attendu'; texte: string }
  /** La réponse à retenir, encadrée (fin d'une question). */
  | { type: 'reponse'; texte: string }
  /** Une question du sujet et sa correction. Jamais de question dans une question. */
  | {
      type: 'question'
      numero: string
      intitule: string
      points?: number | null
      blocs: Bloc[]
    }

export type NaturePartie =
  | 'dissertation'
  | 'explication'
  | 'commentaire'
  | 'etude'
  | 'essai'
  | 'interpretation'
  | 'composee'
  | 'exercice'

export type PartieCorrigee = {
  /** Unique dans l'annale, en kebab-case (« sujet-1 », « exercice-2 »). */
  id: string
  /** Court, pour un onglet : « Sujet 1 », « Exercice 2 », « Étude critique ». */
  titre: string
  nature: NaturePartie
  /** L'énoncé tel que le sujet le pose (la question de dissertation, le titre de l'exercice). */
  enonce: string
  points?: number | null
  /** Durée conseillée pour cette partie, en minutes. */
  minutes?: number | null
  /** « En 30 secondes » : 3 à 5 phrases courtes — problématique, plan, résultat clé. */
  enBref: string[]
  blocs: Bloc[]
}

export type AnnaleCorrigee = {
  /** = nom du fichier JSON et du PDF du sujet : `<matiere>-<annee>-<centre>[-jN]`. */
  id: string
  /** Slug de `subjects` (philosophie, maths, physique-chimie, svt, ses, hggsp, nsi, hlp, francais). */
  matiere: string
  niveau: Niveau
  examen: Examen
  annee: number
  /** Centre d'examen lisible : « Métropole », « Amérique du Nord », « Sujet zéro »… */
  centre: string
  /** Jour de l'épreuve (1 ou 2), `null` quand il n'y en a qu'un. */
  jour: number | null
  /** Code officiel imprimé en pied du sujet (« 24-PHGEAN1 »), '' s'il n'y en a pas. */
  code: string
  /** « Bac 2024 — Philosophie ». */
  titre: string
  dureeMin: number
  coefficient: number | null
  /** La règle de l'épreuve en une phrase : « Trois sujets, un seul à traiter. » */
  consigne: string
  parties: PartieCorrigee[]
}
