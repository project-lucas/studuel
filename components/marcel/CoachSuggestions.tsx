'use client'

import Link from 'next/link'
import {
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  Layers,
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

// CE QUE MARCEL SAIT FAIRE — le rail de cartes, juste sous le personnage.
//
// Il mélange volontairement DEUX natures, parce que l'élève, lui, n'en voit
// qu'une (« qu'est-ce que Marcel peut faire pour moi ? ») :
//   • les MODES arment le champ — faire une fiche, débloquer un exercice,
//     fabriquer des cartes. Ils appellent le modèle, et se paient ;
//   • les PAGES ouvrent un écran déjà calculé — la mission du jour, la méthode,
//     l'oral, l'entraînement, les progrès. Elles ne coûtent rien.
// La différence se voit sans être expliquée : une carte armée reste ALLUMÉE
// (liseré épais, coche), une page s'ouvre et l'écran change.
//
// CHAQUE OUTIL A SA TEINTE. Avant, huit cartes violettes se suivaient : on ne
// se souvenait d'aucune, et il fallait lire chaque titre à chaque fois. La
// couleur ne touche que l'icône, sa pastille et le liseré — les boutons
// d'action restent violets (cf. `.outil-*` dans globals.css).
//
// La carte coupée sur le bord droit dit qu'il y en a d'autres : un rail qui
// déborde s'attrape au doigt, une grille qui déborde ne se voit pas.

const ICONE_MODE: Record<ModeCle, LucideIcon> = {
  question: GraduationCap,
  fiche: NotebookPen,
  exercice: Sigma,
  flashcards: Layers,
}

const ICONE_VUE: Record<MarcelVueSecondaire, LucideIcon> = {
  mission: BookOpenCheck,
  methode: GraduationCap,
  oral: Mic,
  entrainement: Timer,
  progres: BarChart3,
}

/** Les modes montrés en carte — « poser une question » est déjà le champ. */
const MODES_RAIL: ModeCle[] = ['fiche', 'exercice', 'flashcards']

type Carte = {
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
   * Le repère chiffré d'une carte, quand il existe — laisser vide plutôt que
   * d'inventer. « L'oral » n'en a pas : son état demande deux requêtes de plus,
   * que l'écran d'accueil n'a aucune raison de payer.
   */
  stats?: Partial<Record<MarcelVueSecondaire, string>>
}) {
  const { mode: modeActif, choisirMode } = useCoachFil()

  // L'ordre est celui de l'usage : ce que Marcel recommande aujourd'hui, puis
  // ce qu'on lui demande le plus souvent, puis ses écrans de fond.
  const mission = MARCEL_ENTREES.find((e) => e.key === 'mission')
  const autresVues = MARCEL_ENTREES.filter((e) => e.key !== 'mission')

  const cartes: Carte[] = [
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
          } as Carte,
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
      } as Carte
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
        }) as Carte,
    ),
  ]

  return (
    <nav aria-label="Ce que Marcel peut faire" className="mt-4">
      {/* Le rail déborde des marges de la page (`-mx-4`) et les rend en
          rembourrage : la première carte reste alignée sur le texte, la
          dernière peut aller mourir au bord de l'écran. */}
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cartes.map((carte, index) => {
          const { Icone } = carte
          const pleine = index === 0
          const arme = 'mode' in carte && modeActif === carte.mode

          const contenu = (
            <>
              <span className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-2xl',
                    pleine ? 'bg-white/18 text-white' : 'outil-pastille',
                  )}
                >
                  <Icone aria-hidden="true" className="size-5" strokeWidth={2.2} />
                </span>
                {/* Le chiffre est un repère, pas un titre : discret, et jamais
                    seul porteur du sens — la ligne d'explication reste là. */}
                {carte.stat ? (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10.5px] font-extrabold',
                      pleine
                        ? 'bg-white/20 text-white'
                        : 'bg-foreground/6 text-muted-foreground',
                    )}
                  >
                    {carte.stat}
                  </span>
                ) : null}
                {arme ? (
                  <span className="outil-encre text-[10.5px] font-extrabold">
                    Choisi
                  </span>
                ) : null}
              </span>

              <b
                className={cn(
                  'font-heading text-[15px] leading-tight font-extrabold text-balance',
                  !pleine && arme && 'outil-encre',
                )}
              >
                {carte.label}
              </b>
              <span
                className={cn(
                  'mt-1 text-xs leading-snug font-semibold text-balance',
                  pleine ? 'text-white/80' : 'text-muted-foreground',
                )}
              >
                {carte.hint}
              </span>
            </>
          )

          const classeCarte = cn(
            'flex h-full min-h-[132px] w-full flex-col rounded-[22px] p-3.5 text-left transition-transform active:translate-y-0.5',
            pleine ? 'outil-carte-pleine text-white' : 'bg-card outil-carte',
            arme && 'ring-[2.5px] ring-[var(--outil)]',
          )

          return (
            <li
              key={carte.cle}
              data-teinte={carte.teinte}
              className="w-[62%] max-w-[224px] min-w-[172px] shrink-0 snap-start"
            >
              {'href' in carte ? (
                <Link href={carte.href} className={classeCarte}>
                  {contenu}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-pressed={arme}
                  onClick={() => {
                    sfx.tap()
                    // Re-toucher la carte armée revient au mode ordinaire :
                    // sans ça, on reste coincé en « fiche » sans comprendre
                    // pourquoi Marcel ne répond plus normalement.
                    choisirMode(arme ? 'question' : carte.mode)
                  }}
                  className={classeCarte}
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
