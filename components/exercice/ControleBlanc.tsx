'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  Crown,
  Hourglass,
  LoaderCircle,
  PenLine,
  RefreshCw,
  RotateCcw,
  Send,
  Timer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChoixNiveau from '@/components/exercices/ChoixNiveau'
import LessonRichContent from '@/components/LessonRichContent'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { SEUIL_GEMMES } from '@/lib/economie'
import type { Gain } from '@/lib/gains'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { chronoTick, formatChrono, tempsEcoule } from '@/lib/quiz-chrono'
import {
  appreciation,
  DIFFICULTE_DEFAUT,
  DIFFICULTES,
  dureeExerciceSecondes,
  libelleDifficulte,
  libelleStyle,
  noteRatio,
  REPONSE_MAX_LEN,
  type Correction,
  type Difficulte,
} from '@/lib/exercice'
import {
  obtenirExercice,
  rendreCopie,
  type ExerciceServi,
  type RaisonExercice,
} from '@/app/reviser/[subject]/[chapter]/exercice/actions'

/** Sous une minute, le cadran s'alarme — c'est la fin d'un contrôle. */
const ALERTE_SECONDES = 60

type Phase =
  | { nom: 'chargement' }
  | { nom: 'erreur'; raison: RaisonExercice }
  | { nom: 'consigne'; servi: ExerciceServi }
  | { nom: 'redaction'; servi: ExerciceServi }
  | { nom: 'correction-en-cours'; servi: ExerciceServi }
  | { nom: 'correction'; servi: ExerciceServi; correction: Correction; gains: Gain[] }

/**
 * LE CONTRÔLE BLANC d'un chapitre — l'écran de la tuile « Exercice ».
 *
 * Quatre temps, comme en classe : la CONSIGNE (le sujet, le barème, la durée,
 * on ne commence que quand on est prêt), la RÉDACTION (le chrono tourne, on
 * écrit sa copie), la CORRECTION (la note sur 20, les points par critère, le
 * mot du correcteur, le corrigé). À la sonnerie, la copie est RAMASSÉE telle
 * quelle et corrigée — un contrôle ne s'abandonne pas, il se rend.
 *
 * Le sujet est celui du chapitre, partagé (cf. actions.ts), au NIVEAU choisi
 * (Facile · Moyen · Difficile) : trois sujets écrits d'avance par fiche.
 * « Un autre sujet » en demande un neuf à l'IA, ce qui coûte un appel du quota.
 */
export default function ControleBlanc({
  chapterId,
  chapterTitle,
  backHref,
}: {
  chapterId: string
  chapterTitle: string
  backHref: string
}) {
  const [phase, setPhase] = useState<Phase>({ nom: 'chargement' })
  const [difficulte, setDifficulte] = useState<Difficulte>(DIFFICULTE_DEFAUT)
  const [copie, setCopie] = useState('')
  const [secondes, setSecondes] = useState(0)
  const secondesRef = useRef(0)
  const [budget, setBudget] = useState(0)
  // La copie ne se rend qu'une fois, même si la sonnerie et le bouton tombent
  // dans la même seconde.
  const rendueRef = useRef(false)
  // Le miroir de la copie, pour la sonnerie (cf. l'effet du chrono).
  const copieRef = useRef('')

  const charger = (niveau: Difficulte, nouveau: boolean) => {
    setDifficulte(niveau)
    setPhase({ nom: 'chargement' })
    obtenirExercice(chapterId, niveau, nouveau)
      .then((r) => {
        if (r.ok) setPhase({ nom: 'consigne', servi: r.exercice })
        else setPhase({ nom: 'erreur', raison: r.raison })
      })
      .catch(() => setPhase({ nom: 'erreur', raison: 'erreur' }))
  }

  // Au montage : le sujet du chapitre. L'état ne bouge qu'à la RÉPONSE (dans
  // la promesse), jamais dans le corps de l'effet ; et une réponse arrivée
  // après un démontage est ignorée.
  useEffect(() => {
    let actif = true
    obtenirExercice(chapterId, DIFFICULTE_DEFAUT, false)
      .then((r) => {
        if (!actif) return
        if (r.ok) setPhase({ nom: 'consigne', servi: r.exercice })
        else setPhase({ nom: 'erreur', raison: r.raison })
      })
      .catch(() => {
        if (actif) setPhase({ nom: 'erreur', raison: 'erreur' })
      })
    return () => {
      actif = false
    }
  }, [chapterId])

  const commencer = (servi: ExerciceServi) => {
    sfx.tap()
    const duree = dureeExerciceSecondes(servi.exercice.dureeMin)
    secondesRef.current = duree
    setSecondes(duree)
    setBudget(duree)
    setCopie('')
    copieRef.current = ''
    rendueRef.current = false
    setPhase({ nom: 'redaction', servi })
  }

  const rendre = (servi: ExerciceServi, texte: string) => {
    if (rendueRef.current) return
    rendueRef.current = true
    sfx.complete()
    setPhase({ nom: 'correction-en-cours', servi })
    rendreCopie(servi.id, texte)
      .then((r) => {
        if (r.ok) setPhase({ nom: 'correction', servi, correction: r.correction, gains: r.gains })
        else setPhase({ nom: 'erreur', raison: r.raison })
      })
      .catch(() => setPhase({ nom: 'erreur', raison: 'erreur' }))
  }

  // Le chrono de la rédaction. À zéro, la copie est ramassée — celle du
  // miroir `copieRef`, tenu à jour par la saisie : l'intervalle ne dépend pas
  // du texte, sinon chaque frappe le relancerait et fausserait le décompte.
  const enRedaction = phase.nom === 'redaction'
  const serviEnCours = enRedaction ? phase.servi : null
  useEffect(() => {
    if (!enRedaction || !serviEnCours) return
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible')
        return
      secondesRef.current = chronoTick(secondesRef.current)
      setSecondes(secondesRef.current)
      if (tempsEcoule(secondesRef.current)) rendre(serviEnCours, copieRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [enRedaction, serviEnCours])

  // ------------------------------------------------------------ chargement
  if (phase.nom === 'chargement') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <LoaderCircle className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="font-heading font-extrabold">Le professeur prépare ton sujet…</p>
        <p className="text-muted-foreground text-sm">
          Un contrôle sur « {chapterTitle} », écrit à partir du cours.
        </p>
      </div>
    )
  }

  // ---------------------------------------------------------------- erreur
  if (phase.nom === 'erreur') {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed p-8 text-center">
        <p className="font-heading font-semibold text-balance">{messageErreur(phase.raison)}</p>
        <div className="mt-5 flex flex-col items-center gap-2">
          {phase.raison === 'premium' ? (
            <Button asChild className="rounded-full">
              <Link href="/compte">
                <Crown className="size-4" /> Débloquer avec Studuel+
              </Link>
            </Button>
          ) : phase.raison !== 'quota' && phase.raison !== 'indisponible' ? (
            <Button className="rounded-full" onClick={() => charger(difficulte, false)}>
              <RefreshCw className="size-4" /> Réessayer
            </Button>
          ) : null}
          <Link
            href={backHref}
            className="text-muted-foreground text-sm font-medium underline underline-offset-4"
          >
            Retour au chapitre
          </Link>
        </div>
      </div>
    )
  }

  const { servi } = phase
  const { exercice } = servi

  // -------------------------------------------------------------- consigne
  if (phase.nom === 'consigne') {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Le niveau, aux ÉTOILES — le même gabarit que le cahier (26/10/2026). */}
        <ChoixNiveau
          label="Niveau du sujet"
          valeur={servi.difficulte}
          options={DIFFICULTES.map((d) => ({ valeur: d, etoiles: d, libelle: libelleDifficulte(d) }))}
          onChoisir={(d) => {
            if (d === servi.difficulte) return
            sfx.tap()
            charger(d, false)
          }}
        />
        {/* LE BLOC D'ENTRÉE, SIMPLIFIÉ (26/10/2026, Lucas : « simplifie le bloc
            introductif du contrôle, valable pour tous ») : le genre du sujet en
            surtitre, le titre, la consigne, puis une seule ligne de deux jetons
            (la durée, la note) à la place des deux cases et de la liste du
            barème — le barème reste à portée, replié. Le niveau n'est plus
            répété ici : la pastille au-dessus le dit déjà. */}
        <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <p className="surtitre">{libelleStyle(servi.style)}</p>
          <h2 className="font-heading mt-1 text-xl font-extrabold text-balance">{exercice.titre}</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{exercice.consigne}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-extrabold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 tabular-nums">
              <Timer className="size-4 text-primary" aria-hidden="true" />
              {exercice.dureeMin} min
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 tabular-nums">
              <PenLine className="size-4 text-primary" aria-hidden="true" />
              Noté sur 20
            </span>
          </div>

          <details className="group mt-3">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-bold text-muted-foreground [&::-webkit-details-marker]:hidden">
              <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" aria-hidden="true" />
              Voir le barème
            </summary>
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {exercice.bareme.map((b) => (
                <li key={b.critere} className="flex items-baseline justify-between gap-3">
                  <span>{b.critere}</span>
                  <span className="font-mono text-xs font-bold text-muted-foreground tabular-nums">
                    {b.points} pt{b.points > 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <p className="text-muted-foreground text-center text-xs text-balance">
          À la sonnerie, la copie est ramassée telle quelle, comme en classe.
        </p>

        <Button className="min-h-12 w-full rounded-full text-base" onClick={() => commencer(servi)}>
          Commencer le contrôle
        </Button>
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              charger(difficulte, true)
            }}
            className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 font-medium underline underline-offset-4"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" /> Un autre sujet
          </button>
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground font-medium underline underline-offset-4"
          >
            Retour au chapitre
          </Link>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------- correction en cours
  if (phase.nom === 'correction-en-cours') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <LoaderCircle className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="font-heading font-extrabold">Copie rendue. Le professeur corrige…</p>
        <p className="text-muted-foreground text-sm">Quelques secondes.</p>
      </div>
    )
  }

  // ------------------------------------------------------------ correction
  if (phase.nom === 'correction') {
    const { correction, gains } = phase
    const ratio = noteRatio(correction.note, correction.sur)
    const sur20 = correction.sur > 0 ? (20 * correction.note) / correction.sur : 0
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="rounded-3xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="surtitre">
            Ta note
          </p>
          <p
            className={cn(
              'font-heading mt-1 text-5xl font-extrabold tabular-nums',
              ratio >= 0.8 ? 'text-success' : ratio >= 0.5 ? 'text-warning' : 'text-destructive',
            )}
          >
            {formatNote(correction.note)}
            <span className="text-muted-foreground text-2xl font-bold">/{correction.sur}</span>
          </p>
          <p className="font-heading mt-1 text-lg font-extrabold">
            {appreciation(correction.note, correction.sur)}
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-balance">
            {correction.bilan}
          </p>
        </div>

        {/* Un contrôle blanc est une ÉPREUVE (557) : son XP suit la note, et
            dès 14/20 il rapporte des gemmes — l'une des rares portes vers elles. */}
        <PanneauRecompenses gains={gains} titre="Gagné" />
        {sur20 < SEUIL_GEMMES.controle ? (
          <p className="-mt-3 text-center text-xs font-semibold text-muted-foreground">
            Dès {SEUIL_GEMMES.controle}/20, un contrôle blanc rapporte des gemmes.
          </p>
        ) : null}

        <section className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="titre-section">
            Points par critère
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {correction.points.map((p) => {
              const r = noteRatio(p.obtenu, p.maximum)
              return (
                <li key={p.critere}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-semibold">{p.critere}</span>
                    <span className="font-mono text-xs font-bold tabular-nums">
                      {formatNote(p.obtenu)}/{p.maximum}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        r >= 0.8 ? 'bg-success' : r >= 0.5 ? 'bg-warning' : 'bg-destructive',
                      )}
                      style={{ width: `${r * 100}%` }}
                    />
                  </div>
                  {p.commentaire ? (
                    <p className="text-muted-foreground mt-1 text-xs leading-snug">
                      {p.commentaire}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="titre-section">Corrigé</h3>
          <LessonRichContent content={correction.corrige} className="mt-2 text-sm" />
        </section>

        <details className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
          <summary className="cursor-pointer text-sm font-bold">Relire ma copie</summary>
          <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
            {copie.trim() || '(copie vide)'}
          </p>
        </details>

        <div className="flex flex-col gap-3">
          {servi.difficulte < 3 && ratio >= 0.5 ? (
            <Button
              className="min-h-12 w-full rounded-full"
              onClick={() => {
                sfx.tap()
                charger((servi.difficulte + 1) as Difficulte, false)
              }}
            >
              <ArrowUp className="size-4" /> Passer au niveau{' '}
              {libelleDifficulte((servi.difficulte + 1) as Difficulte).toLowerCase()}
            </Button>
          ) : null}
          <Button
            variant={servi.difficulte < 3 && ratio >= 0.5 ? 'outline' : 'default'}
            className="min-h-12 w-full rounded-full"
            onClick={() => commencer(servi)}
          >
            <RotateCcw className="size-4" /> Refaire ce sujet
          </Button>
          <Button
            variant="outline"
            className="min-h-11 w-full rounded-full"
            onClick={() => {
              sfx.tap()
              charger(difficulte, true)
            }}
          >
            <RefreshCw className="size-4" /> Un autre sujet
          </Button>
          <Button variant="ghost" asChild className="min-h-11 w-full rounded-full">
            <Link href={backHref}>
              <ArrowLeft className="size-4" /> Retour au chapitre
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------- rédaction
  const alerte = secondes > 0 && secondes <= ALERTE_SECONDES
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase">
          <PenLine className="size-3.5" aria-hidden="true" />
          {libelleStyle(servi.style)}
        </span>
        <span
          role="timer"
          aria-live="off"
          aria-label={`${secondes} secondes restantes`}
          title="Temps restant"
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1 font-mono text-sm font-bold tabular-nums shadow-sm',
            alerte ? 'border-destructive/40 text-destructive' : 'text-foreground',
          )}
        >
          <Hourglass className="size-4" aria-hidden="true" />
          {formatChrono(secondes)}
        </span>
      </div>
      <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-1000 ease-linear',
            alerte ? 'bg-destructive' : 'bg-highlight',
          )}
          style={{ width: `${budget > 0 ? (secondes / budget) * 100 : 0}%` }}
        />
      </div>

      <section className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
        <h2 className="font-heading text-lg font-extrabold text-balance">{exercice.titre}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{exercice.consigne}</p>
        <LessonRichContent content={exercice.enonce} className="mt-3 text-sm" />
      </section>

      <label className="flex flex-col gap-1.5">
        <span className="surtitre">Ta copie</span>
        <textarea
          value={copie}
          onChange={(e) => {
            const v = e.target.value.slice(0, REPONSE_MAX_LEN)
            copieRef.current = v
            setCopie(v)
          }}
          rows={10}
          maxLength={REPONSE_MAX_LEN}
          placeholder="Rédige ta réponse ici, comme sur une feuille."
          className="focus-visible:ring-primary/40 min-h-48 w-full resize-y rounded-2xl border bg-card p-4 text-sm leading-relaxed shadow-sm focus-visible:ring-4 focus-visible:outline-none"
        />
        <span className="text-muted-foreground self-end font-mono text-[10px] tabular-nums">
          {copie.length}/{REPONSE_MAX_LEN}
        </span>
      </label>

      <Button
        className="min-h-12 w-full rounded-full text-base"
        onClick={() => rendre(servi, copie)}
      >
        <Send className="size-4" /> Rendre ma copie
      </Button>
      <Link
        href={backHref}
        className="text-muted-foreground hover:text-foreground self-center text-sm font-medium underline underline-offset-4"
      >
        Abandonner le contrôle
      </Link>
    </div>
  )
}

/** « 14 », « 12,5 » — la virgule française, sans décimale inutile. */
function formatNote(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ',')
}

function messageErreur(raison: RaisonExercice): string {
  switch (raison) {
    case 'premium':
      return 'L’exercice de chapitre est réservé à Studuel+ : un vrai sujet, corrigé et noté par l’IA.'
    case 'quota':
      return 'Tu as utilisé tes exercices du jour. Reviens demain — ou refais un quiz en attendant.'
    case 'indisponible':
      return 'La correction par l’IA n’est pas branchée sur ce serveur.'
    case 'introuvable':
      return 'Ce chapitre n’a pas encore de cours à partir duquel écrire un contrôle.'
    case 'auth':
      return 'Connecte-toi pour passer ce contrôle.'
    default:
      return 'Le professeur n’a pas réussi à écrire (ou corriger) ce sujet. Réessaie.'
  }
}
