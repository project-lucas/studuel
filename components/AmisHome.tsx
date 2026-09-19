'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Swords,
  Crown,
  Zap,
  Check,
  ChevronDown,
  UserPlus,
  Users,
  School,
  Flame,
  X,
  Pencil,
  Medal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendAddButton from '@/components/FriendAddButton'
import SquadSection from '@/components/SquadSection'
import FriendStories from '@/components/amis/FriendStories'
import RivalCard from '@/components/amis/RivalCard'
import TeamChestCard from '@/components/amis/TeamChestCard'
import TropheeAnime from '@/components/amis/TropheeAnime'
import RailDivisions from '@/components/amis/RailDivisions'
import {
  ligneDivision,
  lignesEcole,
  monRang,
  sousTitreEcole,
  titreEcole,
} from '@/lib/amis/classement-ecole'
import type { ReferralSummary } from '@/lib/gems'
import type { ClanWeekBoard } from '@/lib/clan-week'
import { cn } from '@/lib/utils'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import { sfx } from '@/lib/sounds'
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

// Le blason de l'élève (plus d'emoji d'animal, Lucas 17/09/2026).
function Avatar({ id, portrait }: { id: string; portrait?: string }) {
  return <PortraitJoueur id={id} portrait={portrait} className="size-9" />
}

// LE COMPTE DE TROPHÉES, écrit d'une seule façon sur tout l'onglet : la coupe
// animée devant, le nombre derrière, dans une pastille. C'est ce que lisent
// les lignes des deux classements ET le résumé « ta place » — un même nombre
// ne doit pas s'écrire de deux manières à dix pixels d'écart.
function CompteTrophees({ n }: { n: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full bg-foreground/5 py-1 pr-2.5 pl-1.5 font-mono text-sm font-bold tabular-nums">
      <TropheeAnime />
      {n}
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
              <PortraitJoueur
                id={e.id}
                portrait={e.portrait}
                className="size-11 ring-1 ring-foreground/10"
              />
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
              {/* LA DIVISION EN BLASON, un peu plus grand (Lucas, 19/09/2026 :
                  « agrandis légèrement la place que prennent les illustrations
                  de divisions ») : le dessin du palier plutôt que son emoji de
                  repli, qui tenait dans la hauteur d'une lettre. */}
              <span className="mt-0.5 flex min-w-0 items-center gap-1 text-xs font-semibold text-primary">
                <Image
                  src={rank.tier.image}
                  alt=""
                  aria-hidden="true"
                  width={48}
                  height={48}
                  className="size-[22px] shrink-0 select-none object-contain"
                />
                <span className="truncate">{rank.label}</span>
              </span>
            </span>
            <CompteTrophees n={e.trophies} />
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
//
// « MES AMIS », plus « Mon équipe » (Lucas, 16/09/2026) : le bloc est le
// classement de mes amis aux trophées, et « équipe » laissait croire à un
// groupe constitué — celui-là, c'est le coffre d'équipe du clan, plus haut.
const DEFAULT_SQUAD_NAME = 'Mes amis'

function SquadHeader({
  squadName,
  canRename,
  myFriendCode,
  referral,
}: {
  squadName: string | null
  canRename: boolean
  myFriendCode: string
  referral: ReferralSummary
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
          placeholder="Nom de ton groupe d’amis…"
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
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-highlight/25 text-2xl"
      >
        🛡️
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Classement des amis
        </p>
        <div className="flex min-w-0 items-center gap-1">
          <h2 className="font-heading truncate text-lg font-extrabold text-foreground">
            {display}
          </h2>
          {/* Le crayon suit le nom (le n°1 seulement) : l'angle est à
              l'invitation. La pastille « N°1 seulement » est partie — elle
              occupait l'angle pour dire ce qu'on ne pouvait pas faire. */}
          {canRename ? (
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setDraft(name ?? '')
                setEditing(true)
              }}
              aria-label="Renommer le groupe"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 active:scale-90"
            >
              <Pencil className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      {/* L'ANGLE : inviter un ami (Lucas, 17/09/2026). La carte de parrainage
          qui vivait sous ce bloc s'ouvre d'ici. */}
      <FriendAddButton
        variant="coin"
        myFriendCode={myFriendCode}
        referral={referral}
      />
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
  referral,
}: {
  ranking: RankPlayer[]
  onlineFriendIds: string[]
  myFriendCode: string
  squadName: string | null
  canRenameSquad: boolean
  referral: ReferralSummary
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
      <SquadHeader
        squadName={squadName}
        canRename={canRenameSquad}
        myFriendCode={myFriendCode}
        referral={referral}
      />

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
          Invite tes amis avec le bouton violet, en haut : vous vous comparez
          aux trophées 🏆
        </p>
      ) : (
        <>
          {/* Résumé : ta place, ton palier, et l'objectif juste devant. */}
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
            {/* DEUX DESSINS POUR DEUX SITUATIONS, et c'est la même case.
                Sans ami, il n'y a pas de rang à montrer — « Bronze IV » sur un
                classement d'une personne ne mesure rien. On y met donc la
                mascotte, qui dit l'état vide et invite à le quitter. Dès qu'un
                ami arrive, la case reprend son rôle et affiche le BLASON du
                palier — le webp existait depuis juillet (lib/rank.ts le
                déclare, RankBadge l'affiche), cet écran se contentait de son
                emoji de repli. */}
            {friendCount > 0 ? (
              <Image
                src={myRankTier.tier.image}
                alt=""
                aria-hidden="true"
                width={128}
                height={128}
                className="size-14 shrink-0 select-none object-contain"
              />
            ) : (
              <Image
                src="/images/amis/solo.webp"
                alt=""
                aria-hidden="true"
                width={128}
                height={128}
                className="size-14 shrink-0 select-none object-contain"
              />
            )}
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
                    ? myRankTier.label
                    : 'Ajoute des amis pour vous comparer'}
              </p>
            </div>
            {/* LE MÊME COMPTE QUE SUR LES LIGNES, écrit de la même façon
                (Lucas, 16/09/2026 : « ce n'est pas propre ») : il y avait ici
                « 20 🏆 » et sur ma ligne « 🏆 20 », deux ordres pour un seul
                nombre. Une seule pastille, la coupe devant, partout. */}
            <CompteTrophees n={myTrophies} />
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

      {/* Plus de gros bouton « Ajouter un ami » en pied de bloc : l'invitation
          est dans l'angle, avec le parrainage. */}
      {friendCount > 0 ? (
        <p className="mt-2 px-1 pb-1 text-[11px] text-muted-foreground">
          {`Tape l’épée d’un ami pour le défier sur le Défi du jour (+${DUEL_XP_BONUS} XP) — le point vert signale un ami en session.`}
        </p>
      ) : null}
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

// L'ÉCRAN DE LIGUE DE DUOLINGO (Lucas, 16/09/2026 : « je veux cela comme
// Duolingo », puis « le classement se fera via les trophées et non plus le
// nombre d'heures travaillées »). Il se lit de haut en bas :
//
//   1. LE RAIL DES DIVISIONS — les six blasons de rang (les mêmes que
//      l'arène, public/images/defi/ranks) : le mien au centre en grand, ceux
//      d'avant en couleur, ceux d'après GRIS ET CADENASSÉS tant que je n'y
//      suis pas (components/amis/RailDivisions).
//   2. LA PHRASE qui dit ma place (« Tu es n°3 du classement de ton collège »),
//      et dessous ce qu'il me reste à faire (« 40 trophées pour doubler Rayan »).
//   3. LA LISTE — rang, avatar, nom, trophées — coupée par un bandeau. Chez
//      Duolingo c'est la zone de promotion ; ici il n'y a ni semaine ni
//      relégation, la seule zone qui existe est LE PODIUM : le bandeau se pose
//      sous la 3e place. Ma ligne est surlignée, et elle est TOUJOURS visible
//      même repliée (les dix premiers, une ellipse, moi) : c'est elle qu'on
//      vient vérifier.
//
// Tout ce qui se décide (ordre, pli, bandeau, phrases, état des blasons) vit
// dans lib/amis/classement-ecole.ts, testé ; ici on ne fait que dessiner.
function GeoRankingSection({
  school,
  schoolDemo,
}: {
  school: SchoolBoard
  schoolDemo: boolean
}) {
  const [scope, setScope] = useState<GeoScope>('school')
  // LA BOÎTE DU CLASSEMENT (Lucas, 17/09/2026 : « faire un carré pour le
  // scrolling du classement »). Toute la liste vit dans une boîte de hauteur
  // fixe qui défile seule : la page reste courte, et plus besoin de plier.
  const boite = useRef<HTMLOListElement>(null)
  // Mes vrais trophées, lus depuis l'établissement : ils replacent « Toi » au
  // bon rang dans les aperçus d'échelons plus larges, et décident de ma
  // division sur le rail.
  const myTrophies = school.mates.find((m) => m.isMe)?.trophies ?? 0

  // Établissement : vraies données si dispo. Échelons plus larges : aperçu
  // (« Aperçu ») tant que le back-end géo n'est pas branché.
  const board =
    scope === 'school'
      ? school
      : getMockGeoBoard(scope, myTrophies, school.level)
  const demo = scope === 'school' ? schoolDemo : true
  const noun = schoolNoun(board.level)
  const complement = geoScopePossessive(scope, board.level)
  // Établissement réel : la RPC plafonne à 50 élèves — on le dit. Les aperçus
  // d'échelons larges ne sont jamais plafonnés (données de démonstration).
  const capped =
    scope === 'school' && !demo && board.mates.length >= SCHOOL_BOARD_LIMIT

  const lignes = lignesEcole(board.mates, true)
  const rang = monRang(board.mates)

  // Ma ligne au milieu de la boîte à l'ouverture (et au changement
  // d'échelle). On déplace la BOÎTE (scrollTop) : `scrollIntoView` ferait
  // aussi défiler la page.
  useEffect(() => {
    const conteneur = boite.current
    const moi = conteneur?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!conteneur || !moi) return
    conteneur.scrollTop =
      moi.offsetTop - (conteneur.clientHeight - moi.offsetHeight) / 2
  }, [scope])

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

      <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-black/5">
        {/* --- 1 : le rail des divisions ------------------------------------ */}
        <RailDivisions trophies={myTrophies} />

        {/* --- 2 : ma place ------------------------------------------------- */}
        <div className="flex flex-col items-center px-4 pb-3 text-center">
          <h3 className="font-heading text-lg leading-tight font-extrabold text-balance">
            {titreEcole(rang, complement)}
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-muted-foreground text-balance">
            {sousTitreEcole(board.mates, complement)}
          </p>
          {/* Ma division, et le prochain blason à débloquer. */}
          <p className="mt-1 inline-flex items-center gap-1 text-[0.68rem] font-bold text-muted-foreground/80">
            <TropheeAnime className="size-3.5" />
            {ligneDivision(myTrophies)}
            {capped ? ` · les ${SCHOOL_BOARD_LIMIT} mieux classés` : ''}
          </p>
        </div>

        {/* --- 3 : la liste, coupée par le bandeau du podium -----------------
            LA BOÎTE DE DUOLINGO (Lucas, 17/09/2026 : « si le user veut voir
            plus bas il va avoir du mal à trouver un endroit pour scroller »).
            La liste occupait toute la largeur et la moitié de l'écran : où
            qu'on pose le pouce, c'est elle qui défilait, jamais la page.
            Elle est maintenant une boîte ENCADRÉE, en retrait des bords, et
            d'environ cinq lignes : autour d'elle il reste de la carte pour
            faire défiler l'écran. Pas d'`overscroll-contain` : arrivé au bout
            de la liste, le même geste continue sur la page. */}
        <ol
          ref={boite}
          aria-label="Classement"
          // `relative` : les `offsetTop` des lignes se mesurent depuis la boîte.
          className="relative mx-3 mb-3 max-h-[min(16.5rem,36svh)] overflow-y-auto rounded-2xl border-2 border-border [scrollbar-width:thin]"
        >
          {lignes.map((ligne) => {
            if (ligne.kind === 'separateur') {
              return (
                <li
                  key="podium"
                  className="font-heading flex items-center justify-center gap-2 py-1.5 text-xs font-extrabold tracking-wider text-primary uppercase"
                >
                  <Medal className="size-4" strokeWidth={2.6} aria-hidden="true" />
                  Podium
                  <Medal className="size-4" strokeWidth={2.6} aria-hidden="true" />
                </li>
              )
            }
            if (ligne.kind === 'ellipse') {
              return (
                <li
                  key="ellipse"
                  className="py-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  … {ligne.caches} {ligne.caches > 1 ? 'élèves' : 'élève'}
                </li>
              )
            }
            const { mate: m, rank, podium } = ligne
            return (
              <li
                key={m.id}
                aria-current={m.isMe ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2',
                  // Ma ligne : or si je suis sur le podium (la récompense),
                  // violet sinon — la zone d'abord, l'identité ensuite.
                  m.isMe && (podium ? 'bg-highlight/25' : 'bg-primary/10'),
                )}
              >
                <span
                  className={cn(
                    'font-heading flex size-7 shrink-0 items-center justify-center rounded-full text-base font-extrabold tabular-nums',
                    rank === 1 && 'bg-highlight text-foreground',
                    rank === 2 && 'bg-muted-foreground/25 text-foreground',
                    rank === 3 && 'bg-accent text-accent-foreground',
                    rank > 3 && 'text-muted-foreground',
                  )}
                >
                  {rank}
                </span>
                <Avatar id={m.id} portrait={m.portrait} />
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-sm',
                    m.isMe ? 'font-bold' : 'font-semibold',
                  )}
                >
                  {m.name}
                  {rank === 1 ? (
                    <Crown
                      className="ml-1 inline size-3.5 -translate-y-0.5 text-highlight"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <CompteTrophees n={m.trophies} />
              </li>
            )
          })}
        </ol>

      </div>

      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        {scope === 'school'
          ? demo
            ? `Exemple de classement — choisis ton ${noun} dans ton profil pour voir le vrai.`
            : 'Chaque duel classé gagné rapporte des trophées — celui qui en gagne le plus grimpe.'
          : `Aperçu — ton classement au niveau ${geoScopeLabel(scope, board.level).toLowerCase()} arrivera avec ton code postal.`}
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
        <Avatar id={request.id} portrait={request.portrait} />
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
      <Avatar id={request.id} portrait={request.portrait} />
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
  // Parrainage (migration 183) : où en sont mes invitations.
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

      {/* 5. MES AMIS — le classement aux trophées, façon liste de clan.
          Remonté AU-DESSUS du parrainage (Lucas, 16/09/2026) : c'est le bloc
          qu'on vient regarder après l'école, et l'invitation à parrainer se
          lisait comme un mur entre les deux classements. Il reste sous
          l'établissement : voir d'abord où l'on se situe dans son lycée donne
          une raison de se constituer un cercle d'amis, l'inverse demandait
          d'en avoir déjà un. */}
      <ClassementArena
        ranking={ranking}
        onlineFriendIds={onlineFriendIds}
        myFriendCode={myFriendCode}
        squadName={squadName}
        canRenameSquad={canRenameSquad}
        referral={referral}
      />

      {/* 6. Le parrainage n'a plus de bloc : il s'ouvre depuis l'angle du
          classement des amis (Lucas, 17/09/2026 : « trop bas »). */}

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
    </div>
  )
}
