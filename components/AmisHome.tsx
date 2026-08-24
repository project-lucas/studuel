'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Swords,
  Trophy,
  Crown,
  Zap,
  Check,
  ChevronDown,
  UserPlus,
  Users,
  School,
  Hourglass,
  Flame,
  X,
  Pencil,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendAddButton from '@/components/FriendAddButton'
import ParrainageCard from '@/components/ParrainageCard'
import SquadSection from '@/components/SquadSection'
import FriendStories from '@/components/amis/FriendStories'
import RivalCard from '@/components/amis/RivalCard'
import TeamChestCard from '@/components/amis/TeamChestCard'
import type { ReferralSummary } from '@/lib/gems'
import type { ClanWeekBoard } from '@/lib/clan-week'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { formatHours } from '@/lib/time'
import {
  type Friend,
  type SchoolBoard,
  type PendingRequest,
  type GeoScope,
  GEO_SCOPES,
  geoScopeLabel,
  geoScopeTitle,
  geoScopePossessive,
  getMockGeoBoard,
  schoolNoun,
  schoolTotalSeconds,
  SCHOOL_BOARD_LIMIT,
  DUEL_XP_BONUS,
  ACTIVE_DUEL_KEY,
} from '@/lib/social'
import {
  acceptFriend,
  removeFriend,
  createDuel,
  renameSquad,
} from '@/app/amis/actions'
import {
  rankPlayers,
  rivalAhead,
  type RankPlayer,
} from '@/lib/trophies'
import { rankFor } from '@/lib/rank'

// En-tête de section : petite étiquette icône + titre, cohérente partout.
function SectionTitle({
  icon: Icon,
  children,
  aside,
}: {
  icon: typeof Flame
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

// ------------------------------------------------------------------- Classement
// Le bouton ⚔️ de chaque ligne : défier CET ami sur le Défi du jour, avec le
// gain d'XP affiché à côté de l'épée. Mécanique réelle (create_duel, 1/jour
// garanti côté SQL) — si le défi du jour est déjà lancé, on le dit au lieu
// d'échouer en silence.
function ChallengeButton({
  friendId,
  name,
  onBlocked,
}: {
  friendId: string
  name: string
  onBlocked: () => void
}) {
  const router = useRouter()
  const [launching, startLaunch] = useTransition()

  return (
    <button
      type="button"
      aria-label={`Défier ${name} (+${DUEL_XP_BONUS} XP)`}
      disabled={launching}
      onClick={() => {
        sfx.correct()
        startLaunch(async () => {
          const res = await createDuel(friendId, 'Défi du jour')
          if (res.id) {
            // Le duel se joue sur le Défi du jour — on retient l'id pour que
            // la fin de partie y dépose mon score.
            try {
              sessionStorage.setItem(ACTIVE_DUEL_KEY, res.id)
            } catch {
              /* sessionStorage indispo : le score ne sera pas déposé */
            }
            router.push('/defi')
          } else {
            onBlocked()
          }
        })
      }}
      className="flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-primary px-2.5 text-primary-foreground shadow-sm transition active:scale-95 disabled:opacity-60"
    >
      {launching ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <>
          <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="flex items-center font-mono text-[11px] font-bold text-highlight tabular-nums"
          >
            <Zap className="size-3" />+{DUEL_XP_BONUS}
          </span>
        </>
      )}
    </button>
  )
}

// Le VRAI classement aux trophées (mode classé du Défi) : moi + mes amis,
// triés par trophées, en cartes empilées façon liste de clan Clash Royale.
// C'est LA barre d'amis unique : trophées, point vert « en ligne » sur
// l'avatar, et bouton ⚔️ (+XP) pour défier d'un tap.
function RankingBoard({
  players,
  onlineIds,
  onDuelBlocked,
}: {
  players: RankPlayer[]
  onlineIds: ReadonlySet<string>
  onDuelBlocked: () => void
}) {
  const rows = rankPlayers(players)
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((e) => {
        const rank = rankFor(e.trophies)
        const online = !e.isMe && onlineIds.has(e.id)
        return (
          <li
            key={e.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl bg-card p-2.5 pr-2.5 text-foreground shadow-sm ring-1 ring-black/5',
              e.isMe && 'ring-2 ring-highlight',
            )}
          >
            {/* Avatar carré encadré, comme la fiche d'un membre de clan.
                Point vert = ami en session en ce moment (RPC friends_live). */}
            <span className="relative shrink-0">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-xl bg-muted text-2xl ring-1 ring-foreground/10"
              >
                {e.emoji}
              </span>
              {online ? (
                <span
                  role="img"
                  aria-label="En ligne"
                  className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full border-2 border-card bg-green-500"
                >
                  <span className="absolute size-full animate-ping rounded-full bg-green-500/70" />
                </span>
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  'flex items-center gap-1 truncate text-sm',
                  e.isMe ? 'font-bold' : 'font-semibold',
                )}
              >
                {e.name}
                {e.rank === 1 ? (
                  <Crown
                    className="inline size-3.5 shrink-0 text-highlight"
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <span className="block truncate text-xs font-semibold text-primary">
                {rank.tier.emoji} {rank.label}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 font-mono text-sm font-bold tabular-nums">
              <Trophy className="size-4 text-highlight" aria-hidden="true" />
              {e.trophies}
            </span>
            {e.isMe ? null : (
              <ChallengeButton
                friendId={e.id}
                name={e.name}
                onBlocked={onDuelBlocked}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// Le titre du groupe d'amis (« squad ») : à la place de l'arène. Le n°1 du
// classement (celui qui a le plus grimpé) peut le renommer d'un tap ; les
// autres le voient en lecture seule, avec l'invitation à devenir n°1. Le nom est
// optimiste : il se fige dès l'action réussie, sans recharger la page.
const DEFAULT_SQUAD_NAME = 'Mon équipe'

function SquadHeader({
  squadName,
  canRename,
}: {
  squadName: string | null
  canRename: boolean
}) {
  const [name, setName] = useState(squadName)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(squadName ?? '')
  const [pending, start] = useTransition()

  const display = name ?? DEFAULT_SQUAD_NAME

  const submit = () => {
    if (pending) return
    sfx.tap()
    start(async () => {
      const res = await renameSquad(draft)
      if (res.ok) {
        setName(res.name)
        setEditing(false)
      }
    })
  }

  if (editing) {
    return (
      <div className="mb-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={40}
          autoFocus
          aria-label="Nom du groupe"
          placeholder="Nom de ton équipe…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="font-heading min-h-10 min-w-0 flex-1 rounded-full border border-primary/40 bg-white px-4 text-base font-extrabold text-foreground"
        />
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          aria-label="Valider le nom"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-90 disabled:opacity-50"
        >
          <Check className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setDraft(name ?? '')
            setEditing(false)
          }}
          aria-label="Annuler"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:scale-90"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-highlight/25 text-xl"
      >
        🛡️
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Ton équipe
        </p>
        <h2 className="font-heading truncate text-lg font-extrabold text-foreground">
          {display}
        </h2>
      </div>
      {canRename ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setDraft(name ?? '')
            setEditing(true)
          }}
          aria-label="Renommer le groupe"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 active:scale-90"
        >
          <Pencil className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      ) : (
        <span
          className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"
          title="Le n°1 du groupe peut le renommer"
        >
          <Lock className="size-3" aria-hidden="true" /> N°1 seulement
        </span>
      )}
    </div>
  )
}

// L'écran d'accueil de l'onglet, façon liste de clan Clash Royale : on arrive
// du swipe depuis Réviser DIRECTEMENT sur le classement entre amis — panneau
// violet profond de l'arène, cartes empilées avec un bouton ⚔️ par ami, et
// « Ajouter un ami » en action du bas.
function ClassementArena({
  ranking,
  onlineFriendIds,
  myFriendCode,
  squadName,
  canRenameSquad,
}: {
  ranking: RankPlayer[]
  onlineFriendIds: string[]
  myFriendCode: string
  squadName: string | null
  canRenameSquad: boolean
}) {
  // Défi refusé (1/jour déjà lancé, ou plus ami) : message sous la liste.
  const [duelNotice, setDuelNotice] = useState(false)
  const rows = rankPlayers(ranking)
  const meRow = rows.find((e) => e.isMe)
  const myRank = meRow?.rank ?? 0
  const myTrophies = meRow?.trophies ?? 0
  const myRankTier = rankFor(myTrophies)
  const ahead = rivalAhead(rows)
  const friendCount = ranking.filter((e) => !e.isMe).length
  const onlineIds = new Set(onlineFriendIds)
  const onlineCount = ranking.filter(
    (e) => !e.isMe && onlineIds.has(e.id),
  ).length

  return (
    <section
      aria-label="Mes amis"
      className="overflow-hidden rounded-3xl bg-card p-3 text-foreground shadow-sm ring-1 ring-black/5"
    >
      {/* Le titre du groupe (renommable par le n°1) — remplace l'arène comme
          identité du cercle d'amis. */}
      <SquadHeader squadName={squadName} canRename={canRenameSquad} />

      {/* Compteur discret : amis en ligne / nombre de joueurs. */}
      {onlineCount > 0 ? (
        <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold text-green-600">
          <span className="size-2 animate-pulse rounded-full bg-green-500" />
          {onlineCount} en ligne
        </p>
      ) : friendCount > 0 ? (
        <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground">
          <Users className="size-3.5 text-primary" aria-hidden="true" />
          {friendCount + 1} joueurs
        </p>
      ) : null}

      {ranking.length === 0 ? (
        /* Visiteur : pas de classement à montrer — état vide explicite. */
        <p className="rounded-2xl bg-muted/50 p-3 text-sm text-foreground/80">
          Connecte-toi et ajoute des amis pour vous comparer aux trophées 🏆
        </p>
      ) : (
        <>
          {/* Résumé : ta place, ton palier, et l'objectif juste devant. */}
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
            <span aria-hidden="true" className="text-3xl">
              {myRankTier.tier.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-foreground">
                {friendCount > 0
                  ? myRank === 1
                    ? `1er sur ${friendCount + 1} — tu domines 👑`
                    : `${myRank}e sur ${friendCount + 1} amis`
                  : 'En solo pour l’instant'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {ahead
                  ? `${ahead.trophies - myTrophies} trophées pour doubler ${ahead.name}`
                  : friendCount > 0
                    ? `${myRankTier.label} · ${myTrophies} 🏆`
                    : 'Ajoute des amis pour vous comparer'}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 font-mono font-bold text-foreground tabular-nums">
              {myTrophies}
              <Trophy className="size-4 text-highlight" aria-hidden="true" />
            </span>
          </div>
          <RankingBoard
            players={ranking}
            onlineIds={onlineIds}
            onDuelBlocked={() => setDuelNotice(true)}
          />
          {duelNotice ? (
            <p
              role="status"
              className="mt-2 rounded-2xl bg-muted/60 p-2.5 text-xs font-medium text-foreground/80"
            >
              Ton défi du jour est déjà lancé — une seule mission par jour,
              reviens demain ⚔️
            </p>
          ) : null}
        </>
      )}

      {/* L'action du bas, comme sous la liste de clan. */}
      <div className="mt-3">
        <FriendAddButton variant="cta" myFriendCode={myFriendCode} />
      </div>
      <p className="mt-2 px-1 pb-1 text-[11px] text-muted-foreground">
        {friendCount > 0
          ? `Tape l’épée d’un ami pour le défier sur le Défi du jour (+${DUEL_XP_BONUS} XP) — le point vert signale un ami en session.`
          : 'Ajoute des amis pour vous comparer — chaque match classé gagné rapporte des trophées.'}
      </p>
    </section>
  )
}

// ------------------------------------------------------- Classement géographique
// Les heures de chaque élève s'additionnent pour son échelon ; le classement
// interne départage les élèves au temps de travail réel. Un sélecteur d'échelon
// (Lycée/Collège → Département → Région → National, cf. docs/CADRAGE-GEO.md)
// laisse l'élève voir où il se situe à chaque échelle. L'établissement affiche
// les vraies données quand elles existent ; les échelons plus larges sont un
// aperçu tant que le back-end géo (code postal + RPC) n'est pas branché.

// La cagnotte + le classement d'un échelon donné. Extrait pour être réutilisé à
// l'identique par chaque onglet du sélecteur.
function ScopeBoard({
  board,
  scope,
  demo,
}: {
  board: SchoolBoard
  scope: GeoScope
  demo: boolean
}) {
  const total = schoolTotalSeconds(board.mates)
  const myRank = board.mates.findIndex((m) => m.isMe) + 1
  const noun = schoolNoun(board.level)
  const possessive = geoScopePossessive(scope, board.level)
  // Établissement réel : la RPC plafonne à 50 élèves — on le dit. Les aperçus
  // d'échelons larges ne sont jamais plafonnés (données de démonstration).
  const capped =
    scope === 'school' && !demo && board.mates.length >= SCHOOL_BOARD_LIMIT

  return (
    <>
      {/* Cagnotte d'heures : l'effort de chacun compte pour tout l'échelon. */}
      <div className="rounded-t-2xl bg-primary p-4 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            {board.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading truncate text-lg font-bold">
              {board.name}
            </p>
            <p className="text-sm text-primary-foreground/75">
              {myRank > 0 ? `Tu es ${myRank === 1 ? '1er' : `${myRank}e`} · ` : ''}
              {capped
                ? `les heures des ${SCHOOL_BOARD_LIMIT} plus actifs de ton ${noun}`
                : `chaque minute que tu travailles compte pour ${possessive}`}
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
        {board.mates.map((m, i) => {
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
        {scope === 'school'
          ? demo
            ? `Exemple de classement — choisis ton ${noun} dans ton profil pour voir le vrai.`
            : 'Le temps est mesuré par le chrono de tes sessions — celui qui travaille le plus grimpe.'
          : `Aperçu — ton classement au niveau ${geoScopeLabel(scope, board.level).toLowerCase()} arrivera avec ton code postal.`}
      </p>
    </>
  )
}

function GeoRankingSection({
  school,
  schoolDemo,
}: {
  school: SchoolBoard
  schoolDemo: boolean
}) {
  const [scope, setScope] = useState<GeoScope>('school')
  // Replié par défaut : le podium + ta ligne suffisent au quotidien — la liste
  // complète (et sa cagnotte) se déplie à la demande.
  const [expanded, setExpanded] = useState(false)
  // Mon temps réel, lu depuis l'établissement : il replace « Toi » au bon rang
  // dans les aperçus d'échelons plus larges.
  const mySeconds = school.mates.find((m) => m.isMe)?.seconds ?? 0

  // Établissement : vraies données si dispo. Échelons plus larges : aperçu
  // (« Aperçu ») tant que le back-end géo n'est pas branché.
  const board =
    scope === 'school'
      ? school
      : getMockGeoBoard(scope, mySeconds, school.level)
  const demo = scope === 'school' ? schoolDemo : true

  // Le podium (1er au centre, 2e à gauche, 3e à droite) + ma ligne.
  const podium = board.mates.slice(0, 3)
  const ordered = [podium[1], podium[0], podium[2]].filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  )
  const myIndex = board.mates.findIndex((m) => m.isMe)
  const me = myIndex >= 0 ? board.mates[myIndex] : null

  return (
    <section>
      <SectionTitle
        icon={School}
        aside={
          <span className="flex items-center gap-2">
            {demo ? <DemoBadge /> : null}
            {/* Portée unique « Collège ▾ » : un seul sélecteur discret au lieu
                de quatre onglets pour un aperçu. */}
            <label className="relative">
              <span className="sr-only">Échelle du classement</span>
              <select
                value={scope}
                onChange={(e) => {
                  sfx.tap()
                  setScope(e.target.value as GeoScope)
                }}
                className="cursor-pointer appearance-none rounded-full bg-white py-1 pr-7 pl-3 text-xs font-bold text-primary shadow-sm ring-1 ring-black/5"
              >
                {GEO_SCOPES.map((s) => (
                  <option key={s} value={s}>
                    {geoScopeLabel(s, school.level)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-primary"
                aria-hidden="true"
              />
            </label>
          </span>
        }
      >
        {board.name.length > 0 ? board.name : geoScopeTitle(scope, school.level)}
      </SectionTitle>

      {expanded ? (
        <ScopeBoard board={board} scope={scope} demo={demo} />
      ) : (
        <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
          {/* Le podium : trois marches, le 1er au centre et plus grand. */}
          <div className="flex items-end justify-center gap-5">
            {ordered.map((m) => {
              const rank = board.mates.indexOf(m) + 1
              const first = rank === 1
              return (
                <div key={m.id} className="flex flex-col items-center gap-1">
                  <span
                    aria-hidden="true"
                    className={cn(first ? 'text-4xl' : 'text-2xl')}
                  >
                    {m.emoji}
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums',
                      first
                        ? 'bg-highlight/40 text-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {rank === 1 ? '1ᵉʳ' : `${rank}ᵉ`} · {formatHours(m.seconds)}
                  </span>
                  <span className="max-w-20 truncate text-[11px] font-semibold text-muted-foreground">
                    {m.name}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Ma ligne, toujours visible — c'est elle qu'on vient vérifier. */}
          {me ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-accent/40 px-3 py-2.5">
              <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-muted-foreground tabular-nums">
                {myIndex + 1}
              </span>
              <Avatar emoji={me.emoji} />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">
                Toi
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {formatHours(me.seconds)}
              </span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setExpanded(true)
            }}
            className="mt-2 w-full cursor-pointer rounded-full py-1.5 text-center text-xs font-bold text-primary transition-colors hover:bg-primary/5"
          >
            Voir tout le classement
          </button>
        </div>
      )}
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
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
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
  ranking,
  onlineFriendIds,
  school,
  schoolDemo,
  friends,
  pendingRequests,
  myFriendCode,
  squadName,
  canRenameSquad,
  gems,
  referral,
  squadIds,
  clanBoard,
  today,
}: {
  ranking: RankPlayer[]
  // Amis actuellement en session (RPC friends_live) : point vert sur leur
  // ligne du classement + compteur « en ligne » dans son en-tête.
  onlineFriendIds: string[]
  school: SchoolBoard
  // true = données d'exemple (visiteur / élève sans établissement) : l'UI le
  // signale avec la pastille « Aperçu » au lieu de les faire passer pour vraies.
  schoolDemo: boolean
  friends: Friend[]
  pendingRequests: PendingRequest[]
  myFriendCode: string
  // Nom du groupe d'amis (« squad », migration 176) et droit de le renommer.
  squadName: string | null
  canRenameSquad: boolean
  // Économie des gemmes (migration 183) : solde et avancement du parrainage.
  gems: number
  referral: ReferralSummary
  // Composition du groupe privé (migration 183), sous-ensemble des relations.
  squadIds: string[]
  // Clan hebdo (migration 204) — null tant que la migration n'est pas passée.
  clanBoard: ClanWeekBoard | null
  today: string
}) {
  // Défi refusé depuis les stories ou la carte rival (1/jour déjà lancé).
  const [duelNotice, setDuelNotice] = useState(false)
  const rows = rankPlayers(ranking)
  const me = rows.find((r) => r.isMe)
  const rival = rivalAhead(rows)
  const onlineIds = new Set(onlineFriendIds)

  return (
    <div className="flex flex-col gap-6">
      {/* 1. « En ce moment » — la rangée stories : qui est là, qui tient sa
          flamme, un tap = défier. L'écran s'ouvre sur du vivant. */}
      {friends.length > 0 ? (
        <FriendStories
          friends={friends}
          onlineIds={onlineIds}
          myFriendCode={myFriendCode}
          onDuelBlocked={() => setDuelNotice(true)}
        />
      ) : null}

      {/* 2. Le rival direct — LA action du jour, sortie du rang. */}
      {rival && me ? (
        <RivalCard
          rival={rival}
          myTrophies={me.trophies}
          onDuelBlocked={() => setDuelNotice(true)}
        />
      ) : null}

      {duelNotice ? (
        <p
          role="status"
          className="-mt-3 rounded-2xl bg-muted/60 p-2.5 text-xs font-medium text-foreground/80"
        >
          Ton défi du jour est déjà lancé — une seule mission par jour, reviens
          demain ⚔️
        </p>
      ) : null}

      {/* 3. Le coffre d'équipe hebdo : l'objectif commun en jauge (clan 204).
          Masqué sans clan ou tant que la migration n'est pas passée. */}
      {clanBoard ? <TeamChestCard board={clanBoard} today={today} /> : null}

      {/* 4. L'ÉTABLISSEMENT — podium + ta ligne (portée en sélecteur, liste
          complète à la demande).

          IL PASSE DEVANT « Mon équipe ». Le classement du lycée est peuplé dès
          le premier jour : il y a toujours des camarades devant et derrière, donc
          toujours quelque chose à regarder. « Mon équipe », lui, est vide tant
          qu'on n'a ajouté personne — et il ouvrait l'onglet sur « En solo pour
          l'instant », c'est-à-dire sur un vide, à l'endroit qui décide si on
          reste. Le plein d'abord, l'invitation ensuite. */}
      <GeoRankingSection school={school} schoolDemo={schoolDemo} />

      {/* 5. Parrainage — compacté en une ligne (on le fait une fois, il n'a
          plus le droit d'écraser le quotidien). */}
      <ParrainageCard
        myFriendCode={myFriendCode}
        gems={gems}
        summary={referral}
      />

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

      {/* Mon groupe — la sélection privée parmi toutes les relations. */}
      <SquadSection
        friends={friends}
        squadIds={squadIds}
        squadName={squadName}
      />

      {/* 6. Mon équipe — le classement aux trophées, façon liste de clan.
          Descendu sous le classement de l'établissement : voir d'abord où l'on
          se situe dans son lycée donne une raison de se constituer une équipe,
          l'inverse demandait d'en avoir déjà une. */}
      <ClassementArena
        ranking={ranking}
        onlineFriendIds={onlineFriendIds}
        myFriendCode={myFriendCode}
        squadName={squadName}
        canRenameSquad={canRenameSquad}
      />
    </div>
  )
}
