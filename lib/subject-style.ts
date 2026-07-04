import type { CSSProperties } from 'react'

// Thèmes pastel par matière (clé `subjects.color`).
// Classes statiques → compatibles avec le compilateur Tailwind.

export type SubjectTheme = {
  header: string // fond pastel du header matière/chapitre
  tile: string // fond de la carte matière
  chip: string // vignette de leçon / chapitre
}

const THEMES: Record<string, SubjectTheme> = {
  blue: {
    header: 'bg-sky-100 text-sky-950 dark:bg-sky-950/60 dark:text-sky-100',
    tile: 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/60',
    chip: 'bg-sky-100 dark:bg-sky-900/60',
  },
  red: {
    header: 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100',
    tile: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60',
    chip: 'bg-rose-100 dark:bg-rose-900/60',
  },
  orange: {
    header: 'bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100',
    tile: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-950/60',
    chip: 'bg-orange-100 dark:bg-orange-900/60',
  },
  green: {
    header: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100',
    tile: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60',
    chip: 'bg-emerald-100 dark:bg-emerald-900/60',
  },
  purple: {
    header: 'bg-violet-100 text-violet-950 dark:bg-violet-950/60 dark:text-violet-100',
    tile: 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:hover:bg-violet-950/60',
    chip: 'bg-violet-100 dark:bg-violet-900/60',
  },
  indigo: {
    header: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-100',
    tile: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60',
    chip: 'bg-indigo-100 dark:bg-indigo-900/60',
  },
  teal: {
    header: 'bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-100',
    tile: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-950/60',
    chip: 'bg-teal-100 dark:bg-teal-900/60',
  },
  pink: {
    header: 'bg-pink-100 text-pink-950 dark:bg-pink-950/60 dark:text-pink-100',
    tile: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/60',
    chip: 'bg-pink-100 dark:bg-pink-900/60',
  },
  yellow: {
    header: 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100',
    tile: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60',
    chip: 'bg-amber-100 dark:bg-amber-900/60',
  },
  slate: {
    header: 'bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:text-slate-100',
    tile: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800',
    chip: 'bg-slate-200 dark:bg-slate-700/80',
  },
}

export function subjectTheme(color: string): SubjectTheme {
  return THEMES[color] ?? THEMES.blue
}

// Motif grille léger pour les headers colorés.
export const GRID_PATTERN: CSSProperties = {
  backgroundImage:
    'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
  backgroundSize: '26px 26px',
}

// Mascotte récurrente des vignettes de leçons.
export const MASCOT = '🦉'
