'use client'

import { Fragment, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronsDown, ChevronsUp, Clock } from 'lucide-react'
import RailDivisions from '@/components/amis/RailDivisions'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import CompteXp from '@/components/amis/ligue/CompteXp'
import { useMaintenant } from '@/components/amis/ligue/useMaintenant'
import XpIcon from '@/components/ui/XpIcon'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { Button } from '@/components/ui/button'
import {
  echelon,
  libelleFin,
  nbPromus,
  nbRelegues,
  regleDeLaSemaine,
  zoneDe,
  type EtatLigue,
  type MembreLigue,
  type Zone,
} from '@/lib/ligue'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA LIGUE DE LA SEMAINE — le cœur de l'onglet Amis (Lucas, 24/09/2026 : « à
// l'identique de Duolingo : les 30 personnages, les divisions par rang Bronze
// 4 3 2 1, le renouvellement chaque semaine »).
//
// UNE SEULE CARTE BLANCHE (Lucas, 24/09/2026 : « insère le bloc des
// divisions dans le même bloc avec un fond blanc ») — de haut en bas : le rail
// des rangs (le blason courant au centre, la division dessous), le nom de la
// ligue, la règle de la semaine (« Les 7 premiers montent en Bronze 3 ») et le
// compte à rebours ; puis, sous un filet, l'invitation « Gagne ta première XP
// de la semaine » tant que l'élève n'a pas d'XP — elle disparaît à sa première
// leçon et la LISTE des 30 prend sa place, dans une boîte qui défile et
// s'ouvre centrée sur ma ligne. Les bandeaux « Zone de
// promotion » et « Zone de relégation » séparent ceux qui montent et ceux qui
// descendent, et le rang de chacun prend la couleur de sa zone — vert et
// corail sont des ÉTATS, jamais une action.
//
// Tout vient du serveur (`ligue_etat`, migration 376) : le classement, les
// rivaux IA et leur XP. Ici on ne fait que dessiner.
// -----------------------------------------------------------------------------

export default function LigueSemaine({
  etat,
  apercu = false,
  maintenantIso,
  monAvatar = null,
}: {
  /** null = la ligue n'est pas encore ouverte (migration 376 absente). */
  etat: EtatLigue | null
  /** Données d'exemple (visiteur) : la pastille « Aperçu » le dit. */
  apercu?: boolean
  maintenantIso: string
  /** Mon avatar, pour ma ligne (null : le blason déduit de mon id). */
  monAvatar?: AvatarAffiche | null
}) {
  const maintenant = useMaintenant(maintenantIso)
  const router = useRouter()
  // La fin déjà relue : une par semaine (l'onglet reste monté des semaines).
  const relueFin = useRef<number | null>(null)
  const finMs = etat ? Date.parse(etat.fin) : Number.NaN

  // LA SEMAINE SE TERMINE SOUS LES YEUX DE L'ÉLÈVE : on relit la ligue une
  // fois — le serveur clôt la semaine, et l'écran de fin de semaine arrive.
  useEffect(() => {
    if (apercu || !Number.isFinite(finMs) || maintenant < finMs || relueFin.current === finMs) return
    relueFin.current = finMs
    router.refresh()
  }, [apercu, finMs, maintenant, router])

  if (!etat) {
    return (
      <section aria-labelledby="ligue-titre" className="carte flex flex-col items-center gap-2 px-4 pt-2 pb-5 text-center">
        <RailLigue echelon={0} />
        <h2 id="ligue-titre" className="font-heading text-2xl font-extrabold">
          La ligue ouvre bientôt
        </h2>
        <p className="max-w-xs text-sm font-semibold text-muted-foreground">
          Chaque semaine, 30 joueurs, classés à l’XP&nbsp;: les premiers montent de division.
        </p>
      </section>
    )
  }

  const division = echelon(etat.echelon)
  const reste = finMs - maintenant

  return (
    <section aria-labelledby="ligue-titre" className="carte flex flex-col gap-4 px-4 pt-2 pb-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <RailLigue echelon={etat.echelon} />
        <h2 id="ligue-titre" className="font-heading mt-1 text-2xl font-extrabold">
          Ligue {division.nom}
        </h2>
        <p className="text-sm font-semibold text-muted-foreground">{regleDeLaSemaine(etat.echelon)}</p>
        <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-extrabold text-foreground ring-1 ring-border">
            <Clock className="size-3.5 text-primary" strokeWidth={2.6} aria-hidden="true" />
            Fin dans {libelleFin(reste)}
          </span>
          {apercu ? (
            <span className="rounded-full bg-highlight/25 px-2.5 py-1 text-xs font-extrabold text-foreground/80">
              Aperçu
            </span>
          ) : null}
        </p>
      </div>

      {etat.inscrit ? (
        // Une clé par semaine : un nouveau groupe repart centré sur ma ligne.
        <ListeLigue key={etat.semaine} groupe={etat.groupe} index={etat.echelon} monAvatar={monAvatar} />
      ) : (
        <EntrerDansLaLigue />
      )}
    </section>
  )
}

/**
 * Le rail des rangs, bord à bord dans la carte : il défile jusqu'aux arêtes
 * au lieu de s'arrêter net au retrait du texte.
 */
function RailLigue({ echelon: index }: { echelon: number }) {
  return (
    <div className="-mx-4 self-stretch">
      <RailDivisions echelon={index} />
    </div>
  )
}

/**
 * Pas encore d'XP cette semaine : pas encore de groupe. On dit comment y
 * entrer — dans la carte de la ligue, sous un filet ; la rangée disparaît à
 * la première XP, et la liste des 30 prend sa place.
 */
function EntrerDansLaLigue() {
  return (
    <div className="flex items-center gap-3 border-t border-border/70 pt-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-highlight/20">
        <XpIcon className="size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block leading-tight font-extrabold">
          Gagne ta première XP de la semaine
        </span>
        <span className="block text-sm font-semibold text-muted-foreground">
          Une leçon ou quelques cartes, et tu entres dans ta ligue de 30.
        </span>
      </span>
      <Button asChild size="sm" className="shrink-0">
        <Link href="/reviser">Réviser</Link>
      </Button>
    </div>
  )
}

/** La liste des 30, centrée sur ma ligne à l'ouverture. */
function ListeLigue({
  groupe,
  index,
  monAvatar,
}: {
  groupe: MembreLigue[]
  index: number
  monAvatar: AvatarAffiche | null
}) {
  const boite = useRef<HTMLDivElement>(null)
  const maLigne = useRef<HTMLLIElement>(null)
  const taille = groupe.length
  const promus = nbPromus(taille, index)
  const relegues = nbRelegues(taille, index)

  // Ma ligne au CENTRE de la boîte : on déplace la boîte elle-même
  // (scrollTop), jamais la page — `scrollIntoView` ferait aussi défiler
  // l'écran pour l'amener en vue.
  useEffect(() => {
    const conteneur = boite.current
    const cible = maLigne.current
    if (!conteneur || !cible) return
    conteneur.scrollTop = Math.max(0, cible.offsetTop - (conteneur.clientHeight - cible.offsetHeight) / 2)
  }, [])

  return (
    <div className="border-t border-border/70 pt-1">
      {/* La boîte qui défile, fondue en haut et en bas : on voit qu'il y a
          des joueurs au-delà. Le fondu est sur la boîte INTÉRIEURE, pour ne
          pas effacer le filet qui la sépare de l'en-tête. */}
      <div
        ref={boite}
        className="relative -mx-2 max-h-[27rem] overflow-y-auto overscroll-contain px-0.5 py-2 [mask-image:linear-gradient(to_bottom,transparent,black_14px,black_calc(100%-14px),transparent)] [scrollbar-width:thin]"
      >
        <ol aria-label={`Classement de la ligue ${echelon(index).nom}`} className="flex flex-col gap-0.5">
          {groupe.map((m) => {
            const zone = zoneDe(m.rang, promus, relegues, taille)
            return (
              <Fragment key={m.cle}>
                {relegues > 0 && m.rang === taille - relegues + 1 ? <BandeauZone zone="relegation" /> : null}
                <LigneLigue membre={m} zone={zone} ref={m.moi ? maLigne : undefined} avatar={m.moi ? monAvatar : null} />
                {promus > 0 && m.rang === promus ? <BandeauZone zone="promotion" /> : null}
              </Fragment>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const COULEUR_RANG: Record<Zone, string> = {
  promotion: 'text-success',
  neutre: 'text-muted-foreground',
  relegation: 'text-destructive',
}

/** Les trois premiers portent une médaille : or, argent, bronze. */
const MEDAILLE = ['bg-highlight text-foreground', 'bg-muted text-foreground ring-1 ring-foreground/15', 'bg-warning/45 text-foreground']

function LigneLigue({
  membre: m,
  zone,
  ref,
  avatar,
}: {
  membre: MembreLigue
  zone: Zone
  ref?: React.Ref<HTMLLIElement>
  avatar: AvatarAffiche | null
}) {
  return (
    <li
      ref={ref}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-2 py-1.5',
        m.moi && 'bg-primary/10 ring-2 ring-primary/50',
      )}
    >
      <span
        className={cn('font-heading grid w-7 shrink-0 place-items-center text-base font-extrabold tabular-nums', COULEUR_RANG[zone])}
      >
        {m.rang <= 3 ? (
          <span className={cn('grid size-7 place-items-center rounded-full text-sm', MEDAILLE[m.rang - 1])}>
            {m.rang}
          </span>
        ) : (
          m.rang
        )}
      </span>
      <PortraitJoueur id={m.id ?? m.cle} portrait={m.portrait} avatar={avatar} className="size-10 ring-1 ring-foreground/10" />
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className={cn('truncate text-sm', m.moi ? 'font-extrabold text-primary' : 'font-semibold')}>
          {m.nom}
        </span>
        {m.moi ? (
          <span className="shrink-0 rounded-full bg-primary px-1.5 py-px text-[10px] font-extrabold text-primary-foreground">
            Toi
          </span>
        ) : null}
        {m.robot ? (
          <span
            title="Rival IA : il complète la ligue tant qu’elle n’a pas 30 élèves"
            className="shrink-0 rounded-full bg-muted px-1.5 py-px text-[10px] font-extrabold text-muted-foreground"
          >
            IA
          </span>
        ) : null}
        <span className="sr-only">
          {zone === 'promotion' ? ' — zone de promotion' : zone === 'relegation' ? ' — zone de relégation' : ''}
        </span>
      </span>
      <CompteXp xp={m.xp} accent={m.moi} />
    </li>
  )
}

/** « ⌃ Zone de promotion ⌃ » : la frontière entre ceux qui montent et les autres. */
function BandeauZone({ zone }: { zone: 'promotion' | 'relegation' }) {
  const Fleche = zone === 'promotion' ? ChevronsUp : ChevronsDown
  return (
    <li
      aria-hidden="true"
      className={cn(
        'my-1 flex items-center justify-center gap-2 py-1 text-[11px] font-extrabold tracking-[0.08em] uppercase',
        zone === 'promotion' ? 'text-success' : 'text-destructive',
      )}
    >
      <Fleche className="size-4" strokeWidth={2.8} />
      {zone === 'promotion' ? 'Zone de promotion' : 'Zone de relégation'}
      <Fleche className="size-4" strokeWidth={2.8} />
    </li>
  )
}
