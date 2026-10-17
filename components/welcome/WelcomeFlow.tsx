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
import Image from 'next/image'
import accueilImage from '@/public/images/onboarding/accueil.webp'
import OnbButton from './OnbButton'
import TutoStep from './TutoStep'
import MarcelParle, { POSES } from './MarcelParle'
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
import CodeCoach from './CodeCoach'
import { verifierCodeCoach } from '@/app/bienvenue/coach-actions'
import { libelleGroupe } from '@/lib/coach/code'
import type { PortesOAuth } from '@/lib/auth-portes'

// Écrans à bouton standard en pied (footer géré par le flux). Les autres
// portent leurs propres boutons — et depuis le 13/10/2026, la classe avance
// AU TAP, sans bouton (rien n'y est préchoisi). Le rythme, lui, garde son
// « Continuer » (Lucas : « il faudrait un bouton continuer en bas ») : un
// rythme est déjà coché par défaut, un tap n'y est pas une réponse.
const STANDARD_FOOTER: WelcomeStep[] = [
  'profil',
  'motivation',
  'source',
  'goal',
  'school',
  'subjects',
  'dailyGoal',
  'avatar',
]

/** Le libellé du bouton de pied quand ce n'est pas « Continuer ». */
const FOOTER_LABEL: Partial<Record<WelcomeStep, string>> = {
  avatar: 'C’est moi',
}

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
  etapeInitiale,
  codeInvite,
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
  /** L'écran d'ouverture forcé (développement seulement : captures, maquettes). */
  etapeInitiale?: WelcomeStep
  /** Le code de groupe venu du lien d'invitation (?code=), forme déjà vérifiée. */
  codeInvite?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<WelcomeStep>(
    finish ? 'plan' : oauthFailed ? 'signup' : (etapeInitiale ?? 'intro'),
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
      // LIEN D'INVITATION : même chemin que « J'ai un code » (vérification par
      // le serveur, cookie posé pour le rattachement à l'ouverture de session).
      // Toujours revérifié, même si le brouillon porte déjà ce code : c'est
      // ce qui repose le cookie s'il a expiré.
      if (codeInvite) {
        void verifierCodeCoach(codeInvite).then((r) => {
          if (!r.ok) return
          setAnswers((a) => ({
            ...a,
            coachCode: r.code,
            coachGroupe: libelleGroupe(r.nom, r.categorie, r.coach),
            profileType: 'eleve',
          }))
        })
      }
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
        <Image src={POSES.salut} alt="" aria-hidden="true" priority sizes="200px" className="float-slow h-[220px] w-auto" />
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
                  {FOOTER_LABEL[step] ?? 'Continuer'}
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
        return (
          <IntroStep
            onStart={() => {
              // Sans écran profil (13/10/2026), l'élève est le défaut.
              setAnswers((a) => ({ ...a, profileType: a.profileType ?? 'eleve' }))
              go(nextStep('intro', { ...answers, profileType: answers.profileType ?? 'eleve' }) ?? 'tuto')
            }}
            onParent={() => {
              setAnswers((a) => ({ ...a, profileType: 'parent' }))
              go('parentIntro')
            }}
            coachGroupe={answers.coachGroupe}
            onCode={(code, libelle) =>
              // Un code de coach, c'est un élève : on le présuppose, l'écran
              // suivant le laisse encore changer.
              setAnswers((a) => ({ ...a, coachCode: code, coachGroupe: libelle, profileType: 'eleve' }))
            }
            onRetrait={() => setAnswers((a) => ({ ...a, coachCode: null, coachGroupe: null }))}
          />
        )
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
      case 'tuto':
        return <TutoStep onDone={next} />
      case 'grade':
        return (
          <GradeStep
            answers={answers}
            subjects={subjects}
            onPick={(grade) => {
              setAnswers((a) => ({
                ...a,
                grade,
                subjects: defaultSelectedForGrade(subjects, grade),
              }))
              // Un tap, et on avance (13/10/2026) : la suite ne dépend pas de
              // la classe choisie, seulement du profil — déjà connu.
              go(nextStep('grade', answers) ?? 'avatar')
            }}
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
            onPick={(minutes) => setAnswers((a) => ({ ...a, dailyGoalMinutes: minutes }))}
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
// L'ACCUEIL (13/10/2026, Lucas : « la première page avant le logo numérisé ne
// va pas » ; « l'app doit montrer qu'elle promet de belles choses »). Plus de
// logo plat sur le mur crème : l'ACADÉMIE plein écran — la cour d'honneur au
// soir, les crayons croisés dorés au-dessus du portail, peinte dans le monde de
// l'arène (scripts/onboarding-illustrations.mjs) —, le nom en Baloo cerné, la
// promesse en Caveat, et les trois portes en bas sur un voile d'encre : jouer,
// se connecter, et (en petit) le parent et le code de coach.
function IntroStep({
  onStart,
  onParent,
  coachGroupe,
  onCode,
  onRetrait,
}: {
  onStart: () => void
  /** « Je suis parent » : son chemin à lui (présentation, puis le compte). */
  onParent: () => void
  coachGroupe: string | null
  onCode: (code: string, libelle: string) => void
  onRetrait: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={accueilImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(43,35,80,0) 38%, rgba(43,35,80,0.55) 62%, rgba(43,35,80,0.9) 100%)',
          }}
        />
      </div>
      <div className="flex flex-col items-center pt-8 text-center">
        <p
          className="onb-word text-[34px] leading-none text-white"
          style={{ textShadow: '0 3px 0 rgba(43,35,80,0.55), 0 8px 22px rgba(43,35,80,0.35)' }}
        >
          Studuel
        </p>
      </div>
      {/* MARCEL ACCUEILLE, comme Duo (13/10/2026) : c'est lui qui parle, devant l'académie. */}
      <div className="flex flex-1 flex-col justify-end pb-3">
        <MarcelParle
          grand
          clair
          pose="salut"
          titre="Salut, moi c’est Marcel !"
          sous="Ton coach. Je vais faire de toi la terreur des contrôles."
        />
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-2">
        <OnbButton onClick={onStart}>C&apos;est parti</OnbButton>
        <OnbButton variant="ghost" asChild className="border-white/80 bg-white/95">
          <Link href="/login">J&apos;ai déjà un compte</Link>
        </OnbButton>
        {/* flex-wrap : ouvert (champ du code) ou rempli (« Tu rejoins … »), le
            bloc du code passe SOUS la rangée, en pleine largeur — sur la rangée,
            il débordait à droite et « Rejoindre » sortait de l'écran (17/10). */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 text-[13px] font-extrabold text-white/85 has-[form]:[&>.sep]:hidden has-[.badge-code]:[&>.sep]:hidden">
          <button type="button" onClick={onParent} className="min-h-11 underline underline-offset-4">
            Je suis parent
          </button>
          <span aria-hidden="true" className="sep">·</span>
          {/* « J'ai un code » (13/10/2026) : le joueur d'un centre de formation
              saisit le code de son coach ici, puis continue comme tout le monde. */}
          <div className="[&>button]:text-white/85 [&>button]:underline-offset-4 has-[form]:order-first has-[form]:mb-1 has-[form]:w-full has-[.badge-code]:order-first has-[.badge-code]:mb-1 has-[.badge-code]:w-full">
            <CodeCoach groupe={coachGroupe} onCode={onCode} onRetrait={onRetrait} />
          </div>
        </div>
      </div>
    </div>
  )
}
