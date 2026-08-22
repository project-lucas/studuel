'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  normalizeAvatarConfig,
  DEFAULT_AVATAR,
  type AvatarConfig,
} from '@/lib/avatar'
import {
  parseCondition,
  normalizeEquipped,
  MAX_EQUIPPED,
  type BadgeState,
} from '@/lib/badges'
import {
  buildProfileSummary,
  type ProfileSummary,
  type ProfileStatInputs,
} from '@/lib/profile-stats'
import { activeSchoolId } from '@/lib/clan'
import { readRowTolerant } from '@/lib/profile-read'
import { parseGradeStandings, type GradeStandings } from '@/lib/percentile'

// Tout ce dont la carte + la modale de profil ont besoin, sérialisable.
export type ProfileData = {
  /** Nom affiché : le pseudo de jeu si défini, sinon le prénom. */
  displayName: string
  /** L'élève a-t-il choisi un pseudo de jeu (vs prénom par défaut) ? */
  hasCustomGamertag: boolean
  gamertag: string | null
  firstName: string
  gradeLabel: string | null
  avatar: AvatarConfig
  profileBanner: string | null
  schoolName: string | null
  summary: ProfileSummary
  /**
   * Place de l'élève parmi les élèves de son niveau. Sur cet écran c'est la
   * mesure TROPHÉES qu'on affiche : /defi est l'arène, on y compare ce qui s'y
   * gagne. Les autres mesures voyagent avec, prêtes pour d'autres écrans.
   */
  standings: GradeStandings
  /** Catalogue complet, chaque badge marqué acquis ou non (ordre catalogue). */
  badges: BadgeState[]
  /** Ids des badges mis en avant, dans l'ordre choisi (≤3). */
  equippedBadgeIds: string[]
  /** Slugs des badges DÉBLOQUÉS à l'instant (pour une célébration). */
  newlyUnlocked: string[]
  /** asset_keys des bannières que l'élève peut équiper (gratuites + possédées). */
  availableBanners: string[]
}

const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

// Agrège l'intégralité du profil de jeu. Retourne null pour un visiteur non
// connecté. Attribue d'abord les badges mérités (recalcul serveur), puis lit
// l'état à jour — comme le vestiaire réclame ses déblocages à l'ouverture.
export async function getProfileData(): Promise<ProfileData | null> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  // 1) Attribution serveur des badges mérités (renvoie les slugs neufs).
  const { data: awarded } = await supabase.rpc('award_earned_badges')
  const newlyUnlocked = Array.isArray(awarded)
    ? awarded.map((s) => str(s)).filter(Boolean)
    : []

  // 2) Stats d'affichage (RPC unique), identité de base + colonnes profil (200),
  //    catalogue de badges + badges de l'élève — en parallèle.
  const [
    { data: statsRaw },
    { data: base },
    { data: cosmetics },
    { data: catalog },
    { data: mine },
    { data: standingsRow },
  ] = await Promise.all([
    supabase.rpc('profile_stats'),
    // Lecture TOLÉRANTE : `primaire_school_id` n'existe qu'après la migration
    // 242. Dans un `select` ordinaire, une colonne absente fait échouer TOUTE
    // la requête — le pseudo, la classe et l'avatar disparaîtraient avec elle.
    // Le lecteur tolérant réessaie sans la colonne fautive (cf. lib/profile-read).
    readRowTolerant<{
      full_name: string | null
      grade_level: string | null
      avatar: unknown
      primaire_school_id: string | null
      college_school_id: string | null
      lycee_school_id: string | null
    }>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'avatar',
      'primaire_school_id',
      'college_school_id',
      'lycee_school_id',
    ]).then((data) => ({ data })),
    // Colonnes de la migration 200 isolées : si elle n'est pas encore passée,
    // seule cette lecture échoue (le reste du profil s'affiche quand même).
    supabase
      .from('profiles')
      .select('gamertag, equipped_badges, profile_banner')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('badges').select('id, slug, title, description, icon, condition'),
    supabase.from('user_badges').select('badge_id, unlocked_at').eq('user_id', user.id),
    // Place de l'élève parmi son niveau (223) : ce qui traduit « 3 000
    // trophées » en « top 2 % des 3e ». RPC SECURITY DEFINER obligatoire — la
    // RLS de `profiles` ne laisserait voir qu'une seule ligne à l'élève.
    supabase.rpc('my_grade_standings'),
  ])

  // Bannières équipables : les gratuites d'office (price + unlock null) et
  // celles que l'élève possède (user_avatar_items), catégorie 'banner'.
  const [{ data: freeBanners }, { data: ownedBanners }] = await Promise.all([
    supabase
      .from('avatar_items')
      .select('asset_key')
      .eq('category', 'banner')
      .is('price', null)
      .is('unlock_condition', null),
    supabase
      .from('user_avatar_items')
      .select('avatar_items(asset_key, category)')
      .eq('user_id', user.id),
  ])
  const availableBanners = Array.from(
    new Set([
      ...(Array.isArray(freeBanners) ? freeBanners : []).map((r) =>
        str((r as Record<string, unknown>).asset_key),
      ),
      ...(Array.isArray(ownedBanners) ? ownedBanners : []).flatMap((r) => {
        const item = (r as Record<string, unknown>).avatar_items as
          | Record<string, unknown>
          | null
        return item && item.category === 'banner' ? [str(item.asset_key)] : []
      }),
    ]),
  ).filter(Boolean)

  const stats = (statsRaw ?? {}) as Record<string, unknown>
  const firstName = str(base?.full_name).split(' ')[0] || 'Moi'
  const gamertag = cosmetics?.gamertag ? str(cosmetics.gamertag) : null

  // École courante (nom seulement) selon la classe.
  const gradeLevel = base?.grade_level ? str(base.grade_level) : null
  const schoolId = activeSchoolId(base, gradeLevel)
  let schoolName: string | null = null
  if (schoolId) {
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .maybeSingle()
    schoolName = school?.name ? str(school.name) : null
  }

  // Badges : fusion catalogue + acquis, condition typée.
  const earnedMap = new Map<string, string>()
  for (const row of Array.isArray(mine) ? mine : []) {
    const o = row as Record<string, unknown>
    if (o.badge_id) earnedMap.set(str(o.badge_id), str(o.unlocked_at) || '')
  }
  const badges: BadgeState[] = (Array.isArray(catalog) ? catalog : [])
    .map((row) => {
      const o = row as Record<string, unknown>
      const condition = parseCondition(o.condition)
      if (!condition) return null
      const id = str(o.id)
      const unlockedAt = earnedMap.get(id) ?? null
      return {
        id,
        slug: str(o.slug),
        title: str(o.title),
        description: str(o.description),
        icon: str(o.icon) || '🏅',
        condition,
        earned: earnedMap.has(id),
        unlockedAt: unlockedAt || null,
      } satisfies BadgeState
    })
    .filter((b): b is BadgeState => b !== null)

  // Équipés : nettoyés contre les badges réellement acquis.
  const earnedIds = new Set(badges.filter((b) => b.earned).map((b) => b.id))
  const rawEquipped = Array.isArray(cosmetics?.equipped_badges)
    ? (cosmetics.equipped_badges as unknown[]).map((x) => str(x))
    : []
  const equippedBadgeIds = normalizeEquipped(rawEquipped, earnedIds)

  const subjectCountsRaw =
    stats.subject_counts && typeof stats.subject_counts === 'object'
      ? (stats.subject_counts as Record<string, unknown>)
      : {}
  const subjectCounts: Record<string, number> = {}
  for (const [k, v] of Object.entries(subjectCountsRaw)) subjectCounts[k] = num(v)

  const inputs: ProfileStatInputs = {
    gamesPlayed: num(stats.games_played),
    wins: num(stats.wins),
    currentStreak: num(stats.current_streak),
    bestStreak: num(stats.best_streak),
    totalXp: num(stats.total_xp),
    level: num(stats.level, 1),
    trophies: num(stats.trophies),
    bestTrophies: num(stats.best_trophies),
    studyMinutes: num(stats.study_minutes),
    subjectCounts,
  }

  return {
    displayName: gamertag ?? firstName,
    hasCustomGamertag: gamertag !== null,
    gamertag,
    firstName,
    gradeLabel: gradeLevel,
    avatar: base?.avatar
      ? normalizeAvatarConfig(base.avatar)
      : DEFAULT_AVATAR,
    profileBanner: cosmetics?.profile_banner ? str(cosmetics.profile_banner) : null,
    schoolName,
    summary: buildProfileSummary(inputs),
    standings: parseGradeStandings(standingsRow),
    badges,
    equippedBadgeIds,
    newlyUnlocked,
    availableBanners,
  }
}

// -------------------------------------------------------------- mutations

// Contraintes du pseudo de jeu : 3–16 caractères, lettres/chiffres/espace/tiret/
// underscore, pas d'espaces en bordure. Validé ICI (le GRANT UPDATE colonne ne
// protège pas du contenu).
const GAMERTAG_RE = /^[\p{L}\p{N} _-]{3,16}$/u

export async function updateGamertag(
  raw: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Connecte-toi pour choisir un pseudo.' }

  const name = String(raw ?? '').trim()
  if (!GAMERTAG_RE.test(name)) {
    return {
      ok: false,
      error: 'Pseudo : 3 à 16 lettres, chiffres, espace, tiret ou underscore.',
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ gamertag: name })
    .eq('id', user.id)
  if (error) return { ok: false, error: 'Impossible d’enregistrer le pseudo.' }

  revalidatePath('/defi')
  return { ok: true }
}

// Équipe jusqu'à 3 badges. La RPC borne et vérifie la possession côté serveur ;
// on nettoie aussi ici pour un retour immédiat cohérent.
export async function setEquippedBadges(
  ids: string[],
): Promise<{ ok: boolean; equipped?: string[]; error?: string }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Connecte-toi pour équiper des badges.' }

  const clean = (Array.isArray(ids) ? ids : [])
    .map((x) => String(x))
    .slice(0, MAX_EQUIPPED)

  const { data, error } = await supabase.rpc('set_equipped_badges', {
    p_badge_ids: clean,
  })
  if (error) return { ok: false, error: 'Impossible d’équiper ces badges.' }

  revalidatePath('/defi')
  return {
    ok: true,
    equipped: Array.isArray(data) ? data.map((x) => String(x)) : [],
  }
}

// Équipe une bannière possédée (la RPC vérifie la possession).
export async function equipProfileBanner(
  banner: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Connecte-toi pour changer de bannière.' }

  const { error } = await supabase.rpc('equip_profile_banner', {
    p_banner: String(banner),
  })
  if (error) return { ok: false, error: 'Bannière non débloquée.' }

  revalidatePath('/defi')
  return { ok: true }
}

// Achète une bannière du profil (réutilise l'économie du vestiaire : prix lu en
// base par la RPC, jamais reçu du client).
export async function purchaseProfileBanner(
  itemId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Connecte-toi pour acheter une bannière.' }

  const { error } = await supabase.rpc('purchase_avatar_item', {
    p_item_id: String(itemId),
  })
  if (error) return { ok: false, error: 'Achat impossible (pièces insuffisantes ?).' }

  revalidatePath('/defi')
  return { ok: true }
}
