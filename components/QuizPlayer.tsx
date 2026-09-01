'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { recordTestSession } from '@/app/test/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import { sfx, buzz } from '@/lib/sounds'
import { bestStreak, COMBO_HOT } from '@/lib/juice'
import { missedQuestions, canRetryMissed } from '@/lib/quiz-retry'
import { verdictFor, verdictSrc } from '@/lib/verdict'
import ComboBadge from '@/components/ComboBadge'
import {
  bilanDuQuiz,
  formatDureeGain,
  formatDureeTotale,
  type EtatBilan,
} from '@/lib/quiz-bilan'
import {
  preparerCelebration,
  type Celebration,
} from '@/lib/serie-celebration'
import SerieCelebration from '@/components/quiz/SerieCelebration'
import BilanCartes from '@/components/quiz/BilanCartes'
import { useWorkTimer } from '@/components/useWorkTimer'
import BackButton from '@/components/BackButton'
import QuitGuardButton from '@/components/QuitGuardButton'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import { subjectRobe, subjectVignette } from '@/lib/subject-style'
import { layoutForQuestion } from '@/lib/quiz-layout'
import BossApparition from '@/components/defi/BossApparition'
import QuizFeedbackMascotte from '@/components/QuizFeedbackMascotte'
import { feedbackTitle, reactionSrc } from '@/lib/quiz-feedback'
import type { TraqueApparition } from '@/lib/traque'
import {
  CircleCheck,
  CircleX,
  Clock,
  RotateCcw,
  ArrowLeft,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/types'

/**
 * LA FORME des deux boutons de reprise — le traitement du bouton DUEL de
 * l'arène, ramené à l'échelle d'une pilule (`.quiz-pilule`, globals.css).
 *
 * Le socle standard de `.btn-chunky` ne convenait pas ici : sous une carte
 * claire, son trait sombre se lisait comme une ombre portée mal découpée. La
 * plaque de l'arène résout le même problème autrement — contour foncé, dégradé
 * haut→bas, reflet interne, puis seulement la tranche. On neutralise donc le
 * socle de la maison (`--btn-edge` / `--btn-depth`) pour ne garder que celui-là.
 */
/**
 * La réponse d'une question passée sans que l'élève en propose une
 * (« Je ne sais pas »). Jamais égale à un index d'option, donc toujours comptée
 * ratée — par le score, par `missedQuestions` et par la répétition espacée.
 */
const SANS_REPONSE = -1

const PILULE_REPRISE =
  'quiz-pilule h-11 min-w-32 gap-1.5 px-5 text-sm font-extrabold whitespace-nowrap ' +
  '[--btn-edge:transparent] [--btn-depth:0px] hover:brightness-[1.04]'

/**
 * « À revoir » : le VERT du succès — celui des pastilles justes.
 *
 * Il portait le CORAIL des pastilles ratées. Cohérent sur le papier (« les
 * rouges, on les refait »), mais un bouton rouge se lit comme un
 * avertissement : on l'évite. Or c'est LE geste qu'on veut voir cliqué — les
 * questions ratées sont le seul contenu utile qui reste après un quiz.
 *
 * Trois teintes du MÊME vert : le haut éclairci donne le volume, le bas est la
 * couleur de référence, le contour est sa version foncée. Un contour pris
 * ailleurs que dans la couleur du bouton ferait un cerne, pas une tranche.
 */
const ROBE_ERREURS = cn(
  'text-white',
  '[--pilule-haut:color-mix(in_oklab,var(--success),white_10%)]',
  '[--pilule-bas:color-mix(in_oklab,var(--success),black_10%)]',
  '[--pilule-bord:color-mix(in_oklab,var(--success),black_42%)]',
)

/**
 * « Continuer » : le violet clair, avec l'encre marine — plus lisible qu'un
 * blanc sur pastel, et assez doux pour laisser la pilule verte mener l'œil.
 */
const ROBE_CONTINUER = cn(
  'text-foreground',
  '[--pilule-haut:color-mix(in_oklab,var(--primary),white_62%)]',
  '[--pilule-bas:color-mix(in_oklab,var(--primary),white_48%)]',
  '[--pilule-bord:color-mix(in_oklab,var(--primary),black_18%)]',
)

// Session de quiz (template « structure des cours ») : à chaque réponse, l'élève
// voit tout de suite si c'est juste ou faux, la bonne réponse et l'explication,
// puis passe à la suivante d'un tap. Le score + le récap complet restent à la
// fin. (L'examen blanc, lui, garde la correction différée — autre composant.)

// Message de la mascotte selon le score.
export default function QuizPlayer({
  quizId,
  title,
  questions: allQuestions,
  deck = null,
  subject = null,
  subjectColor = null,
  subjectSlug = null,
  tempsTotalSecondes = 0,
  backHref = '/reviser',
  record = true,
  gradeLevel = null,
}: {
  quizId: string
  title: string
  questions: QuizQuestion[]
  /**
   * Le paquet RÉELLEMENT SERVI, quand il est plus court que le quiz : la
   * session d'entraînement composée par le moteur de sélection pour un élève
   * qui a déjà passé ce quiz une fois (cf. `app/test/[id]/page.tsx`).
   *
   * `questions` reste le quiz ENTIER — c'est lui qui donne le dénominateur.
   * Une session plus courte est donc `isPartial`, exactement comme un rejeu des
   * erreurs : elle ne recompte pas dans la maîtrise du chapitre, mais elle
   * nourrit la répétition espacée. Tout le mécanisme existait déjà ; il ne lui
   * manquait qu'une seconde façon d'être déclenché.
   */
  deck?: QuizQuestion[] | null
  subject?: string | null
  /**
   * Couleur de la matière (`subjects.color`) — elle donne sa ROBE à la session,
   * comme chaque jeu de salon porte la sienne. Absente (quiz personnel, quiz
   * détaché) : repli sur le violet de l'app.
   */
  subjectColor?: string | null
  /**
   * Identifiant de la matière (`subjects.slug`) — il donne son ILLUSTRATION
   * (`subjectVignette`). Sans elle, l'écran n'a que sa teinte de fond : la
   * matière se devine, elle ne se voit pas.
   */
  subjectSlug?: string | null
  /** Temps de révision DÉJÀ accumulé (`profiles.work_seconds`), en secondes. */
  tempsTotalSecondes?: number
  backHref?: string
  // `false` pour un quiz PERSONNEL (bibliothèque) : on ne l'enregistre pas comme
  // une session de catalogue (quiz_id absent de `quizzes` → violerait la FK) et
  // il ne doit pas gonfler l'XP / la file « À revoir ».
  record?: boolean
  // Classe du quiz : règle le TON du bilan (« Aïeee… » convient à un 6e, pas à
  // un Terminale qui prépare le bac). Absente pour un quiz personnel.
  gradeLevel?: string | null
}) {
  // LA ROBE DE LA SESSION : la couleur de la matière, posée en variables
  // `--jeu-*` (globals.css). Les mêmes que celles des jeux de salon — c'est ce
  // qui fait qu'un quiz et une partie se ressemblent enfin.
  const robe = subjectRobe(subjectColor)
  // L'illustration du dossier de la matière — absente pour un quiz détaché.
  const vignette = subjectSlug ? subjectVignette(subjectSlug) : undefined

  // Le paquet EN COURS. Il vaut le quiz complet, sauf après « Revoir mes
  // erreurs », où il ne contient plus que les questions ratées.
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    deck && deck.length > 0 ? deck : allQuestions,
  )
  const [index, setIndex] = useState(0)
  // Choix de l'élève, question par question — la correction se lit dedans.
  const [choices, setChoices] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  // LA CORRECTION EST-ELLE DÉVOILÉE ? Auparavant, choisir ET corriger étaient
  // le même geste : `answered` valait `selected !== null`. Depuis le bouton
  // « Valider », ce sont deux temps — on choisit (révocable), puis on valide.
  const [valide, setValide] = useState(false)
  // Bonnes réponses d'affilée (remise à zéro à la première erreur).
  const [streak, setStreak] = useState(0)
  // Le miroir : erreurs d'affilée, remises à zéro à la première bonne réponse.
  // C'est ce compteur qui fait tomber les cheveux de la mascotte — et sa remise
  // à zéro qui les fait repousser, ce qui est tout le sel du gag.
  const [missStreak, setMissStreak] = useState(0)
  // Meilleure série de la session : sans elle, un « Inarrêtable ×8 » atteint en
  // cours de route ne laisse aucune trace sur l'écran de fin.
  const [best, setBest] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Les états du moteur APRÈS la session : la matière des trois chiffres de
  // fin (réussite / avancement / ancrage).
  const [etatsBilan, setEtatsBilan] = useState<EtatBilan[] | null>(null)
  // La fête de série, quand cette session est la PREMIÈRE du jour. Elle se pose
  // par-dessus tout, avant même l'écran de score : c'est le moment où la case
  // du jour se remplit, et il ne doit pas passer derrière un bilan chiffré.
  const [celebration, setCelebration] = useState<Celebration | null>(null)
  // Le temps de révision de CETTE session. Le hook est monté ici plutôt que via
  // le `<WorkTimer />` de la page : c'est le même compteur, la même écriture
  // vers /api/work-time — mais sa valeur devient AFFICHABLE, et on ne peut pas
  // en avoir deux sans compter le temps en double.
  const secondesTravail = useWorkTimer()
  // Le chrono du hook ne s'arrête PAS à la fin du quiz — et c'est voulu :
  // l'élève qui lit la correction travaille encore, et ces minutes doivent
  // continuer d'aller au total du profil (c'est ce que faisait déjà le
  // `<WorkTimer />` de la page). Mais le chiffre AFFICHÉ, lui, annonce « le
  // temps que tu viens de faire » sur CETTE manche : il doit se figer au
  // moment du bilan, sinon il grimpe sous les yeux de l'élève et ne veut plus
  // rien dire.
  // Le chiffre est CUMULATIF sur toute la visite, et figé à chaque bilan.
  //
  // Il a d'abord compté par manche, remis à zéro au rejeu : le second bilan
  // affichait alors le temps du seul rejeu, comme si les minutes du quiz
  // d'avant avaient été perdues. Or refaire ses erreurs est du travail EN PLUS,
  // pas du travail à la place — et c'est déjà ainsi que le total du profil le
  // compte (le chrono ne s'arrête jamais). Les deux chiffres disent maintenant
  // la même chose.
  //
  // Le temps passé à LIRE la correction entre deux manches y est inclus, et
  // c'est voulu : relire ses erreurs est de la révision, et ces secondes sont
  // de toute façon déjà versées au total.
  const [secondesAffichees, setSecondesAffichees] = useState<number | null>(
    null,
  )
  // La Traque : ce quiz vient-il de faire sortir un gardien de sa tanière ? Le
  // serveur le dit en enregistrant la session ; le rideau s'ouvre par-dessus
  // l'écran de fin, jamais au milieu d'une question.
  const [apparition, setApparition] = useState<TraqueApparition | null>(null)

  const question = questions[index]
  // Rejeu partiel : le paquet en cours ne couvre plus tout le quiz.
  const isPartial = questions.length < allQuestions.length

  // Réponses de la session pour la répétition espacée (SRS + Revanche) —
  // envoyées en une fois à la fin, en « fire and forget ».
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Garde anti-double-soumission : un double-tap rapide sur « Continuer » de la
  // dernière question pourrait franchir le garde `selected` (state périmé) et
  // enregistrer la session deux fois.
  const finishedRef = useRef(false)
  // Verrou synchrone anti double-tap sur une option : `selected` (state) ne se
  // met à jour qu'au prochain rendu ; sans ce ref, deux taps rapprochés
  // pousseraient une réponse en double dans reviewsRef. Relâché à la suivante.
  const lockedRef = useRef(false)
  // Verrou d'avancement, relâché au changement d'`index` (donc après re-rendu).
  const advancingRef = useRef(false)

  const finish = (allChoices: number[]) => {
    if (finishedRef.current) return
    finishedRef.current = true
    const score = allChoices.reduce(
      (s, choice, i) => s + (choice === questions[i].correct_index ? 1 : 0),
      0,
    )
    setFinished(true)
    setSecondesAffichees(secondesTravail)
    sfx.complete()
    // Quiz personnel (bibliothèque) : on ne persiste rien (ni session, ni SRS).
    if (!record) return

    // ⚠️ Un REJEU DES ERREURS n'est PAS une session de quiz. `lib/mastery.ts`
    // agrège le MEILLEUR RATIO par quiz : enregistrer un 2/2 obtenu sur les
    // seules questions ratées ferait passer le chapitre à 100 % — donc
    // « maîtrisé », couronne comprise — alors que l'élève avait fait 8/10.
    // On garde donc l'entraînement (SRS, ci-dessous) sans la comptabilité.
    if (!isPartial) {
      recordTestSession(quizId, score, questions.length)
        .then((r) => {
          setSaved(r.saved)
          setApparition(r.apparition)
          // L'état de la série lu AVANT l'écriture : c'est lui qui sait si la
          // case du jour était encore vide, donc s'il y a quelque chose à
          // remplir à l'écran.
          if (r.serieAvant) {
            const fete = preparerCelebration(
              r.serieAvant.semaine,
              r.serieAvant.serie,
            )
            if (fete.celebrer) setCelebration(fete)
          }
        })
        .catch(() => setSaved(false))
    }
    // La file « À revoir » est reprogrammée dans TOUS les cas : elle raisonne
    // par question, pas par session — retravailler une erreur est justement
    // l'information la plus utile qu'on puisse lui donner.
    // Le scope, c'est le QUIZ ENTIER : l'avancement et l'ancrage se lisent sur
    // lui, pas sur le paquet servi ce jour-là (une séance d'entraînement de 5
    // questions sur 8 ne fait pas « 100 % du chapitre »).
    recordReviewAnswers(
      reviewsRef.current,
      allQuestions.map((q) => q.id),
    )
      .then((r) => {
        if (r.etats) setEtatsBilan(r.etats)
      })
      .catch(() => {})
  }

  // Répondre : on révèle tout de suite le résultat (juste/faux, bonne réponse,
  // explication) et on attend un tap « Continuer » pour avancer.
  const choose = (optionIndex: number) => {
    // Une SÉLECTION, plus une réponse : elle se change tant qu'on n'a pas
    // validé. Plus de verrou anti-double-tap ici — c'est `valider` qui le porte
    // désormais, puisque c'est lui qui écrit.
    if (valide) return
    sfx.tap()
    setSelected(optionIndex)
  }

  /**
   * Corrige. `choix` vaut `null` pour « Je ne sais pas » : la question est
   * comptée ratée, et la bonne réponse dévoilée sans en désigner une comme
   * « la tienne » — l'élève n'en a proposé aucune.
   */
  const valider = (choix: number | null) => {
    if (valide || lockedRef.current) return
    lockedRef.current = true
    setSelected(choix)
    setValide(true)
    const good = choix === question.correct_index
    // Série en cours : la récompense MONTE tant qu'on enchaîne, et retombe net
    // à la première erreur. C'est ce qui donne envie de continuer.
    const nextStreak = good ? streak + 1 : 0
    setStreak(nextStreak)
    setMissStreak(good ? 0 : missStreak + 1)
    setBest((b) => bestStreak(b, nextStreak))
    if (good) sfx.correctCombo(nextStreak)
    else sfx.wrong()
    buzz(good, nextStreak)
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject,
      good,
    })
  }

  // Passer à la suite (ou terminer) une fois le feedback lu.
  const advance = () => {
    // Verrou synchrone : `selected` (state) est en retard d'un rendu, donc deux
    // taps rapprochés sur « Continuer » franchissent tous deux la garde. Or
    // `setIndex` est un updater FONCTIONNEL : il s'applique deux fois (index+2)
    // alors qu'une SEULE réponse est poussée dans `choices` — tout le reste de
    // la session lit alors `choices[i]` face à la mauvaise question (score,
    // pastilles de correction et « Revoir mes erreurs » faussés). `choose()` et
    // `finish()` avaient déjà leur verrou, pas celui-ci.
    if (!valide || advancingRef.current) return
    advancingRef.current = true
    // `SANS_REPONSE` pour « Je ne sais pas » : jamais égal à `correct_index`,
    // donc compté raté par le score comme par `missedQuestions`.
    const next = [...choices, selected ?? SANS_REPONSE]
    setChoices(next)
    setSelected(null)
    if (next.length >= questions.length) finish(next)
    else {
      setIndex((i) => i + 1)
      setValide(false)
      lockedRef.current = false
    }
  }

  // Toujours la DERNIÈRE version d'`advance` (elle capture `choices`/`selected`).
  // Mise à jour dans un effet, jamais pendant le rendu : écrire un ref pendant
  // le rendu casse les garanties du rendu concurrent de React.
  useEffect(() => {
    advancingRef.current = false
  }, [index])

  // PLUS D'ENCHAÎNEMENT AUTOMATIQUE. Il existait pour les bonnes réponses sans
  // explication à lire, où le tap « Continuer » ne servait à rien. Il se
  // retourne contre la feuille de la mascotte : elle monterait et repartirait
  // avant d'avoir été vue. La feuille étant désormais servie à TOUTES les
  // matières, il n'y a plus un seul cas où enchaîner seul — le tap EST le
  // rythme (c'est le geste de Duolingo). `autoAdvanceDelay` reste dans
  // `lib/juice.ts`, testé, si on veut le rebrancher un jour.

  // Repart sur un paquet donné (le quiz entier, ou seulement les erreurs).
  const replay = (deck: QuizQuestion[]) => {
    setQuestions(deck)
    setIndex(0)
    setChoices([])
    setSelected(null)
    setValide(false)
    setStreak(0)
    setBest(0)
    setFinished(false)
    setSaved(null)
    // Le gardien reste sorti, mais son rideau a déjà été joué : le rejeu ne le
    // rouvre pas (la bannière de l'arène prend le relais pendant l'heure).
    setApparition(null)
    reviewsRef.current = []
    finishedRef.current = false
    lockedRef.current = false
    // Le chiffre se rafraîchira au prochain bilan, en repartant du total.
    setSecondesAffichees(null)
  }

  const restart = () => replay(allQuestions)

  // ---------------------------------------------------------------------------
  // Écran final : score + correction complète, scrollable (template).
  // ---------------------------------------------------------------------------
  if (finished) {
    const score = choices.reduce(
      (s, choice, i) => s + (choice === questions[i].correct_index ? 1 : 0),
      0,
    )
    const ratio = questions.length > 0 ? score / questions.length : 0
    const missed = missedQuestions(questions, choices)
    const v = verdictFor(ratio, gradeLevel)
    // Y a-t-il des erreurs à revoir ? La réponse commande le LIBELLÉ comme la
    // robe des deux boutons de reprise : calculée une fois, pas trois.
    const peutRevoir = canRetryMissed(questions.length, missed.length)
    // Les trois lectures de fin. `etatsBilan` arrive après l'écriture des
    // réponses (donc après un aller-retour) : tant qu'il est nul, avancement et
    // ancrage valent 0 — et la réussite, elle, est immédiate.
    const bilan = bilanDuQuiz(allQuestions.length, etatsBilan ?? [], {
      justes: score,
      posees: questions.length,
    })

    // LA FÊTE DE SÉRIE PASSE DEVANT LE BILAN. Elle est montée par-dessus tout
    // (position fixe) tant que l'élève ne l'a pas refermée : le score l'attend
    // derrière. L'ordre compte — voir « 3/8 » puis une fête sonne comme une
    // consolation ; voir la série se remplir puis son score, c'est la journée
    // qui commence bien.
    if (celebration) {
      return (
        <SerieCelebration
          celebration={celebration}
          onContinue={() => setCelebration(null)}
        />
      )
    }

    return (
      // `key` explicite : sans elle, le démontage de l'écran de question (et
      // donc de l'état de ComboBadge) ne tient qu'à l'alignement positionnel
      // des deux arbres JSX — une coïncidence qu'un simple <div> ajouté plus
      // tard casserait, en faisant réapparaître un badge fantôme.
      <div key="quiz-fin" className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
        {/* La Traque : si ce quiz a fait déborder la jauge, le gardien surgit
            PAR-DESSUS le score. Il se monte en portail (document.body), donc sa
            position dans cet arbre n'a aucune incidence sur la mise en page. */}
        {apparition ? (
          <BossApparition
            apparition={apparition}
            onClose={() => setApparition(null)}
          />
        ) : null}

        {/* Volet score, dans la robe de la matière — même table que l'écran de
            fin d'un jeu de salon. */}
        <div
          className={cn(
            robe,
            'jeu-table px-4 pt-16 pb-10 text-foreground md:px-8 md:pt-12',
          )}
        >
          <div className="mx-auto w-full max-w-xl">
            <BackButton
              fallback={backHref}
              label="Quitter le quiz"
              className="mb-4"
            >
              <X className="size-5" aria-hidden="true" />
            </BackButton>

            <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5">
              {/* LE SCORE ET LA MASCOTTE, CÔTE À CÔTE.
                  Elle était posée plus bas, entre le score et les boutons, dans
                  une bulle qui poussait tout le reste hors de l'écran : sur un
                  téléphone, il fallait faire défiler pour voir les reprises.
                  Remontée à droite du score, elle réagit AU MOMENT où on lit le
                  chiffre — et libère la place centrale pour ce qui manquait
                  vraiment, les trois lectures du chapitre. */}
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 text-left">
                  <h1 className="font-heading text-base font-bold text-muted-foreground">
                    Score du quiz
                  </h1>
                  <p className="mt-0.5 font-mono text-5xl font-bold tabular-nums">
                    {score}
                    <span className="text-xl text-muted-foreground">
                      {' '}
                      / {questions.length}
                    </span>
                  </p>

                  {/* Une pastille par question. PLEINE = juste, ÉVIDÉE = ratée :
                      la couleur ne doit pas être le seul porteur de
                      l'information — un garçon sur douze ne distingue pas le
                      vert du rouge, et cette app s'adresse d'abord à des
                      collégiens. La forme le dit aussi, sans rien coûter. */}
                  <div
                    className="mt-3 flex flex-wrap gap-1"
                    aria-label={`${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${questions.length}`}
                  >
                    {questions.map((q, i) => (
                      <span
                        key={q.id}
                        aria-hidden="true"
                        className={cn(
                          'h-2 w-4 rounded-full',
                          choices[i] === q.correct_index
                            ? 'bg-success'
                            : 'border-2 border-destructive bg-destructive/20',
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* LA MASCOTTE RÉAGIT AU SCORE — en dessin, plus en emoji.
                    Le canevas des réactions est en 500×360 : c'est la largeur
                    du CADRE qu'on cale, jamais celle du personnage. */}
                <Image
                  src={verdictSrc(ratio)}
                  alt=""
                  aria-hidden="true"
                  width={500}
                  height={360}
                  sizes="132px"
                  className="h-auto w-28 max-w-full shrink-0 sm:w-32"
                />
              </div>

              {/* LA RÉCOMPENSE ET LE TEMPS, sur la même ligne jaune.
                  L'XP existait sans être dite ; le TEMPS de révision, lui,
                  était compté en silence et versé au profil sans que l'élève le
                  voie jamais. Deux gains, deux chiffres, au même endroit. */}
              {/* LA RÉCOMPENSE ET LE TEMPS.
                  L'XP n'est versée que sur une manche COMPLÈTE : un rejeu des
                  erreurs ne recompte pas dans le score du quiz (cf. `finish`),
                  donc l'annoncer serait un mensonge.
                  Le TEMPS, lui, est gagné dans tous les cas — refaire ses
                  erreurs est du travail en plus, et ces minutes vont déjà au
                  total du profil. La bande s'affiche donc dès qu'on enregistre,
                  et c'est l'XP seule qui se retire quand la manche est
                  partielle. */}
              {record ? (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-highlight/20 px-3 py-2">

                  <span
                    className="font-heading flex items-center gap-1 text-base font-extrabold text-[color-mix(in_oklch,var(--highlight),black_25%)]"
                    title="Temps de révision ajouté à ton total"
                  >
                    <Clock className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
                    {formatDureeGain(secondesAffichees ?? 0)}
                  </span>
                </div>
              ) : null}

              {best >= COMBO_HOT ? (
                <p className="mt-2 text-center text-sm font-semibold text-foreground">
                  🔥 Meilleure série : {best} d&apos;affilée
                </p>
              ) : null}

              {/* LES TROIS LECTURES, à la place que la mascotte occupait.
                  « 3 / 8 » ne dit ni si on a fait le tour du chapitre, ni si ça
                  tient dans le temps. */}
              <div className="mt-4">
                <BilanCartes bilan={bilan} />
              </div>

              {/* Le mot de la mascotte, sous les chiffres — la bulle n'a plus à
                  porter l'image, donc plus besoin de la recouvrir. */}
              <div className="mt-4 rounded-2xl bg-muted px-4 py-3">
                <p className="text-center text-sm font-semibold text-balance text-foreground">
                  {v.message}
                </p>
              </div>

              {/* `record &&` est essentiel : un quiz PERSONNEL (bibliothèque)
                  n'écrit RIEN — ni session, ni SRS (`finish` sort avant
                  `recordReviewAnswers`). Promettre « tes erreurs sont
                  reprogrammées » y serait un mensonge pur. */}
              {isPartial ? (
                <p className="mt-3 text-center text-sm text-pretty text-muted-foreground">
                  {record
                    ? "Séance d'entraînement : elle ne recompte pas dans ton score du quiz, mais tes erreurs sont bien reprogrammées."
                    : "Séance d'entraînement sur tes erreurs."}
                </p>
              ) : null}

              {saved === true ? (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  ✓ Session enregistrée — ta série continue 🔥
                </p>
              ) : saved === false ? (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  <Link href="/login" className="underline underline-offset-4">
                    Connecte-toi
                  </Link>{' '}
                  pour sauvegarder ta progression.
                </p>
              ) : null}
            </div>

            {/* LES REPRISES — deux pilules, plus petites et plus douces.
                Elles étaient hautes, larges et posées sur un socle sombre :
                deux plaques qui pesaient autant que le score au-dessus.

                LE ROUGE EST PARTI. « Revoir mes erreurs » portait le corail des
                pastilles ratées — cohérent sur le papier, mais un bouton rouge
                se lit comme un avertissement : on l'évite. Or c'est LE geste
                qu'on veut voir cliqué, puisque les questions ratées sont le
                seul contenu utile qui reste. Il prend donc le VERT du succès,
                celui des pastilles justes : « va les chercher », pas « attention ».

                Et les libellés raccourcissent — « À revoir » / « Continuer » —
                parce que deux mots tiennent sur une ligne à n'importe quelle
                largeur, ce qui n'était pas le cas de « Revoir mes 5 erreurs ». */}
            <div className="mt-4 flex items-center justify-center gap-2.5">
              {peutRevoir ? (
                <Button
                  onClick={() => replay(missed)}
                  className={cn(PILULE_REPRISE, ROBE_ERREURS)}
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />À revoir
                  <span className="ml-0.5 rounded-full bg-white/25 px-1.5 text-[11px] tabular-nums">
                    {missed.length}
                  </span>
                </Button>
              ) : null}

              <Button
                onClick={restart}
                className={cn(PILULE_REPRISE, ROBE_CONTINUER)}
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>

        {/* Correction détaillée, scrollable */}
        <div className="relative -mt-4 rounded-t-3xl bg-background">
          <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-24 md:px-8">
            <div
              className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/30"
              aria-hidden="true"
            />
            <h2 className="font-heading mt-4 text-center text-2xl font-bold">
              Correction
            </h2>

            <ol className="mt-6 flex flex-col gap-4">
              {questions.map((q, i) => {
                const chosen = choices[i]
                const good = chosen === q.correct_index
                return (
                  <li
                    key={q.id}
                    className="rounded-3xl border bg-card p-5 shadow-sm"
                  >
                    <p className="flex gap-3 font-semibold">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="min-w-0">{q.question}</span>
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      {/* La bonne réponse, toujours montrée */}
                      <p className="flex items-center gap-2.5 rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                        <CircleCheck
                          className="size-5 shrink-0 fill-success text-white"
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="sr-only">Bonne réponse : </span>
                          {q.options[q.correct_index]}
                        </span>
                      </p>
                      {/* Le choix de l'élève, seulement s'il était faux */}
                      {!good && chosen !== undefined && q.options[chosen] !== undefined ? (
                        <p className="flex items-center gap-2.5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                          <CircleX
                            className="size-5 shrink-0 fill-destructive text-white"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="sr-only">Ta réponse : </span>
                            {q.options[chosen]}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    {q.explanation ? (
                      <div className="mt-4 border-t border-dashed pt-4">
                        <h3 className="text-sm font-bold">Explication</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {q.explanation}
                        </p>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>

            <Button variant="outline" asChild className="mt-6 w-full rounded-full">
              <Link href={backHref}>
                <ArrowLeft className="size-4" /> Retour aux révisions
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Écran de question : plein écran, feedback immédiat à la réponse.
  // ---------------------------------------------------------------------------
  const answered = valide
  const isCorrect = selected === question.correct_index
  const isLast = index + 1 >= questions.length
  // Série en cours DANS LE SENS de la réponse qu'on vient de donner : c'est elle
  // qui choisit l'illustration et le titre. Les deux compteurs sont déjà à jour
  // ici (`choose` les a posés), et l'un des deux vaut forcément 0.
  const run = isCorrect ? streak : missStreak
  return (
    // data-no-swipe : pendant une question, le balayage d'onglet (SwipeTabs)
    // est neutralisé — sinon un glissé du pouce quitte le quiz sans passer par
    // la garde de sortie et la session est perdue.
    <div
      key="quiz-session"
      data-no-swipe
      className={cn(
        robe,
        // `quiz-fond` par-dessus `jeu-table` : le lavis de la matière, assez
        // dense pour qu'un quiz d'allemand ne ressemble pas à un quiz de maths.
        'jeu-table quiz-fond relative flex min-h-svh flex-col overflow-hidden px-4 pt-3 pb-4 text-foreground md:px-8',
      )}
      // La feuille de la mascotte se pose PAR-DESSUS le bas de l'écran : sans
      // cette marge, la dernière réponse disparaîtrait sous elle. Elle tient
      // compte de la mascotte, qui dépasse du panneau de toute sa moitié haute.
      // En ligne (et non en classe) pour la même raison que dans
      // QuizFeedbackMascotte.
      style={answered ? { paddingBottom: '21rem' } : undefined}
    >
      {/* L'ILLUSTRATION DE LA MATIÈRE, DANS L'ANGLE.
          Elle occupait le creux entre l'énoncé et les réponses, au CENTRE de
          l'écran — c'est-à-dire sur l'axe du regard, exactement là où l'œil
          descend de la question vers les plaques. Un décor posé sur ce chemin
          n'est plus un décor : il se fait lire comme un élément de l'exercice
          (« le drapeau fait-il partie de la question ? »), et il repoussait les
          réponses vers le bas.

          Dans l'angle, elle rend cette hauteur au contenu et garde son seul
          vrai rôle : dire de quelle matière on révise, du coin de l'œil. Elle
          déborde des deux bords et passe SOUS tout le reste (`-z-0` contre la
          colonne en `z-10`) — un motif d'angle, comme le blason d'une faction
          dans un jeu, pas un objet de plus à regarder.

          Très en retrait (opacité basse, halo diffus) : à sa saturation
          d'avant, posée derrière le bouton « quitter » et l'énoncé, elle
          salissait les deux. */}
      {vignette ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-14 -z-0 select-none md:-top-4 md:-left-6"
        >
          <span
            className="absolute inset-0 m-auto size-52 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, var(--jeu-glow), transparent 70%)',
            }}
          />
          <Image
            src={vignette}
            alt=""
            width={320}
            height={320}
            sizes="176px"
            className="relative h-auto w-48 opacity-30 drop-shadow-sm md:w-44 md:opacity-45"
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col">
        {/* LA RANGÉE DU HAUT : quitter · progression · son.
            L'anneau « Question 4/8 » vivait au MILIEU de l'écran, entre le
            compteur et la question, et poussait tout le reste vers le bas. Une
            barre qui se remplit vers la droite dit la même chose en une ligne,
            se lit sans être regardée, et rend au contenu la hauteur qu'elle
            occupait. */}
        <div className="flex shrink-0 items-center gap-2.5">
          <QuitGuardButton
            fallback={backHref}
            label="Quitter le quiz"
            className="shrink-0 shadow-sm"
          >
            <X className="size-5" aria-hidden="true" />
          </QuitGuardButton>
          <span className="sr-only">{title}</span>

          {/* LA BARRE — plus courte, et à la COULEUR DE LA MATIÈRE.
              Elle courait d'un bord à l'autre, en gris : sur un fond déjà pâle,
              elle disparaissait, et rien ne disait de quelle matière on
              révisait. Le rail passe en teinte foncée du fond (elle se voit
              même vide) et la jauge prend `--jeu-accent`, la couleur du dossier.
              Elle raccourcit pour laisser sa place au chrono. */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={index + (valide ? 1 : 0)}
            aria-label={`Question ${index + 1} sur ${questions.length}`}
            className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-black/12 ring-1 ring-black/5 ring-inset"
          >
            <div
              className="h-full rounded-full bg-[color:var(--jeu-accent)] transition-[width] duration-300 ease-out"
              style={{
                width: `${((index + (valide ? 1 : 0)) / questions.length) * 100}%`,
              }}
            >
              {/* Le reflet : la jauge a la même épaisseur que les plaques, elle
                  en prend le biseau. Sans lui, un aplat sur un aplat. */}
              <span
                aria-hidden="true"
                className="block h-1/2 rounded-full bg-white/30"
              />
            </div>
          </div>

          {/* LE CHRONO DE RÉVISION, à la place du bouton son.
              Le temps travaillé était compté en silence et ne se voyait qu'en
              fin de quiz. Ici il TOURNE : le total du profil plus la session en
              cours, seconde par seconde. C'est le seul chiffre de l'écran qui
              monte quoi qu'il arrive — même sur une mauvaise réponse.

              IL EST DE LA MÊME FAMILLE QUE LES PLAQUES. C'était une pastille
              plate à liseré gris, posée à côté d'objets qui ont tous un contour,
              un dégradé et une tranche : elle avait l'air d'appartenir à une
              autre application. Même traitement, en pilule — mais tranche plus
              fine et pas d'enfoncement au tap : ce n'est pas un bouton, c'est un
              compteur, et rien ne doit laisser croire qu'on peut le presser.

              Le cadran est un JETON à la couleur de la matière : il donne au
              chrono le seul point de couleur saturée du bandeau, et sépare
              l'icône du nombre au lieu de les laisser flotter côte à côte.

              ⚠️ Le bouton de coupure du son quitte donc cet écran. Comme le
              bandeau du haut est masqué pendant la session, il n'y a plus de
              moyen de couper le son SANS sortir du quiz. Arbitrage assumé. */}
          <span
            className="quiz-plaque quiz-plaque--ronde quiz-plaque--compteur h-9 shrink-0 gap-1.5 pr-3 pl-1 [--plaque-bas:color-mix(in_oklab,var(--card),black_5%)] [--plaque-bord:color-mix(in_oklab,var(--jeu-accent),black_26%)] [--plaque-haut:var(--card)]"
            title="Ton temps de révision total"
          >
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full bg-[color:var(--jeu-accent)] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
            >
              <Clock className="size-4" strokeWidth={2.6} />
            </span>
            <span className="font-heading text-sm font-extrabold text-foreground tabular-nums">
              {formatDureeTotale(tempsTotalSecondes + secondesTravail)}
            </span>
            <span className="sr-only">de révision au total</span>
          </span>
        </div>

        {/* Badge de SÉRIE : n'apparaît qu'à partir de 2 bonnes réponses
            d'affilée, grossit avec le palier, et disparaît net à la première
            erreur. C'est la récompense visible qui accompagne la montée du son. */}
        {/* La région `aria-live` reste TOUJOURS montée : un lecteur d'écran
            n'annonce que les CHANGEMENTS d'une région déjà présente. Si elle
            apparaissait en même temps que son texte, l'annonce serait ratée. */}
        <div className="mt-2 flex min-h-7 shrink-0 justify-center" aria-live="polite">
          <ComboBadge streak={streak} variant="clair" />
        </div>

        {/* LA CONSIGNE, puis L'ÉNONCÉ — en haut, l'un sous l'autre.
            Précédemment l'énoncé était centré dans la hauteur libre : il
            creusait DEUX vides, un au-dessus de lui et un entre lui et les
            réponses, et l'écran n'était plus qu'une carte blanche flottant dans
            du bleu pâle. Le vide se rassemble maintenant en UN seul endroit,
            sous l'énoncé, là où il sert de respiration avant les réponses.

            Et l'énoncé quitte sa CARTE : une boîte blanche au-dessus de boîtes
            blanches, c'était trois fois la même surface pour trois rôles
            différents. Posé à même le fond, en grand, il n'a plus besoin d'un
            cadre pour se distinguer — ce sont les réponses qui en portent un. */}
        <div className="mt-4 shrink-0">
          <p className="mb-2.5 text-xs font-extrabold tracking-wide text-foreground/45 uppercase">
            {question.kind === 'true_false'
              ? 'Vrai ou faux ?'
              : 'Choisis la bonne réponse'}
          </p>

          {/* MARCEL POSE LA QUESTION.
              L'écran était muet pendant qu'on cherchait, puis la mascotte
              surgissait en pleine page une fois la réponse donnée : bavarde au
              moment où l'on veut passer à la suite, absente au moment où l'on
              hésite. Le voir attendre à côté de l'énoncé, c'est la même voix du
              début à la fin — et c'est le rôle du hibou chez Duolingo.

              Sa TÊTE, celle de la nav : un visage déjà connu, neutre et
              attentif. Surtout pas une réaction du jeu de dix — elles sont
              toutes des verdicts (pouce levé, grimace), et en montrer une avant
              la réponse reviendrait à approuver ou plaindre d'avance.

              La BULLE est ce qui distingue l'énoncé des plaques de réponse : sa
              pointe dit « ceci est dit », là où trois rectangles blancs
              identiques ne disaient rien du tout. */}
          <div className="flex items-start gap-2.5">
            <Image
              src="/images/nav/marcel.webp"
              alt=""
              aria-hidden="true"
              width={256}
              height={256}
              sizes="64px"
              priority
              className="size-16 shrink-0 rounded-full"
            />
            <div className="relative min-w-0 flex-1 rounded-3xl border-2 border-black/10 bg-card px-4 py-3.5">
              <p className="font-heading text-lg leading-snug font-extrabold text-balance text-foreground">
                {question.question}
              </p>
              {/* La pointe, côté mascotte. Deux bords seulement, tournés à 45° :
                  le carré emprunte au cadre de la bulle son trait et son fond,
                  donc il suit toute retouche sans qu'on y pense. */}
              <span
                aria-hidden="true"
                className="absolute top-6 -left-[9px] size-4 rotate-45 border-b-2 border-l-2 border-black/10 bg-card"
              />
            </div>
          </div>
        </div>

        {/* LA RESPIRATION avant les réponses. Elle ne porte plus rien depuis
            que l'illustration est passée dans l'angle : c'est du vide, et c'est
            son rôle — séparer ce qu'on lit de ce qu'on tape. */}
        <div className="min-h-3 flex-1" aria-hidden="true" />

        {/* LES RÉPONSES, ANCRÉES EN BAS — au plus près du pouce.
            Elles suivaient la question dans le flux : sur un écran haut, elles
            se retrouvaient au milieu, hors de portée de la main qui tient le
            téléphone, avec un vide inutile en dessous. `shrink-0` en fin de
            colonne flex les colle au bas, quelle que soit la taille de l'écran.

            Le plateau lui-même est celui des jeux de salon, à l'identique : le
            quiz avait le sien, avec des pastilles qui viraient à l'APLAT vert ou
            rouge saturé là où la table de jeu teinte et cerne. Deux grammaires
            du même verdict dans la même app — c'est désormais un seul composant. */}
        <div className="shrink-0" role="group" aria-label="Réponses">
          <AnswerBoard
            options={question.options}
            correctIndex={question.correct_index}
            selected={selected}
            revealed={answered}
            // Le quiz a un bouton « Valider » : la sélection y est un
            // brouillon, et un brouillon qu'on ne peut pas corriger n'en est
            // pas un. Les jeux de salon gardent le verrou au premier tap.
            verrouillerAuChoix={false}
            // La disposition suit la FORME de la question, plus « liste » pour
            // tout le monde : un vrai/faux s'ouvre en deux grandes plaques,
            // quatre dates se rangent en damier, une définition garde ses
            // lignes pleine largeur. Cf. `lib/quiz-layout`.
            layout={layoutForQuestion(question)}
            onAnswer={choose}
          />
        </div>

        {/* La respiration du BAS : elle remonte les réponses vers le centre au
            lieu de les coller au bord, maintenant qu'un bouton occupe le bas. */}
        <div className="min-h-3 flex-1" aria-hidden="true" />

        {/* VALIDER, et « Je ne sais pas » dessous.
            Le tap sur une réponse corrigeait immédiatement : un doigt qui
            ripe coûtait la question, sans recours. Le geste se dédouble — on
            choisit, puis on valide — et le bouton reste ÉTEINT tant que rien
            n'est coché, ce qui dit sans un mot ce qu'il attend.

            « Je ne sais pas » n'est pas un abandon mais un aveu : il compte la
            question ratée (donc la reprogramme) et montre la bonne réponse. Le
            proposer, c'est éviter le clic au hasard — qui, lui, apprend à la
            répétition espacée que la carte est sue. */}
        {!answered ? (
          <div className="mt-3 flex shrink-0 flex-col gap-2.5">
            <button
              type="button"
              disabled={selected === null}
              onClick={() => valider(selected)}
              className={cn(
                'quiz-plaque h-13 w-full text-base font-extrabold tracking-wide uppercase',
                selected === null
                  ? // ÉTEINT — mais toujours une PLAQUE. Il était plat, sans
                    // contour ni tranche : un aplat beige qui ne ressemblait
                    // plus à un bouton du tout. Un bouton désactivé doit rester
                    // reconnaissable comme bouton, sinon on ne comprend pas ce
                    // qu'on attend de nous. C'est sa SATURATION qui tombe, pas
                    // sa forme.
                    // ÉTEINT, mais PAS INCOLORE. Il était gris sur fond pâle :
                    // le texte blanc s'y perdait et le contour n'existait pas.
                    // Il garde la teinte de la matière, très désaturée, avec un
                    // contour franc — on voit un bouton, on voit qu'il attend.
                    'cursor-not-allowed text-foreground/45 [--plaque-bas:color-mix(in_oklab,var(--jeu-accent),white_74%)] [--plaque-bord:color-mix(in_oklab,var(--jeu-accent),black_28%)] [--plaque-haut:color-mix(in_oklab,var(--jeu-accent),white_82%)]'
                  : 'text-white [--plaque-bas:color-mix(in_oklab,var(--success),black_14%)] [--plaque-bord:color-mix(in_oklab,var(--success),black_50%)] [--plaque-haut:color-mix(in_oklab,var(--success),white_14%)]',
              )}
            >
              Valider
            </button>

            {/* « JE NE SAIS PAS » EST UN BOUTON, DONC IL A DES CONTOURS.
                C'était un texte gris posé sur le fond : rien ne disait qu'on
                pouvait le toucher, et sa zone tactile s'arrêtait aux lettres.
                Même plaque que « Valider », en robe claire — c'est le rang qui
                les distingue (la couleur, la saturation), pas la présence ou
                l'absence de bouton. */}
            <button
              type="button"
              onClick={() => valider(null)}
              className="quiz-plaque h-12 w-full cursor-pointer text-sm font-extrabold text-foreground/75 [--plaque-bas:color-mix(in_oklab,var(--card),black_7%)] [--plaque-bord:color-mix(in_oklab,var(--jeu-accent),black_34%)] [--plaque-haut:var(--card)]"
            >
              Je ne sais pas
            </button>
          </div>
        ) : null}

        {/* Feedback + explication + bouton pour continuer. La feuille porte
            désormais TOUT le retour après réponse, pour toutes les matières :
            l'ancien bandeau en ligne (« ✅ Bonne réponse ! ») n'avait plus
            aucun cas d'usage une fois le pilote généralisé. */}
        <QuizFeedbackMascotte
          open={answered}
          good={isCorrect}
          imageSrc={reactionSrc(isCorrect, run)}
          title={feedbackTitle(isCorrect, run, question.id)}
          correctAnswer={question.options[question.correct_index]}
          explanation={question.explanation}
          ctaLabel={isLast ? 'Voir mon score' : 'Continuer'}
          onContinue={advance}
        />
      </div>
    </div>
  )
}
