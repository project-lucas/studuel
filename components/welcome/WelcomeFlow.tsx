'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Subject } from '@/lib/types'
import {
  STORAGE_KEY,
  canAdvance,
  defaultSelectedForGrade,
  makePlacement,
  parseAnswers,
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
  DailyGoalStep,
  GoalStep,
  GradeStep,
  MotivationStep,
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
  PlanStep,
} from './EngageSteps'
import SignUpStep from './SignUpStep'

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
]

export default function WelcomeFlow({
  subjects,
  finish = false,
}: {
  subjects: Subject[]
  finish?: boolean
}) {
  const router = useRouter()
  const [step, setStep] = useState<WelcomeStep>(finish ? 'plan' : 'intro')
  const [history, setHistory] = useState<WelcomeStep[]>([])
  // On démarre vide pour que le rendu serveur et le premier rendu client soient
  // identiques (pas d'écart d'hydratation) ; le brouillon localStorage est
  // chargé juste après, au montage côté client (effet ci-dessous).
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => parseAnswers(null))
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [questions, setQuestions] = useState<PlacementQuestion[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [finishing, setFinishing] = useState(false)

  // Montage (client) : charge le brouillon local, puis — au retour OAuth
  // (?finish=1) — applique CE brouillon au profil (le compte existe déjà). On
  // lit ici et pas dans l'initialiseur d'état pour éviter tout écart
  // d'hydratation sur l'écran « plan ».
  useEffect(() => {
    const loadDraft = () => {
      const draft = parseAnswers(window.localStorage.getItem(STORAGE_KEY))
      setAnswers(draft)
      setDraftLoaded(true)
      if (finish) void applyOnboarding(draft)
    }
    loadDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persistance du brouillon — jamais avant de l'avoir chargé, sinon on
  // écraserait le brouillon existant avec l'état vide initial.
  useEffect(() => {
    if (!draftLoaded) return
    window.localStorage.setItem(STORAGE_KEY, serializeAnswers(answers))
  }, [answers, draftLoaded])

  function go(to: WelcomeStep) {
    setHistory((h) => [...h, step])
    setStep(to)
  }
  function back() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setStep(prev)
  }

  // Enchaînement naturel des écrans à bouton « Continuer ».
  function next() {
    switch (step) {
      case 'profil':
        return go(answers.profileType === 'parent' ? 'signup' : 'motivation')
      case 'motivation':
        return go('source')
      case 'source':
        return go('goal')
      case 'goal':
        return go('grade')
      case 'grade':
        return go('school')
      case 'school':
        return go('subjects')
      case 'subjects':
        return go('dailyGoal')
      case 'dailyGoal':
        return go('placementIntro')
      default:
        return
    }
  }

  async function startPlacement() {
    setLoadingQuiz(true)
    const qs = await fetchPlacementQuestions(answers.grade)
    setQuestions(qs)
    setLoadingQuiz(false)
    go('placementQuiz')
  }

  function finishOnboarding() {
    setFinishing(true)
    router.push(answers.profileType === 'parent' ? '/parents' : '/defi')
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
    <div className="onb fixed inset-0 z-50 flex flex-col pb-[env(safe-area-inset-bottom)]">
      {showFlowHeader ? (
        <ProgressHeader progress={progress} onBack={back} />
      ) : null}

      {step === 'placementQuiz' ? (
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
          <PlacementQuizStep
            progress={progress ?? 0.78}
            questions={questions}
            onBack={back}
            onDone={(correct, total) => {
              setAnswers((a) => ({ ...a, placement: makePlacement(correct, total) }))
              go('friends')
            }}
          />
        </div>
      ) : (
        <>
          <main className="min-h-0 flex-1 overflow-y-auto">
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
        return <IntroStep onStart={() => go('profil')} />
      case 'profil':
        return (
          <ProfilStep
            answers={answers}
            onPick={(v) => setAnswers((a) => ({ ...a, profileType: v }))}
          />
        )
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
              go('friends')
            }}
          />
        )
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
              go('signup')
            }}
          />
        )
      case 'signup':
        return (
          <SignUpStep
            answers={answers}
            onSignedUp={() =>
              // Le parcours parent n'a pas de plan élève : direct l'espace parents.
              answers.profileType === 'parent'
                ? router.push('/parents')
                : go('plan')
            }
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

  // Loader minimal pendant le chargement du quiz (rare, réseau).
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
}
