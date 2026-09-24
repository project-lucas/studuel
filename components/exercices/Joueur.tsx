'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Crown, LoaderCircle, Lock, RefreshCw, RotateCcw, X } from 'lucide-react'
import ConfettiRain from '@/components/ConfettiRain'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { Button } from '@/components/ui/button'
import {
  commencerExercice,
  terminerExercice,
  verifierReponse,
  type RaisonCahier,
  type ResultatTerminer,
} from '@/app/reviser/[subject]/[chapter]/exercice/cahier-actions'
import { motDuBilan } from '@/lib/exercices/progression'
import { COMPETENCES, type Etoiles as NombreEtoiles, type ExercicePublic, type Reponse } from '@/lib/exercices/types'
import type { Gain } from '@/lib/gains'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { Inline } from './commun'
import DocumentVue from './DocumentVue'
import { Etoiles } from './Etoiles'
import Question, { STATUT_VIERGE, type StatutQuestion } from './Question'
import s from './manuel.module.css'

export type ExerciceJoue = {
  id: string
  position: number
  etoiles: NombreEtoiles
  gemmes: number
  xp: number
  contenu: ExercicePublic
}

/**
 * Le moteur d'un exercice : commencer, vérifier, terminer. Par défaut, les
 * actions serveur (le seul juge qui compte) ; l'aperçu de développement en
 * branche un local (components/exercices/moteur-demo.ts).
 */
export type MoteurExercice = {
  commencer: typeof commencerExercice
  verifier: typeof verifierReponse
  terminer: typeof terminerExercice
}

const MOTEUR_SERVEUR: MoteurExercice = {
  commencer: commencerExercice,
  verifier: verifierReponse,
  terminer: terminerExercice,
}

type Phase =
  | { nom: 'demarrage' }
  | { nom: 'erreur'; raison: RaisonCahier }
  | { nom: 'jeu'; passage: string }
  | { nom: 'bilan'; passage: string; resultat: Extract<ResultatTerminer, { ok: true }> }

/**
 * LE JOUEUR D'UN EXERCICE — une page de manuel qu'on résout.
 *
 * En haut, la mise en situation et les documents ; dessous, les questions,
 * chacune avec son bouton « Vérifier ». Deux essais par question : le premier
 * raté donne le coup de pouce, le second donne la correction. Quand toutes les
 * questions sont finies, le serveur fait le bilan (exercice_terminer) : réussi
 * à la moitié des points, il ouvre l'exercice suivant et verse les gemmes.
 */
export default function Joueur({
  exercice,
  retour,
  suivant,
  cours,
  moteur = MOTEUR_SERVEUR,
}: {
  exercice: ExerciceJoue
  /** Le cahier du chapitre. */
  retour: string
  /** L'exercice suivant (lien et étoiles), s'il existe. */
  suivant: { href: string; etoiles: NombreEtoiles } | null
  /** Le cours du chapitre, pour revoir avant de recommencer. */
  cours: string | null
  moteur?: MoteurExercice
}) {
  const { contenu } = exercice
  const [phase, setPhase] = useState<Phase>({ nom: 'demarrage' })
  const [statuts, setStatuts] = useState<StatutQuestion[]>(() => contenu.questions.map(() => STATUT_VIERGE))
  const [enCours, setEnCours] = useState<number | null>(null)
  const [essai, setEssai] = useState(0)
  const termine = useRef(false)
  const bilanRef = useRef<HTMLDivElement>(null)

  // Un passage neuf à l'ouverture (et à chaque « Recommencer »).
  useEffect(() => {
    let actif = true
    termine.current = false
    moteur
      .commencer(exercice.id)
      .then((r) => {
        if (!actif) return
        setPhase(r.ok ? { nom: 'jeu', passage: r.passage } : { nom: 'erreur', raison: r.raison })
      })
      .catch(() => actif && setPhase({ nom: 'erreur', raison: 'erreur' }))
    return () => {
      actif = false
    }
  }, [exercice.id, essai, moteur])

  const passage = phase.nom === 'jeu' || phase.nom === 'bilan' ? phase.passage : null

  const verifier = useCallback(
    (i: number, reponse: Reponse) => {
      if (!passage || enCours !== null) return
      setEnCours(i)
      moteur
        .verifier(passage, i, reponse)
        .then((r) => {
          if (!r.ok) {
            setPhase({ nom: 'erreur', raison: r.raison })
            return
          }
          if (r.juste) sfx.correct()
          else sfx.wrong()
          setStatuts((prev) =>
            prev.map((st, k) =>
              k === i
                ? {
                    essais: r.essais,
                    juste: r.juste,
                    fini: r.fini,
                    bons: r.bons,
                    total: r.total,
                    ...(r.correction ? { correction: r.correction } : {}),
                  }
                : st,
            ),
          )
        })
        .catch(() => setPhase({ nom: 'erreur', raison: 'erreur' }))
        .finally(() => setEnCours(null))
    },
    [passage, enCours, moteur],
  )

  // Toutes les questions finies : le bilan, compté par le serveur.
  const toutFini = statuts.every((st) => st.fini)
  useEffect(() => {
    if (!toutFini || phase.nom !== 'jeu' || termine.current) return
    termine.current = true
    const p = phase.passage
    moteur
      .terminer(p)
      .then((r) => {
        if (!r.ok) {
          setPhase({ nom: 'erreur', raison: r.raison })
          return
        }
        if (r.reussi) sfx.complete()
        setPhase({ nom: 'bilan', passage: p, resultat: r })
        setTimeout(() => bilanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
      })
      .catch(() => setPhase({ nom: 'erreur', raison: 'erreur' }))
  }, [toutFini, phase, moteur])

  const recommencer = () => {
    sfx.tap()
    setStatuts(contenu.questions.map(() => STATUT_VIERGE))
    setPhase({ nom: 'demarrage' })
    setEssai((n) => n + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const active = statuts.findIndex((st) => !st.fini)

  return (
    <div className={cn(s.manuel, 'mx-auto flex w-full max-w-xl flex-col gap-4')}>
      {/* La barre du haut : fermer, et une pastille par question. */}
      <div className="sticky top-16 z-20 flex items-center gap-3 md:top-3 rounded-full bg-[var(--card)]/95 px-2 py-1.5 shadow-[0_0_0_1.5px_var(--border),0_8px_18px_-14px_rgba(36,48,79,0.8)]">
        <Link href={retour} aria-label="Retour au cahier" className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
          <X className="size-5" strokeWidth={2.6} />
        </Link>
        <div className="flex flex-1 gap-1" aria-label={`${statuts.filter((x) => x.fini).length} questions sur ${statuts.length} terminées`}>
          {statuts.map((st, i) => (
            <span
              key={i}
              className={cn(
                'h-2.5 flex-1 rounded-full transition-colors',
                !st.fini ? (i === active ? 'bg-[color-mix(in_oklch,var(--primary),white_60%)]' : 'bg-[var(--muted)]') : st.juste ? 'bg-[var(--success)]' : 'bg-[var(--destructive)]',
              )}
            />
          ))}
        </div>
        <Etoiles n={exercice.etoiles} className="pr-1.5" />
      </div>

      {/* L'en-tête d'exercice, comme dans le manuel. */}
      <header className="px-1">
        <div className="flex items-center gap-2.5">
          <span className={s.numero}>{exercice.position}</span>
          <div className="min-w-0">
            <p className="surtitre">{COMPETENCES[contenu.competence]}</p>
            <h1 className="font-heading text-[1.45rem] leading-tight font-extrabold text-balance">{contenu.titre}</h1>
          </div>
        </div>
      </header>

      <div className={s.situation}>
        <p className="text-[0.95rem] leading-relaxed">
          <Inline texte={contenu.situation} />
        </p>
      </div>

      {contenu.documents.map((d, i) => (
        <DocumentVue key={d.id} doc={d} numero={i + 1} id={`doc-${d.id}`} />
      ))}

      {phase.nom === 'demarrage' ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm font-semibold text-[var(--muted-foreground)]">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> On ouvre ton cahier…
        </div>
      ) : phase.nom === 'erreur' ? (
        <Erreur raison={phase.raison} retour={retour} onReessayer={recommencer} />
      ) : (
        <>
          <h2 className="font-heading mt-1 px-1 text-lg font-extrabold">À toi de jouer</h2>
          {contenu.questions.map((q, i) => (
            <Question
              key={`${essai}-${i}`}
              q={q}
              numero={i + 1}
              documents={contenu.documents}
              statut={statuts[i]}
              enCours={enCours === i}
              active={i === active}
              onVerifier={(r) => verifier(i, r)}
            />
          ))}
        </>
      )}

      {phase.nom === 'jeu' && toutFini ? (
        <div className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[var(--muted-foreground)]">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Le prof fait le bilan…
        </div>
      ) : null}

      {phase.nom === 'bilan' ? (
        <div ref={bilanRef}>
          <Bilan
            resultat={phase.resultat}
            etoiles={exercice.etoiles}
            retour={retour}
            suivant={suivant}
            cours={cours}
            onRecommencer={recommencer}
          />
        </div>
      ) : null}
    </div>
  )
}

function Bilan({
  resultat,
  etoiles,
  retour,
  suivant,
  cours,
  onRecommencer,
}: {
  resultat: Extract<ResultatTerminer, { ok: true }>
  etoiles: NombreEtoiles
  retour: string
  suivant: { href: string; etoiles: NombreEtoiles } | null
  cours: string | null
  onRecommencer: () => void
}) {
  const gains: Gain[] = [
    ...(resultat.gemmes > 0 ? [{ unite: 'gemme' as const, montant: resultat.gemmes }] : []),
    ...(resultat.xp > 0 ? [{ unite: 'xp' as const, montant: resultat.xp }] : []),
  ]
  const mot = motDuBilan(resultat)
  return (
    <section className={cn('relative overflow-hidden rounded-[1.6rem] bg-[var(--card)] p-5 text-center shadow-[0_0_0_2px_var(--border),0_18px_30px_-22px_rgba(36,48,79,0.9)]', s.apparition)} aria-live="polite">
      {resultat.reussi ? <ConfettiRain /> : null}
      <div className="relative">
        <Etoiles n={etoiles} className="justify-center [&_svg]:size-7" />
        <p className="font-heading mt-2 text-2xl font-extrabold">{mot}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--muted-foreground)]">
          {resultat.score} point{resultat.score > 1 ? 's' : ''} sur {resultat.max}
          {resultat.parfait ? ' · sans une seule erreur' : ''}
        </p>
        {resultat.parfait ? (
          <span className={cn(s.sceau, 'mt-2 bg-[color-mix(in_oklch,var(--highlight),white_70%)] text-[color-mix(in_oklch,var(--highlight),black_55%)]')}>
            <Crown className="size-3.5" aria-hidden="true" /> Sans faute
          </span>
        ) : null}

        {gains.length ? (
          <PanneauRecompenses gains={gains} titre="Tu gagnes" className="mt-4" />
        ) : resultat.reussi && resultat.deja ? (
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">Tes gemmes pour cet exercice sont déjà dans ton coffre.</p>
        ) : null}

        {!resultat.reussi ? (
          <p className="mx-auto mt-3 max-w-xs text-sm text-balance">
            Il faut la moitié des points pour débloquer la suite. Maintenant que tu as vu la correction, tu vas y arriver.
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2.5">
          {resultat.reussi && suivant ? (
            <Button asChild shine className="min-h-12 rounded-full text-base">
              <Link href={suivant.href}>
                Exercice suivant <Etoiles n={suivant.etoiles} className="[&_svg]:!text-white/90" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
          {!resultat.reussi ? (
            <Button className="min-h-12 rounded-full text-base" onClick={onRecommencer}>
              <RotateCcw className="size-4" aria-hidden="true" /> Recommencer
            </Button>
          ) : null}
          {!resultat.reussi && cours ? (
            <Button asChild variant="outline" className="min-h-11 rounded-full">
              <Link href={cours}>
                <BookOpen className="size-4" aria-hidden="true" /> Revoir le cours
              </Link>
            </Button>
          ) : null}
          <Button asChild variant={resultat.reussi && suivant ? 'outline' : resultat.reussi ? 'default' : 'ghost'} className="min-h-11 rounded-full">
            <Link href={retour}>Retour au cahier</Link>
          </Button>
          {resultat.reussi ? (
            <button type="button" onClick={onRecommencer} className="mx-auto text-sm font-semibold text-[var(--muted-foreground)] underline underline-offset-4">
              Refaire cet exercice
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Erreur({ raison, retour, onReessayer }: { raison: RaisonCahier; retour: string; onReessayer: () => void }) {
  const message =
    raison === 'premium'
      ? 'Le cahier d’exercices est réservé à Studuel+.'
      : raison === 'verrouille'
        ? 'Cet exercice s’ouvre quand tu as réussi le précédent.'
        : raison === 'auth'
          ? 'Connecte-toi pour faire cet exercice.'
          : raison === 'indisponible'
            ? 'Le cahier d’exercices arrive très bientôt sur ton compte.'
            : raison === 'termine'
              ? 'Cet exercice est déjà rendu.'
              : raison === 'quota'
                ? 'Tu as déjà fait beaucoup d’exercices aujourd’hui. Reprends demain !'
              : 'Oups, le cahier ne s’est pas ouvert. Réessaie.'
  return (
    <div className="rounded-3xl border-2 border-dashed border-[var(--border)] p-6 text-center">
      {raison === 'verrouille' ? <Lock className="mx-auto mb-2 size-6 text-[var(--muted-foreground)]" aria-hidden="true" /> : null}
      <p className="font-heading font-extrabold text-balance">{message}</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        {raison === 'premium' ? (
          <Button asChild className="rounded-full">
            <Link href="/compte">
              <Crown className="size-4" /> Débloquer avec Studuel+
            </Link>
          </Button>
        ) : raison === 'erreur' || raison === 'termine' ? (
          <Button className="rounded-full" onClick={onReessayer}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        ) : null}
        <Link href={retour} className="text-sm font-medium text-[var(--muted-foreground)] underline underline-offset-4">
          Retour au cahier
        </Link>
      </div>
    </div>
  )
}
