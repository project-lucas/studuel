'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Subject } from '@/lib/types'
import { toast } from '@/lib/toast'
import {
  STORAGE_KEY,
  STORAGE_STEP_KEY,
  canAdvance,
  defaultSelectedForGrade,
  destinationApresPlan,
  makePlacement,
  nextStep,
  parseAnswers,
  pathTo,
  resumeStep,
  serializeAnswers,
  stepProgress,
  type OnboardingAnswers,
  type WelcomeStep,
} from '@/lib/welcome'
import {
  applyOnboarding,
  fetchPlacementQuestions,
} from '@/app/bienvenue/actions'
import type { PlacementQuestion } from '@/lib/placement'
import PencilLogo from './PencilLogo'
import OnbButton from './OnbButton'
import { ProgressHeader } from './OnbBits'
import {
  AvatarStep,
  DailyGoalStep,
  GoalStep,
  GradeStep,
  MotivationStep,
  ParentIntroStep,
  ProfilStep,
  SchoolStep,
  SourceStep,
  SubjectsStep,
} from './WelcomeSteps'
import {
  FriendsStep,
  NotificationsStep,
  PlacementIntroStep,
  PlacementQuizStep,
  PlacementResultStep,
  PlanStep,
} from './EngageSteps'
import SignUpStep from './SignUpStep'
import type { PortesOAuth } from '@/lib/auth-portes'

// Écrans à bouton « Continuer » standard (footer géré par le flux). Les autres
// portent leurs propres boutons.
const STANDARD_FOOTER: WelcomeStep[] = [
  'profil',
  'motivation',
  'source',
  'goal',
  'grade',
  'school',
  'subjects',
  'dailyGoal',
  'avatar',
]

function lireLocal(cle: string): string | null {
  try {
    return window.localStorage.getItem(cle)
  } catch {
    return null
  }
}

function ecrireLocal(cle: string, valeur: string | null): void {
  try {
    if (valeur === null) window.localStorage.removeItem(cle)
    else window.localStorage.setItem(cle, valeur)
  } catch {
    // Stockage indisponible (navigation privée, quota) : le parcours
    // fonctionne sans reprise, c'est tout.
  }
}

export default function WelcomeFlow({
  subjects,
  portes,
  finish = false,
  oauthFailed = false,
}: {
  subjects: Subject[]
  /** Les fournisseurs OAuth réellement activés côté Supabase (écran 13). */
  portes: PortesOAuth
  finish?: boolean
  /** Le lancement OAuth a échoué (fournisseur non activé côté Supabase, panne).
   *  On reprend à l'écran de création de compte, PAS à l'intro : renvoyer
   *  l'élève au début lui faisait retraverser douze écrans sans jamais lui dire
   *  ce qui s'était passé — et il retentait le même bouton. */
  oauthFailed?: boolean
}) {
  const router = useRouter()
  const [step, setStep] = useState<WelcomeStep>(
    finish ? 'plan' : oauthFailed ? 'signup' : 'intro',
  )
  const [history, setHistory] = useState<WelcomeStep[]>([])
  // On démarre vide pour que le rendu serveur et le premier rendu client soient
  // identiques (pas d'écart d'hydratation) ; le brouillon localStorage est
  // chargé juste après, au montage côté client (effet ci-dessous).
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => parseAnswers(null))
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [questions, setQuestions] = useState<PlacementQuestion[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [finishing, setFinishing] = useState(false)
  // Retour OAuth : l'enregistrement du plan a échoué (RLS, réseau…) — on
  // retentera au « Commencer » et on préviendra au lieu d'échouer en silence.
  const [applyFailed, setApplyFailed] = useState(false)

  // Montage (client) : charge le brouillon local, puis — au retour OAuth
  // (?finish=1) — applique CE brouillon au profil (le compte existe déjà). On
  // lit ici et pas dans l'initialiseur d'état pour éviter tout écart
  // d'hydratation sur l'écran « plan ».
  //
  // REPRISE. Si un écran d'AVANT le compte a été mémorisé (onglet fermé,
  // appel, app passée en arrière-plan), on y revient directement, avec
  // l'historique du bouton retour reconstruit — plutôt que de faire
  // retraverser à l'élève des écrans déjà remplis (cf. resumeStep).
  useEffect(() => {
    const loadDraft = () => {
      const draft = parseAnswers(lireLocal(STORAGE_KEY))
      setAnswers(draft)
      setDraftLoaded(true)
      if (finish) {
        // Résultat surveillé : un échec silencieux laisserait l'élève croire
        // son plan enregistré (profil resté vide) sans aucun signal.
        applyOnboarding(draft)
          .then((res) => {
            if (!res?.ok) setApplyFailed(true)
          })
          .catch(() => setApplyFailed(true))
        return
      }
      if (oauthFailed) return
      const reprise = resumeStep(lireLocal(STORAGE_STEP_KEY), draft)
      if (reprise && reprise !== 'intro') {
        setStep(reprise)
        setHistory(pathTo(reprise, draft))
      }
    }
    loadDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persistance du brouillon — jamais avant de l'avoir chargé, sinon on
  // écraserait le brouillon existant avec l'état vide initial.
  useEffect(() => {
    if (!draftLoaded) return
    ecrireLocal(STORAGE_KEY, serializeAnswers(answers))
  }, [answers, draftLoaded])

  // L'écran courant, mémorisé pour la reprise (même garde).
  useEffect(() => {
    if (!draftLoaded) return
    ecrireLocal(STORAGE_STEP_KEY, step)
  }, [step, draftLoaded])

  // Changement d'écran : on déplace le focus sur le nouvel écran. Sans ça, le
  // clavier et le lecteur d'écran restent sur le bouton qui vient de
  // disparaître — l'élève au lecteur d'écran n'entend RIEN du nouvel écran, et
  // la tabulation repart du haut du document. On remet aussi le défilement en
  // haut : un écran long laissé à mi-hauteur ferait manquer son titre.
  // Volontairement pas au tout premier rendu : voler le focus à l'arrivée sur
  // la page serait plus gênant qu'utile.
  const screenRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    scrollRef.current?.scrollTo({ top: 0 })
    screenRef.current?.focus({ preventScroll: true })
  }, [step])

  // `sansRetour` : l'écran quitté ne rentre pas dans l'historique. Sert au
  // quiz → résultat : revenir « en arrière » depuis le résultat doit ramener à
  // l'intro du quiz, pas relancer un quiz à moitié fait.
  function go(to: WelcomeStep, sansRetour = false) {
    if (!sansRetour) setHistory((h) => [...h, step])
    setStep(to)
  }
  function back() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setStep(prev)
  }

  // Enchaînement des écrans : l'ORDRE vit dans lib/welcome (pur et testé), pas
  // ici. C'est lui qui porte la décision « jouer d'abord, questionner ensuite ».
  function next() {
    const to = nextStep(step, answers)
    if (to !== null) go(to)
  }

  async function startPlacement() {
    setLoadingQuiz(true)
    try {
      const qs = await fetchPlacementQuestions(answers.grade)
      setQuestions(qs)
      go('placementQuiz')
    } catch {
      // Réseau KO : sans ce garde, la promesse rejetée laissait loadingQuiz à
      // true pour toujours → les DEUX boutons (disabled={loading}) restaient
      // bloqués et l'élève ne pouvait ni tester ni passer. On relâche le verrou
      // (finally) pour qu'il réessaie ou passe.
    } finally {
      setLoadingQuiz(false)
    }
  }

  // Le parcours est FINI : le brouillon et l'écran mémorisé n'ont plus de
  // raison d'être — un frère ou une sœur qui ouvre l'app sur le même appareil
  // ne doit pas reprendre au milieu du parcours d'un autre.
  function oublierBrouillon() {
    ecrireLocal(STORAGE_KEY, null)
    ecrireLocal(STORAGE_STEP_KEY, null)
  }

  function finishOnboarding() {
    setFinishing(true)
    const dest = destinationApresPlan(answers)
    if (!applyFailed) {
      oublierBrouillon()
      router.push(dest)
      return
    }
    // L'enregistrement du plan avait échoué au retour OAuth : on retente une
    // fois, et en cas de nouvel échec on le DIT (sans bloquer l'entrée).
    applyOnboarding(answers)
      .then((res) => {
        if (!res?.ok) {
          toast('Ton plan n’a pas pu être enregistré — refais-le depuis ton compte.', 'error')
        }
      })
      .catch(() => {
        toast('Ton plan n’a pas pu être enregistré — refais-le depuis ton compte.', 'error')
      })
      .finally(() => {
        oublierBrouillon()
        router.push(dest)
      })
  }

  const progress = stepProgress(step)
  const showFlowHeader = progress !== null && step !== 'placementQuiz'

  // Retour OAuth (?finish=1) : on attend d'avoir chargé le brouillon avant
  // d'afficher le plan — évite un flash de valeurs par défaut. Identique côté
  // serveur et au 1er rendu client → aucun écart d'hydratation.
  if (finish && !draftLoaded) {
    return (
      <div className="onb fixed inset-0 z-50 flex flex-col items-center justify-center pb-[env(safe-area-inset-bottom)]">
        <PencilLogo size={120} className="float-slow" />
      </div>
    )
  }

  return (
    <div
      ref={screenRef}
      tabIndex={-1}
      className="onb fixed inset-0 z-50 flex flex-col pb-[env(safe-area-inset-bottom)] outline-none"
    >
      {showFlowHeader ? (
        <ProgressHeader progress={progress} onBack={back} />
      ) : null}

      {step === 'placementQuiz' ? (
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
          <PlacementQuizStep
            progress={progress ?? 0.4}
            questions={questions}
            onBack={back}
            onDone={(correct, total) => {
              setAnswers((a) => ({ ...a, placement: makePlacement(correct, total) }))
              // Un quiz FAIT montre son résultat ; un quiz vide (aucune
              // question servie) file droit à l'écran suivant.
              if (total > 0) go('placementResult', true)
              else go(nextStep('placementResult', answers) ?? 'avatar', true)
            }}
          />
        </div>
      ) : (
        <>
          <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-[22px] pt-2 pb-[22px]">
              {renderStep()}
            </div>
          </main>

          {STANDARD_FOOTER.includes(step) ? (
            <footer className="px-[22px] pt-3 pb-[22px]">
              <div className="mx-auto w-full max-w-md">
                <OnbButton disabled={!canAdvance(step, answers)} onClick={next}>
                  Continuer
                </OnbButton>
              </div>
            </footer>
          ) : null}
        </>
      )}
    </div>
  )

  function renderStep() {
    switch (step) {
      case 'intro':
        return <IntroStep onStart={next} />
      case 'profil':
        return (
          <ProfilStep
            answers={answers}
            onPick={(v) => setAnswers((a) => ({ ...a, profileType: v }))}
          />
        )
      case 'parentIntro':
        return <ParentIntroStep onContinue={next} />
      case 'motivation':
        return <MotivationStep />
      case 'source':
        return (
          <SourceStep
            answers={answers}
            onPick={(v) => setAnswers((a) => ({ ...a, source: v }))}
          />
        )
      case 'goal':
        return (
          <GoalStep
            answers={answers}
            onPick={(v) => setAnswers((a) => ({ ...a, goal: v }))}
          />
        )
      case 'grade':
        return (
          <GradeStep
            answers={answers}
            subjects={subjects}
            onPick={(grade) =>
              setAnswers((a) => ({
                ...a,
                grade,
                subjects: defaultSelectedForGrade(subjects, grade),
              }))
            }
          />
        )
      case 'school':
        return (
          <SchoolStep
            answers={answers}
            onChange={(schoolName, schoolCity) =>
              setAnswers((a) => ({ ...a, schoolName, schoolCity }))
            }
          />
        )
      case 'subjects':
        return (
          <SubjectsStep
            subjects={subjects}
            answers={answers}
            onToggle={(slug) =>
              setAnswers((a) => ({
                ...a,
                subjects: a.subjects.includes(slug)
                  ? a.subjects.filter((s) => s !== slug)
                  : [...a.subjects, slug],
              }))
            }
          />
        )
      case 'dailyGoal':
        return (
          <DailyGoalStep
            answers={answers}
            onPick={(minutes) =>
              setAnswers((a) => ({ ...a, dailyGoalMinutes: minutes }))
            }
          />
        )
      case 'placementIntro':
        return (
          <PlacementIntroStep
            loading={loadingQuiz}
            onStart={() => void startPlacement()}
            onSkip={() => {
              setAnswers((a) => ({ ...a, placement: makePlacement(0, 0) }))
              // Passer le quiz saute AUSSI le quiz et son résultat : on
              // rejoint la suite du chemin (le blason), sans écran orphelin.
              go(nextStep('placementResult', answers) ?? 'signup')
            }}
          />
        )
      case 'placementResult':
        return <PlacementResultStep answers={answers} onContinue={next} />
      case 'friends':
        return (
          <FriendsStep
            onInvited={() => {
              setAnswers((a) => ({ ...a, friendsInvited: true }))
              go('notifications')
            }}
            onSkip={() => go('notifications')}
          />
        )
      case 'notifications':
        return (
          <NotificationsStep
            onDecided={(enabled) => {
              setAnswers((a) => ({ ...a, notificationsEnabled: enabled }))
              go(nextStep('notifications', answers) ?? 'plan')
            }}
          />
        )
      case 'avatar':
        return (
          <AvatarStep
            answers={answers}
            onPick={(avatar) => setAnswers((a) => ({ ...a, avatar }))}
          />
        )
      case 'signup':
        return (
          <SignUpStep
            answers={answers}
            portes={portes}
            initialError={
              oauthFailed
                ? 'La connexion avec ce service n’a pas pu démarrer. Réessaie, ou crée ton compte avec un e-mail.'
                : null
            }
            onSignedUp={() => {
              // Le parcours parent n'a pas de suite élève : direct l'espace
              // parents (nextStep renvoie null pour lui).
              const to = nextStep('signup', answers)
              if (to === null) {
                oublierBrouillon()
                router.push('/parents')
              } else go(to)
            }}
          />
        )
      case 'plan':
        return (
          <PlanStep
            answers={answers}
            subjectCount={answers.subjects.length}
            onFinish={finishOnboarding}
            finishing={finishing}
          />
        )
      default:
        return null
    }
  }

}

// Écran d'accueil de l'onboarding. Défini au niveau module (et non dans le corps
// de WelcomeFlow) pour garder une identité de composant STABLE : sinon chaque
// rendu du parent recréait la fonction, React remontait l'écran entier et
// l'animation du logo repartait de zéro (flicker sur l'écran le plus critique J1).
function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <PencilLogo size={150} className="float-slow" />
        <div className="onb-word mt-1.5 text-[34px]" style={{ color: 'var(--onb-ink)' }}>
          studuel
        </div>
        <p
          className="mt-2.5 max-w-[210px] text-[16px] font-bold"
          style={{ color: 'var(--onb-mut)' }}
        >
          Révise, défie tes potes, et cartonne ton année.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <OnbButton onClick={onStart}>C&apos;est parti</OnbButton>
        <Link href="/login" className="onb-btn onb-btn-ghost block text-center no-underline">
          J&apos;ai déjà un compte
        </Link>
      </div>
    </div>
  )
}
