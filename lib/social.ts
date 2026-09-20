// Couche sociale (onglet « Amis ») — logique pure + données de démonstration.
// Amitiés, duels, « en direct » et « mon école » sont branchés sur Supabase ;
// les `getMock*` restants ne servent que d'aperçu (visiteur non connecté ou
// élève sans établissement), toujours signalé comme tel dans l'UI.

import { type SchoolLevel } from '@/lib/clan'

export type Friend = {
  id: string
  name: string
  emoji: string // avatar léger (emoji), en attendant les photos
  // Blason choisi (clé de lib/portraits, '' si aucun) — onglet Amis.
  portrait?: string
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

// ------------------------------------------------------------- Mission duel
// Le défi d'ami est LA mission bonus du jour : une seule par jour, non
// renouvelable. Elle paye plus que le défi classique — c'est le geste social
// qu'on veut ancrer (« prouve que tu es plus malin que ton ami »).
export const DUEL_XP_BONUS = 50

// Jour ('YYYY-MM-DD' UTC) du dernier duel fantôme lancé (mode Duel du Défi) :
// utilisé par DuelMode pour son propre verrou quotidien côté client.
export const DUEL_DAY_STORAGE_KEY = 'scolaria-duel-day'

// ----------------------------------------------------------------- L'école
// LE CLASSEMENT DE L'ÉCOLE SE FAIT AUX TROPHÉES (Lucas, 16/09/2026), plus au
// temps de travail. Les heures mesuraient l'assiduité ; les trophées mesurent
// ce que l'élève a GAGNÉ (duels classés, cf. lib/trophies) — c'est la même
// monnaie que le classement entre amis et le rang de saison (lib/rank), donc
// un seul vocabulaire sur tout l'onglet : « Bronze IV », « 480 trophées ».
export type SchoolMate = {
  id: string
  name: string
  emoji: string
  // Blason choisi (migration 363) ; absent = blason fixe déduit de l'id.
  portrait?: string
  trophies: number // trophées de saison (cf. profiles.trophies, lib/trophies)
  isMe?: boolean
}

export type SchoolBoard = {
  name: string
  emoji: string
  // Cycle de l'établissement : pilote les textes (« ton collège »/« ton lycée »).
  level: SchoolLevel
  mates: SchoolMate[]
}

// Nom courant de l'établissement pour les phrases de l'UI.
export function schoolNoun(level: SchoolLevel): string {
  return level === 'lycee' ? 'lycée' : 'collège'
}

export function sortSchool(mates: SchoolMate[]): SchoolMate[] {
  return [...mates].sort((a, b) => b.trophies - a.trophies)
}

// La RPC clan_mates (362) ne renvoie que les 50 élèves les mieux classés :
// au-delà, le rang affiché ne couvre que ce top — l'UI doit le dire au lieu
// de présenter la liste comme toute l'école.
export const SCHOOL_BOARD_LIMIT = 50

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
// ({ school_name, mates:[{ id, name, trophies }] }). Marque l'élève courant.
// Les trophées arrivent avec la migration 362 ; une RPC plus ancienne (160/242)
// ne les renvoie pas : ils valent alors 0, et la liste se lit quand même.
export function buildSchoolBoard(
  raw: unknown,
  myId: string,
  level: SchoolLevel = 'college',
): SchoolBoard {
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
        portrait: typeof mo.portrait === 'string' ? mo.portrait : '',
        trophies: Math.max(0, Math.floor(Number(mo.trophies) || 0)),
        isMe: id === myId,
      },
    ]
  })
  return {
    name: typeof o.school_name === 'string' ? o.school_name : '',
    emoji: '🏫',
    level,
    mates: sortSchool(mates),
  }
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

// Liste d'amis à défier (mock, adversaires fantômes du mode Duel du Défi) —
// l'ordre met en avant les rivaux « proches » en niveau.
export function getMockFriends(): Friend[] {
  return [F.tom, F.ines, F.lea, F.hugo, F.rayan, F.naila]
}

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
  portrait?: string
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

// Résultat de `add_friend_by_code()` / `add_friend_qr()` → message français.
// 'added' vient du scan de QR (163) : amitié créée directement, sans attente.
export type AddFriendStatus =
  | 'sent'
  | 'added'
  | 'already'
  | 'self'
  | 'not_found'
  | 'error'

export function addFriendMessage(status: AddFriendStatus): {
  ok: boolean
  message: string
} {
  switch (status) {
    case 'sent':
      return { ok: true, message: 'Demande envoyée ! 🎉' }
    case 'added':
      return { ok: true, message: 'Vous êtes maintenant amis ! 🎉' }
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

// L'école de l'élève (aperçu, signalé comme tel dans l'UI) — `myTrophies` vient
// du vrai profil quand il est connecté, pour que sa place bouge avec ses
// vrais duels. Le nom suit le cycle pour ne pas contredire le titre.
export function getMockSchool(
  myTrophies: number,
  level: SchoolLevel = 'college',
): SchoolBoard {
  return {
    name: level === 'lycee' ? 'Lycée Jean-Moulin' : 'Collège Jean-Moulin',
    emoji: '🏫',
    level,
    mates: sortSchool([
      { id: 'me', name: 'Toi', emoji: '🚀', trophies: myTrophies, isMe: true },
      { id: 'naila', name: 'Naïla', emoji: '🦉', trophies: 1240 },
      { id: 'rayan', name: 'Rayan', emoji: '🦁', trophies: 980 },
      { id: 'lea', name: 'Léa', emoji: '🦊', trophies: 760 },
      { id: 'ines', name: 'Inès', emoji: '🐝', trophies: 540 },
      { id: 'tom', name: 'Tom', emoji: '🐼', trophies: 310 },
      { id: 'hugo', name: 'Hugo', emoji: '🐺', trophies: 180 },
      { id: 'chloe', name: 'Chloé', emoji: '🐰', trophies: 60 },
    ]),
  }
}

// --- Échelons géographiques du classement (docs/CADRAGE-GEO.md) ---------------
// Du plus proche au plus large : ton établissement (la « ville » de départ),
// ton département, ta région, le national. Un sélecteur d'échelon laisse
// l'élève voir où il se situe à chaque échelle.

export type GeoScope = 'school' | 'dept' | 'region' | 'national'

export const GEO_SCOPES: readonly GeoScope[] = [
  'school',
  'dept',
  'region',
  'national',
]

// Libellé court de l'onglet. L'établissement suit le cycle (« Lycée »/« Collège »).
export function geoScopeLabel(scope: GeoScope, level: SchoolLevel): string {
  switch (scope) {
    case 'school':
      return level === 'lycee' ? 'Lycée' : 'Collège'
    case 'dept':
      return 'Département'
    case 'region':
      return 'Région'
    case 'national':
      return 'National'
  }
}

// Titre du bloc pour l'échelon courant (« Ton lycée », « Ton département »…).
export function geoScopeTitle(scope: GeoScope, level: SchoolLevel): string {
  switch (scope) {
    case 'school':
      return `Ton ${schoolNoun(level)}`
    case 'dept':
      return 'Ton département'
    case 'region':
      return 'Ta région'
    case 'national':
      return 'France entière'
  }
}

// Groupe nominal pour les phrases « … compte pour {…} » selon l'échelon.
export function geoScopePossessive(scope: GeoScope, level: SchoolLevel): string {
  switch (scope) {
    case 'school':
      return `ton ${schoolNoun(level)}`
    case 'dept':
      return 'ton département'
    case 'region':
      return 'ta région'
    case 'national':
      return 'la France'
  }
}

// Meneurs d'exemple par échelon (hors établissement) : plus le vivier est large,
// plus les meneurs cumulent de trophées. « Toi » y es inséré avec tes vrais
// trophées, puis tout est trié — au national tu apparais donc plus bas, ce qui
// dit la vérité du jeu : on grimpe en gagnant des duels.
const GEO_DEMO_LEADERS: Record<
  Exclude<GeoScope, 'school'>,
  { name: string; emoji: string; leaders: Omit<SchoolMate, 'isMe'>[] }
> = {
  dept: {
    name: 'Seine-et-Marne',
    emoji: '🏙️',
    leaders: [
      { id: 'd1', name: 'Yasmine', emoji: '🦅', trophies: 2760 },
      { id: 'd2', name: 'Théo', emoji: '🐯', trophies: 2340 },
      { id: 'd3', name: 'Camille', emoji: '🦊', trophies: 1930 },
      { id: 'd4', name: 'Adam', emoji: '🐺', trophies: 1530 },
      { id: 'd5', name: 'Sofia', emoji: '🦉', trophies: 1290 },
      { id: 'd6', name: 'Nael', emoji: '🐼', trophies: 1150 },
    ],
  },
  region: {
    name: 'Île-de-France',
    emoji: '🗺️',
    leaders: [
      { id: 'r1', name: 'Jade', emoji: '🦄', trophies: 6420 },
      { id: 'r2', name: 'Gabriel', emoji: '🐉', trophies: 5610 },
      { id: 'r3', name: 'Louna', emoji: '🦅', trophies: 4690 },
      { id: 'r4', name: 'Ibrahim', emoji: '🦁', trophies: 3990 },
      { id: 'r5', name: 'Manon', emoji: '🦊', trophies: 3540 },
      { id: 'r6', name: 'Ethan', emoji: '🐯', trophies: 3040 },
    ],
  },
  national: {
    name: 'France',
    emoji: '🇫🇷',
    leaders: [
      { id: 'n1', name: 'Alia', emoji: '👑', trophies: 15360 },
      { id: 'n2', name: 'Noah', emoji: '🚀', trophies: 14040 },
      { id: 'n3', name: 'Lina', emoji: '🦄', trophies: 12650 },
      { id: 'n4', name: 'Raphaël', emoji: '🐉', trophies: 11670 },
      { id: 'n5', name: 'Emma', emoji: '🦅', trophies: 10560 },
      { id: 'n6', name: 'Aymen', emoji: '🦁', trophies: 9550 },
    ],
  },
}

// Aperçu d'exemple d'un échelon géographique, tant que le back-end géo (code
// postal + RPC geo_ranking, cf. docs/CADRAGE-GEO.md) n'est pas branché. Pour
// l'établissement, on réutilise l'aperçu d'école existant.
export function getMockGeoBoard(
  scope: GeoScope,
  myTrophies: number,
  level: SchoolLevel = 'college',
): SchoolBoard {
  if (scope === 'school') return getMockSchool(myTrophies, level)

  const preset = GEO_DEMO_LEADERS[scope]
  return {
    name: preset.name,
    emoji: preset.emoji,
    level,
    mates: sortSchool([
      { id: 'me', name: 'Toi', emoji: '🚀', trophies: myTrophies, isMe: true },
      ...preset.leaders.map((l) => ({ ...l })),
    ]),
  }
}
