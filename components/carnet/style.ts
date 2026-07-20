// Vocabulaire visuel des cours du carnet : teinte pastel + icône lucide par
// cours, icône par type de question. Pur mapping UI (les identifiants stockés
// vivent dans lib/carnet-cours.ts).
import {
  BookOpen,
  Calculator,
  Dumbbell,
  FlaskConical,
  Folder,
  Globe,
  Landmark,
  Languages,
  Layers,
  ListChecks,
  Music,
  Palette,
  PenLine,
  Sparkles,
  TextCursorInput,
  ToggleLeft,
  type LucideIcon,
} from 'lucide-react'
import type {
  CourseColor,
  CourseIcon,
  CourseQuestionType,
} from '@/lib/carnet-cours'

// Containers arrondis pastels (fond + encre), fidèles au monde crème & violet :
// violet/jaune/corail sur les jetons sémantiques, menthe/ciel/sable en oklch
// doux (même pratique que les feuilles du Défi).
export const COURSE_TINT: Record<CourseColor, string> = {
  violet: 'bg-primary/10 text-primary',
  jaune: 'bg-highlight/25 text-foreground',
  corail: 'bg-destructive/10 text-destructive',
  menthe: 'bg-[oklch(0.95_0.05_165)] text-[oklch(0.44_0.09_168)]',
  ciel: 'bg-[oklch(0.95_0.04_235)] text-[oklch(0.45_0.09_240)]',
  sable: 'bg-[oklch(0.95_0.05_80)] text-[oklch(0.5_0.09_70)]',
}

// Pastille pleine (sélecteur de couleur des Paramètres).
export const COURSE_DOT: Record<CourseColor, string> = {
  violet: 'bg-primary',
  jaune: 'bg-highlight',
  corail: 'bg-destructive',
  menthe: 'bg-[oklch(0.8_0.11_165)]',
  ciel: 'bg-[oklch(0.78_0.09_235)]',
  sable: 'bg-[oklch(0.82_0.1_80)]',
}

export const COURSE_ICON: Record<CourseIcon, LucideIcon> = {
  'book-open': BookOpen,
  languages: Languages,
  calculator: Calculator,
  'flask-conical': FlaskConical,
  globe: Globe,
  landmark: Landmark,
  music: Music,
  palette: Palette,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
}

export const TYPE_ICON: Record<CourseQuestionType, LucideIcon> = {
  qcm: ListChecks,
  flashcard: Layers,
  vrai_faux: ToggleLeft,
  texte_a_trous: TextCursorInput,
  reponse_libre: PenLine,
}

export const CHAPTER_ICON = Folder
