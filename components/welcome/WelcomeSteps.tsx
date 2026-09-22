'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type Subject } from '@/lib/types'
import { GRADE_CYCLES } from '@/lib/grades'
import {
  DAILY_GOALS,
  GOALS,
  GRADE_LABELS,
  SOURCES,
  gradeReassurance,
  subjectsForGrade,
  type DailyGoalMinutes,
  type Goal,
  type OnboardingAnswers,
  type ProfileType,
  type Source,
} from '@/lib/welcome'
import { schoolLevelForGrade, SCHOOL_LEVEL_LABEL } from '@/lib/clan'
import { PORTRAIT_KEYS, portraitSrc, type PortraitKey } from '@/lib/portraits'
import PencilLogo from './PencilLogo'
import OnbButton from './OnbButton'
import {
  Bubble,
  OptionGroup,
  OptionIcon,
  OptionRow,
  StepHead,
  usePressFx,
} from './OnbBits'

// ---------------------------------------------------------------------------
// Écran 2 — Parent ou élève
// ---------------------------------------------------------------------------
export function ProfilStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: ProfileType) => void
}) {
  return (
    <div className="flex flex-1 flex-col pt-3">
      <StepHead
        title="Qui utilise Studuel ?"
        subtitle="On adapte l'expérience selon ton profil."
      />
      <div className="pt-6">
        <OptionGroup label="Qui utilise Studuel">
          <OptionRow
            selected={answers.profileType === 'eleve'}
            onClick={() => onPick('eleve')}
            icon={
              <OptionIcon color="var(--onb-pp)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
              </OptionIcon>
            }
            label="Je suis élève"
            description="Je révise et je défie mes amis en duel"
          />
          <OptionRow
            selected={answers.profileType === 'parent'}
            onClick={() => onPick('parent')}
            icon={
              <OptionIcon color="var(--onb-yl)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5a3d00" strokeWidth="2.2">
                  <circle cx="8" cy="8" r="3.2" />
                  <circle cx="16" cy="9" r="2.6" />
                  <path d="M2 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 8-3.8" />
                </svg>
              </OptionIcon>
            }
            label="Je suis parent"
            description="Je suis les progrès de mon enfant"
          />
        </OptionGroup>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 2bis — Le parcours PARENT : ce qu'il va trouver (ajouté le 22/09/2026)
//
// Un parent qui choisissait « Je suis parent » tombait sur « Sauvegarde ta
// progression… garde ta série, tes XP » — l'écran de compte de l'ÉLÈVE —
// puis, une fois inscrit, sur « Aucun enfant lié » et un champ de code dont
// personne ne lui avait parlé. Cet écran dit, AVANT le compte, les trois
// choses que l'espace parents lui donne, et comment on lie l'enfant : son
// code, dans l'onglet Amis de SON application. Vouvoiement : c'est la règle
// de tout l'espace parents.
// ---------------------------------------------------------------------------
const PARENT_PROMESSES: { titre: string; detail: string; color: string; icon: ReactNode }[] = [
  {
    titre: 'Ce qu’il a fait cette semaine',
    detail: 'Le temps de révision, la régularité, la tendance sur quatre semaines.',
    color: 'var(--onb-pp)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2">
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
      </svg>
    ),
  },
  {
    titre: 'Ses contrôles à venir',
    detail: 'Déclarés par votre enfant dans l’app, avec leurs chapitres.',
    color: 'var(--onb-co)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2">
        <path d="M4 5h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M4 9h16M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    titre: 'Des conseils concrets',
    detail: 'Six repères sur l’apprentissage, et des gestes adaptés à sa semaine.',
    color: 'var(--onb-yl)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5a3d00" strokeWidth="2.2">
        <path d="M12 3l2.5 5.3 5.8.8-4.2 4 1 5.7L12 16l-5.1 2.6 1-5.7L3.7 9l5.8-.8z" />
      </svg>
    ),
  },
]

export function ParentIntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Votre espace parent"
        subtitle="Un tableau de bord clair, mis à jour à chaque session de votre enfant."
      />
      <ul className="flex flex-col gap-[11px] pt-6">
        {PARENT_PROMESSES.map((p) => (
          <li
            key={p.titre}
            className="flex items-center gap-3.5 rounded-2xl border-2 bg-white p-[15px]"
            style={{ borderColor: 'var(--onb-line)' }}
          >
            <OptionIcon color={p.color}>{p.icon}</OptionIcon>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold">{p.titre}</span>
              <span className="mt-0.5 block text-[13px] leading-[1.35] font-semibold" style={{ color: 'var(--onb-mut)' }}>
                {p.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div
        className="mt-4 rounded-[18px] border-2 p-4"
        style={{ borderColor: 'var(--onb-yl)', background: '#FFF7E0' }}
      >
        <p className="text-[11px] font-extrabold tracking-[0.1em] uppercase" style={{ color: '#a06d00' }}>
          Comment ça marche
        </p>
        <ol className="mt-1.5 flex flex-col gap-1 text-[13.5px] leading-[1.4] font-semibold" style={{ color: 'var(--onb-ink)' }}>
          <li>1. Vous créez votre compte (écran suivant).</li>
          <li>
            2. Votre enfant vous donne son code — dans l’onglet <strong>Amis</strong>{' '}
            de son application.
          </li>
          <li>3. Vous le saisissez dans votre espace : son suivi apparaît.</li>
        </ol>
      </div>

      <div className="mt-auto pt-5">
        <OnbButton onClick={onContinue}>Créer mon espace</OnbButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 3 — Motivation (le crayon te parle)
// ---------------------------------------------------------------------------
export function MotivationStep() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-7 max-w-[280px]">
        <Bubble>Salut ! On va faire de toi la terreur des contrôles 💪</Bubble>
      </div>
      <PencilLogo size={130} className="float-slow" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 4 — Comment tu nous as connu ?
// ---------------------------------------------------------------------------
const SOURCE_ICONS: Record<Source, { color: string; icon: ReactNode }> = {
  tiktok: {
    color: '#111',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M16 3c.5 2.5 2 4 4.5 4.2v3C18.8 10 17.3 9.4 16 8.4V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.2A3 3 0 1 0 13 15V3h3z" />
      </svg>
    ),
  },
  instagram: {
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  youtube: {
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12zM10 15V9l5 3-5 3z" />
      </svg>
    ),
  },
  ami: {
    color: 'var(--onb-yl)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3 19a6 6 0 0 1 12 0M15.5 19a5 5 0 0 1 5.5-4.7" />
      </svg>
    ),
  },
  app_store: {
    color: 'var(--onb-pp)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  autre: {
    color: 'var(--onb-mut)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  },
}

export function SourceStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: Source) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead title="Comment tu as connu Studuel ?" />
      <div className="pt-6">
        <OptionGroup label="Comment tu as connu Studuel">
          {SOURCES.map((s) => {
            const meta = SOURCE_ICONS[s.value]
            return (
              <OptionRow
                key={s.value}
                selected={answers.source === s.value}
                onClick={() => onPick(s.value)}
                icon={<OptionIcon color={meta.color}>{meta.icon}</OptionIcon>}
                label={s.label}
              />
            )
          })}
        </OptionGroup>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 5 — Objectif n°1
// ---------------------------------------------------------------------------
const GOAL_ICONS: Record<Goal, { color: string; icon: ReactNode }> = {
  controles: {
    color: 'var(--onb-co)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  moyenne: {
    color: 'var(--onb-pp)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
      </svg>
    ),
  },
  examen: {
    color: 'var(--onb-yl)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 3l2.5 5.3 5.8.8-4.2 4 1 5.7L12 16l-5.1 2.6 1-5.7L3.7 9l5.8-.8z" />
      </svg>
    ),
  },
  avance: {
    color: '#2AA36B',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4 18l6-6 4 4 6-8" />
      </svg>
    ),
  },
  defi: {
    color: 'var(--onb-ink)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M13 3L5 14h5l-1 7 8-11h-5z" />
      </svg>
    ),
  },
}

export function GoalStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: Goal) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead title="Ton objectif n°1 ?" subtitle="On adapte ton plan en fonction." />
      <div className="pt-6">
        <OptionGroup label="Ton objectif n°1">
          {GOALS.map((g) => {
            const meta = GOAL_ICONS[g.value]
            return (
              <OptionRow
                key={g.value}
                selected={answers.goal === g.value}
                onClick={() => onPick(g.value)}
                icon={<OptionIcon color={meta.color}>{meta.icon}</OptionIcon>}
                label={g.label}
              />
            )
          })}
        </OptionGroup>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 6 — Ta classe
// ---------------------------------------------------------------------------
function GradeCell({
  label,
  selected,
  onPick,
}: {
  label: string
  selected: boolean
  onPick: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      // Choix exclusif (une seule classe) : même motif radio que OptionRow.
      role="radio"
      aria-checked={selected}
      onClick={() => {
        onPress()
        onPick()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'onb-card flex items-center justify-center px-3 py-[15px] text-[15px] font-extrabold',
        selected && 'onb-card-on',
        pop && 'onb-pop',
      )}
    >
      {label}
    </button>
  )
}

export function GradeStep({
  answers,
  subjects,
  onPick,
}: {
  answers: OnboardingAnswers
  /** Le catalogue, pour dire combien de matières couvre la classe choisie. */
  subjects: Subject[]
  onPick: (grade: string) => void
}) {
  const reassurance = gradeReassurance(subjects, answers.grade)
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Tu es en quelle classe ?"
        subtitle="Pour te proposer le bon programme."
      />
      {/* La réassurance, dès qu'une classe est cochée : « 8 matières · tout
          le programme de 4e ». Un choix administratif devient une promesse
          tenue — et elle se lit avant même d'appuyer sur Continuer. */}
      <p
        aria-live="polite"
        className="mt-2 min-h-[20px] text-[13px] font-extrabold"
        style={{ color: reassurance ? '#2AA36B' : 'transparent' }}
      >
        {reassurance ? `✓ ${reassurance}` : ' '}
      </p>
      <div className="pt-4">
        {/* Groupé par cycle. À sept classes, une grille à plat se lisait ; à
            quatorze — le primaire et la voie technologique sont arrivés — elle
            ne dit plus rien de la structure, et un CE1 doit parcourir tout le
            lycée pour se trouver. Un seul OptionGroup enveloppe les trois
            blocs : il retrouve ses radios en profondeur, la navigation au
            clavier continue donc de traverser les cycles d'une traite. */}
        <OptionGroup label="Tu es en quelle classe" className="flex flex-col gap-5">
          {GRADE_CYCLES.map((cycle) => (
            <div key={cycle.id} className="flex flex-col gap-[11px]">
              <h3 className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                {cycle.label}
              </h3>
              <div className="grid grid-cols-2 gap-[11px]">
                {cycle.grades.map((g) => (
                  <GradeCell
                    key={g}
                    label={GRADE_LABELS[g] ?? g}
                    selected={answers.grade === g}
                    onPick={() => onPick(g)}
                  />
                ))}
              </div>
            </div>
          ))}
        </OptionGroup>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 6bis — Ton établissement = ton clan
// ---------------------------------------------------------------------------
export function SchoolStep({
  answers,
  onChange,
}: {
  answers: OnboardingAnswers
  onChange: (name: string | null, city: string | null) => void
}) {
  const level = schoolLevelForGrade(answers.grade)
  const word = SCHOOL_LEVEL_LABEL[level].toLowerCase()
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title={`Ton ${word}, c’est ton clan`}
        subtitle="Tu grimperas au classement avec les élèves de ton établissement. Tu pourras le changer plus tard."
      />
      <div className="flex flex-col gap-3 pt-6">
        <input
          value={answers.schoolName ?? ''}
          onChange={(e) => onChange(e.target.value || null, answers.schoolCity)}
          placeholder={`Nom de ton ${word}`}
          aria-label={`Nom de ton ${word}`}
          maxLength={120}
          className="w-full rounded-2xl border-2 bg-white px-4 py-3 text-[15px] font-semibold outline-none"
          style={{ borderColor: 'var(--onb-line)' }}
        />
        <input
          value={answers.schoolCity ?? ''}
          onChange={(e) => onChange(answers.schoolName, e.target.value || null)}
          placeholder="Ville (facultatif)"
          aria-label="Ville de ton établissement"
          maxLength={80}
          className="w-full rounded-2xl border-2 bg-white px-4 py-3 text-[15px] font-semibold outline-none"
          style={{ borderColor: 'var(--onb-line)' }}
        />
        <p className="px-1 text-[13px] font-semibold" style={{ color: 'var(--onb-mut)' }}>
          Pas envie maintenant ? Passe cette étape, tu choisiras ton clan depuis
          le Défi.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 7 — Matières (choix multiple)
// ---------------------------------------------------------------------------
function SubjectChip({
  name,
  selected,
  onToggle,
}: {
  name: string
  selected: boolean
  onToggle: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => {
        onPress()
        onToggle()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'rounded-[18px] border-2 px-[16px] py-[11px] text-[14.5px] font-extrabold transition-colors active:translate-y-[2px]',
        pop && 'onb-pop',
      )}
      style={{
        borderColor: selected ? 'var(--onb-pp)' : 'var(--onb-line)',
        background: selected ? 'var(--onb-pp)' : '#fff',
        color: selected ? '#fff' : 'var(--onb-ink)',
        boxShadow: selected
          ? '0 3px 0 var(--onb-ppd)'
          : '0 3px 0 var(--onb-line-d)',
      }}
    >
      {name}
    </button>
  )
}

export function SubjectsStep({
  subjects,
  answers,
  onToggle,
}: {
  subjects: Subject[]
  answers: OnboardingAnswers
  onToggle: (slug: string) => void
}) {
  const ofLevel = subjectsForGrade(subjects, answers.grade)
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Quelles matières bosser ?"
        subtitle="Choisis-en autant que tu veux."
      />
      <div className="flex flex-wrap content-start gap-[10px] pt-6">
        {ofLevel.map((s) => (
          <SubjectChip
            key={s.slug}
            name={s.name}
            selected={answers.subjects.includes(s.slug)}
            onToggle={() => onToggle(s.slug)}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 8 — Objectif quotidien (minutes)
// ---------------------------------------------------------------------------
export function DailyGoalStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (minutes: DailyGoalMinutes) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Ton objectif quotidien ?"
        subtitle="Tu pourras le changer plus tard."
      />
      <div className="pt-6">
        <OptionGroup label="Ton objectif quotidien">
          {DAILY_GOALS.map((g) => {
            const selected = answers.dailyGoalMinutes === g.minutes
            return (
              <OptionRow
                key={g.minutes}
                selected={selected}
                onClick={() => onPick(g.minutes)}
                label={g.label}
                trailing={
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[13px] font-bold"
                      style={{
                        color: selected ? 'var(--onb-pp)' : 'var(--onb-mut)',
                      }}
                    >
                      {g.hint}
                    </span>
                    <span
                      className="shrink-0 rounded-full border-2"
                      style={{
                        width: 26,
                        height: 26,
                        borderColor: selected ? 'var(--onb-pp)' : 'var(--onb-line)',
                        background: selected ? 'var(--onb-pp)' : '#fff',
                        boxShadow: selected ? 'inset 0 0 0 4px #fff' : undefined,
                      }}
                    />
                  </div>
                }
              />
            )
          })}
        </OptionGroup>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 10bis — Ton avatar (le blason de joueur), ajouté le 16/09/2026
//
// Treize blasons peints (lib/portraits.ts), un seul à choisir. L'écran vient
// JUSTE APRÈS le mini-quiz et JUSTE AVANT le compte : l'élève vient de jouer,
// il se donne un visage, puis il l'enregistre. Le choix voyage dans le brouillon
// (`answers.avatar`) jusqu'au metadata d'inscription.
//
// Le blason retenu s'affiche en grand au-dessus de la grille — c'est lui qu'on
// retrouvera sur la carte de l'onglet Moi, à la même taille. Pas de nom sous
// les vignettes : un visage se reconnaît, il ne se lit pas.
// ---------------------------------------------------------------------------
function PortraitCell({
  portrait,
  index,
  selected,
  onPick,
}: {
  portrait: PortraitKey
  index: number
  selected: boolean
  onPick: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`Blason ${index + 1}`}
      onClick={() => {
        onPress()
        onPick()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'onb-card relative w-[calc(25%-9px)] p-1.5',
        selected && 'onb-card-on',
        pop && 'onb-pop',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portraitSrc(portrait)}
        alt=""
        width={384}
        height={384}
        loading="lazy"
        className="block aspect-square w-full object-contain"
      />
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full text-white"
          style={{ background: 'var(--onb-pp)', boxShadow: '0 2px 0 var(--onb-ppd)' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3.2">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </button>
  )
}

export function AvatarStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (portrait: PortraitKey) => void
}) {
  const chosen = answers.avatar
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Choisis ton avatar"
        subtitle="C’est lui qui te représentera face à tes rivaux. Tu pourras le changer au vestiaire."
      />

      {/* Le blason retenu, en grand — la place qu'il aura sur la carte Moi. */}
      <div className="flex justify-center pt-5 pb-4" aria-live="polite">
        {chosen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={chosen}
            src={portraitSrc(chosen)}
            alt={`Blason ${PORTRAIT_KEYS.indexOf(chosen) + 1}, choisi`}
            width={384}
            height={384}
            className="onb-pop size-[132px] object-contain drop-shadow-[0_10px_18px_rgba(60,30,120,0.28)]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-[132px] items-center justify-center rounded-[28px] border-2 border-dashed text-[44px] font-extrabold"
            style={{ borderColor: 'var(--onb-line)', color: 'var(--onb-mut)' }}
          >
            ?
          </span>
        )}
      </div>

      <OptionGroup label="Ton avatar" className="flex flex-wrap justify-center gap-3">
        {PORTRAIT_KEYS.map((p, i) => (
          <PortraitCell
            key={p}
            portrait={p}
            index={i}
            selected={chosen === p}
            onPick={() => onPick(p)}
          />
        ))}
      </OptionGroup>
    </div>
  )
}
