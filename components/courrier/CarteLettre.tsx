'use client'

import { ArrowRight, Check, ChevronDown, Clock, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import { estARecuperer, estARelever, estExpiree, estNonLue, ilYA, type Lettre } from '@/lib/courrier'
import { epreuve, formatScore } from '@/lib/palmares/epreuves'
import { cn } from '@/lib/utils'
import PortraitLettre from './PortraitLettre'

/** Le socle doré du bouton « Récupérer » : l'or est la couleur du gain, partout. */
const BOUTON_OR =
  'bg-highlight text-foreground font-extrabold hover:bg-highlight/90 [--btn-edge:color-mix(in_oklab,var(--highlight),black_28%)]'

export type GestesLettre = {
  onOuvrir: (lettre: Lettre) => void
  onRecuperer: (lettre: Lettre, bouton: HTMLElement) => void
  onRelever: (lettre: Lettre) => void
  onSuivreLien: (lettre: Lettre) => void
}

/**
 * UNE LETTRE DANS LA BOÎTE (25/10/2026, cadrage « le jeu vivant » § G).
 *
 * Une `.carte` : le visage de l'expéditeur, son nom et « il y a 2 h » en
 * surtitre, le titre en Baloo, le corps replié sur deux lignes — toucher la
 * lettre l'ouvre (et la marque lue). Dessous, selon la lettre :
 *   · un CADEAU : la plaque dorée avec ce qu'elle offre et « Récupérer » en
 *     or — les éclairs partent du bouton vers la barre du bandeau ;
 *   · un DÉFI d'ami : son mode, son score, « Relever » en violet ;
 *   · un LIEN : « Voir » (une nouveauté, un mot du coach).
 * Un point corail sur le visage tant qu'elle n'est pas lue (ou pas récupérée).
 */
export default function CarteLettre({
  lettre,
  ouverte,
  enCours,
  gestes,
}: {
  lettre: Lettre
  ouverte: boolean
  enCours: boolean
  gestes: GestesLettre
}) {
  const nonLue = estNonLue(lettre)
  const cadeau = lettre.gains !== null
  const aRecuperer = estARecuperer(lettre)
  const defi = lettre.defi !== null
  const aRelever = estARelever(lettre)
  const expiree = estExpiree(lettre)
  const titreId = `lettre-${lettre.id}-titre`
  const corpsId = `lettre-${lettre.id}-corps`

  return (
    <article
      aria-labelledby={titreId}
      className={cn(
        'carte relative flex flex-col gap-3 p-3.5 transition-shadow',
        nonLue ? 'ring-2 ring-primary/20' : 'ring-1 ring-primary/5',
      )}
    >
      <button
        type="button"
        onClick={() => gestes.onOuvrir(lettre)}
        aria-expanded={ouverte}
        aria-controls={corpsId}
        className="flex w-full items-start gap-3 text-left"
      >
        <span className="relative shrink-0">
          <PortraitLettre visage={lettre.visage} />
          {nonLue ? (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -left-0.5 size-3.5 rounded-full bg-destructive ring-2 ring-card"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="surtitre flex items-center gap-1.5">
            <span className="truncate">{lettre.expediteur}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={lettre.recueLe} className="shrink-0 normal-case tracking-normal">
              {ilYA(lettre.recueLe)}
            </time>
          </span>
          <span
            id={titreId}
            className={cn(
              'font-heading mt-0.5 block text-[17px] leading-tight font-extrabold text-balance',
              !nonLue && 'text-foreground/80',
            )}
          >
            {lettre.titre}
          </span>
          {lettre.corps ? (
            <span
              id={corpsId}
              className={cn(
                'mt-1 block text-sm leading-snug whitespace-pre-wrap',
                nonLue ? 'text-foreground/85' : 'text-muted-foreground',
                !ouverte && 'line-clamp-2',
              )}
            >
              {lettre.corps}
            </span>
          ) : null}
        </span>
        {lettre.corps.length > 90 ? (
          <ChevronDown
            aria-hidden="true"
            className={cn('mt-1 size-4 shrink-0 text-muted-foreground transition-transform', ouverte && 'rotate-180')}
          />
        ) : null}
      </button>

      {cadeau ? (
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl p-2 pl-3',
            aRecuperer ? 'bg-highlight/15 ring-1 ring-highlight/70' : 'bg-secondary/60',
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
            {lettre.gains && lettre.gains.xp > 0 ? (
              <span className="font-heading inline-flex items-center gap-1 text-base font-extrabold tabular-nums">
                <XpIcon className="size-5" /> {lettre.gains.xp} XP
              </span>
            ) : null}
            {lettre.gains && lettre.gains.gemmes > 0 ? (
              <span className="font-heading inline-flex items-center gap-1 text-base font-extrabold tabular-nums">
                <CristalIcon className="size-5" /> {lettre.gains.gemmes}
              </span>
            ) : null}
          </span>
          {aRecuperer ? (
            <Button
              type="button"
              size="default"
              className={BOUTON_OR}
              disabled={enCours}
              onClick={(e) => gestes.onRecuperer(lettre, e.currentTarget)}
            >
              Récupérer
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 text-xs font-extrabold text-muted-foreground">
              {expiree && !lettre.recuperee ? (
                <>
                  <Clock className="size-3.5" aria-hidden="true" /> Expiré
                </>
              ) : (
                <>
                  <Check className="size-3.5" aria-hidden="true" /> Récupéré
                </>
              )}
            </span>
          )}
        </div>
      ) : null}

      {defi ? (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/60 p-2 pl-3">
          <Swords className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm font-bold">
            {lettre.defi?.mode && lettre.defi.sonScore !== null ? (
              <>
                À battre : <span className="font-heading text-base font-extrabold tabular-nums">{formatScore(lettre.defi.mode, lettre.defi.sonScore)}</span>
              </>
            ) : lettre.defi?.mode ? (
              `${epreuve(lettre.defi.mode).nom} · à toi de jouer`
            ) : (
              'Défi du jour'
            )}
          </span>
          {aRelever && lettre.defi?.mode ? (
            <Button type="button" size="default" disabled={enCours} onClick={() => gestes.onRelever(lettre)}>
              Relever
            </Button>
          ) : (
            <span className="px-2 text-xs font-extrabold text-muted-foreground">{expiree ? 'Expiré' : 'Joué'}</span>
          )}
        </div>
      ) : null}

      {!cadeau && !defi && lettre.lien ? (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant={nonLue ? 'default' : 'secondary'}
            onClick={() => gestes.onSuivreLien(lettre)}
          >
            {lettre.lienLibelle ?? 'Voir'}
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {cadeau && lettre.lien && ouverte ? (
        <div className="-mt-1 flex justify-end">
          <Button type="button" size="sm" variant="ghost" onClick={() => gestes.onSuivreLien(lettre)}>
            {lettre.lienLibelle ?? 'Voir'}
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </article>
  )
}
