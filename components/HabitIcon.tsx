import type { ReactNode } from 'react'
import {
  Backpack,
  BedDouble,
  BookOpen,
  Bus,
  CalendarCheck,
  Croissant,
  Dumbbell,
  Footprints,
  GlassWater,
  MonitorOff,
  NotebookPen,
  PhoneOff,
  Sparkles,
  Target,
  Wind,
} from 'lucide-react'
import type { HabitCatalogEntry } from '@/lib/types'

// L'émoji du catalogue est remplacé par une icône ligne (style produit) :
// icône encre sur pastille encre pâle (cohérent avec le reste de l'app).
// Partagé entre le planning (WeekPlanner) et les missions du jour.
const iconProps = { className: 'size-4', strokeWidth: 2.2 }
const ICONS: Record<string, ReactNode> = {
  '😴': <BedDouble {...iconProps} />,
  '🎯': <Target {...iconProps} />,
  '🚌': <Bus {...iconProps} />,
  '⚽': <Dumbbell {...iconProps} />,
  '📖': <BookOpen {...iconProps} />,
  '🌙': <MonitorOff {...iconProps} />,
  '🥐': <Croissant {...iconProps} />,
  '📵': <PhoneOff {...iconProps} />,
  '🗓': <CalendarCheck {...iconProps} />,
  '💧': <GlassWater {...iconProps} />,
  '🚶': <Footprints {...iconProps} />,
  '📓': <NotebookPen {...iconProps} />,
  '🎒': <Backpack {...iconProps} />,
  '🧘': <Wind {...iconProps} />,
}

export default function HabitIcon({ entry }: { entry: HabitCatalogEntry }) {
  // U+FE0F (sélecteur de variante) est retiré : « 🗓️ » et « 🗓 » → même clé.
  const key = [...entry.icon]
    .filter((c) => c.codePointAt(0) !== 0xfe0f)
    .join('')
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {ICONS[key] ?? <Sparkles {...iconProps} />}
    </span>
  )
}
