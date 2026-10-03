'use client'

import Image from 'next/image'
import { useRef, useSyncExternalStore, useTransition } from 'react'
import { Check, Clock } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { claimDailyQuests } from '@/app/defi/hebdo-actions'
import {
  ALL_DONE_GEMS,
  ALL_DONE_XP,
  BONUS_STEP_ID,
  PILIER_LIBELLE,
  aEncaisser,
  libelleRenouvellement,
  minutesAvantMinuitUtc,
  type QueteServie,
  type QuetesDuJour,
} from '@/lib/quests'
import type { Gain } from '@/lib/gains'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { iconeQuete } from './icone'
import { BoutonAller, BoutonEncaisser } from './BoutonsQuete'
import CoffreDuJourDessin from './CoffreDuJourDessin'
import { fermerFeuilleQuetes, marquerEncaissees, relireQuetes, useFeuilleQuetesOuverte, useQuetesDuJour } from './store'

function abonnerMinute(cb: () => void): () => void {
  const t = setInterval(cb, 60_000)
  return () => clearInterval(t)
}
function useMinutesAvantMinuit(): number | null {
  return useSyncExternalStore(abonnerMinute, () => minutesAvantMinuitUtc(Date.now()), () => null)
}

/**
 * LA FEUILLE DES QUÊTES DU JOUR (03/10/2026, maquette « A » choisie par Lucas).
 * Ouverte depuis la pastille du bandeau, la tuile de l'arène ou le bandeau
 * « Quête accomplie » — une seule feuille pour toute l'app, montée une fois
 * dans la mise en page (components/quetes/QuetesGlobales). Claire, en cartes
 * blanches : une quête par geste (apprendre, se tester, jouer), sa barre, ce
 * qu'elle rapporte, et à droite le rond violet pour y aller ou le cristal d'or
 * pour encaisser. En pied, le coffre du jour (le violet d'avant), qui s'ouvre
 * quand les trois sont bouclées.
 *
 * Elle ne calcule aucune récompense : les montants sont relus en base à
 * l'encaissement (quest_claim, migrations 205 · 209 · 555), qui paie d'un coup
 * TOUTES les quêtes finies, plus le coffre si les trois le sont.
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
      const gains: Gain[] = [
        { unite: 'xp', montant: r.xp },
        { unite: 'gemme', montant: r.gems },
      ].filter((g) => g.montant > 0) as Gain[]
      celebrer(gains, origineUnique(declencheur.current, gains))
    })
  }

  return (
    <div className="flex flex-col gap-3 pt-1">
      <header>
        <h2 className="font-heading text-2xl leading-tight font-extrabold">Quêtes du jour</h2>
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] font-bold text-muted-foreground">
          <Clock className="size-3" aria-hidden="true" />
          {libelleRenouvellement(minutes)}
        </p>
      </header>

      <ul className="flex flex-col gap-2.5" aria-label={`${faites} quête${faites > 1 ? 's' : ''} sur ${etat.quetes.length} bouclée${faites > 1 ? 's' : ''}`}>
        {etat.quetes.map((q) => (
          <LigneQuete
            key={q.id}
            q={q}
            encaissee={payees.has(q.id)}
            pending={pending}
            onEncaisser={encaisser}
          />
        ))}
      </ul>

      <CoffreDuJour faites={faites} total={etat.quetes.length} ouvert={coffreOuvert} />
    </div>
  )
}

function LigneQuete({
  q,
  encaissee,
  pending,
  onEncaisser,
}: {
  q: QueteServie
  encaissee: boolean
  pending: boolean
  onEncaisser: (bouton: HTMLButtonElement | null) => void
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const ratio = q.goal > 0 ? Math.min(q.current, q.goal) / q.goal : 0
  return (
    <li className={cn('carte flex items-center gap-3 p-3', encaissee && 'opacity-70')}>
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary">
        <Image src={iconeQuete(q)} alt="" width={96} height={96} className="size-11 object-contain" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="surtitre">{PILIER_LIBELLE[q.pilier]}</p>
        <p className="font-heading text-[0.95rem] leading-tight font-extrabold">{q.label}</p>
        <p className="truncate text-xs text-muted-foreground">{q.detail}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={q.goal}
            aria-valuenow={Math.min(q.current, q.goal)}
            aria-label={`${Math.min(q.current, q.goal)} sur ${q.goal}`}
          >
            <div
              className={cn('h-full origin-left rounded-full', q.done ? 'bg-success' : 'bg-primary')}
              style={{ transform: `scaleX(${ratio})` }}
            />
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-extrabold text-muted-foreground tabular-nums">
            <span className="inline-flex items-center gap-0.5">
              <XpIcon className="size-3.5" />
              {q.xp}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <CristalIcon className="size-4" />
              {q.gems}
            </span>
          </span>
        </div>
      </div>
      {encaissee ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-5" strokeWidth={3} aria-label="Encaissée" />
        </span>
      ) : q.done ? (
        <BoutonEncaisser
          ref={bouton}
          xp={q.xp}
          gemmes={q.gems}
          disabled={pending}
          onClick={() => onEncaisser(bouton.current)}
        />
      ) : (
        <BoutonAller href={q.href} titre={q.label} onClick={fermerFeuilleQuetes} />
      )}
    </li>
  )
}

function CoffreDuJour({ faites, total, ouvert }: { faites: number; total: number; ouvert: boolean }) {
  const reste = total - faites
  return (
    <div className="carte flex items-center gap-3 p-4">
      <CoffreDuJourDessin ouvert={ouvert || reste === 0} className="size-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-base font-extrabold">Coffre du jour</p>
        <p className="text-xs text-muted-foreground">
          {ouvert
            ? 'Ouvert. Reviens demain pour le prochain.'
            : reste === 0
              ? 'Les trois sont bouclées : encaisse pour l’ouvrir'
              : `Encore ${reste} quête${reste > 1 ? 's' : ''} pour l’ouvrir`}
        </p>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < faites ? 'bg-highlight' : 'bg-secondary')} />
          ))}
        </div>
      </div>
      <span className="flex shrink-0 flex-col items-end gap-1 text-xs font-extrabold tabular-nums">
        <span className="inline-flex items-center gap-0.5">
          <XpIcon className="size-3.5" />
          {ALL_DONE_XP}
        </span>
        <span className="inline-flex items-center gap-0.5">
          <CristalIcon className="size-4" />
          {ALL_DONE_GEMS}
        </span>
      </span>
    </div>
  )
}
