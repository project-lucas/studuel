'use client'

import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  COURSE_COLORS,
  COURSE_ICONS,
  normalizeCourseColor,
  normalizeCourseIcon,
  type CourseColor,
  type CourseIcon,
} from '@/lib/carnet-cours'
import { COULEUR_LABEL } from '@/lib/carnet/filtre'
import { COURSE_DOT, COURSE_ICON } from '@/components/carnet/style'

export type LookPatch = { icon?: CourseIcon; color?: CourseColor }

/**
 * Les deux réglages d'ALLURE d'un dossier : son icône et sa couleur. Un seul
 * composant pour TROIS endroits — l'onglet Paramètres du cours, la feuille
 * « Personnaliser » qu'on ouvre en touchant la pastille du cours, et les
 * options d'un dossier depuis la liste du carnet (le ⋯). Sans ce raccourci,
 * changer l'icône demandait d'ouvrir le cours puis un troisième onglet : cinq
 * dossiers finissaient identiques, tous avec le même livre violet.
 *
 * La couleur n'est pas qu'un ornement : c'est ce que le filtre du carnet
 * (`lib/carnet/filtre`) permet de trier — d'où l'intérêt de la régler vite.
 */
export default function CourseLook({
  icon,
  color,
  disabled = false,
  onPatch,
}: {
  icon: string | null
  color: string | null
  disabled?: boolean
  onPatch: (p: LookPatch) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-heading mb-1.5 text-sm font-extrabold text-foreground">Icône</p>
        {/* Trois rangées de sept, cases plus petites (10/09/2026) : vingt et
            une icônes tiennent sans faire défiler la feuille. ~40 px de côté
            sur 360 px de large — à la limite basse d'une cible tactile, mais
            ce sont des cases contiguës, pas des boutons isolés. */}
        <div className="grid grid-cols-7 gap-1.5">
          {COURSE_ICONS.map((iconId) => {
            const Icon = COURSE_ICON[iconId]
            const active = normalizeCourseIcon(icon) === iconId
            return (
              <button
                key={iconId}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                aria-label={`Icône ${iconId}`}
                onClick={() => {
                  sfx.tap()
                  onPatch({ icon: iconId })
                }}
                className={cn(
                  'flex aspect-square cursor-pointer items-center justify-center rounded-xl transition disabled:opacity-60',
                  active
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-muted/60 text-foreground hover:bg-muted',
                )}
              >
                <Icon className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="font-heading mb-1.5 text-sm font-extrabold text-foreground">Couleur</p>
        <div className="flex gap-2.5">
          {COURSE_COLORS.map((colorId) => {
            const active = normalizeCourseColor(color) === colorId
            return (
              <button
                key={colorId}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                aria-label={`Couleur ${COULEUR_LABEL[colorId]}`}
                onClick={() => {
                  sfx.tap()
                  onPatch({ color: colorId })
                }}
                className={cn(
                  'size-9 cursor-pointer rounded-full transition disabled:opacity-60',
                  COURSE_DOT[colorId],
                  active && 'ring-2 ring-foreground/50 ring-offset-2',
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
