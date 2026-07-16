// Couche sociale (onglet « Amis ») — logique pure + données de démonstration.
// Aujourd'hui : mock local, pour poser l'agencement et les interactions.
// Demain : chaque `getMock*` sera remplacé par une requête Supabase (tables
// friends / live_sessions / duels / league_week) sans toucher aux composants.

export type Friend = {
  id: string
  name: string
  emoji: string // avatar léger (emoji), en attendant les photos
  level: number
  // true = fantôme réel (manches enregistrées d'un vrai ami, duel_recordings)
  real?: boolean
  // Série (jours consécutifs d'activité), quand elle est connue (RPC 155).
  streak?: number
}

// Fantôme d'un ami : ses manches réellement jouées (migration 023).
export type FriendGhost = {
  id: string
  name: string
  rounds: { correct: number; timeMs: number }[]
}

// Avatar stable dérivé de l'id (en attendant les photos de profil).
const GHOST_AVATARS = ['🦊', '🐼', '🦉', '🐺', '🐝', '🦁', '🐨', '🐸']

export function avatarEmojiFor(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return GHOST_AVATARS[h % GHOST_AVATARS.length]
}

// Un ami actuellement en session : c'est le cœur de l'onglet — on voit qui
// bosse en direct et on peut le rejoindre.
export type LiveSession = {
  friend: Friend
  activity: string // « révise les fractions »
  subject: string
  minutes: number // depuis combien de temps il est en session
}

export type DuelStatus =
  | 'incoming' // il t'a défié, à toi de relever
  | 'outgoing' // tu l'as défié, en attente
  | 'won'
  | 'lost'
  | 'tie'

export type Duel = {
  id: string
  opponent: Friend
  subject: string
  status: DuelStatus
  myScore: number | null
  theirScore: number | null
  total: number
}

export type LeagueEntry = {
  id: string
  name: string
  emoji: string
  xp: number
  isMe?: boolean
}

// ------------------------------------------------------------- Mission duel
// Le défi d'ami est LA mission bonus du jour : une seule par jour, non
// renouvelable. Elle paye plus que le défi classique — c'est le geste social
// qu'on veut ancrer (« prouve que tu es plus malin que ton pote »).
export const DUEL_XP_BONUS = 50

// Mock côté client : on retient le jour ('YYYY-MM-DD' UTC) du dernier duel
// lancé. Demain : table duels + contrainte unique (challenger, jour).
export const DUEL_DAY_STORAGE_KEY = 'scolaria-duel-day'

// La mission est disponible tant qu'aucun duel n'a été lancé aujourd'hui.
export function duelMissionAvailable(
  lastDuelDayKey: string | null,
  todayKey: string,
): boolean {
  return lastDuelDayKey !== todayKey
}

// ----------------------------------------------------------------- L'école
// Les heures travaillées par chaque élève s'accumulent au bénéfice de son
// école ; le classement interne départage les élèves au temps de travail.
export type SchoolMate = {
  id: string
  name: string
  emoji: string
  seconds: number // temps de travail cumulé (cf. profiles.work_seconds)
  isMe?: boolean
}

export type SchoolBoard = {
  name: string
  emoji: string
  mates: SchoolMate[]
}

export function sortSchool(mates: SchoolMate[]): SchoolMate[] {
  return [...mates].sort((a, b) => b.seconds - a.seconds)
}

// Total des heures de l'école : la somme de tous ses élèves.
export function schoolTotalSeconds(mates: SchoolMate[]): number {
  return mates.reduce((sum, m) => sum + Math.max(0, m.seconds), 0)
}

// --- Backend réel (migration 160) : « en direct » + « mon école » ------------

// Texte d'activité selon le type de session renvoyé par friends_live.
export const LIVE_KIND_LABEL: Record<string, { activity: string; subject: string }> = {
  defi: { activity: 'fait un défi', subject: 'Défi' },
  quiz: { activity: 'joue un quiz', subject: 'Quiz' },
  revision: { activity: 'révise', subject: 'Révision' },
  lecon: { activity: 'revoit une leçon', subject: 'Leçon' },
}

// Construit les sessions « en direct » à partir des lignes de la RPC
// friends_live ({ friend_id, full_name, kind, minutes }). Pur → testable.
export function buildLiveSessions(rows: unknown): LiveSession[] {
  if (!Array.isArray(rows)) return []
  return rows.flatMap((r) => {
    const o = (r ?? {}) as Record<string, unknown>
    const id = String(o.friend_id ?? '')
    if (id.length === 0) return []
    const label = LIVE_KIND_LABEL[String(o.kind ?? '')] ?? LIVE_KIND_LABEL.revision
    return [
      {
        friend: {
          id,
          name: String(o.full_name ?? 'Ami').split(' ')[0] || 'Ami',
          emoji: avatarEmojiFor(id),
          level: 0,
        },
        activity: label.activity,
        subject: label.subject,
        minutes: Math.max(0, Number(o.minutes) || 0),
      },
    ]
  })
}

// Construit le tableau « mon école » à partir du JSONB de la RPC clan_mates
// ({ school_name, mates:[{ id, name, seconds }] }). Marque l'élève courant.
export function buildSchoolBoard(raw: unknown, myId: string): SchoolBoard {
  const o = (raw ?? {}) as Record<string, unknown>
  const matesRaw = Array.isArray(o.mates) ? o.mates : []
  const mates: SchoolMate[] = matesRaw.flatMap((m) => {
    const mo = (m ?? {}) as Record<string, unknown>
    const id = String(mo.id ?? '')
    if (id.length === 0) return []
    return [
      {
        id,
        name: id === myId ? 'Toi' : String(mo.name ?? 'Élève'),
        emoji: avatarEmojiFor(id),
        seconds: Math.max(0, Number(mo.seconds) || 0),
        isMe: id === myId,
      },
    ]
  })
  return {
    name: typeof o.school_name === 'string' ? o.school_name : '',
    emoji: '🏫',
    mates: sortSchool(mates),
  }
}

// La ligue hebdomadaire : les 5 premiers montent, les 5 derniers descendent.
export const LEAGUE_PROMOTE = 5
export const LEAGUE_RELEGATE = 5

export type LeagueZone = 'promote' | 'relegate' | 'safe'

export function leagueZone(rank: number, total: number): LeagueZone {
  if (rank <= LEAGUE_PROMOTE) return 'promote'
  if (rank > total - LEAGUE_RELEGATE) return 'relegate'
  return 'safe'
}

export function sortLeague(entries: LeagueEntry[]): LeagueEntry[] {
  return [...entries].sort((a, b) => b.xp - a.xp)
}

// -------------------------------------------------------- Séries des amis
// Mini-classement des séries : voir où en sont ses amis (jours consécutifs) et
// se comparer, pour ajouter de la compétition. Les séries viennent du RPC
// friends_streaks() / my_streak() (migration 155) ; ces helpers restent purs.
export type StreakEntry = {
  id: string
  name: string
  emoji: string
  streak: number // jours consécutifs d'activité
  isMe?: boolean
}

// Trie les séries décroissantes ; à égalité, « Toi » passe devant (ta place se
// lit d'un coup d'œil), puis ordre alpha stable.
export function sortStreaks(entries: readonly StreakEntry[]): StreakEntry[] {
  return [...entries].sort((a, b) => {
    if (b.streak !== a.streak) return b.streak - a.streak
    if (a.isMe !== b.isMe) return a.isMe ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

// « il y a 12 min » à partir d'un nombre de minutes.
export function sinceLabel(minutes: number): string {
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `depuis ${minutes} min`
  const h = Math.floor(minutes / 60)
  return `depuis ${h} h`
}

// --------------------------------------------------------------- démonstration

const F = {
  lea: { id: 'lea', name: 'Léa', emoji: '🦊', level: 7 },
  tom: { id: 'tom', name: 'Tom', emoji: '🐼', level: 5 },
  naila: { id: 'naila', name: 'Naïla', emoji: '🦉', level: 9 },
  hugo: { id: 'hugo', name: 'Hugo', emoji: '🐺', level: 4 },
  ines: { id: 'ines', name: 'Inès', emoji: '🐝', level: 6 },
  rayan: { id: 'rayan', name: 'Rayan', emoji: '🦁', level: 8 },
} satisfies Record<string, Friend>

export function getMockLive(): LiveSession[] {
  return [
    { friend: F.lea, activity: 'révise les fractions', subject: 'Maths', minutes: 12 },
    { friend: F.naila, activity: 'fait un défi', subject: 'Histoire', minutes: 3 },
    { friend: F.rayan, activity: 'révise les verbes irréguliers', subject: 'Anglais', minutes: 24 },
  ]
}

export function getMockDuels(): Duel[] {
  return [
    { id: 'd1', opponent: F.tom, subject: 'Fractions', status: 'incoming', myScore: null, theirScore: 4, total: 5 },
    { id: 'd2', opponent: F.ines, subject: 'Conjugaison', status: 'outgoing', myScore: null, theirScore: null, total: 5 },
    { id: 'd3', opponent: F.hugo, subject: 'Théorème de Pythagore', status: 'won', myScore: 5, theirScore: 3, total: 5 },
    { id: 'd4', opponent: F.naila, subject: 'Révolution française', status: 'lost', myScore: 2, theirScore: 4, total: 5 },
  ]
}

export function getMockLeague(): LeagueEntry[] {
  return sortLeague([
    { id: 'naila', name: 'Naïla', emoji: '🦉', xp: 640 },
    { id: 'rayan', name: 'Rayan', emoji: '🦁', xp: 585 },
    { id: 'me', name: 'Toi', emoji: '🚀', xp: 520, isMe: true },
    { id: 'lea', name: 'Léa', emoji: '🦊', xp: 470 },
    { id: 'ines', name: 'Inès', emoji: '🐝', xp: 430 },
    { id: 'tom', name: 'Tom', emoji: '🐼', xp: 360 },
    { id: 'hugo', name: 'Hugo', emoji: '🐺', xp: 295 },
    { id: 'chloe', name: 'Chloé', emoji: '🐰', xp: 210 },
    { id: 'sofiane', name: 'Sofiane', emoji: '🐢', xp: 150 },
    { id: 'maya', name: 'Maya', emoji: '🦋', xp: 90 },
  ])
}

// Code d'ami — mock. Servira à l'ajout par code / lien d'invitation.
export const MOCK_FRIEND_CODE = 'LUCAS-7K2'

// Liste d'amis à défier (mock) — l'ordre met en avant les rivaux « proches »
// en niveau : battre un ami de son niveau est plus savoureux.
export function getMockFriends(): Friend[] {
  return [F.tom, F.ines, F.lea, F.hugo, F.rayan, F.naila]
}

// Matière prioritaire du duel — mock. Demain : le chapitre le plus fragile
// de l'élève (même logique que la carte « Reprendre » de Réviser).
export const MOCK_PRIORITY_SUBJECT = { subject: 'Maths', topic: 'Les fractions' }

// =============================================================== Amitiés réelles
// Branchées sur la fondation sociale (migration 019) : code ami unique, table
// `friendships` (pending → accepted) et fonctions SECURITY DEFINER. Ces helpers
// restent purs (mappage + messages) ; les appels Supabase vivent dans les
// Server Actions de `app/amis/actions.ts`.

// Ligne brute renvoyée par la fonction SQL `friends_overview()`.
export type FriendOverviewRow = {
  friend_id: string
  full_name: string | null
  status: string
  incoming: boolean
}

// Une demande d'ami reçue (ou envoyée), en attente.
export type PendingRequest = {
  id: string
  name: string
  emoji: string
}

// Prénom d'affichage : premier mot du nom complet, repli « Ami ».
function displayFirstName(fullName: string | null): string {
  return (fullName ?? '').trim().split(/\s+/)[0] || 'Ami'
}

// Éclate les lignes de `friends_overview()` en trois listes prêtes à afficher :
// amis acceptés (pour défier), demandes reçues (à accepter), demandes envoyées.
export function mapFriendsOverview(rows: readonly FriendOverviewRow[] | null): {
  accepted: Friend[]
  incoming: PendingRequest[]
  outgoing: PendingRequest[]
} {
  const accepted: Friend[] = []
  const incoming: PendingRequest[] = []
  const outgoing: PendingRequest[] = []
  for (const r of rows ?? []) {
    const id = r?.friend_id
    if (!id) continue
    const name = displayFirstName(r.full_name)
    const emoji = avatarEmojiFor(String(id))
    if (r.status === 'accepted') {
      accepted.push({ id: String(id), name, emoji, level: 0, real: true })
    } else if (r.status === 'pending' && r.incoming) {
      incoming.push({ id: String(id), name, emoji })
    } else if (r.status === 'pending') {
      outgoing.push({ id: String(id), name, emoji })
    }
  }
  return { accepted, incoming, outgoing }
}

// Résultat de `add_friend_by_code()` → message français pour l'élève.
export type AddFriendStatus = 'sent' | 'already' | 'self' | 'not_found' | 'error'

export function addFriendMessage(status: AddFriendStatus): {
  ok: boolean
  message: string
} {
  switch (status) {
    case 'sent':
      return { ok: true, message: 'Demande envoyée ! 🎉' }
    case 'already':
      return { ok: false, message: 'Vous êtes déjà liés (ou une demande est en cours).' }
    case 'self':
      return { ok: false, message: "C'est ton propre code 😄" }
    case 'not_found':
      return { ok: false, message: 'Aucun élève avec ce code.' }
    default:
      return { ok: false, message: 'Oups, réessaie dans un instant.' }
  }
}

// ================================================================ Duels réels
// Branchés sur la table `duels` + fonctions create_duel / submit_duel_score
// (migration 019, en base). Le duel se joue sur le Défi du jour : au lancement
// on retient l'id du duel actif (sessionStorage), et la fin de partie du Défi
// dépose le score via submit_duel_score.

// Clé sessionStorage : id du duel en cours de jeu (posée par l'onglet Amis,
// lue puis effacée par le Défi à la fin de la partie).
export const ACTIVE_DUEL_KEY = 'studuel-active-duel'

// Ligne brute de la table `duels` (RLS : seulement mes duels).
export type DuelRow = {
  id: string
  challenger_id: string
  opponent_id: string
  subject: string
  total: number
  challenger_score: number | null
  opponent_score: number | null
}

// Statut du duel du point de vue de l'élève, à partir des deux scores.
export function duelStatus(
  myScore: number | null,
  theirScore: number | null,
): DuelStatus {
  if (myScore != null && theirScore != null) {
    if (myScore > theirScore) return 'won'
    if (myScore < theirScore) return 'lost'
    return 'tie'
  }
  if (myScore != null) return 'outgoing' // j'ai joué, j'attends l'adversaire
  return 'incoming' // à moi de jouer
}

// Transforme une ligne `duels` en carte d'affichage `Duel`, du point de vue de
// `myId`. L'adversaire (prénom + emoji) est résolu en amont depuis la liste
// d'amis (tout adversaire de duel est un ami accepté).
export function duelView(row: DuelRow, myId: string, opponent: Friend): Duel {
  const iAmChallenger = row.challenger_id === myId
  const myScore = iAmChallenger ? row.challenger_score : row.opponent_score
  const theirScore = iAmChallenger ? row.opponent_score : row.challenger_score
  return {
    id: row.id,
    opponent,
    subject: row.subject,
    status: duelStatus(myScore, theirScore),
    myScore,
    theirScore,
    total: row.total,
  }
}

// L'école de l'élève (mock) — `mySeconds` vient du vrai profil quand il est
// connecté, pour que sa place dans le classement bouge avec son travail réel.
export function getMockSchool(mySeconds: number): SchoolBoard {
  return {
    name: 'Collège Jean-Moulin',
    emoji: '🏫',
    mates: sortSchool([
      { id: 'me', name: 'Toi', emoji: '🚀', seconds: mySeconds, isMe: true },
      { id: 'naila', name: 'Naïla', emoji: '🦉', seconds: 41 * 3600 },
      { id: 'rayan', name: 'Rayan', emoji: '🦁', seconds: 33 * 3600 },
      { id: 'lea', name: 'Léa', emoji: '🦊', seconds: 27 * 3600 + 1800 },
      { id: 'ines', name: 'Inès', emoji: '🐝', seconds: 19 * 3600 },
      { id: 'tom', name: 'Tom', emoji: '🐼', seconds: 12 * 3600 + 2400 },
      { id: 'hugo', name: 'Hugo', emoji: '🐺', seconds: 7 * 3600 },
      { id: 'chloe', name: 'Chloé', emoji: '🐰', seconds: 4 * 3600 + 900 },
    ]),
  }
}
