'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useRef, useSyncExternalStore, useTransition, type ReactNode } from 'react'
import { Check, ChevronRight, Clock } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import XpIcon from '@/components/ui/XpIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { claimDailyQuests } from '@/app/defi/hebdo-actions'
import {
  ALL_DONE_XP,
  BONUS_STEP_ID,
  PILIER_LIBELLE,
  aEncaisser,
  coffreDuJourPret,
  libelleRenouvellement,
  minutesAvantMinuitUtc,
  type QueteServie,
  type QuetesDuJour,
} from '@/lib/quests'
import type { Gain } from '@/lib/gains'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { iconeQuete } from './icone'
import { BoutonEncaisser } from './BoutonsQuete'
import CoffreDuJourDessin from './CoffreDuJourDessin'
import s from './FeuilleQuetes.module.css'
import { fermerFeuilleQuetes, marquerEncaissees, relireQuetes, useFeuilleQuetesOuverte, useQuetesDuJour } from './store'

function abonnerMinute(cb: () => void): () => void {
  const t = setInterval(cb, 60_000)
  return () => clearInterval(t)
}
function useMinutesAvantMinuit(): number | null {
  return useSyncExternalStore(abonnerMinute, () => minutesAvantMinuitUtc(Date.now()), () => null)
}

/**
 * LA FEUILLE DES QUÊTES DU JOUR — « LE COFFRE D'ABORD » (14/10/2026, direction
 * validée par Lucas ; elle remplace la maquette « A » du 03/10 : trois cartes
 * identiques, trois flèches identiques, et le coffre en dernier, coupé par le
 * bas de la fenêtre — la plus grosse récompense de l'écran était celle qu'on
 * ne voyait pas).
 *
 * De haut en bas : LE COFFRE en grand sur son disque lavande, « +100 XP » en
 * pilule d'or ; sous lui LE SENTIER — les trois icônes de quête en médaillons
 * reliés par un pointillé qui se dore à mesure : les quêtes sont visiblement
 * les trois marches vers le coffre ; puis UNE carte blanche à trois lignes
 * (plus de surtitres Apprendre / Se tester / Jouer : l'icône le dit, ils
 * restent dans l'aria-label) — toute la ligne est le lien, la récompense en
 * or au bout. Ligne finie : la jauge passe à l'or et la pièce « Encaisser »
 * prend la place de la récompense ; encaissée : coche et ligne estompée.
 * Quand les trois sont bouclées, la pièce passe SOUS LE COFFRE, qui frémit,
 * et paie tout d'un coup. Tout tient en ~520 px : au-dessus du pli.
 *
 * Ouverte depuis la pastille du bandeau, la tuile de l'arène ou le bandeau
 * « Quête accomplie » — une seule feuille pour toute l'app, montée une fois
 * dans la mise en page (components/quetes/QuetesGlobales). Elle ne calcule
 * aucune récompense : les montants sont relus en base à l'encaissement
 * (quest_claim, migrations 205 · 209 · 555), qui paie d'un coup TOUTES les
 * quêtes finies, plus le coffre si les trois le sont.
 */
export default function FeuilleQuetes() {
  const ouverte = useFeuilleQuetesOuverte()
  const etat = useQuetesDuJour()
  return (
    <Feuille open={ouverte && etat !== null} onClose={fermerFeuilleQuetes} label="Quêtes du jour">
      {etat ? <ContenuQuetes etat={etat} /> : null}
    </Feuille>
  )
}

function ContenuQuetes({ etat }: { etat: QuetesDuJour }) {
  const minutes = useMinutesAvantMinuit()
  const { celebrer } = useRecompenses()
  const [pending, start] = useTransition()
  const declencheur = useRef<HTMLButtonElement | null>(null)

  const faites = etat.quetes.filter((q) => q.done).length
  const payees = new Set(etat.encaissees)
  const coffreOuvert = payees.has(BONUS_STEP_ID)
  const coffrePret = coffreDuJourPret(etat)
  // Ce que paie la pièce posée sous le coffre : les quêtes finies non payées,
  // plus le coffre lui-même (le serveur relit les montants : ici, l'étiquette).
  const duXp = aEncaisser(etat).reduce((somme, q) => somme + q.xp, 0) + (coffrePret ? ALL_DONE_XP : 0)

  const encaisser = (bouton: HTMLButtonElement | null) => {
    if (pending) return
    declencheur.current = bouton
    sfx.complete()
    const dues = aEncaisser(etat)
    start(async () => {
      const r = await claimDailyQuests()
      if (!r.claimed) {
        void relireQuetes()
        return
      }
      marquerEncaissees(
        dues.map((q) => q.id),
        r.allDone,
      )
      const gains: Gain[] = [{ unite: 'xp', montant: r.xp }].filter((g) => g.montant > 0) as Gain[]
      celebrer(gains, origineUnique(declencheur.current, gains))
    })
  }

  return (
    <div className="flex flex-col gap-4 pt-1">
      <h2 className="font-heading pr-12 text-2xl leading-tight font-extrabold">Quêtes du jour</h2>

      <CoffreDuJour
        quetes={etat.quetes}
        faites={faites}
        ouvert={coffreOuvert}
        pret={coffrePret}
        duXp={duXp}
        minutes={minutes}
        pending={pending}
        onEncaisser={encaisser}
      />

      <ul
        className="carte divide-y divide-border/60"
        aria-label={`${faites} quête${faites > 1 ? 's' : ''} sur ${etat.quetes.length} bouclée${faites > 1 ? 's' : ''}`}
      >
        {etat.quetes.map((q) => (
          <LigneQuete
            key={q.id}
            q={q}
            encaissee={payees.has(q.id)}
            coffrePret={coffrePret}
            pending={pending}
            onEncaisser={encaisser}
          />
        ))}
      </ul>
    </div>
  )
}

/** Le coffre en tête : le dessin, « +100 XP », le sentier, l'état, le compte à rebours. */
function CoffreDuJour({
  quetes,
  faites,
  ouvert,
  pret,
  duXp,
  minutes,
  pending,
  onEncaisser,
}: {
  quetes: QueteServie[]
  faites: number
  ouvert: boolean
  pret: boolean
  duXp: number
  minutes: number | null
  pending: boolean
  onEncaisser: (bouton: HTMLButtonElement | null) => void
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const reste = quetes.length - faites
  const statut = ouvert
    ? 'Ouvert ! Reviens demain pour le prochain.'
    : pret
      ? 'Les trois sont bouclées : encaisse pour l’ouvrir'
      : `Encore ${reste} quête${reste > 1 ? 's' : ''} pour l’ouvrir`

  return (
    <section aria-label="Coffre du jour" className="flex flex-col items-center gap-2 text-center">
      <div className="relative grid size-28 place-items-center">
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-secondary" />
        <CoffreDuJourDessin ouvert={ouvert} className={cn('relative size-24', pret && !ouvert && s.coffreTremble)} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-heading text-lg leading-tight font-extrabold">Coffre du jour</p>
        <span className="font-heading inline-flex items-center gap-1 rounded-full bg-highlight px-2.5 py-0.5 text-sm font-extrabold text-foreground tabular-nums">
          <XpIcon className="size-4" />+{ALL_DONE_XP} XP
        </span>
      </div>

      <Sentier quetes={quetes} />

      {pret ? (
        <BoutonEncaisser ref={bouton} xp={duXp} disabled={pending} onClick={() => onEncaisser(bouton.current)} />
      ) : null}

      <p className="text-sm font-bold">{statut}</p>
      <p className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
        <Clock className="size-3" aria-hidden="true" />
        {libelleRenouvellement(minutes)}
      </p>
    </section>
  )
}

/**
 * Le sentier : un médaillon par quête (son icône sur disque lavande, cerclé
 * d'or et coché une fois faite — il « pop » à la bascule), relié au suivant
 * par un pointillé qui se dore quand ses deux bouts sont faits.
 */
function Sentier({ quetes }: { quetes: QueteServie[] }) {
  return (
    <div role="list" aria-label="Les trois marches vers le coffre" className="flex items-center justify-center py-1">
      {quetes.map((q, i) => (
        <Fragment key={q.id}>
          {i > 0 ? (
            <span aria-hidden="true" className={s.segment} data-done={quetes[i - 1].done && q.done ? 'true' : undefined} />
          ) : null}
          <span
            role="listitem"
            className={s.medaillon}
            data-done={q.done ? 'true' : undefined}
            aria-label={`${PILIER_LIBELLE[q.pilier]} : ${q.label}, ${q.done ? 'faite' : 'à faire'}`}
          >
            <Image
              src={iconeQuete(q)}
              alt=""
              width={96}
              height={96}
              className={cn('size-7 object-contain', !q.done && 'opacity-80')}
            />
            {q.done ? (
              <span className={s.coche} aria-hidden="true">
                <Check className="size-3" strokeWidth={4} />
              </span>
            ) : null}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

/**
 * Une ligne de la carte : l'icône, le titre, la jauge (« 3/10 ») pour une
 * quête comptable ou sa précision pour une quête à objectif 1, et à droite
 * ce qu'elle rapporte — ou la pièce, ou la coche. Toute la ligne est le lien.
 */
function LigneQuete({
  q,
  encaissee,
  coffrePret,
  pending,
  onEncaisser,
}: {
  q: QueteServie
  encaissee: boolean
  /** Les trois sont bouclées : la pièce est sous le coffre, la ligne ne porte qu'une coche d'or. */
  coffrePret: boolean
  pending: boolean
  onEncaisser: (bouton: HTMLButtonElement | null) => void
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const fait = Math.min(q.current, q.goal)
  const ratio = q.goal > 0 ? fait / q.goal : 0
  const comptable = q.goal > 1

  const corps = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary">
        <Image src={iconeQuete(q)} alt="" width={96} height={96} className="size-8 object-contain" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="font-heading block text-[0.95rem] leading-tight font-extrabold">{q.label}</span>
        {comptable ? (
          <span className="mt-1.5 flex items-center gap-2">
            <span
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={q.goal}
              aria-valuenow={fait}
              aria-label={`${fait} sur ${q.goal}`}
            >
              <span
                className={cn('block h-full rounded-full', s.jauge, q.done ? 'bg-highlight' : 'bg-primary')}
                style={{ transform: `scaleX(${ratio})` }}
              />
            </span>
            <span className="text-xs font-extrabold text-muted-foreground tabular-nums">
              {fait}/{q.goal}
            </span>
          </span>
        ) : (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{q.detail}</span>
        )}
      </span>
    </>
  )

  let droite: ReactNode
  if (encaissee) {
    droite = (
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success/15 text-success">
        <Check className="size-5" strokeWidth={3} aria-label="Encaissée" />
      </span>
    )
  } else if (q.done && coffrePret) {
    droite = (
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight text-foreground">
        <Check className="size-5" strokeWidth={3} aria-label="Faite" />
      </span>
    )
  } else if (q.done) {
    droite = <BoutonEncaisser ref={bouton} xp={q.xp} disabled={pending} onClick={() => onEncaisser(bouton.current)} />
  } else {
    droite = (
      <>
        <span className="font-heading inline-flex shrink-0 items-center gap-0.5 rounded-full bg-highlight px-2 py-0.5 text-sm font-extrabold text-foreground tabular-nums">
          <XpIcon className="size-4" />
          {q.xp}
        </span>
        <ChevronRight className="-ml-1 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </>
    )
  }

  const rangee = 'flex items-center gap-3 p-3'
  if (!q.done && !encaissee) {
    return (
      <li>
        <Link
          href={q.href}
          onClick={fermerFeuilleQuetes}
          className={cn(rangee, 'transition active:scale-[0.98]')}
          aria-label={`${PILIER_LIBELLE[q.pilier]} : ${q.label}${comptable ? `, ${fait} sur ${q.goal}` : ''}, ${q.xp} XP — y aller`}
        >
          {corps}
          {droite}
        </Link>
      </li>
    )
  }
  return (
    <li className={cn(rangee, encaissee && 'opacity-60')} aria-label={`${PILIER_LIBELLE[q.pilier]} : ${q.label}`}>
      {corps}
      {droite}
    </li>
  )
}
