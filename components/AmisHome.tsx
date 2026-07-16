'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Radio,
  Swords,
  Trophy,
  Crown,
  Zap,
  Copy,
  Check,
  UserPlus,
  ArrowRight,
  School,
  Hourglass,
  Flame,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendQrButton from '@/components/FriendQrButton'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { formatHours } from '@/lib/time'
import {
  type Friend,
  type LiveSession,
  type Duel,
  type SchoolBoard,
  type PendingRequest,
  type StreakEntry,
  sinceLabel,
  schoolNoun,
  schoolTotalSeconds,
  DUEL_XP_BONUS,
  ACTIVE_DUEL_KEY,
} from '@/lib/social'
import {
  addFriendByCode,
  acceptFriend,
  removeFriend,
  createDuel,
} from '@/app/amis/actions'
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

// Pastille « Aperçu » : signale une section en données de démonstration, même
// wording que le Tournoi des écoles du Défi. Jamais de mock sans ce badge.
function DemoBadge() {
  return (
    <span className="rounded-full bg-highlight/25 px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
      Aperçu
    </span>
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
// LA mission bonus du jour : défier un ami sur le Défi du jour (même quiz pour
// les deux joueurs — on annonce exactement ce qui sera joué, pas une matière
// fictive). Une seule par jour, non renouvelable — c'est le cœur de l'onglet.
// Le duel est réel : create_duel persiste le défi (1/jour garanti côté SQL),
// et l'id du duel est retenu pour que le Défi dépose le score à la fin.
function DuelMissionCard({
  friends,
  doneAgainst,
}: {
  friends: Friend[]
  doneAgainst: string | null
}) {
  const router = useRouter()
  const [picked, setPicked] = useState<Friend | null>(null)
  const [launching, startLaunch] = useTransition()

  const launch = () => {
    if (!picked || launching) return
    sfx.correct()
    startLaunch(async () => {
      const res = await createDuel(picked.id, 'Défi du jour')
      if (res.id) {
        // Le duel se joue sur le Défi du jour — même contenu, deux joueurs.
        try {
          sessionStorage.setItem(ACTIVE_DUEL_KEY, res.id)
        } catch {
          /* sessionStorage indispo : le score ne sera pas déposé, tant pis */
        }
        router.push('/defi')
      }
      // res.id null (déjà lancé aujourd'hui / plus ami) : revalidatePath
      // rafraîchit l'état « mission faite » sans nous faire quitter la page.
    })
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
            Défie un ami sur le Défi du jour
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/75">
            Le même quiz pour vous deux, le meilleur score gagne. Montre-lui
            qui a le plus gros cerveau 🧠
          </p>

          {/* Choix de l'adversaire : une rangée d'avatars, un tap. */}
          {friends.length > 0 ? (
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
          ) : (
            <p className="mt-3 rounded-2xl bg-primary-foreground/10 p-3 text-sm text-primary-foreground/80">
              Ajoute un ami plus bas pour pouvoir le défier 👇
            </p>
          )}

          <Button
            size="lg"
            variant="secondary"
            className="mt-3 w-full rounded-full font-bold"
            disabled={!picked || launching}
            onClick={launch}
          >
            {launching ? (
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
          // « Bosser aussi » = démarrer sa propre session pendant que l'ami
          // travaille (on ne rejoint pas SA partie — ne pas surpromettre).
          setTimeout(() => router.push('/defi'), 350)
        }}
      >
        {joined ? (
          <>
            <Check className="size-4" /> En route
          </>
        ) : (
          'Bosser aussi'
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
            // Relever = jouer le Défi du jour ; on retient l'id du duel pour
            // que la fin de partie y dépose mon score.
            try {
              sessionStorage.setItem(ACTIVE_DUEL_KEY, duel.id)
            } catch {
              /* sessionStorage indispo : le score ne sera pas déposé */
            }
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

// --------------------------------------------------------------------- Séries
// Le classement des séries : voir où en sont ses amis (jours consécutifs de
// travail) et se comparer. La flamme est LA récompense de régularité — c'est ce
// qui pousse à ne pas lâcher le premier. Moi + amis, triés séries décroissantes.
function StreakSection({ streaks }: { streaks: StreakEntry[] }) {
  const meIndex = streaks.findIndex((e) => e.isMe)
  const top = streaks[0]
  // « X jours d'avance » sur celui juste derrière moi, ou « rattrape untel »
  // s'il y a quelqu'un devant : un objectif concret par-dessus le classement.
  const ahead = meIndex > 0 ? streaks[meIndex - 1] : null
  const me = meIndex >= 0 ? streaks[meIndex] : null
  const gap = ahead && me ? ahead.streak - me.streak : 0

  return (
    <section>
      <SectionTitle
        icon={Flame}
        aside={
          top && top.streak > 0 ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Crown className="size-3.5 text-highlight" />
              {top.name} · {top.streak} j
            </span>
          ) : undefined
        }
      >
        Séries en cours
      </SectionTitle>

      {ahead && me && gap > 0 ? (
        <p className="mb-2 rounded-2xl bg-primary p-3 text-sm font-medium text-primary-foreground">
          {gap} jour{gap > 1 ? 's' : ''} pour rattraper {ahead.name} — tiens ta
          série aujourd&apos;hui 🔥
        </p>
      ) : me && meIndex === 0 && me.streak > 0 ? (
        <p className="mb-2 rounded-2xl bg-primary p-3 text-sm font-medium text-primary-foreground">
          Tu as la plus longue série du groupe — ne la casse pas 👑🔥
        </p>
      ) : null}

      <ol className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
        {streaks.map((e, i) => {
          const rank = i + 1
          const cold = e.streak === 0
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
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-sm',
                  e.isMe ? 'font-bold' : 'font-medium',
                )}
              >
                {e.name}
              </span>
              <span
                className={cn(
                  'flex shrink-0 items-center gap-1 font-mono text-sm font-bold tabular-nums',
                  cold ? 'text-muted-foreground' : 'text-orange-500',
                )}
              >
                <Flame
                  className={cn('size-4', cold && 'opacity-40')}
                  strokeWidth={2.4}
                />
                {e.streak}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Une série = des jours de suite où tu travailles. Reviens chaque jour pour
        garder ta flamme allumée.
      </p>
    </section>
  )
}

// ---------------------------------------------------------------------- École
// Les heures de chaque élève s'additionnent pour son école ; le classement
// interne départage les élèves au temps de travail réel. Le titre suit le
// cycle de l'élève (« Ton collège » / « Ton lycée »), jamais codé en dur.
function SchoolSection({ school, demo }: { school: SchoolBoard; demo: boolean }) {
  const total = schoolTotalSeconds(school.mates)
  const myRank = school.mates.findIndex((m) => m.isMe) + 1
  const noun = schoolNoun(school.level)

  return (
    <section>
      <SectionTitle icon={School} aside={demo ? <DemoBadge /> : undefined}>
        Ton {noun}
      </SectionTitle>

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
              chaque minute que tu travailles compte pour ton {noun}
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
        {demo
          ? `Exemple de classement — choisis ton ${noun} dans ton profil pour voir le vrai.`
          : 'Le temps est mesuré par le chrono de tes sessions — celui qui travaille le plus grimpe.'}
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
  liveDemo,
  duels,
  ranking,
  streaks,
  school,
  schoolDemo,
  friends,
  pendingRequests,
  myFriendCode,
  missionDoneAgainst,
}: {
  live: LiveSession[]
  // true = données d'exemple (visiteur / élève sans établissement) : l'UI le
  // signale avec la pastille « Aperçu » au lieu de les faire passer pour vraies.
  liveDemo: boolean
  duels: Duel[]
  ranking: RankPlayer[]
  streaks: StreakEntry[]
  school: SchoolBoard
  schoolDemo: boolean
  friends: Friend[]
  pendingRequests: PendingRequest[]
  myFriendCode: string
  missionDoneAgainst: string | null
}) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
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
      setCopyFailed(false)
      setCopied(true)
      sfx.tap()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission…) :
      // on le dit au lieu de laisser un tap sans effet.
      setCopyFailed(true)
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
      <DuelMissionCard friends={friends} doneAgainst={missionDoneAgainst} />

      {/* En direct — qui bosse là, maintenant. En démo (visiteur), la pastille
          « Aperçu » remplace le compteur « en ligne » : pas de faux amis. */}
      <section>
        <SectionTitle
          icon={Radio}
          aside={
            liveDemo ? (
              <DemoBadge />
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <span className="size-2 animate-pulse rounded-full bg-green-500" />
                {live.length} en ligne
              </span>
            )
          }
        >
          En direct
        </SectionTitle>
        {live.length > 0 ? (
          <>
            <ul className="flex flex-col gap-2">
              {live.map((s) => (
                <LiveRow key={s.friend.id} session={s} />
              ))}
            </ul>
            {liveDemo ? (
              <p className="mt-2 px-1 text-[11px] text-muted-foreground">
                Exemple — connecte-toi pour voir tes vrais amis en session.
              </p>
            ) : null}
          </>
        ) : (
          <p className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            Personne en session pour l’instant. Lance-toi le premier 🔥
          </p>
        )}
      </section>

      {/* Duels — l'historique réel : reçus (à relever), envoyés, résultats. */}
      <section>
        <SectionTitle icon={Swords}>Duels</SectionTitle>
        {duels.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {duels.map((d) => (
              <DuelRow key={d.id} duel={d} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            Aucun duel pour l’instant. Défie un ami avec la mission du jour
            ci-dessus ⚔️
          </p>
        )}
      </section>

      {/* Séries — qui tient sa flamme le plus longtemps. Masqué sans ami. */}
      {friends.length > 0 ? <StreakSection streaks={streaks} /> : null}

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
        {ranking.length === 0 ? (
          /* Visiteur : pas de classement à montrer — état vide explicite,
             cohérent avec « En direct » et « Duels ». */
          <p className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            Connecte-toi et ajoute des amis pour vous comparer aux trophées 🏆
          </p>
        ) : (
          <>
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
              {friendCount > 0
                ? 'Gagne des matchs classés dans le Défi pour grimper — chaque victoire rapporte des trophées.'
                : 'Ajoute des amis plus bas pour vous comparer — chaque match classé gagné rapporte des trophées.'}
            </p>
          </>
        )}
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

      {/* Ton collège / ton lycée — la cagnotte d'heures et le classement interne. */}
      <SchoolSection school={school} demo={schoolDemo} />

      {/* Ajouter un ami. */}
      <section className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <SectionTitle icon={UserPlus}>Ajouter un ami</SectionTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Fais scanner ton QR code : vous devenez amis direct. Par code, ton
          ami reçoit une demande à accepter.
        </p>
        {/* Mon QR à faire scanner — quiconque le scanne devient mon ami. */}
        {myFriendCode ? (
          <div className="mb-2">
            <FriendQrButton friendCode={myFriendCode} />
          </div>
        ) : null}
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
        {copyFailed ? (
          <p role="status" className="mt-1 px-1 text-xs text-destructive">
            Copie impossible sur cet appareil — recopie ton code à la main.
          </p>
        ) : null}
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
