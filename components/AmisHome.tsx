'use client'

import { useState, useSyncExternalStore, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Radio,
  Swords,
  Trophy,
  Crown,
  Zap,
  Plus,
  Copy,
  Check,
  UserPlus,
  ArrowRight,
  School,
  Hourglass,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { formatHours } from '@/lib/time'
import {
  type Friend,
  type LiveSession,
  type Duel,
  type SchoolBoard,
  type PendingRequest,
  sinceLabel,
  schoolTotalSeconds,
  duelMissionAvailable,
  DUEL_XP_BONUS,
  DUEL_DAY_STORAGE_KEY,
} from '@/lib/social'
import { addFriendByCode, acceptFriend, removeFriend } from '@/app/amis/actions'
import {
  arenaFor,
  rankPlayers,
  rivalAhead,
  type RankPlayer,
} from '@/lib/trophies'

// En-tête de section : petite étiquette icône + titre, cohérente partout.
function SectionTitle({
  icon: Icon,
  children,
  aside,
}: {
  icon: typeof Radio
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="font-heading flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-4 text-primary" strokeWidth={2.4} />
        {children}
      </h2>
      {aside}
    </div>
  )
}

function Avatar({ emoji, size = 'md' }: { emoji: string; size?: 'md' | 'lg' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-muted',
        size === 'lg' ? 'size-11 text-2xl' : 'size-9 text-xl',
      )}
    >
      {emoji}
    </span>
  )
}

// -------------------------------------------------------------- Mission duel
// LA mission bonus du jour : défier un ami sur sa matière prioritaire.
// Une seule par jour, non renouvelable — c'est le cœur de l'onglet.

// Le localStorage est un « store externe » : on le lit via useSyncExternalStore
// (null côté serveur, la vraie valeur après hydratation — sans mismatch).
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}
const readDuelDay = () => localStorage.getItem(DUEL_DAY_STORAGE_KEY)

function DuelMissionCard({
  friends,
  subject,
  topic,
  todayKey,
}: {
  friends: Friend[]
  subject: string
  topic: string
  todayKey: string
}) {
  const router = useRouter()
  const [picked, setPicked] = useState<Friend | null>(null)
  const [launched, setLaunched] = useState(false)
  const rawDuel = useSyncExternalStore(subscribeStorage, readDuelDay, () => null)

  // Mission déjà lancée aujourd'hui ? (mock localStorage — demain : table duels)
  let doneAgainst: string | null = null
  if (rawDuel) {
    try {
      const stored = JSON.parse(rawDuel) as { day?: string; opponent?: string }
      if (!duelMissionAvailable(stored.day ?? null, todayKey)) {
        doneAgainst = stored.opponent ?? 'un ami'
      }
    } catch {
      /* valeur corrompue : mission disponible */
    }
  }

  const launch = () => {
    if (!picked) return
    sfx.correct()
    setLaunched(true)
    try {
      localStorage.setItem(
        DUEL_DAY_STORAGE_KEY,
        JSON.stringify({ day: todayKey, opponent: picked.name }),
      )
    } catch {
      /* tant pis : la mission redeviendra disponible au refresh */
    }
    // Le duel se joue sur le Défi du jour — même contenu, deux joueurs.
    setTimeout(() => router.push('/defi'), 400)
  }

  const done = doneAgainst !== null

  return (
    <section
      aria-label="Mission du jour"
      className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
          <Swords className="size-4 text-highlight" strokeWidth={2.4} />
          Mission du jour
        </p>
        <span className="flex items-center gap-1 rounded-full bg-highlight px-2.5 py-1 font-mono text-xs font-bold text-foreground tabular-nums">
          <Zap className="size-3.5" />+{DUEL_XP_BONUS} XP
        </span>
      </div>

      {done ? (
        <>
          <h2 className="font-heading text-xl font-bold">
            Défi lancé contre {doneAgainst} <Check className="inline size-5 text-highlight" />
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/75">
            Résultat dès qu&apos;il aura joué. Une seule mission par jour —
            reviens demain pour la prochaine.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-heading text-xl font-bold">
            Défie un ami en {subject}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/75">
            {topic} — ta priorité du moment. Montre-lui qui a le plus gros
            cerveau 🧠
          </p>

          {/* Choix de l'adversaire : une rangée d'avatars, un tap. */}
          <ul
            aria-label="Choisir un adversaire"
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
          >
            {friends.map((f) => {
              const isPicked = picked?.id === f.id
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-pressed={isPicked}
                    onClick={() => {
                      sfx.tap()
                      setPicked(f)
                    }}
                    className={cn(
                      'flex w-16 flex-col items-center gap-1 rounded-2xl p-2 transition-all',
                      isPicked
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary-foreground/10 hover:bg-primary-foreground/20',
                    )}
                  >
                    <span aria-hidden="true" className="text-2xl">
                      {f.emoji}
                    </span>
                    <span className="max-w-full truncate text-xs font-semibold">
                      {f.name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <Button
            size="lg"
            variant="secondary"
            className="mt-3 w-full rounded-full font-bold"
            disabled={!picked || launched}
            onClick={launch}
          >
            {launched ? (
              <>
                <Check className="size-4" /> C&apos;est parti !
              </>
            ) : picked ? (
              <>
                <Swords className="size-4" /> Défier {picked.name}
              </>
            ) : (
              'Choisis ton adversaire'
            )}
          </Button>
        </>
      )}
    </section>
  )
}

// -------------------------------------------------------------------- En direct
function LiveRow({ session }: { session: LiveSession }) {
  const router = useRouter()
  const [joined, setJoined] = useState(false)

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <div className="relative">
        <Avatar emoji={session.friend.emoji} size="lg" />
        <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-card bg-green-500">
          <span className="absolute size-full animate-ping rounded-full bg-green-500/70" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {session.friend.name}{' '}
          <span className="font-normal text-muted-foreground">
            {session.activity}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {session.subject} · {sinceLabel(session.minutes)}
        </p>
      </div>
      <Button
        size="sm"
        variant={joined ? 'outline' : 'default'}
        className="rounded-full"
        onClick={() => {
          sfx.flip()
          setJoined(true)
          // Rejoindre = démarrer une session en même temps que l'ami.
          setTimeout(() => router.push('/defi'), 350)
        }}
      >
        {joined ? (
          <>
            <Check className="size-4" /> En route
          </>
        ) : (
          'Rejoindre'
        )}
      </Button>
    </li>
  )
}

// ------------------------------------------------------------------------ Duels
function DuelRow({ duel }: { duel: Duel }) {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)

  const badge = {
    incoming: { label: 'Te défie', cls: 'bg-highlight/20 text-foreground' },
    outgoing: { label: 'En attente', cls: 'bg-muted text-muted-foreground' },
    won: { label: 'Gagné', cls: 'bg-green-600/15 text-green-700 dark:text-green-400' },
    lost: { label: 'Perdu', cls: 'bg-destructive/10 text-destructive' },
    tie: { label: 'Égalité', cls: 'bg-muted text-muted-foreground' },
  }[duel.status]

  const score =
    duel.myScore !== null || duel.theirScore !== null
      ? `${duel.myScore ?? '–'} / ${duel.theirScore ?? '–'}`
      : null

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <Avatar emoji={duel.opponent.emoji} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{duel.opponent.name}</p>
        <p className="truncate text-xs text-muted-foreground">{duel.subject}</p>
      </div>

      {score ? (
        <span className="font-mono text-sm font-bold tabular-nums">{score}</span>
      ) : null}

      {duel.status === 'incoming' ? (
        <Button
          size="sm"
          className="rounded-full"
          disabled={accepted}
          onClick={() => {
            sfx.correct()
            setAccepted(true)
            setTimeout(() => router.push('/defi'), 350)
          }}
        >
          {accepted ? <Check className="size-4" /> : 'Relever'}
        </Button>
      ) : (
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            badge.cls,
          )}
        >
          {badge.label}
        </span>
      )}
    </li>
  )
}

// ------------------------------------------------------------------- Classement
// Le VRAI classement aux trophées (mode classé du Défi) : moi + mes amis,
// triés par trophées. Chaque joueur porte l'emoji de son arène courante.
function RankingBoard({ players }: { players: RankPlayer[] }) {
  const rows = rankPlayers(players)
  return (
    <ol className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
      {rows.map((e) => {
        const rank = e.rank
        const arena = arenaFor(e.trophies)
        return (
          <li
            key={e.id}
            className={cn(
              'flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0',
              e.isMe && 'bg-accent/40',
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums',
                rank === 1 && 'bg-highlight text-foreground',
                rank === 2 && 'bg-muted-foreground/25',
                rank === 3 && 'bg-accent text-accent-foreground',
                rank > 3 && 'text-muted-foreground',
              )}
            >
              {rank}
            </span>
            <Avatar emoji={e.emoji} />
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  'flex items-center gap-1 truncate text-sm',
                  e.isMe ? 'font-bold' : 'font-medium',
                )}
              >
                {e.name}
                {rank === 1 ? (
                  <Crown className="inline size-3.5 text-highlight" aria-hidden="true" />
                ) : null}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {arena.emoji} {arena.name}
              </span>
            </span>
            <span className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
              {e.trophies}
              <Trophy className="size-3.5 text-highlight" aria-hidden="true" />
            </span>
          </li>
        )
      })}
    </ol>
  )
}

// ---------------------------------------------------------------------- École
// Les heures de chaque élève s'additionnent pour son école ; le classement
// interne départage les élèves au temps de travail réel.
function SchoolSection({ school }: { school: SchoolBoard }) {
  const total = schoolTotalSeconds(school.mates)
  const myRank = school.mates.findIndex((m) => m.isMe) + 1

  return (
    <section>
      <SectionTitle icon={School}>Ton collège</SectionTitle>

      {/* Cagnotte d'heures : l'effort de chacun compte pour tous. */}
      <div className="rounded-t-2xl bg-primary p-4 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            {school.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading truncate text-lg font-bold">
              {school.name}
            </p>
            <p className="text-sm text-primary-foreground/75">
              {myRank > 0 ? `Tu es ${myRank === 1 ? '1er' : `${myRank}e`} · ` : ''}
              chaque minute que tu travailles compte pour ton collège
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-lg font-bold tabular-nums">
            <Hourglass className="size-4 text-highlight" />
            {formatHours(total)}
          </span>
        </div>
      </div>

      {/* Classement inter-élèves, au temps de travail. */}
      <ol className="overflow-hidden rounded-b-2xl bg-card ring-1 ring-foreground/10">
        {school.mates.map((m, i) => {
          const rank = i + 1
          return (
            <li
              key={m.id}
              className={cn(
                'flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0',
                m.isMe && 'bg-accent/40',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums',
                  rank === 1 && 'bg-highlight text-foreground',
                  rank === 2 && 'bg-muted-foreground/25',
                  rank === 3 && 'bg-accent text-accent-foreground',
                  rank > 3 && 'text-muted-foreground',
                )}
              >
                {rank}
              </span>
              <Avatar emoji={m.emoji} />
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-sm',
                  m.isMe ? 'font-bold' : 'font-medium',
                )}
              >
                {m.name}
                {rank === 1 ? (
                  <Crown className="ml-1 inline size-3.5 -translate-y-0.5 text-highlight" />
                ) : null}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {formatHours(m.seconds)}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Le temps est mesuré par le chrono de tes sessions — celui qui travaille
        le plus grimpe.
      </p>
    </section>
  )
}

// ------------------------------------------------------------- Demandes reçues
// Une demande d'ami à accepter ou refuser. Optimiste : la ligne se fige sur son
// issue dès l'action réussie, sans attendre le rechargement de la page.
function PendingRow({ request }: { request: PendingRequest }) {
  const [pending, start] = useTransition()
  const [done, setDone] = useState<'accepted' | 'refused' | null>(null)

  if (done === 'refused') return null

  if (done === 'accepted') {
    return (
      <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
        <Avatar emoji={request.emoji} />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
          {request.name}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-green-600/15 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
          <Check className="size-3.5" /> Ami ajouté
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <Avatar emoji={request.emoji} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {request.name}
        <span className="block text-xs font-normal text-muted-foreground">
          veut être ton ami
        </span>
      </span>
      <Button
        size="sm"
        className="rounded-full"
        disabled={pending}
        onClick={() => {
          sfx.correct()
          start(async () => {
            const res = await acceptFriend(request.id)
            if (res.ok) setDone('accepted')
          })
        }}
      >
        Accepter
      </Button>
      <button
        type="button"
        aria-label={`Refuser la demande de ${request.name}`}
        disabled={pending}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        onClick={() => {
          sfx.tap()
          start(async () => {
            const res = await removeFriend(request.id)
            if (res.ok) setDone('refused')
          })
        }}
      >
        <X className="size-4" />
      </button>
    </li>
  )
}

// ------------------------------------------------------------------------- Page
export default function AmisHome({
  live,
  duels,
  ranking,
  school,
  friends,
  pendingRequests,
  myFriendCode,
  prioritySubject,
  todayKey,
}: {
  live: LiveSession[]
  duels: Duel[]
  ranking: RankPlayer[]
  school: SchoolBoard
  friends: Friend[]
  pendingRequests: PendingRequest[]
  myFriendCode: string
  prioritySubject: { subject: string; topic: string }
  todayKey: string
}) {
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null,
  )
  const [isAdding, startAdding] = useTransition()
  // Classement réel aux trophées : ma place, mes trophées, mon arène, et le
  // rival juste devant (« +40 pour le doubler »).
  const rankedRows = rankPlayers(ranking)
  const meRow = rankedRows.find((e) => e.isMe)
  const myRank = meRow ? meRow.rank : 0
  const myTrophies = meRow?.trophies ?? 0
  const myArena = arenaFor(myTrophies)
  const ahead = rivalAhead(rankedRows)
  const friendCount = ranking.filter((e) => !e.isMe).length

  const copyCode = async () => {
    if (!myFriendCode) return
    try {
      await navigator.clipboard.writeText(myFriendCode)
      setCopied(true)
      sfx.tap()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard indisponible : on ignore silencieusement */
    }
  }

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    if (!value || isAdding) return
    sfx.tap()
    startAdding(async () => {
      const res = await addFriendByCode(value)
      setFeedback(res)
      if (res.ok) setCode('')
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* LA mission du jour : défier un ami. Central, récurrent, non skippable. */}
      <DuelMissionCard
        friends={friends}
        subject={prioritySubject.subject}
        topic={prioritySubject.topic}
        todayKey={todayKey}
      />

      {/* En direct — qui bosse là, maintenant. */}
      <section>
        <SectionTitle
          icon={Radio}
          aside={
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              {live.length} en ligne
            </span>
          }
        >
          En direct
        </SectionTitle>
        {live.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {live.map((s) => (
              <LiveRow key={s.friend.id} session={s} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            Personne en session pour l’instant. Lance-toi le premier 🔥
          </p>
        )}
      </section>

      {/* Duels — se défier sur un thème. */}
      <section>
        <SectionTitle
          icon={Swords}
          aside={
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => sfx.tap()}
            >
              <Plus className="size-4" /> Défier
            </Button>
          }
        >
          Duels
        </SectionTitle>
        <ul className="flex flex-col gap-2">
          {duels.map((d) => (
            <DuelRow key={d.id} duel={d} />
          ))}
        </ul>
      </section>

      {/* Le Classement — aux trophées, en temps réel (mode classé du Défi). */}
      <section>
        <SectionTitle
          icon={Trophy}
          aside={
            <Link
              href="/defi"
              onClick={() => sfx.tap()}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
            >
              <Swords className="size-3.5" /> Match classé
            </Link>
          }
        >
          Classement
        </SectionTitle>
        {/* Résumé : ta place, ton arène, et l'objectif juste devant. */}
        <div className="mb-2 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-3xl">
              {myArena.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold">
                {friendCount > 0
                  ? myRank === 1
                    ? `1er sur ${friendCount + 1} — tu domines 👑`
                    : `${myRank}e sur ${friendCount + 1} amis`
                  : myArena.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {ahead
                  ? `${ahead.trophies - myTrophies} trophées pour doubler ${ahead.name}`
                  : `Arène ${myArena.name}`}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 font-mono font-bold tabular-nums">
              {myTrophies}
              <Trophy className="size-4 text-highlight" />
            </span>
          </div>
        </div>
        <RankingBoard players={ranking} />
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          Gagne des matchs classés dans le Défi pour grimper — chaque victoire
          rapporte des trophées.
        </p>
      </section>

      {/* Demandes reçues — à accepter ou refuser. Masqué s'il n'y en a pas. */}
      {pendingRequests.length > 0 ? (
        <section>
          <SectionTitle
            icon={UserPlus}
            aside={
              <span className="rounded-full bg-highlight px-2.5 py-0.5 font-mono text-xs font-bold text-foreground tabular-nums">
                {pendingRequests.length}
              </span>
            }
          >
            Demandes reçues
          </SectionTitle>
          <ul className="flex flex-col gap-2">
            {pendingRequests.map((r) => (
              <PendingRow key={r.id} request={r} />
            ))}
          </ul>
        </section>
      ) : null}

      {/* Ton collège — la cagnotte d'heures et le classement interne. */}
      <SchoolSection school={school} />

      {/* Ajouter un ami. */}
      <section className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <SectionTitle icon={UserPlus}>Ajouter un ami</SectionTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Partage ton code, ou entre celui d’un pote.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            disabled={!myFriendCode}
            aria-label={
              myFriendCode ? `Copier ton code ${myFriendCode}` : 'Code indisponible'
            }
            className="flex flex-1 items-center justify-between gap-2 rounded-full border bg-muted/50 px-4 py-2 font-mono text-sm font-bold transition-colors hover:bg-muted disabled:opacity-60"
          >
            {myFriendCode || '——————'}
            {copied ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <Copy className="size-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <form className="mt-2 flex items-center gap-2" onSubmit={submitCode}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              if (feedback) setFeedback(null)
            }}
            maxLength={10}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="Code d’un ami…"
            aria-label="Entrer le code d’un ami"
            className="h-10 flex-1 rounded-full border bg-card px-4 font-mono text-sm tracking-wide uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
          />
          <Button
            type="submit"
            className="rounded-full"
            disabled={isAdding || code.trim().length === 0}
          >
            {isAdding ? (
              'Envoi…'
            ) : (
              <>
                Ajouter <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className={cn(
              'mt-2 px-1 text-sm font-medium',
              feedback.ok ? 'text-green-700 dark:text-green-400' : 'text-destructive',
            )}
          >
            {feedback.message}
          </p>
        ) : null}
      </section>
    </div>
  )
}
