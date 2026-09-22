'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Subject } from '@/lib/types'
import {
  EMPTY_ANSWERS,
  canAdvance,
  defaultSelectedForGrade,
  isDailyGoalMinutes,
  type OnboardingAnswers,
  type WelcomeStep,
} from '@/lib/welcome'
import { saveOnboarding } from '@/app/onboarding/actions'
import OnbButton from '@/components/welcome/OnbButton'
import { ProgressHeader } from '@/components/welcome/OnbBits'
import PencilLogo from '@/components/welcome/PencilLogo'
import {
  DailyGoalStep,
  GradeStep,
  SubjectsStep,
} from '@/components/welcome/WelcomeSteps'

// Les trois écrans, dans l'ordre. Ce sont CEUX du parcours d'accueil
// (`components/welcome/WelcomeSteps`) : mêmes cartes, mêmes sons, même barre.
const ETAPES = ['grade', 'subjects', 'dailyGoal'] as const satisfies readonly WelcomeStep[]
type Etape = (typeof ETAPES)[number]

const PROGRESSION: Record<Etape, number> = {
  grade: 0.34,
  subjects: 0.67,
  dailyGoal: 1,
}

/**
 * L'onboarding d'un compte DÉJÀ CONNECTÉ — trois questions (classe, matières,
 * objectif), dans le monde visuel de `/bienvenue`.
 *
 * QUI ARRIVE ICI. Un compte créé sans passer par le parcours d'accueil
 * (inscription depuis /login, connexion Google d'un compte jamais configuré),
 * un profil sans classe renvoyé par une page qui en a besoin (« Choisir ma
 * classe »), et l'élève qui CHANGE de classe depuis son compte. Jusqu'ici cet
 * écran était le seul survivant de la première version de l'app : cartes
 * grises, boutons plats — à côté du parcours d'accueil, il avait l'air d'un
 * autre produit. Il en reprend désormais les écrans, un par un.
 *
 * `modification` : un élève déjà onboardé qui revient changer de classe. On le
 * dit dans le titre, et le bouton final ne promet pas un « C'est parti » à
 * quelqu'un qui joue déjà depuis des semaines.
 */
export default function OnboardingCompte({
  subjects,
  firstName,
  defaultGrade,
  defaultGoalMinutes,
  defaultSelected,
  modification,
}: {
  subjects: Subject[]
  firstName: string | null
  defaultGrade: string | null
  defaultGoalMinutes: number | null
  defaultSelected: string[] | null
  modification: boolean
}) {
  const router = useRouter()
  const [etape, setEtape] = useState<Etape>('grade')
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => ({
    ...EMPTY_ANSWERS,
    profileType: 'eleve',
    grade: defaultGrade,
    subjects:
      defaultSelected && defaultSelected.length > 0
        ? defaultSelected
        : defaultGrade
          ? defaultSelectedForGrade(subjects, defaultGrade)
          : [],
    dailyGoalMinutes: isDailyGoalMinutes(defaultGoalMinutes) ? defaultGoalMinutes : 10,
  }))
  const [pending, startTransition] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)

  const index = ETAPES.indexOf(etape)
  const derniere = index === ETAPES.length - 1

  function back() {
    if (index === 0) {
      // Premier écran : « retour » quitte l'onboarding — vers le compte pour
      // une modification, vers l'app sinon (l'élève reviendra par un lien).
      router.push(modification ? '/compte' : '/defi')
      return
    }
    setEtape(ETAPES[index - 1])
  }

  function next() {
    if (!derniere) {
      setEtape(ETAPES[index + 1])
      return
    }
    setErreur(null)
    const form = new FormData()
    form.set('grade_level', answers.grade ?? '')
    form.set('daily_goal_minutes', String(answers.dailyGoalMinutes))
    for (const slug of answers.subjects) form.append('subjects', slug)
    startTransition(async () => {
      try {
        await saveOnboarding(form)
      } catch (e) {
        // Une redirection Next voyage par une exception : ce n'est pas une
        // panne. Tout le reste en est une, et on le dit.
        if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) throw e
        setErreur('Impossible d’enregistrer pour le moment. Réessaie dans un instant.')
      }
    })
  }

  return (
    <div className="onb fixed inset-0 z-50 flex flex-col pb-[env(safe-area-inset-bottom)]">
      <ProgressHeader progress={PROGRESSION[etape]} onBack={back} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-[22px] pt-2 pb-[22px]">
          {etape === 'grade' && !modification ? (
            <div className="mb-4 flex items-center gap-3">
              <PencilLogo size={48} />
              <p className="text-[14px] leading-[1.35] font-extrabold">
                {firstName ? `Bienvenue, ${firstName} !` : 'Bienvenue !'}
                <span className="block text-[13px] font-semibold" style={{ color: 'var(--onb-mut)' }}>
                  Trois questions pour personnaliser ton espace.
                </span>
              </p>
            </div>
          ) : null}
          {etape === 'grade' && modification ? (
            <p
              className="mb-3 inline-block w-fit rounded-[20px] px-[9px] py-[3px] text-[11px] font-extrabold tracking-[0.1em] uppercase"
              style={{ color: 'var(--onb-pp)', background: 'var(--onb-pps)' }}
            >
              Modifier ma classe
            </p>
          ) : null}

          {etape === 'grade' ? (
            <GradeStep
              answers={answers}
              subjects={subjects}
              onPick={(grade) =>
                setAnswers((a) => ({
                  ...a,
                  grade,
                  // Nouvelle classe → toutes les matières du niveau cochées ;
                  // la même classe → on garde le tri de l'élève.
                  subjects:
                    grade === a.grade ? a.subjects : defaultSelectedForGrade(subjects, grade),
                }))
              }
            />
          ) : etape === 'subjects' ? (
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
          ) : (
            <DailyGoalStep
              answers={answers}
              onPick={(minutes) => setAnswers((a) => ({ ...a, dailyGoalMinutes: minutes }))}
            />
          )}
        </div>
      </main>
      <footer className="px-[22px] pt-3 pb-[22px]">
        <div className="mx-auto w-full max-w-md">
          {erreur ? (
            <p role="alert" className="mb-2 text-center text-[13px] font-bold" style={{ color: 'var(--onb-co)' }}>
              {erreur}
            </p>
          ) : null}
          <OnbButton
            variant={derniere ? 'yellow' : 'primary'}
            disabled={pending || !canAdvance(etape, answers)}
            onClick={next}
          >
            {pending
              ? 'Un instant…'
              : derniere
                ? modification
                  ? 'Enregistrer'
                  : 'C’est parti'
                : 'Continuer'}
          </OnbButton>
        </div>
      </footer>
    </div>
  )
}
