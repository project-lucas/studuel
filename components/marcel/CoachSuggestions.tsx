'use client'

import Link from 'next/link'
import {
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  Mic,
  NotebookPen,
  Sigma,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { MODES, TEINTE_VUE, type ModeCle, type Teinte } from '@/lib/coach/outils'
import { vueHref, type MarcelVueSecondaire } from '@/lib/coach/marcel-vues'
import { MARCEL_ENTREES } from '@/lib/coach/marcel-vues'
import { useCoachFil } from './CoachFil'

// CE QUE MARCEL SAIT FAIRE — la rangée de pastilles DANS le champ.
//
// C'était un rail de grandes cartes entre le personnage et le champ ; il
// prenait un tiers de l'écran et obligeait à défiler pour trouver où parler
// (Lucas, 22/09/2026 : « mets les blocs dans la conversation, ça prend de la
// place ; tout sur une même vue, pas de scroll »). Les mêmes outils tiennent
// maintenant sur une ligne de pastilles, posée dans la carte du champ, au-dessus
// de la zone de saisie — là où l'on décide ce qu'on demande.
//
// Deux natures, un seul geste pour l'élève :
//   • les MODES arment le champ — faire une fiche, débloquer un exercice. Ils
//     appellent le modèle, et se paient ; une pastille armée reste ALLUMÉE
//     (liseré à sa teinte) et le champ le redit à sa couleur ;
//   • les PAGES ouvrent un écran déjà calculé — la mission du jour, la méthode,
//     l'oral, l'entraînement, les progrès. Elles ne coûtent rien.
//
// PLUS DE FLASHCARDS (Lucas, 22/09/2026). Le mode existe encore dans
// lib/coach/outils (le fil sait relire des cartes), mais il n'a plus de porte :
// il n'était pas assez utilisé pour valoir une pastille.
//
// CHAQUE OUTIL A SA TEINTE (`.outil-*`, globals.css) : elle ne colore que le
// disque de l'icône et le liseré de la pastille armée ; la mission du jour,
// seule à RECOMMANDER, est la seule pleine.

const ICONE_MODE: Record<ModeCle, LucideIcon> = {
  question: GraduationCap,
  fiche: NotebookPen,
  exercice: Sigma,
  flashcards: NotebookPen,
}

const ICONE_VUE: Record<MarcelVueSecondaire, LucideIcon> = {
  mission: BookOpenCheck,
  methode: GraduationCap,
  oral: Mic,
  entrainement: Timer,
  progres: BarChart3,
}

/** Les modes montrés en pastille — « poser une question » est déjà le champ. */
const MODES_RAIL: ModeCle[] = ['fiche', 'exercice']

type Pastille = {
  cle: string
  label: string
  hint: string
  teinte: Teinte
  Icone: LucideIcon
  stat?: string
} & ({ mode: ModeCle } | { href: string })

export default function CoachSuggestions({
  matiere,
  stats,
}: {
  /** Matière courante, emportée vers les vues qui en dépendent. */
  matiere?: string | null
  /**
   * Le repère chiffré d'une pastille, quand il existe — laisser vide plutôt
   * que d'inventer. « L'oral » n'en a pas : son état demande deux requêtes de
   * plus, que l'écran d'accueil n'a aucune raison de payer.
   */
  stats?: Partial<Record<MarcelVueSecondaire, string>>
}) {
  const { mode: modeActif, choisirMode } = useCoachFil()

  // L'ordre est celui de l'usage : ce que Marcel recommande aujourd'hui, puis
  // ce qu'on lui demande le plus souvent, puis ses écrans de fond.
  const mission = MARCEL_ENTREES.find((e) => e.key === 'mission')
  const autresVues = MARCEL_ENTREES.filter((e) => e.key !== 'mission')

  const pastilles: Pastille[] = [
    ...(mission
      ? [
          {
            cle: mission.key,
            label: mission.label,
            hint: mission.hint,
            teinte: TEINTE_VUE[mission.key] ?? 'violet',
            Icone: ICONE_VUE[mission.key],
            stat: stats?.[mission.key],
            href: vueHref(mission.key, matiere),
          } as Pastille,
        ]
      : []),
    ...MODES_RAIL.map((cle) => {
      const m = MODES[cle]
      return {
        cle,
        label: m.label,
        hint: m.hint,
        teinte: m.teinte,
        Icone: ICONE_MODE[cle],
        mode: cle,
      } as Pastille
    }),
    ...autresVues.map(
      (e) =>
        ({
          cle: e.key,
          label: e.label,
          hint: e.hint,
          teinte: TEINTE_VUE[e.key] ?? 'violet',
          Icone: ICONE_VUE[e.key],
          stat: stats?.[e.key],
          href: vueHref(e.key, matiere),
        }) as Pastille,
    ),
  ]

  return (
    <nav aria-label="Ce que Marcel peut faire" className="-mx-1 mt-2">
      {/* La rangée déborde de la carte d'un rien et glisse au doigt : la
          dernière pastille coupée dit qu'il y en a d'autres. */}
      <ul className="flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pastilles.map((pastille, index) => {
          const { Icone } = pastille
          const pleine = index === 0
          const arme = 'mode' in pastille && modeActif === pastille.mode

          const contenu = (
            <>
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full',
                  pleine ? 'bg-white/20 text-white' : 'outil-pastille',
                )}
                aria-hidden="true"
              >
                <Icone className="size-3.5" strokeWidth={2.4} />
              </span>
              <span className="font-heading text-[12px] leading-none font-extrabold whitespace-nowrap">
                {pastille.label}
              </span>
              {pastille.stat ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] leading-none font-extrabold whitespace-nowrap',
                    pleine ? 'bg-white/20 text-white' : 'bg-foreground/6 text-muted-foreground',
                  )}
                >
                  {pastille.stat}
                </span>
              ) : null}
            </>
          )

          const classe = cn(
            'flex min-h-9 items-center gap-1.5 rounded-full py-1 pr-3 pl-1.5 transition active:translate-y-px',
            pleine
              ? 'outil-carte-pleine text-white'
              : 'bg-background/70 text-foreground shadow-[0_2px_0_rgba(36,48,79,.09)]',
            arme && 'bg-card ring-2 ring-[var(--outil)]',
          )

          return (
            <li key={pastille.cle} data-teinte={pastille.teinte} className="shrink-0">
              {'href' in pastille ? (
                <Link
                  href={pastille.href}
                  className={classe}
                  aria-label={`${pastille.label} — ${pastille.hint}`}
                  title={pastille.hint}
                >
                  {contenu}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-pressed={arme}
                  aria-label={`${pastille.label} — ${pastille.hint}`}
                  title={pastille.hint}
                  onClick={() => {
                    sfx.tap()
                    // Re-toucher la pastille armée revient au mode ordinaire :
                    // sans ça, on reste coincé en « fiche » sans comprendre
                    // pourquoi Marcel ne répond plus normalement.
                    choisirMode(arme ? 'question' : pastille.mode)
                  }}
                  className={classe}
                >
                  {contenu}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
