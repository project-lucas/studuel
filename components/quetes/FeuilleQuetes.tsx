'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useRef, useState, useSyncExternalStore, useTransition, type ReactNode } from 'react'
import { Check, ChevronRight, Clock } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import XpIcon from '@/components/ui/XpIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { claimDailyQuest, openDailyChest } from '@/app/defi/hebdo-actions'
import {
  ALL_DONE_XP,
  BONUS_STEP_ID,
  PILIER_LIBELLE,
  aEncaisser,
  coffreDuJourPret,
  coffreOuvrable,
  libelleRenouvellement,
  minutesAvantMinuitUtc,
  prochaineAEncaisser,
  type QueteServie,
  type QuetesDuJour,
} from '@/lib/quests'
import type { Gain } from '@/lib/gains'
import { buzz, sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { iconeQuete } from './icone'
import { BoutonEncaisser, type HumeurPiece } from './BoutonsQuete'
import CoffreDuJourDessin from './CoffreDuJourDessin'
import s from './FeuilleQuetes.module.css'
import {
  fermerFeuilleQuetes,
  lireEncaisseurDemo,
  marquerEncaissees,
  relireQuetes,
  useFeuilleQuetesOuverte,
  useQuetesDuJour,
} from './store'

function abonnerMinute(cb: () => void): () => void {
  const t = setInterval(cb, 60_000)
  return () => clearInterval(t)
}
function useMinutesAvantMinuit(): number | null {
  return useSyncExternalStore(abonnerMinute, () => minutesAvantMinuitUtc(Date.now()), () => null)
}

/** Ce qui vient d'être encaissé : la ligne éclate en or, son « +N » s'envole. */
type DernierGain = { id: string; xp: number; cle: number }

/**
 * LA FEUILLE DES QUÊTES DU JOUR — « LE COFFRE D'ABORD » (14/10/2026, direction
 * validée par Lucas ; elle remplace la maquette « A » du 03/10 : trois cartes
 * identiques, trois flèches identiques, et le coffre en dernier, coupé par le
 * bas de la fenêtre — la plus grosse récompense de l'écran était celle qu'on
 * ne voyait pas).
 *
 * De haut en bas : LE COFFRE en grand sur son disque lavande, « +100 XP » en
 * pilule d'or ; sous lui LE SENTIER — un médaillon par quête, relié au suivant
 * par un pointillé qui se dore à mesure ; puis UNE carte blanche, une ligne par
 * quête — toute la ligne est le lien, la récompense en or au bout.
 *
 * LES QUÊTES S'ENCAISSENT UNE À UNE (14/10/2026, Lucas : « les validations des
 * missions journalières doivent se faire une à une pour le côté dopamine, avec
 * une belle animation des éclairs qui s'ajoutent en vague, comme Clash Royale,
 * vers la barre de niveau — il faut que ce soit satisfaisant »). Chaque quête
 * finie porte SA pièce ; la prochaine à toucher saute et bat d'une onde d'or,
 * les suivantes attendent. Un toucher : la pièce se ramasse le temps de la
 * réponse, puis la VAGUE part — les éclairs jaillissent tous ensemble autour
 * de la pièce, flottent, et rentrent en file dans la barre de niveau, chacun
 * avec sa note (RecompensesProvider, `vague`) ; la ligne éclate en or, son
 * « +30 » monte, le médaillon du sentier se coche. Quand les quatre sont
 * encaissées, la grande pièce paraît sous le coffre, qui frémit : c'est la
 * cinquième vague, la plus grosse.
 *
 * Ouverte depuis la pastille du bandeau, la tuile de l'arène ou le bandeau
 * « Quête accomplie » — une seule feuille pour toute l'app, montée une fois
 * dans la mise en page (components/quetes/QuetesGlobales). Elle ne calcule
 * aucune récompense : les montants sont relus en base à l'encaissement
 * (quest_claim, 577) et c'est ce qui a été VERSÉ qui vole.
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
  // La pièce touchée (une quête, ou « coffre ») : elle seule se ramasse.
  const [enCharge, setEnCharge] = useState<string | null>(null)
  const [dernier, setDernier] = useState<DernierGain | null>(null)

  const faites = etat.quetes.filter((q) => q.done).length
  const payees = new Set(etat.encaissees)
  const coffreOuvert = payees.has(BONUS_STEP_ID)
  const ouvrable = coffreOuvrable(etat)
  const prochaine = prochaineAEncaisser(etat)

  /** La vague : ce qui a été VERSÉ jaillit de la pièce touchée. */
  const faireVoler = (xp: number, bouton: HTMLElement | null) => {
    const gains = [{ unite: 'xp', montant: xp }].filter((g) => g.montant > 0) as Gain[]
    celebrer(gains, origineUnique(bouton, gains), { vague: true })
  }

  const encaisserQuete = (q: QueteServie, bouton: HTMLButtonElement | null) => {
    if (pending) return
    setEnCharge(q.id)
    sfx.tap()
    start(async () => {
      const demo = lireEncaisseurDemo()
      const r = demo ? await demo(q.id) : await claimDailyQuest(q.id)
      setEnCharge(null)
      if (!r.claimed) {
        void relireQuetes()
        return
      }
      buzz(true, 1)
      marquerEncaissees([q.id], r.allDone)
      setDernier({ id: q.id, xp: r.xp, cle: Date.now() })
      faireVoler(r.xp, bouton)
    })
  }

  const ouvrirCoffre = (bouton: HTMLButtonElement | null) => {
    if (pending) return
    setEnCharge(BONUS_STEP_ID)
    sfx.tap()
    start(async () => {
      const demo = lireEncaisseurDemo()
      const r = demo ? await demo(BONUS_STEP_ID) : await openDailyChest()
      setEnCharge(null)
      if (!r.claimed) {
        void relireQuetes()
        return
      }
      sfx.treasure()
      buzz(true, 3)
      marquerEncaissees(
        etat.quetes.map((q) => q.id),
        r.allDone,
      )
      setDernier({ id: BONUS_STEP_ID, xp: r.xp, cle: Date.now() })
      faireVoler(r.xp, bouton)
    })
  }

  const humeur = (id: string): HumeurPiece =>
    enCharge === id ? 'charge' : prochaine?.id === id && !pending ? 'appel' : 'repos'

  return (
    <div className="flex flex-col gap-4 pt-1">
      <h2 className="font-heading pr-12 text-2xl leading-tight font-extrabold">Quêtes du jour</h2>

      <CoffreDuJour
        etat={etat}
        faites={faites}
        payees={payees}
        ouvert={coffreOuvert}
        ouvrable={ouvrable}
        minutes={minutes}
        pending={pending}
        enCharge={enCharge === BONUS_STEP_ID}
        dernier={dernier?.id === BONUS_STEP_ID ? dernier : null}
        onOuvrir={ouvrirCoffre}
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
            humeur={humeur(q.id)}
            pending={pending}
            dernier={dernier?.id === q.id ? dernier : null}
            onEncaisser={encaisserQuete}
          />
        ))}
      </ul>
    </div>
  )
}

/** Le coffre en tête : le dessin, « +100 XP », le sentier, l'état, le compte à rebours. */
function CoffreDuJour({
  etat,
  faites,
  payees,
  ouvert,
  ouvrable,
  minutes,
  pending,
  enCharge,
  dernier,
  onOuvrir,
}: {
  etat: QuetesDuJour
  faites: number
  payees: ReadonlySet<string>
  ouvert: boolean
  ouvrable: boolean
  minutes: number | null
  pending: boolean
  enCharge: boolean
  dernier: DernierGain | null
  onOuvrir: (bouton: HTMLButtonElement | null) => void
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const quetes = etat.quetes
  const reste = quetes.length - faites
  const aPayer = aEncaisser(etat).length
  const statut = ouvert
    ? 'Ouvert ! Reviens demain pour le prochain.'
    : ouvrable
      ? 'Tout est encaissé : ouvre-le !'
      : coffreDuJourPret(etat)
        ? `Encaisse ${aPayer > 1 ? `tes ${aPayer} quêtes` : 'ta dernière quête'} pour l’ouvrir`
        : `Encore ${reste} quête${reste > 1 ? 's' : ''} pour l’ouvrir`

  return (
    <section aria-label="Coffre du jour" className="flex flex-col items-center gap-2 text-center">
      <div className="relative grid size-28 place-items-center">
        <span aria-hidden="true" className={cn('absolute inset-0 rounded-full bg-secondary', ouvrable && s.disqueAppel)} />
        <CoffreDuJourDessin
          ouvert={ouvert}
          className={cn('relative size-24', ouvrable && s.coffreTremble, dernier && s.coffreSaute)}
        />
        {dernier ? (
          <span key={dernier.cle} className={cn(s.plusFlottant, s.plusCoffre)} aria-hidden="true">
            +{dernier.xp}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-heading text-lg leading-tight font-extrabold">Coffre du jour</p>
        <span className="font-heading inline-flex items-center gap-1 rounded-full bg-highlight px-2.5 py-0.5 text-sm font-extrabold text-foreground tabular-nums">
          <XpIcon className="size-4" />+{ALL_DONE_XP} XP
        </span>
      </div>

      <Sentier quetes={quetes} payees={payees} />

      {ouvrable ? (
        <BoutonEncaisser
          ref={bouton}
          grande
          xp={ALL_DONE_XP}
          disabled={pending}
          humeur={enCharge ? 'charge' : 'appel'}
          label={`Ouvrir le coffre du jour : ${ALL_DONE_XP} XP`}
          onClick={() => onOuvrir(bouton.current)}
        />
      ) : null}

      <p className="text-sm font-bold" aria-live="polite">
        {statut}
      </p>
      <p className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
        <Clock className="size-3" aria-hidden="true" />
        {libelleRenouvellement(minutes)}
      </p>
    </section>
  )
}

/**
 * Le sentier : un médaillon par quête (son icône sur disque lavande, cerclé
 * d'or une fois faite, coché une fois ENCAISSÉE — il « pop » à chaque
 * bascule), relié au suivant par un pointillé qui se dore quand ses deux bouts
 * sont faits.
 */
function Sentier({ quetes, payees }: { quetes: QueteServie[]; payees: ReadonlySet<string> }) {
  return (
    <div role="list" aria-label="Les marches vers le coffre" className="flex items-center justify-center py-1">
      {quetes.map((q, i) => (
        <Fragment key={q.id}>
          {i > 0 ? (
            <span aria-hidden="true" className={s.segment} data-done={quetes[i - 1].done && q.done ? 'true' : undefined} />
          ) : null}
          <span
            role="listitem"
            className={s.medaillon}
            data-done={q.done ? 'true' : undefined}
            aria-label={`${PILIER_LIBELLE[q.pilier]} : ${q.label}, ${
              payees.has(q.id) ? 'encaissée' : q.done ? 'faite, à encaisser' : 'à faire'
            }`}
          >
            <Image
              src={iconeQuete(q)}
              alt=""
              width={96}
              height={96}
              className={cn('size-7 object-contain', !q.done && 'opacity-80')}
            />
            {payees.has(q.id) ? (
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
 * ce qu'elle rapporte — ou SA pièce, ou la coche. Toute la ligne est le lien.
 */
function LigneQuete({
  q,
  encaissee,
  humeur,
  pending,
  dernier,
  onEncaisser,
}: {
  q: QueteServie
  encaissee: boolean
  humeur: HumeurPiece
  pending: boolean
  /** Elle vient d'être encaissée : la ligne éclate en or, le « +N » monte. */
  dernier: DernierGain | null
  onEncaisser: (q: QueteServie, bouton: HTMLButtonElement | null) => void
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
      <span className="relative grid size-10 shrink-0 place-items-center">
        <span className={cn('grid size-10 place-items-center rounded-full bg-success/15 text-success', dernier && s.cocheEclate)}>
          <Check className="size-5" strokeWidth={3} aria-label="Encaissée" />
        </span>
        {dernier ? (
          <span key={dernier.cle} className={s.plusFlottant} aria-hidden="true">
            +{dernier.xp}
          </span>
        ) : null}
      </span>
    )
  } else if (q.done) {
    droite = (
      <BoutonEncaisser
        ref={bouton}
        xp={q.xp}
        disabled={pending}
        humeur={humeur}
        onClick={() => onEncaisser(q, bouton.current)}
      />
    )
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
    <li
      className={cn(rangee, 'relative', encaissee && !dernier && 'opacity-60', dernier && s.ligneEclate)}
      aria-label={`${PILIER_LIBELLE[q.pilier]} : ${q.label}`}
    >
      {dernier ? <span key={dernier.cle} className={s.eclatOr} aria-hidden="true" /> : null}
      {corps}
      {droite}
    </li>
  )
}
