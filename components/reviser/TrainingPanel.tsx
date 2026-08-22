'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight, Swords } from 'lucide-react'
import { BossFace } from '@/components/reviser/BossArena'
import GardienBadge from '@/components/reviser/GardienBadge'
import SubjectBossPanel from '@/components/reviser/SubjectBossPanel'
import SubjectGames from '@/components/reviser/SubjectGames'
import { sfx } from '@/lib/sounds'
import { bossForSubject } from '@/lib/bosses'
import GemIcon from '@/components/ui/GemIcon'
import { peutAffronter, type GardienVue } from '@/lib/reviser/gardien'
import type { ModeQuestion } from '@/lib/defi-modes'

/**
 * L'onglet « Mode de jeu » : tout ce qui se JOUE dans la matière, à un seul
 * endroit — le gardien de la matière, puis les jeux de l'arène.
 *
 * Ce qui s'y trouvait dessous — la liste de tous les chapitres avec leurs
 * pastilles Cours / Quiz / Flashcards / Carte mentale / Défi — a été retiré :
 * c'était le PROGRAMME redit une deuxième fois, plus long que les modes de jeu
 * eux-mêmes, et un dossier à deux disciplines (histoire-géo) l'affichait même
 * sans filtre. Ces formats se trouvent là où on choisit quoi travailler : dans
 * le chapitre, sur l'onglet Programme.
 *
 * Le combat de boss prend TOUT le panneau (l'arène remplace la zone crème) :
 * il vit donc dans une sous-vue, ouverte depuis son billet. C'est ce que
 * l'ancien onglet « Boss » lui offrait — un écran à lui — sans lui coûter un
 * septième onglet dans une barre qui débordait déjà.
 *
 * LE BILLET EST LE MIROIR DE L'ANNEAU. Il était jusqu'ici ouvert en permanence,
 * pendant que « La Traque » soutenait exactement l'inverse : le gardien se
 * débusque en révisant et n'est défiable qu'une heure. Deux portes
 * contradictoires vers le même personnage, dont une qui rendait l'autre
 * décorative. Désormais le billet dit la vérité sur l'état du monde : silhouette
 * et anneau tant qu'il rôde, « Affronter » quand il est sorti. Rien n'est
 * retiré — il n'y a plus qu'une porte.
 */
export default function TrainingPanel({
  subject,
  bossPool,
  gardien,
}: {
  subject: { slug: string; name: string }
  bossPool: ModeQuestion[]
  /**
   * L'état du gardien (lib/reviser/gardien) — le MÊME que celui de l'écusson du
   * header. Deux lectures indépendantes de la jauge finiraient par se
   * contredire à l'écran.
   */
  gardien: GardienVue
}) {
  const [fighting, setFighting] = useState(false)
  // La carte porte son propre gardien ; on ne retombe sur le catalogue que
  // lorsque la traque est illisible (migration 212 absente), cas où le billet
  // garde sa forme d'avant.
  const boss = gardien.boss ?? bossForSubject(subject.slug)
  const ouvert = gardien.etat === 'absent' || peutAffronter(gardien)

  if (fighting) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            sfx.back()
            setFighting(false)
          }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux modes de jeu
        </button>
        <SubjectBossPanel subjectSlug={subject.slug} pool={bossPool} />
      </div>
    )
  }

  return (
    <>
      {ouvert ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setFighting(true)
          }}
          className="group flex w-full items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-3.5 text-left text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
        >
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
            <BossFace boss={boss} px={44} className="size-11" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-heading flex items-center gap-1.5 text-sm leading-tight font-bold">
              <Swords className="size-4 shrink-0" aria-hidden="true" />
              Affronter {boss.name}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
              {gardien.etat === 'debusque'
                ? `Il disparaît dans ${gardien.detail}`
                : `${boss.epithet} · le gardien de ${subject.name}`}
            </span>
          </span>
          {gardien.etat === 'debusque' && gardien.gems > 0 ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-black/25 px-2 py-1 text-xs font-bold tabular-nums">
              <GemIcon className="size-3.5" aria-hidden="true" />
              {gardien.gems}
            </span>
          ) : null}
          <ChevronRight
            className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      ) : (
        /* LE GARDIEN RÔDE. Pas un bouton désactivé — un bouton grisé se tape
           quand même, et ne répond pas. Une CARTE, qui montre l'anneau et dit le
           geste suivant : « 5 cartes de plus ». C'est la même information que
           l'écusson du header, à la taille où on peut la lire. */
        <div className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-black/5">
          <GardienBadge vue={gardien} size="md" tone="light" decoratif />
          <span className="min-w-0 flex-1">
            <span className="font-heading block text-sm leading-tight font-bold">
              {gardien.titre}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">
              {gardien.phrase}
            </span>
          </span>
          <span className="font-heading shrink-0 rounded-full bg-highlight/20 px-2.5 py-1 text-xs font-extrabold tabular-nums">
            {gardien.percent} %
          </span>
        </div>
      )}

      <SubjectGames subject={subject} />
    </>
  )
}
