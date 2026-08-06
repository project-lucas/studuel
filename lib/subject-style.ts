import type { CSSProperties } from 'react'
import {
  Atom,
  BookMarked,
  BookOpen,
  Brain,
  Calculator,
  Code2,
  Cog,
  Cpu,
  Crown,
  Drama,
  Dumbbell,
  Globe,
  Infinity,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  LineChart,
  Microscope,
  Music,
  Palette,
  PiggyBank,
  Receipt,
  Rocket,
  Scale,
  ScrollText,
  Sigma,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

// Icône de trait sobre par matière (clé `subjects.slug`), en remplacement des
// emojis colorés — cohérent avec le thème marine/orange.
const SUBJECT_ICONS: Record<string, LucideIcon> = {
  maths: Calculator,
  'maths-expertes': Infinity,
  francais: BookOpen,
  'histoire-geo': Landmark,
  hggsp: Globe,
  anglais: Languages,
  espagnol: Languages,
  latin: ScrollText,
  svt: Leaf,
  'physique-chimie': Atom,
  'enseignement-scientifique': Microscope,
  technologie: Cpu,
  nsi: Code2,
  ses: LineChart,
  philosophie: Brain,
  // Matières ajoutées par les migrations 191 et 193. Sans entrée ici, elles
  // retombaient toutes sur l'icône générique BookOpen — cinq matières
  // indiscernables dans les listes compactes et la recherche.
  allemand: Languages,
  'arts-plastiques': Palette,
  grec: ScrollText,
  musique: Music,
  sport: Dumbbell,
  emc: Scale,
  snt: Cpu,
  hlp: BookMarked,
  'llcer-anglais': Drama,
  si: Cog,
  'maths-complementaires': Sigma,
  // Matières « culture » (hors-programme). L'ancien dossier unique
  // 'culture-generale' garde son icône tant que la migration 190 (éclatement en
  // matières séparées) n'est pas exécutée.
  'culture-generale': Lightbulb,
  economie: TrendingUp,
  'finances-personnelles': PiggyBank,
  fiscalite: Receipt,
  entrepreneuriat: Rocket,
  'figures-historiques': Crown,
}

export function subjectIcon(slug: string): LucideIcon {
  return SUBJECT_ICONS[slug] ?? BookOpen
}

/**
 * Cette matière a-t-elle son icône ? Même raison que `hasSubjectTheme` : sans
 * entrée, une matière retombe sur l'icône générique et devient indiscernable
 * de ses voisines dans les listes compactes et la recherche.
 */
export function hasSubjectIcon(slug: string): boolean {
  return slug in SUBJECT_ICONS
}

// Thèmes pastel par matière (clé `subjects.color`).
// Classes statiques → compatibles avec le compilateur Tailwind.

export type SubjectTheme = {
  header: string // fond pastel du header matière/chapitre
  chip: string // vignette de leçon / chapitre
  bar: string // remplissage des barres de progression
  stroke: string // anneaux de progression (SVG)
  arena: string // duo de tokens --tile-a/--tile-b (globals.css) pour la tuile « arène »
  /**
   * Barre d'accent verticale (border-left) de la carte matière sur l'accueil
   * Réviser. Remplace les deux rôles colorés d'avant — le fond pastel de la
   * carte et le socle 3D du bas : six teintes de fond sortaient de la palette
   * crème/violet/or et dispersaient l'écran. La couleur de la matière n'a pas
   * disparu, elle s'est concentrée sur 4 px à gauche.
   */
  accent: string
}

const THEMES: Record<string, SubjectTheme> = {
  blue: {
    header: 'bg-sky-100 text-sky-950 dark:bg-sky-950/60 dark:text-sky-100',
    chip: 'bg-sky-100 dark:bg-sky-900/60',
    bar: 'bg-sky-500',
    stroke: 'stroke-sky-500',
    arena: 'tile-subject-blue',
    accent: 'border-l-sky-500',
  },
  red: {
    header: 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100',
    chip: 'bg-rose-100 dark:bg-rose-900/60',
    bar: 'bg-rose-500',
    stroke: 'stroke-rose-500',
    arena: 'tile-subject-red',
    accent: 'border-l-rose-500',
  },
  orange: {
    header: 'bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100',
    chip: 'bg-orange-100 dark:bg-orange-900/60',
    bar: 'bg-orange-500',
    stroke: 'stroke-orange-500',
    arena: 'tile-subject-orange',
    accent: 'border-l-orange-500',
  },
  green: {
    header: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100',
    chip: 'bg-emerald-100 dark:bg-emerald-900/60',
    bar: 'bg-emerald-500',
    stroke: 'stroke-emerald-500',
    arena: 'tile-subject-green',
    accent: 'border-l-emerald-500',
  },
  purple: {
    header: 'bg-violet-100 text-violet-950 dark:bg-violet-950/60 dark:text-violet-100',
    chip: 'bg-violet-100 dark:bg-violet-900/60',
    bar: 'bg-violet-500',
    stroke: 'stroke-violet-500',
    arena: 'tile-subject-purple',
    accent: 'border-l-violet-500',
  },
  indigo: {
    header: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-100',
    chip: 'bg-indigo-100 dark:bg-indigo-900/60',
    bar: 'bg-indigo-500',
    stroke: 'stroke-indigo-500',
    arena: 'tile-subject-indigo',
    accent: 'border-l-indigo-500',
  },
  teal: {
    header: 'bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-100',
    chip: 'bg-teal-100 dark:bg-teal-900/60',
    bar: 'bg-teal-500',
    stroke: 'stroke-teal-500',
    arena: 'tile-subject-teal',
    accent: 'border-l-teal-500',
  },
  pink: {
    header: 'bg-pink-100 text-pink-950 dark:bg-pink-950/60 dark:text-pink-100',
    chip: 'bg-pink-100 dark:bg-pink-900/60',
    bar: 'bg-pink-500',
    stroke: 'stroke-pink-500',
    arena: 'tile-subject-pink',
    accent: 'border-l-pink-500',
  },
  yellow: {
    header: 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100',
    chip: 'bg-amber-100 dark:bg-amber-900/60',
    bar: 'bg-amber-500',
    stroke: 'stroke-amber-500',
    arena: 'tile-subject-yellow',
    accent: 'border-l-amber-500',
  },
  slate: {
    header: 'bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:text-slate-100',
    chip: 'bg-slate-200 dark:bg-slate-700/80',
    bar: 'bg-slate-500',
    stroke: 'stroke-slate-500',
    arena: 'tile-subject-slate',
    accent: 'border-l-slate-500',
  },
}

export function subjectTheme(color: string): SubjectTheme {
  return THEMES[color] ?? THEMES.blue
}

/**
 * Cette couleur a-t-elle VRAIMENT un thème ? `subjectTheme` retombe en silence
 * sur le bleu, donc une couleur mal orthographiée dans une migration passe
 * inaperçue — la matière s'affiche simplement dans la mauvaise teinte. Sert au
 * garde-fou du catalogue (lib/subject-catalogue.test.ts).
 */
export function hasSubjectTheme(color: string): boolean {
  return color in THEMES
}

// Fond pastel uni par couleur de matière (`subjects.color`) — mêmes teintes que
// les tuiles pastel de subjectTheme, en hex pour les fonds inline (bulles,
// pastilles d'initiales…).
const PASTELS: Record<string, string> = {
  blue: '#DFEBFF',
  red: '#FFE4E6',
  orange: '#FFEDD5',
  green: '#D1FAE5',
  purple: '#EFE7FB',
  indigo: '#E0E7FF',
  teal: '#CCFBF1',
  pink: '#FCE7F3',
  yellow: '#FEF3C7',
  slate: '#E2E8F0',
}

// Crème neutre (fond du médaillon de repli des illustrations).
const PASTEL_FALLBACK = '#FBF3DC'

export function subjectPastel(color: string): string {
  return PASTELS[color] ?? PASTEL_FALLBACK
}

// Sigle court par matière (clé `subjects.slug`) pour les pastilles d'initiales.
// Les sigles longs (SVT, NSI, HGGSP…) sont rendus en police réduite pour tenir
// dans le cercle de 40px ; HGGSP est le seul à 5 lettres (sigle officiel,
// aucune forme courte n'existe).
const SUBJECT_INITIALS: Record<string, string> = {
  maths: 'MA',
  'maths-expertes': 'ME',
  francais: 'FR',
  'histoire-geo': 'HG',
  hggsp: 'HGGSP',
  anglais: 'AN',
  espagnol: 'ESP',
  allemand: 'ALL',
  latin: 'LA',
  grec: 'GR',
  svt: 'SVT',
  'physique-chimie': 'PC',
  'enseignement-scientifique': 'ES',
  technologie: 'TECH',
  nsi: 'NSI',
  ses: 'SES',
  philosophie: 'PH',
  'culture-generale': 'CG',
  economie: 'ECO',
  'finances-personnelles': 'FP',
  fiscalite: 'FI',
  entrepreneuriat: 'EN',
  'figures-historiques': 'FH',
  musique: 'MU',
  sport: 'EPS',
  'arts-plastiques': 'AP',
}

// Plafond des initiales DÉRIVÉES (matière sans sigle dédié) : 4 caractères.
const INITIALS_MAX = 4

// Petits mots ignorés lors de la dérivation des initiales depuis un nom.
const INITIALS_STOP_WORDS = new Set(['de', 'des', 'du', 'la', 'le', 'les', 'et'])

export function subjectInitials(slug: string, name?: string): string {
  const known = SUBJECT_INITIALS[slug]
  if (known) return known
  const words = (name ?? slug)
    .split(/[\s\-']+/)
    .filter((w) => w.length > 0 && !INITIALS_STOP_WORDS.has(w.toLowerCase()))
  if (words.length === 0) return '?'
  const derived =
    words.length === 1 ? words[0].slice(0, 2) : words.map((w) => w[0]).join('')
  return derived.slice(0, INITIALS_MAX).toUpperCase()
}

// Décors d'ambiance par matière (public/images/matieres/<slug>.webp).
// Seules les matières dont l'image est générée sont listées — les autres
// gardent le header coloré uni. (Vide pour l'instant : le décor maths a été
// retiré ; l'identité matière passe désormais par les vignettes de carte.)
const SUBJECT_DECORS: Record<string, string> = {}

export function subjectDecor(slug: string): string | undefined {
  return SUBJECT_DECORS[slug]
}

// Vignettes illustrées des cartes matières de l'accueil Réviser : illustration
// à fond transparent, détourée et normalisée sur une toile carrée 320×320 (voir
// scripts de génération) pour que toutes les cartes portent une image de taille
// identique. Ajouter le slug ici dès que l'image est déposée dans
// public/images/matieres/vignettes/<slug>.webp — repli sur le médaillon sinon.
const VIGNETTE_SLUGS: string[] = [
  'allemand',
  'anglais',
  'arts-plastiques',
  'economie',
  'emc',
  'enseignement-scientifique',
  'entrepreneuriat',
  'espagnol',
  'figures-historiques',
  'fiscalite',
  'francais',
  'grec',
  'hggsp',
  'histoire-geo',
  'latin',
  'maths',
  'musique',
  'nsi',
  'philosophie',
  'physique-chimie',
  'ses',
  'sport',
  'svt',
  'technologie',
  // Manque encore : finances-personnelles, maths-expertes,
  // maths-complementaires (aucun dessin dans les lots v2 ni v3 — sources dans
  // assets-sources/, hors dépôt). Elles gardent le médaillon d'icône.
]

export function subjectVignette(slug: string): string | undefined {
  return VIGNETTE_SLUGS.includes(slug)
    ? `/images/matieres/vignettes/${slug}.webp`
    : undefined
}

// Motif grille léger pour les headers colorés.
export const GRID_PATTERN: CSSProperties = {
  backgroundImage:
    'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
  backgroundSize: '26px 26px',
}

