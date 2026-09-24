import { THEMES_CAPSULES, type AchatCapsule, type Capsule, type ThemeCapsule } from '@/lib/capsules'

// -----------------------------------------------------------------------------
// MA BIBLIOTHÈQUE — l'ex-« Mon carnet » (Lucas, 24/09/2026 : « renomme Mon
// carnet par Ma bibliothèque ; les capsules achetées y seront, les fiches de
// révision achetées aussi, chacun avec un filtre pour une bibliothèque bien
// rangée »).
//
// TROIS RAYONS, tout ce qui appartient à l'élève :
//   · DOSSIERS — les cours qu'il écrit lui-même (l'ancien carnet, inchangé) ;
//   · CAPSULES — les mini-formations achetées dans la Boutique (366) ;
//   · FICHES   — les fiches de révision achetées en gemmes : un chapitre
//                débloqué (`chapter_unlocks`, 183), qui s'ouvre sur sa Fiche
//                (`/reviser/<matière>/<chapitre>/carte`).
// Un filtre en tête, TROIS onglets illustrés — Dossiers · Capsules · Fiches ;
// le rayon « Tout » (des étagères empilées) a été retiré le 24/09/2026 (Lucas :
// « enlève le filtre Tout ») : on arrive sur Dossiers, sauf quand une capsule
// neuve attend (le bouton « Ma bibliothèque » mène alors aux Capsules). Dans
// les rayons Capsules et Fiches, un second filtre par thème ou par matière, dès
// qu'il y a de quoi trier.
//
// La route reste `/carnet` : c'est une adresse interne, la renommer casserait
// les liens déjà posés (Marcel, Boutique, notifications) sans rien apporter à
// l'élève, qui ne la voit pas dans l'app installée.
//
// Module PUR (convention projet) : il lit et valide ce que rend la base, range
// et filtre. Aucune requête ici — elles vivent dans `lib/bibliotheque-server`.
// -----------------------------------------------------------------------------

export type Rayon = 'dossiers' | 'capsules' | 'fiches'

/** Les filtres de tête, dans l'ordre de l'écran. */
export const RAYONS: readonly { id: Rayon; label: string }[] = [
  { id: 'dossiers', label: 'Dossiers' },
  { id: 'capsules', label: 'Capsules' },
  { id: 'fiches', label: 'Fiches' },
]

/** L'adresse de la bibliothèque. */
export const CHEMIN_BIBLIOTHEQUE = '/carnet'

/** Le rayon d'arrivée, quand l'adresse n'en demande aucun. */
export const RAYON_DEFAUT: Rayon = 'dossiers'

const IDS_RAYONS: readonly string[] = RAYONS.map((r) => r.id)

/**
 * Le rayon demandé par l'URL (`?rayon=fiches`) ; les Dossiers par défaut. Un
 * ancien lien `?rayon=tout` retombe lui aussi sur les Dossiers.
 */
export function lireRayon(valeur: unknown): Rayon {
  const brut = Array.isArray(valeur) ? valeur[0] : valeur
  return typeof brut === 'string' && IDS_RAYONS.includes(brut) ? (brut as Rayon) : RAYON_DEFAUT
}

/** L'adresse d'un rayon : celui d'arrivée n'a pas de paramètre. */
export function hrefRayon(rayon: Rayon): string {
  return rayon === RAYON_DEFAUT ? CHEMIN_BIBLIOTHEQUE : `${CHEMIN_BIBLIOTHEQUE}?rayon=${rayon}`
}

// ------------------------------------------------------------------- fiches

export type FicheAchetee = {
  chapitreId: string
  titre: string
  /** Le chapitre du programme qui la range (« Le groupe verbal »), s'il existe. */
  theme: string | null
  matiere: { slug: string; nom: string }
  /** Rang dans le programme de la matière : l'ordre du dossier. */
  position: number
  href: string
}

type MatiereConnue = { id: string; slug: string; name: string }

function texte(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t === '' ? null : t
}

/**
 * Les fiches achetées, depuis les lignes de `chapter_unlocks` jointes à leur
 * chapitre (`chapter:chapters(id, title, position, subject_id, theme)`). Une
 * ligne sans chapitre (supprimé du catalogue) ou d'une matière inconnue est
 * écartée : mieux vaut une fiche de moins qu'un lien mort. Rangées comme un
 * rayon : par matière (ordre alphabétique), puis dans l'ordre du programme.
 */
export function lireFichesAchetees(
  rows: unknown,
  matieres: readonly MatiereConnue[],
): FicheAchetee[] {
  if (!Array.isArray(rows)) return []
  const parId = new Map(matieres.map((m) => [m.id, m]))
  const vues = new Set<string>()
  const fiches = rows.flatMap((raw): FicheAchetee[] => {
    if (!raw || typeof raw !== 'object') return []
    const o = raw as Record<string, unknown>
    // PostgREST rend l'objet joint seul, ou dans un tableau selon la relation.
    const joint = Array.isArray(o.chapter) ? o.chapter[0] : o.chapter
    if (!joint || typeof joint !== 'object') return []
    const c = joint as Record<string, unknown>
    const chapitreId = texte(c.id) ?? texte(o.chapter_id)
    const titre = texte(c.title)
    const matiere = parId.get(String(c.subject_id ?? ''))
    if (!chapitreId || !titre || !matiere || vues.has(chapitreId)) return []
    vues.add(chapitreId)
    return [
      {
        chapitreId,
        titre,
        theme: texte(c.theme),
        matiere: { slug: matiere.slug, nom: matiere.name },
        position: typeof c.position === 'number' ? c.position : Number.MAX_SAFE_INTEGER,
        href: `/reviser/${matiere.slug}/${chapitreId}/carte`,
      },
    ]
  })
  return fiches.sort(
    (a, b) =>
      a.matiere.nom.localeCompare(b.matiere.nom, 'fr') ||
      a.position - b.position ||
      a.titre.localeCompare(b.titre, 'fr'),
  )
}

// ------------------------------------------------------- les seconds filtres

/** Une puce du second filtre : une matière, un thème. */
export type Puce = { id: string; label: string; nombre: number }

/** Les matières des fiches achetées, dans l'ordre du rayon. */
export function matieresDesFiches(fiches: readonly FicheAchetee[]): Puce[] {
  const puces = new Map<string, Puce>()
  for (const f of fiches) {
    const puce = puces.get(f.matiere.slug)
    if (puce) puces.set(f.matiere.slug, { ...puce, nombre: puce.nombre + 1 })
    else puces.set(f.matiere.slug, { id: f.matiere.slug, label: f.matiere.nom, nombre: 1 })
  }
  return [...puces.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}

/**
 * Le rayon Fiches, rangé par matière. `matiere` restreint à une seule (la
 * puce choisie) ; `null`, ou une matière absente, les montre toutes — une puce
 * restée choisie sur une matière disparue ne doit pas vider l'écran.
 */
export function fichesParMatiere(
  fiches: readonly FicheAchetee[],
  matiere: string | null,
): { matiere: { slug: string; nom: string }; fiches: FicheAchetee[] }[] {
  const connue = matiere !== null && fiches.some((f) => f.matiere.slug === matiere)
  const groupes = new Map<string, { matiere: { slug: string; nom: string }; fiches: FicheAchetee[] }>()
  for (const f of fiches) {
    if (connue && f.matiere.slug !== matiere) continue
    const groupe = groupes.get(f.matiere.slug)
    if (groupe) groupe.fiches.push(f)
    else groupes.set(f.matiere.slug, { matiere: f.matiere, fiches: [f] })
  }
  return [...groupes.values()]
}

export type CapsuleRangee = { capsule: Capsule; achat: AchatCapsule }

/** Les thèmes des capsules possédées, dans l'ordre des rayons de la Boutique. */
export function themesDesCapsules(etagere: readonly CapsuleRangee[]): Puce[] {
  return THEMES_CAPSULES.flatMap((theme) => {
    const nombre = etagere.filter((e) => e.capsule.theme === theme.id).length
    return nombre > 0 ? [{ id: theme.id, label: theme.label, nombre }] : []
  })
}

/** Le rayon Capsules filtré par thème ; `null` ou un thème absent : toutes. */
export function filtrerCapsules(
  etagere: readonly CapsuleRangee[],
  theme: ThemeCapsule | string | null,
): CapsuleRangee[] {
  if (theme === null || !etagere.some((e) => e.capsule.theme === theme)) return [...etagere]
  return etagere.filter((e) => e.capsule.theme === theme)
}
