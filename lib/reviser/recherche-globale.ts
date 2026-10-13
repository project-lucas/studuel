// -----------------------------------------------------------------------------
// LA LOUPE GLOBALE DE RÉVISER (12/10/2026, Lucas : « oui d'accord avec une
// icône loupe globale ») — chercher une fiche dans TOUTES les matières de sa
// classe, depuis l'accueil Réviser, sans savoir dans quel dossier elle est.
//
// L'index tient en quelques dizaines de Ko : une ligne par fiche, trois champs
// courts (`id`, titre `t`, matière `m`). Il est servi par /api/reviser/fiches
// quand la loupe s'ouvre, gardé en mémoire, et la recherche est SYNCHRONE à
// chaque touche — comme l'encyclopédie : sans accent, sans apostrophe, les
// mots dans n'importe quel ordre (`searchKey`, lib/subject-template).
//
// Pur et testé. Aucun import Supabase (importé par un composant client).
// -----------------------------------------------------------------------------

import { searchKey } from '@/lib/subject-template'

/** Une fiche de l'index : compacte, c'est du réseau. */
export type FicheIndex = {
  id: string
  /** Le titre. */
  t: string
  /** Le slug de la matière. */
  m: string
  /** Le thème (chapitre officiel), s'il y en a un. */
  th?: string
}

export type MatiereIndex = {
  slug: string
  nom: string
}

export type IndexFiches = {
  matieres: MatiereIndex[]
  fiches: FicheIndex[]
}

export type ResultatFiche = {
  fiche: FicheIndex
  matiere: MatiereIndex
  href: string
}

/** Au-delà, la liste ne se lit plus : on affine la recherche. */
export const RESULTATS_MAX = 30

/**
 * Les fiches qui contiennent TOUS les mots cherchés (titre, thème, matière),
 * dans l'ordre de l'index (les matières, puis la position des fiches), bornées.
 * Une recherche vide ne rend rien : la loupe propose, elle n'inonde pas.
 */
export function chercherFiches(index: IndexFiches, query: string, max: number = RESULTATS_MAX): ResultatFiche[] {
  const mots = searchKey(query).split(' ').filter(Boolean)
  if (mots.length === 0) return []
  const parSlug = new Map(index.matieres.map((m) => [m.slug, m]))
  const sortie: ResultatFiche[] = []
  for (const fiche of index.fiches) {
    const matiere = parSlug.get(fiche.m)
    if (!matiere) continue
    const foin = searchKey(`${fiche.t} ${fiche.th ?? ''} ${matiere.nom}`)
    if (!mots.every((mot) => foin.includes(mot))) continue
    sortie.push({ fiche, matiere, href: `/reviser/${matiere.slug}/${fiche.id}` })
    if (sortie.length >= max) break
  }
  return sortie
}

/**
 * Bâtit l'index depuis le catalogue (côté serveur, route /api/reviser/fiches) :
 * les matières qui ont au moins une fiche, dans l'ordre reçu.
 */
export function construireIndex(
  matieres: readonly { id: string; slug: string; name: string }[],
  chapitres: readonly { id: string; subject_id: string; title: string; theme?: string | null }[],
): IndexFiches {
  const parId = new Map(matieres.map((m) => [m.id, m]))
  const fiches: FicheIndex[] = []
  const vues = new Set<string>()
  for (const c of chapitres) {
    const m = parId.get(c.subject_id)
    if (!m) continue
    vues.add(m.slug)
    const fiche: FicheIndex = { id: c.id, t: c.title, m: m.slug }
    if (c.theme) fiche.th = c.theme
    fiches.push(fiche)
  }
  return {
    matieres: matieres.filter((m) => vues.has(m.slug)).map((m) => ({ slug: m.slug, nom: m.name })),
    fiches,
  }
}
