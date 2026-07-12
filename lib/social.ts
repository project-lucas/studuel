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
