import type { CSSProperties } from 'react'
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  Code2,
  Cpu,
  Globe,
  Infinity,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  LineChart,
  Microscope,
  ScrollText,
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
  'culture-generale': Lightbulb,
}

export function subjectIcon(slug: string): LucideIcon {
  return SUBJECT_ICONS[slug] ?? BookOpen
}

// Thèmes pastel par matière (clé `subjects.color`).
// Classes statiques → compatibles avec le compilateur Tailwind.

export type SubjectTheme = {
  header: string // fond pastel du header matière/chapitre
  tile: string // fond de la carte matière
  chip: string // vignette de leçon / chapitre
  bar: string // remplissage des barres de progression
  stroke: string // anneaux de progression (SVG)
  arena: string // duo de tokens --tile-a/--tile-b (globals.css) pour la tuile « arène »
  edge: string // couleur du socle 3D (border-bottom) du bouton matière « chunky »
}

const THEMES: Record<string, SubjectTheme> = {
  blue: {
    header: 'bg-sky-100 text-sky-950 dark:bg-sky-950/60 dark:text-sky-100',
    tile: 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/60',
    chip: 'bg-sky-100 dark:bg-sky-900/60',
    bar: 'bg-sky-500',
    stroke: 'stroke-sky-500',
    arena: 'tile-subject-blue',
    edge: 'border-b-sky-300',
  },
  red: {
    header: 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100',
    tile: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60',
    chip: 'bg-rose-100 dark:bg-rose-900/60',
    bar: 'bg-rose-500',
    stroke: 'stroke-rose-500',
    arena: 'tile-subject-red',
    edge: 'border-b-rose-300',
  },
  orange: {
    header: 'bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100',
    tile: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-950/60',
    chip: 'bg-orange-100 dark:bg-orange-900/60',
    bar: 'bg-orange-500',
    stroke: 'stroke-orange-500',
    arena: 'tile-subject-orange',
    edge: 'border-b-orange-300',
  },
  green: {
    header: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100',
    tile: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60',
    chip: 'bg-emerald-100 dark:bg-emerald-900/60',
    bar: 'bg-emerald-500',
    stroke: 'stroke-emerald-500',
    arena: 'tile-subject-green',
    edge: 'border-b-emerald-300',
  },
  purple: {
    header: 'bg-violet-100 text-violet-950 dark:bg-violet-950/60 dark:text-violet-100',
    tile: 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:hover:bg-violet-950/60',
    chip: 'bg-violet-100 dark:bg-violet-900/60',
    bar: 'bg-violet-500',
    stroke: 'stroke-violet-500',
    arena: 'tile-subject-purple',
    edge: 'border-b-violet-300',
  },
  indigo: {
    header: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-100',
    tile: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60',
    chip: 'bg-indigo-100 dark:bg-indigo-900/60',
    bar: 'bg-indigo-500',
    stroke: 'stroke-indigo-500',
    arena: 'tile-subject-indigo',
    edge: 'border-b-indigo-300',
  },
  teal: {
    header: 'bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-100',
    tile: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-950/60',
    chip: 'bg-teal-100 dark:bg-teal-900/60',
    bar: 'bg-teal-500',
    stroke: 'stroke-teal-500',
    arena: 'tile-subject-teal',
    edge: 'border-b-teal-300',
  },
  pink: {
    header: 'bg-pink-100 text-pink-950 dark:bg-pink-950/60 dark:text-pink-100',
    tile: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/60',
    chip: 'bg-pink-100 dark:bg-pink-900/60',
    bar: 'bg-pink-500',
    stroke: 'stroke-pink-500',
    arena: 'tile-subject-pink',
    edge: 'border-b-pink-300',
  },
  yellow: {
    header: 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100',
    tile: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60',
    chip: 'bg-amber-100 dark:bg-amber-900/60',
    bar: 'bg-amber-500',
    stroke: 'stroke-amber-500',
    arena: 'tile-subject-yellow',
    edge: 'border-b-amber-300',
  },
  slate: {
    header: 'bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:text-slate-100',
    tile: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800',
    chip: 'bg-slate-200 dark:bg-slate-700/80',
    bar: 'bg-slate-500',
    stroke: 'stroke-slate-500',
    arena: 'tile-subject-slate',
    edge: 'border-b-slate-300',
  },
}

export function subjectTheme(color: string): SubjectTheme {
  return THEMES[color] ?? THEMES.blue
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
  'anglais',
  'espagnol',
  'francais',
  'hggsp',
  'histoire-geo',
  'latin',
  'maths',
  'nsi',
  'philosophie',
  'physique-chimie',
  'ses',
  'svt',
  'technologie',
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

// Mascotte récurrente des vignettes de leçons.
export const MASCOT = '🦉'
