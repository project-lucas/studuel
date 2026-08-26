// La première vague de lectures de l'arène (`/defi`), en UN aller-retour.
//
// CE QUE FAISAIT LA PAGE. Vingt lectures en parallèle (`Promise.all`), puis une
// seconde vague de sept une fois le profil connu. La LATENCE tenait — elles
// sont parallélisées, donc c'est un aller-retour, pas vingt. Ce n'est pas le
// problème.
//
// Le problème est le NOMBRE. Chaque lecture est une requête PostgREST qui
// devient une requête Postgres. À cent mille élèves — ~180 pages/s au pic de
// 17 h-21 h — cette seule page demanderait ~4 500 requêtes/s à la base. Le
// remède habituel (grossir la machine) coûte linéairement pour un travail qui
// ne le nécessite pas : ces vingt lectures interrogent la même base, pour le
// même élève, au même instant.
//
// `arene_accueil()` (migration 322) les rassemble. Rien n'est réécrit côté
// base : chaque morceau appelle la MÊME RPC ou fait le MÊME select qu'avant,
// mais Postgres fait le va-et-vient en interne, où il ne coûte rien.
//
// ELLE SUPPRIME AUSSI UNE CASCADE. `clan_ranking` et
// `school_tournament_standings` attendaient la vague 2 parce qu'elles ont
// besoin du cycle scolaire, lui-même tiré du profil de la vague 1 : un second
// aller-retour complet pour une donnée que la base avait déjà sous la main.
//
// CE QUI RESTE DEHORS, ET POURQUOI :
//   · les quêtes (`fetchQuestViews` / `fetchClaimedQuestIds`) — elles ont leur
//     propre chaîne de lecture et de normalisation, à traiter à part ;
//   · la maîtrise — elle a désormais son propre agrégat (321), déjà optimal ;
//   · le catalogue — il est en cache serveur, donc gratuit.
//
// LE REPLI EST LE CODE D'AVANT, MOT POUR MOT. Le projet déploie avant
// d'exécuter ses migrations : tant que la 322 dort, on refait les vingt
// lectures. Sans ce repli, l'arène — page d'accueil de l'app — serait vide
// entre le déploiement et le copier-coller du SQL.

import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizeClanWeekBoard, type ClanWeekBoard } from '@/lib/clan-week'
import { normalizeSeasonState, type SeasonState } from '@/lib/saison'
import { normalizeGauge, type TraqueGauge } from '@/lib/traque'
import { fetchClanWeekBoard, hasClaimedClanWeek } from '@/lib/clan-week-server'
import { fetchSeasonState } from '@/lib/saison-server'
import { fetchGauges } from '@/lib/traque-server'
import { getSubjectPeaks } from '@/lib/subject-rank-server'
import { getReviewItems } from '@/lib/srs'
import type { ReviewItem } from '@/lib/srs'
import { readRowTolerant } from '@/lib/profile-read'

/** Le profil tel que l'arène le consomme. */
export type DefiProfileRow = {
  full_name: string | null
  grade_level: string | null
  trophies: number | null
  primaire_school_id: string | null
  college_school_id: string | null
  lycee_school_id: string | null
  /** L'arène étant la page d'accueil, c'est ici qu'atterrissent les PARENTS. */
  profile_type: string | null
  /** Décide de la pastille Studuel+ du HUD. */
  subscription_tier: string | null
}

const PROFILE_COLONNES = [
  'full_name',
  'grade_level',
  'trophies',
  'primaire_school_id',
  'college_school_id',
  'lycee_school_id',
  'profile_type',
  'subscription_tier',
]

/** Une réponse PostgREST réduite à ce que la page en lit. */
type Data = { data: unknown }

export type AreneVague1 = {
  profile: Partial<DefiProfileRow>
  /**
   * Le cycle scolaire, calculé en base quand la 322 est là. `null` = à dériver
   * côté page (repli), pour ne pas dupliquer la règle ici.
   */
  level: string | null
  natRes: Data
  friendsRes: Data
  liveRes: Data
  leagueRes: Data
  matchesRes: Data
  overviewRes: Data
  gameTrophyRes: Data
  clanRes: Data | null
  tournamentRes: Data | null
  reviews: ReviewItem[]
  weekRes: ClanWeekBoard | null
  lastWeekRes: ClanWeekBoard | null
  alreadyClaimed: boolean
  seasonRes: SeasonState | null
  gaugesRes: Map<string, TraqueGauge> | null
  subjectPeaks: Map<string, number>
}

function asData(v: unknown): Data {
  return { data: v ?? null }
}

/** PGRST202 = la fonction n'est pas (encore) dans la base. */
function migrationAbsente(code?: string): boolean {
  return code === 'PGRST202'
}

export async function fetchAreneVague1(
  supabase: SupabaseClient,
  userId: string,
  todayKey: string,
  previousWeek: string,
): Promise<AreneVague1> {
  const { data, error } = await supabase.rpc('arene_accueil', {
    p_today: todayKey,
    p_prev_week: previousWeek,
  })

  if (!error && data && typeof data === 'object') {
    return mapAreneAccueil(data as Record<string, unknown>, todayKey)
  }
  if (error && !migrationAbsente(error.code)) {
    console.error('[arene] vague 1 groupée indisponible:', error.message)
  }
  return repli(supabase, userId, todayKey, previousWeek)
}

// -----------------------------------------------------------------------------
// Le chemin rapide : un JSON, les mêmes normaliseurs purs qu'avant.
// -----------------------------------------------------------------------------
export function mapAreneAccueil(
  o: Record<string, unknown>,
  todayKey: string,
): AreneVague1 {
  const gaugesRaw = o.gauges
  let gaugesRes: Map<string, TraqueGauge> | null = null
  if (Array.isArray(gaugesRaw)) {
    gaugesRes = new Map()
    for (const row of gaugesRaw) {
      const g = normalizeGauge(row)
      if (g) gaugesRes.set(g.bossId, g)
    }
  }

  const peaks = new Map<string, number>()
  if (Array.isArray(o.subject_peaks)) {
    for (const row of o.subject_peaks) {
      const r = row as { subject_slug?: unknown; peak?: unknown }
      const n = Number(r?.peak)
      if (typeof r?.subject_slug === 'string' && Number.isFinite(n)) {
        peaks.set(r.subject_slug, n)
      }
    }
  }

  return {
    profile: (o.profile ?? {}) as Partial<DefiProfileRow>,
    level: typeof o.level === 'string' ? o.level : null,
    natRes: asData(o.national),
    friendsRes: asData(o.friends_trophies),
    liveRes: asData(o.friends_live),
    leagueRes: asData(o.league),
    matchesRes: asData(o.ranked_matches),
    overviewRes: asData(o.friends_overview),
    gameTrophyRes: asData(o.game_trophies),
    clanRes: asData(o.clan),
    tournamentRes: asData(o.tournament),
    reviews: (Array.isArray(o.review_items) ? o.review_items : []) as ReviewItem[],
    // `null` de la RPC = migration du morceau absente : on rend `null`, comme
    // le faisait le repli, et l'écran s'en accommode déjà.
    weekRes: o.clan_week == null ? null : normalizeClanWeekBoard(o.clan_week, todayKey),
    lastWeekRes:
      o.clan_week_prev == null
        ? null
        : normalizeClanWeekBoard(o.clan_week_prev, todayKey),
    alreadyClaimed: o.clan_week_claimed === true,
    seasonRes: o.season == null ? null : normalizeSeasonState(o.season, todayKey),
    gaugesRes,
    subjectPeaks: peaks,
  }
}

// -----------------------------------------------------------------------------
// Le repli : exactement les lectures d'avant, dans le même Promise.all.
// -----------------------------------------------------------------------------
async function repli(
  supabase: SupabaseClient,
  userId: string,
  todayKey: string,
  previousWeek: string,
): Promise<AreneVague1> {
  const [
    profile,
    natRes,
    friendsRes,
    liveRes,
    leagueRes,
    matchesRes,
    reviews,
    weekRes,
    lastWeekRes,
    alreadyClaimed,
    seasonRes,
    gaugesRes,
    overviewRes,
    gameTrophyRes,
    subjectPeaks,
  ] = await Promise.all([
    readRowTolerant<DefiProfileRow>(supabase, 'profiles', 'id', userId, PROFILE_COLONNES),
    supabase.rpc('national_ranking'),
    supabase.rpc('friends_trophies'),
    supabase.rpc('friends_live'),
    supabase.rpc('league_standings'),
    supabase
      .from('ranked_matches')
      .select('id, won, delta, trophies, opponent, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    getReviewItems(supabase, userId),
    fetchClanWeekBoard(supabase),
    fetchClanWeekBoard(supabase, previousWeek),
    hasClaimedClanWeek(supabase, userId, previousWeek),
    fetchSeasonState(supabase, todayKey),
    fetchGauges(supabase, userId),
    supabase.rpc('friends_overview'),
    supabase
      .from('game_trophies')
      .select('subject_slug, game_id, trophies')
      .eq('user_id', userId),
    getSubjectPeaks(supabase, userId),
  ])

  return {
    profile,
    // Le cycle reste dérivé par la page dans ce chemin : une seule règle, au
    // même endroit qu'avant.
    level: null,
    natRes,
    friendsRes,
    liveRes,
    leagueRes,
    matchesRes,
    overviewRes,
    gameTrophyRes,
    // Le repli ne connaît pas le cycle : ces deux-là restent dans la vague 2,
    // exactement comme avant la 322.
    clanRes: null,
    tournamentRes: null,
    reviews,
    weekRes,
    lastWeekRes,
    alreadyClaimed,
    seasonRes,
    gaugesRes,
    subjectPeaks,
  }
}
