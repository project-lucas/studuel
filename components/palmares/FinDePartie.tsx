'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, RotateCcw, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AvatarRender from '@/components/avatar/AvatarRender'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import Echelle from '@/components/palmares/Echelle'
import { normalizeAvatarConfig } from '@/lib/avatar'
import type { Gain } from '@/lib/gains'
import { toDayKey } from '@/lib/streak'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import {
  mouvementEchelle,
  phraseMarche,
  phraseMouvement,
  phraseRemiseAZero,
  phraseSommet,
  phraseVerdict,
  prochaineMarche,
  reperesJauge,
  titreVerdict,
  verdictPartie,
  type BilanPartie,
} from '@/lib/palmares/bilan'
import { epreuve, formatScore, type EpreuveId } from '@/lib/palmares/epreuves'
import { ordinal } from '@/lib/percentile'

/**
 * L'ÉCRAN DE FIN COMMUN AUX MODES DE L'ARÈNE — la boucle qui ne finit pas.
 *
 * Quatre choses, dans cet ordre, et rien d'autre : le score qui monte, la
 * jauge où l'on voit la DERNIÈRE FOIS et le RECORD, la place sur l'échelle de
 * la semaine (et le joueur juste au-dessus, prénom et score à dépasser), puis
 * REJOUER en gros. Chaque ligne répond à la même question : « et si je
 * refaisais une partie, là, tout de suite ? ».
 *
 * ON N'AFFICHE QUE CE QUE LE SERVEUR A DIT. Le titre reste neutre (« Temps
 * écoulé ! ») tant que le bilan n'est pas arrivé, puis il BASCULE vers le
 * verdict (« Nouveau record ! ») — c'est la révélation, pas un placeholder.
 * Sans serveur (visiteur, migration 352 endormie), on retombe sur le record
 * LOCAL : « Nouveau record ! » y reste vrai, l'échelle n'y apparaît pas.
 */
export default function FinDePartie({
  mode,
  score,
  titreAttente,
  detail,
  bilan,
  enAttente,
  recordLocalAvant,
  gains,
  saved,
  onRejouer,
  libelleRejouer = 'Rejouer',
  avant,
  apres,
  boutons,
  onDark = false,
}: {
  mode: EpreuveId
  score: number
  /** Le titre neutre, avant le verdict (« Temps écoulé ! », « Éliminé ! »). */
  titreAttente: string
  /** La ligne de détail sous le score (« 14/18 bonnes réponses · combo ×3 »). */
  detail: ReactNode
  /** Le bilan serveur, null tant qu'il n'est pas arrivé ou s'il n'y en a pas. */
  bilan: BilanPartie | null
  /** Vrai tant que la réponse du serveur est en route. */
  enAttente: boolean
  /** Le record LOCAL avant cette partie (0 = aucun) — le repli sans serveur. */
  recordLocalAvant: number
  gains: readonly Gain[]
  saved: boolean | null
  onRejouer: () => void
  libelleRejouer?: string
  /** Un emplacement AVANT le score (portrait du boss, face-à-face du duel). */
  avant?: ReactNode
  /** Un emplacement après les récompenses (trophée hebdo, montée de rang…). */
  apres?: ReactNode
  /** Boutons secondaires sous Rejouer (Retour, Continuer…). */
  boutons?: ReactNode
  onDark?: boolean
}) {
  const e = epreuve(mode)

  // Le verdict : celui du serveur dès qu'il est là ; sinon le repli local.
  const verdict = useMemo(() => {
    if (bilan) {
      return verdictPartie({ score: bilan.score, last: bilan.last, bestBefore: bilan.bestBefore })
    }
    if (enAttente) return null
    if (recordLocalAvant <= 0) return null
    return verdictPartie({ score, last: recordLocalAvant, bestBefore: recordLocalAvant })
  }, [bilan, enAttente, recordLocalAvant, score])

  const record = verdict?.kind === 'record'
  const titre = verdict ? titreVerdict(verdict) : titreAttente

  // Le son du record ne se joue qu'UNE fois, à la révélation.
  const sonne = useRef(false)
  useEffect(() => {
    if (record && !sonne.current) {
      sonne.current = true
      sfx.levelUp()
    }
  }, [record])

  const reperes = reperesJauge({
    score,
    last: bilan?.last ?? null,
    best: bilan ? bilan.best : Math.max(score, recordLocalAvant),
  })

  const compte = useCompteur(score)
  const today = toDayKey(new Date())

  return (
    <div className={cn('palm-fin', record && 'palm-fin--record', onDark && 'palm-fin--sombre')}>
      <p className="palm-eyebrow">{e.nom}</p>

      {avant}

      <h1 className={cn('palm-titre', verdict && 'palm-titre--verdict')} key={titre}>
        {titre}
      </h1>

      <p className="palm-score" aria-label={formatScore(mode, score)}>
        <span className="palm-score-nombre">{compte}</span>
        <span className="palm-score-unite">
          {score === 1 ? e.unite.un : e.unite.plusieurs}
        </span>
      </p>
      <p className="palm-detail">{detail}</p>

      {/* LA JAUGE : ma partie, la dernière fois, le record. */}
      <div
        className="palm-jauge"
        role="img"
        aria-label={
          bilan
            ? `Cette partie ${formatScore(mode, score)}${bilan.last !== null ? `, dernière fois ${formatScore(mode, bilan.last)}` : ''}, record ${formatScore(mode, bilan.best)}`
            : `Cette partie ${formatScore(mode, score)}`
        }
      >
        <div className="palm-jauge-piste">
          <div
            className={cn('palm-jauge-plein', record && 'palm-jauge-plein--record')}
            style={{ width: `${Math.round(reperes.score * 100)}%` }}
          />
          {reperes.last !== null && bilan && bilan.last !== null ? (
            <span className="palm-repere palm-repere--derniere" style={{ left: `${reperes.last * 100}%` }}>
              <i />
              <b>Dernière fois</b>
            </span>
          ) : null}
          {(bilan ? bilan.best : Math.max(score, recordLocalAvant)) > 0 ? (
            <span className="palm-repere palm-repere--record" style={{ left: `${reperes.best * 100}%` }}>
              <i />
              <b>Record</b>
            </span>
          ) : null}
        </div>
      </div>

      <p className={cn('palm-verdict', enAttente && !verdict && 'palm-verdict--attente')} aria-live="polite">
        {verdict
          ? phraseVerdict(mode, verdict)
          : enAttente
            ? 'On compare avec ta dernière fois…'
            : /* Le serveur n'a pas répondu (migration 352 absente, score refusé) :
                 l'élève EST connecté — l'arène est derrière l'auth — donc on ne
                 lui demande pas de se connecter. On dit ce qui est vrai. */
              'Ton record est gardé sur cet appareil ; l’échelle de la semaine arrive dès que le serveur répond.'}
      </p>

      {bilan ? <CarteEchelle mode={mode} bilan={bilan} today={today} /> : null}

      <PanneauRecompenses gains={gains} className="w-full" />

      {apres}

      <p className="palm-note">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Partie non enregistrée (connecte-toi pour garder ta progression).'
            : ''}
      </p>

      <div className="palm-boutons">
        <Button size="lg" onClick={onRejouer} className="press-3d h-14 w-full text-lg font-extrabold">
          <RotateCcw className="size-5" aria-hidden="true" /> {libelleRejouer}
        </Button>
        {boutons}
      </div>
    </div>
  )
}

/**
 * La carte de l'ÉCHELLE : mon rang de la semaine (avant → après), la prochaine
 * marche, la remise à zéro, et l'échelle entière repliée dessous.
 */
function CarteEchelle({ mode, bilan, today }: { mode: EpreuveId; bilan: BilanPartie; today: string }) {
  const mouvement = mouvementEchelle(bilan)
  const marche = prochaineMarche(bilan)
  const sommet = phraseSommet(mode, bilan.leader, bilan.grade)
  const [ouverte, setOuverte] = useState(false)
  const monte = mouvement.kind === 'monte' || (mouvement.kind === 'entree' && mouvement.rank === 1)
  const partVersMarche = marche ? Math.max(0.06, Math.min(1, bilan.weekBest / marche.cible)) : 1

  return (
    <section className={cn('palm-echelle', monte && 'palm-echelle--monte')} aria-label="Ton échelle de la semaine">
      <div className="palm-echelle-tete">
        <span className={cn('palm-rang', bilan.weekRank <= 3 && `palm-rang--${bilan.weekRank}`)}>
          <strong>{ordinal(bilan.weekRank)}</strong>
          <small>sur {bilan.weekTotal}</small>
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="palm-echelle-phrase">
            {monte ? <TrendingUp className="mr-1 inline size-4 align-[-2px]" aria-hidden="true" /> : null}
            {phraseMouvement(mouvement, bilan.grade)}
          </p>
          <p className="palm-echelle-reset">{phraseRemiseAZero(today)}</p>
        </div>
      </div>

      {marche ? (
        <div className="palm-marche">
          <span className="palm-marche-avatar" aria-hidden="true">
            <AvatarRender config={normalizeAvatarConfig(marche.avatar ?? {})} className="size-full" />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="palm-marche-phrase">{phraseMarche(mode, marche)}</p>
            <div className="palm-marche-piste">
              <i style={{ width: `${Math.round(partVersMarche * 100)}%` }} />
            </div>
            <p className="palm-marche-cible">
              {marche.name} · {formatScore(mode, marche.cible)}
            </p>
          </div>
        </div>
      ) : sommet ? (
        <p className="palm-sommet">{sommet}</p>
      ) : null}

      <button
        type="button"
        className="palm-echelle-bouton"
        aria-expanded={ouverte}
        onClick={() => {
          sfx.tap()
          setOuverte((o) => !o)
        }}
      >
        {ouverte ? 'Replier l’échelle' : 'Voir l’échelle'}
        <ChevronDown className={cn('size-4 transition-transform', ouverte && 'rotate-180')} aria-hidden="true" />
      </button>

      {ouverte ? <Echelle mode={mode} /> : null}
    </section>
  )
}

/**
 * Le score qui MONTE, de zéro à sa valeur, en 700 ms — coupé par
 * prefers-reduced-motion (valeur finale directe). Le chiffre qui défile est
 * ce qui donne au score son poids ; un nombre posé d'un coup se lit, un nombre
 * qui monte se ressent.
 */
function useCompteur(cible: number): string {
  const [valeur, setValeur] = useState(0)
  useEffect(() => {
    const reduit =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duree = reduit || cible <= 0 ? 0 : 700
    let debut: number | null = null
    let raf = 0
    const pas = (t: number) => {
      if (debut === null) debut = t
      const k = duree === 0 ? 1 : Math.min(1, (t - debut) / duree)
      const ease = 1 - Math.pow(1 - k, 3)
      setValeur(Math.round(cible * ease))
      if (k < 1) raf = requestAnimationFrame(pas)
    }
    raf = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf)
  }, [cible])
  return String(valeur).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
