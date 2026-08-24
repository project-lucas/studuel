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
import { sessionXp } from '@/lib/xp'
import { bilanDuQuiz, formatDureeGain, type EtatBilan } from '@/lib/quiz-bilan'
import BilanCartes from '@/components/quiz/BilanCartes'
import { useWorkTimer } from '@/components/useWorkTimer'
import { SoundToggle } from '@/components/FlashcardPlayer'
import BackButton from '@/components/BackButton'
import QuitGuardButton from '@/components/QuitGuardButton'
import ProgressRing from '@/components/ProgressRing'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import { subjectRobe } from '@/lib/subject-style'
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

  // Le paquet EN COURS. Il vaut le quiz complet, sauf après « Revoir mes
  // erreurs », où il ne contient plus que les questions ratées.
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    deck && deck.length > 0 ? deck : allQuestions,
  )
  const [index, setIndex] = useState(0)
  // Choix de l'élève, question par question — la correction se lit dedans.
  const [choices, setChoices] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
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
    if (selected !== null || lockedRef.current) return
    lockedRef.current = true
    setSelected(optionIndex)
    const good = optionIndex === question.correct_index
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
    if (selected === null || advancingRef.current) return
    advancingRef.current = true
    const next = [...choices, selected]
    setChoices(next)
    setSelected(null)
    if (next.length >= questions.length) finish(next)
    else {
      setIndex((i) => i + 1)
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
                  {!isPartial ? (
                    <>
                      <span className="font-heading text-base font-extrabold text-[color-mix(in_oklch,var(--highlight),black_25%)]">
                        +{sessionXp('quiz', score, questions.length)} XP
                      </span>
                      <span
                        className="h-3 w-px bg-foreground/15"
                        aria-hidden="true"
                      />
                    </>
                  ) : null}
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
  const answered = selected !== null
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
        'jeu-table -mx-4 -mt-16 flex min-h-svh flex-col px-4 pt-16 pb-24 text-foreground md:-mx-8 md:-mt-10 md:px-8 md:pt-12',
      )}
      // La feuille de la mascotte se pose PAR-DESSUS le bas de l'écran : sans
      // cette marge, la dernière réponse disparaîtrait sous elle. Elle tient
      // compte de la mascotte, qui dépasse du panneau de toute sa moitié haute.
      // En ligne (et non en classe) pour la même raison que dans
      // QuizFeedbackMascotte.
      style={answered ? { paddingBottom: '21rem' } : undefined}
    >
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="flex items-center justify-between">
          <QuitGuardButton
            fallback={backHref}
            label="Quitter le quiz"
            className="shadow-sm"
          >
            <X className="size-5" aria-hidden="true" />
          </QuitGuardButton>
          <span className="sr-only">{title}</span>
          <SoundToggle />
        </div>

        {/* Badge de SÉRIE : n'apparaît qu'à partir de 2 bonnes réponses
            d'affilée, grossit avec le palier, et disparaît net à la première
            erreur. C'est la récompense visible qui accompagne la montée du son. */}
        {/* La région `aria-live` reste TOUJOURS montée : un lecteur d'écran
            n'annonce que les CHANGEMENTS d'une région déjà présente. Si elle
            apparaissait en même temps que son texte, l'annonce serait ratée. */}
        <div className="flex min-h-7 justify-center" aria-live="polite">
          <ComboBadge streak={streak} variant="clair" />
        </div>

        {/* Anneau de progression : « Question N/10 » */}
        <div className="z-10 -mb-10 flex justify-center">
          <ProgressRing
            value={(index + (selected !== null ? 1 : 0)) / questions.length}
            size={104}
            strokeWidth={7}
            label={`Question ${index + 1} sur ${questions.length}`}
            trackClassName="stroke-black/10"
            fillClassName="stroke-[color:var(--jeu-accent)]"
          >
            <span className="flex size-[82px] flex-col items-center justify-center rounded-full bg-card text-center shadow-sm">
              <span className="text-xs font-medium text-muted-foreground">
                Question
              </span>
              <span className="font-mono text-lg font-bold tabular-nums">
                {index + 1}/{questions.length}
              </span>
            </span>
          </ProgressRing>
        </div>

        {/* La question */}
        <div className="rounded-3xl bg-card px-5 pt-14 pb-8 text-center shadow-md ring-1 ring-black/5">
          <p className="font-heading text-lg font-bold text-balance text-foreground">
            {question.question}
          </p>
          {question.kind === 'true_false' ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Vrai ou faux ?
            </p>
          ) : null}
        </div>

        {/* LES RÉPONSES — le plateau des jeux de salon, à l'identique.
            Le quiz avait le sien : des pastilles qui viraient à l'APLAT vert ou
            rouge saturé, quand la table de jeu, elle, teinte la bonne réponse et
            la cerne. Deux grammaires du même verdict, dans la même app. C'est
            désormais un seul composant : ce qu'on corrige d'un côté profite à
            l'autre, et un élève n'a plus à réapprendre à lire un écran de
            questions selon la porte par laquelle il est entré. */}
        <div className="mt-5" role="group" aria-label="Réponses">
          <AnswerBoard
            options={question.options}
            correctIndex={question.correct_index}
            selected={selected}
            revealed={answered}
            // La disposition suit la FORME de la question, plus « liste » pour
            // tout le monde : un vrai/faux s'ouvre en deux grandes plaques,
            // quatre dates se rangent en damier, une définition garde ses
            // lignes pleine largeur. Cf. `lib/quiz-layout`.
            layout={layoutForQuestion(question)}
            onAnswer={choose}
          />
        </div>

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
