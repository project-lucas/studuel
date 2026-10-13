import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateRevisionToday } from '@/lib/habits'
import { gainsVerses, walletTouch, xpActivite, type WalletAward } from '@/lib/wallet-server'
import { advanceQuests } from '@/lib/quests-server'
import { contributeToClan } from '@/lib/clan-week-server'
import { addCrowns } from '@/lib/saison-server'
import { enregistrerReponsesRevision } from '@/lib/srs-server'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import type { GameTrophyOutcome } from '@/app/defi/actions'
import { PROGRAMME_GAME_ID } from '@/lib/jeux/programme'
import {
  countsAsWin,
  courseOutcome,
  goldenIndex,
  sanitizeStats,
  type CourseOutcome,
  type CourseStats,
} from '@/lib/duel/course'
import type {
  DuelCourseInput,
  DuelCourseOutcome,
  DuelCourseStatut,
  OpponentClaim,
} from '@/lib/duel/fin-course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { ligueApresCourse } from '@/lib/duel/ligue-course'
import { lireLigue } from '@/lib/ligue-server'
import { rivalFinal, rivalScoreAtEnd, timelineFromSteps } from '@/lib/duel/rival'
import { sanitizeSteps, type ReplayStep } from '@/lib/duel/replay'
import { fetchReplaySteps, saveReplay } from '@/lib/duel/opponent-server'

// -----------------------------------------------------------------------------
// FIN D'UNE COURSE — le seul endroit où le duel classé retombe : trophées de la
// matière, série, clan de la semaine, quêtes du jour, saison, bilan V/D, file
// de révision, et la TRACE qui fera de cette course le rival de quelqu'un.
//
// RIEN N'EST CRU SUR PAROLE. Le client annonce son score, ses réponses et
// l'adversaire qu'il dit avoir affronté ; le serveur REFABRIQUE le rival (un
// robot depuis la graine, un replay depuis la base), rejoue l'issue avec les
// mêmes fonctions pures que l'écran, et n'accorde les trophées que sur CE
// verdict. Un score annoncé hors du possible est ramené dans les bornes.
//
// TENIR LA CHARGE (19/09/2026). Des milliers d'élèves finissent des courses en
// même temps ; cette action a donc été resserrée :
//   · UNE COURSE = UN IDENTIFIANT (`courseId`, tiré par l'écran au départ).
//     Le client peut RÉESSAYER sans risque — réseau coupé, réponse perdue — :
//     une course déjà comptée rend le résultat enregistré, jamais une seconde
//     paie ;
//   · LE CŒUR EN UNE TRANSACTION (`duel_course_enregistrer`, migration 374) :
//     activité, clan, couronnes, trophées, bilan V/D et trace — huit appels
//     séparés qui pouvaient réussir à moitié deviennent un seul aller-retour,
//     tout ou rien. Tant que la 374 dort, le chemin d'avant prend le relais ;
//   · UNE ROUTE, PAS UNE SERVER ACTION (`/api/duel/fin`). Next exécute les
//     Server Actions UNE PAR UNE : un envoi resté sans réponse (réseau
//     mobile qui bascule) bloquait toute relance derrière lui. Un `fetch`
//     s'interrompt et se relance, lui (lib/duel/envoi) ;
//   · AUCUNE REVALIDATION. `revalidatePath` dans une Server Action fait
//     re-rendre la page COURANTE — la course elle-même, ~14 requêtes — et vide
//     le cache client de tous les onglets, que le préchargeur remplissait
//     aussitôt (4 rendus de plus). Pour une chaîne de revanches, tout ça était
//     perdu. L'écran le sait déjà (il a sa réponse) ; l'arène et les onglets se
//     rafraîchissent une fois, quand l'élève sort de la course
//     (lib/apres-course, components/PrechargeurOnglets).
// -----------------------------------------------------------------------------

const MAX_ANSWERS = 50
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Supabase = Awaited<ReturnType<typeof createClient>>

export async function enregistrerFinCourse(input: DuelCourseInput): Promise<DuelCourseOutcome> {
  const stats = sanitizeStats(input.stats ?? {})
  const seed = String(input.seed ?? '').slice(0, 120)
  const subjectSlug = String(input.subjectSlug ?? '').slice(0, 64)
  const courseId = UUID_RE.test(String(input.courseId ?? '')) ? String(input.courseId) : null

  const vide = (statut: DuelCourseStatut): DuelCourseOutcome => ({
    saved: false,
    statut,
    outcome: 'loss',
    rival: null,
    stats,
    trophies: null,
    trophiesPause: false,
    clanPoints: 0,
    questsCompleted: [],
    questDayDone: false,
    gains: [],
    replaySaved: false,
    ligue: null,
    rivalEchelon: null,
  })

  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  if (!user) return vide('non_connecte')
  if (!subjectSlug || !seed) return vide('non_verifie')

  // ---------------------------------------------------- le rival, rejoué ici
  const timeline = await rebuildRival(supabase, input.opponent, seed)
  const rivalEnd = timeline ? rivalFinal(timeline) : null
  // Sans rival vérifiable, la course compte pour l'activité (série, quêtes)
  // mais n'accorde PAS de trophées : on ne paye pas une victoire qu'on ne peut
  // pas constater — et on ne l'inscrit pas non plus comme une défaite.
  const verifie = rivalEnd !== null
  const outcome: CourseOutcome = rivalEnd
    ? courseOutcome({ score: stats.score, goalAtMs: stats.goalAtMs }, rivalEnd)
    : 'loss'
  const won = verifie && countsAsWin(outcome)
  // Ce qu'on renvoie à l'écran : le score du rival AU MOMENT où la course
  // s'est arrêtée, pas sa projection à 90 s.
  const rival =
    timeline && rivalEnd
      ? { score: rivalScoreAtEnd(timeline, stats.goalAtMs), goalAtMs: rivalEnd.goalAtMs }
      : null

  const steps = sanitizeSteps(input.steps)
  const answers = Array.isArray(input.answers) ? input.answers.slice(0, MAX_ANSWERS) : []
  const base = { stats, outcome, rival, statut: (verifie ? 'verifie' : 'non_verifie') as DuelCourseStatut }

  // ------------------------------------------ le cœur, en une transaction
  const coeur = courseId
    ? await enregistrerCoeur(supabase, {
        courseId,
        subjectSlug,
        stats,
        verifie,
        won,
        steps,
      })
    : null

  if (coeur?.dejaCompte) {
    // Un renvoi : la course est déjà payée. On rend ce qui avait été écrit —
    // et la ligue telle qu'elle est (rien de plus n'a été versé : la place
    // d'avant est la place d'aujourd'hui).
    const [ligue, rivalEchelon] = await Promise.all([
      lireLigue(supabase).then((etat) => ligueApresCourse(etat, 0)),
      echelonDuRival(supabase, input.opponent),
    ])
    return { ...resultatStocke(base, coeur.resultat), statut: 'deja_compte', ligue, rivalEchelon }
  }

  const coeurPaye =
    coeur ?? (await cheminSansTransaction(supabase, user.id, { subjectSlug, stats, verifie, won, steps }))

  // ---------------------------- ce qui se décide en TypeScript, à côté
  const [quests, , xpCourse] = await Promise.all([
    // Un duel est une partie (« Faire 1 partie ») et ses questions comptent
    // pour « Répondre à 10 questions », gagné ou non.
    advanceQuests(supabase, user.id, { parties: 1, reponses: stats.answered }),
    coeurPaye.saved ? validateRevisionToday(supabase, user.id) : Promise.resolve(),
    // L'XP DE LA COURSE (557) : 10 pour l'avoir courue, 20 gagnée, 100 par
    // jour au plus — une fois par course (clé : son identifiant).
    coeurPaye.saved
      ? xpActivite(supabase, 'duel', courseId ?? crypto.randomUUID(), won ? 1 : 0, 1)
      : Promise.resolve(null),
    answers.length > 0
      ? enregistrerReponsesRevision(supabase, user.id, answers).catch(() => false)
      : Promise.resolve(true),
  ])

  // Le bonus de journée se verse une fois : quand CETTE course boucle les
  // quêtes. `allDone` reste vrai tout le reste du jour — sans la seconde
  // condition, chaque course suivante le repayait (50 points de clan et 50
  // couronnes, jusqu'aux plafonds).
  const bonusJour = quests.allDone && quests.justCompleted.length > 0
  // LA LIGUE, relue APRÈS le versement (13/10/2026) : `ligue_etat` m'inscrit
  // dans mon groupe si cette XP est ma première de la semaine, et rend la
  // liste classée ; ma place d'avant se recompte sans seconde lecture
  // (lib/duel/ligue-course). L'échelon du rival vient de la 562 (tolérant).
  const [[clanJour], ligue, rivalEchelon] = await Promise.all([
    bonusJour
      ? Promise.all([contributeToClan(supabase, 'quest_day'), addCrowns(supabase, 'quest_day')])
      : Promise.resolve([0]),
    lireLigue(supabase).then((etat) => ligueApresCourse(etat, xpCourse?.awarded ?? 0)),
    echelonDuRival(supabase, input.opponent),
  ])

  return {
    ...base,
    saved: coeurPaye.saved,
    trophies: coeurPaye.trophies,
    trophiesPause: coeurPaye.trophiesPause,
    clanPoints: coeurPaye.clanPoints + clanJour,
    questsCompleted: quests.justCompleted,
    questDayDone: quests.allDone,
    // Les COURONNES DE SAISON (`season_add_crowns`, 207) ne sont plus montrées :
    // le Pass de saison n'a plus de porte depuis le 17/09/2026, et pour
    // l'élève « couronne » veut dire la maîtrise d'un chapitre — un « +10
    // couronnes » en fin de duel annonçait une monnaie qui n'existe nulle
    // part (Lucas, 13/10/2026). La transaction (374) et le bonus du jour les
    // versent encore, sans effet visible.
    gains: gainsVerses(coeurPaye.award, { xp: xpCourse?.awarded ?? 0 }),
    replaySaved: coeurPaye.replaySaved,
    ligue,
    rivalEchelon,
  }
}

/**
 * L'échelon de ligue du rival, pour l'étiquette sous son avatar. Un robot n'en
 * a pas : il est réglé sur l'élève, l'écran lui prête le mien. Un élève rejoué
 * se lit par `ligue_echelon_du_rival` (562, depuis l'identifiant de sa trace :
 * `duel_replays` ne se lit qu'en propre) ; tant qu'elle dort, null —
 * l'étiquette ne s'affiche pas, rien ne casse.
 */
async function echelonDuRival(supabase: Supabase, claim: OpponentClaim): Promise<number | null> {
  if (!claim || typeof claim !== 'object' || claim.kind !== 'replay') return null
  const replayId = String(claim.replayId ?? '')
  if (!UUID_RE.test(replayId)) return null
  const { data, error } = await supabase.rpc('ligue_echelon_du_rival', { p_replay: replayId })
  if (error) {
    if (!isMissingSchemaObject(error)) console.error('[duel] échelon du rival illisible:', error.message)
    return null
  }
  const n = Number(data)
  return data !== null && Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : null
}

// -----------------------------------------------------------------------------
// Le cœur payé : ce que la transaction (ou le chemin d'avant) a versé.
// -----------------------------------------------------------------------------

type CoeurPaye = {
  saved: boolean
  award: WalletAward | null
  clanPoints: number
  couronnes: number
  trophies: GameTrophyOutcome
  trophiesPause: boolean
  replaySaved: boolean
}

type CoeurInput = {
  subjectSlug: string
  stats: CourseStats
  verifie: boolean
  won: boolean
  steps: ReplayStep[]
}

/**
 * La transaction de la 374. Rend `null` quand la fonction n'existe pas encore
 * (le chemin d'avant prend le relais) ; `dejaCompte` quand ce `courseId` a déjà
 * été payé.
 */
async function enregistrerCoeur(
  supabase: Supabase,
  input: CoeurInput & { courseId: string },
): Promise<(CoeurPaye & { dejaCompte: false }) | { dejaCompte: true; resultat: unknown } | null> {
  const { data, error } = await supabase.rpc('duel_course_enregistrer', {
    p_course_id: input.courseId,
    p_subject_slug: input.subjectSlug,
    p_game_id: PROGRAMME_GAME_ID,
    p_score: Math.max(0, Math.floor(input.stats.score)),
    p_correct: Math.min(input.stats.correct, MAX_ANSWERS),
    p_answered: Math.min(input.stats.answered, MAX_ANSWERS),
    p_verifie: input.verifie,
    p_won: input.won,
    p_steps: input.steps.length >= 3 ? input.steps : null,
  })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[duel] enregistrement groupé impossible:', error.message)
    }
    return null
  }
  const r = (data ?? {}) as { deja_compte?: unknown; resultat?: unknown }
  if (r.deja_compte === true) return { dejaCompte: true, resultat: r.resultat }
  return { ...lireCoeur(r.resultat), saved: true, dejaCompte: false }
}

/** Le JSON rendu par la transaction, ramené à des types sûrs. */
function lireCoeur(raw: unknown): Omit<CoeurPaye, 'saved'> {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    award: (r.award && typeof r.award === 'object' ? r.award : null) as WalletAward | null,
    clanPoints: Math.max(0, Number(r.clan_points) || 0),
    couronnes: Math.max(0, Number(r.couronnes) || 0),
    trophies: lireTrophees(r.trophees),
    trophiesPause: r.trophees_pause === true,
    replaySaved: r.replay === true,
  }
}

/** Un résultat déjà enregistré, rendu tel quel à un renvoi. */
function resultatStocke(
  base: Pick<DuelCourseOutcome, 'stats' | 'outcome' | 'rival' | 'statut'>,
  raw: unknown,
): DuelCourseOutcome {
  const c = lireCoeur(raw)
  return {
    ...base,
    saved: true,
    trophies: c.trophies,
    trophiesPause: c.trophiesPause,
    clanPoints: c.clanPoints,
    questsCompleted: [],
    questDayDone: false,
    gains: gainsVerses(c.award),
    replaySaved: c.replaySaved,
    ligue: null,
    rivalEchelon: null,
  }
}

function lireTrophees(raw: unknown): GameTrophyOutcome {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  return {
    before: Number(r.before ?? 0),
    after: Number(r.after ?? 0),
    delta: Number(r.delta ?? 0),
    best: Number(r.best ?? 0),
    total: Number(r.total ?? 0),
  }
}

/**
 * Le chemin d'avant la 374 : les mêmes versements, en appels séparés et
 * parallèles. Sans `courseId` en base, il n'est pas rejouable — l'écran ne
 * réessaie donc qu'une fois la 374 passée (cf. components/duel/useCourse).
 */
async function cheminSansTransaction(
  supabase: Supabase,
  userId: string,
  input: CoeurInput,
): Promise<CoeurPaye> {
  const { stats, verifie, won, steps, subjectSlug } = input
  const { data: session, error } = await supabase
    .from('challenge_sessions')
    .insert({
      user_id: userId,
      score: Math.min(stats.correct, MAX_ANSWERS),
      total: Math.min(stats.answered, MAX_ANSWERS),
      xp: 0,
    })
    .select('id')
    .maybeSingle<{ id: string }>()
  if (error) console.error('[duel] course non enregistrée:', error.message)

  const [award, clanPlay, clanWin, crownPlay, crownWin, trophees, , replaySaved] = await Promise.all([
    error || !session?.id ? Promise.resolve(null) : walletTouch(supabase),
    contributeToClan(supabase, 'duel_play'),
    won ? contributeToClan(supabase, 'duel_win') : Promise.resolve(0),
    addCrowns(supabase, 'duel_play'),
    won ? addCrowns(supabase, 'duel_win') : Promise.resolve(0),
    verifie ? applyTrophies(supabase, subjectSlug, won, stats.score) : Promise.resolve(null),
    verifie ? recordWinLoss(supabase, won) : Promise.resolve(0),
    verifie
      ? saveReplay(supabase, { subjectSlug, score: stats.score, won, steps })
      : Promise.resolve(false),
  ])

  return {
    saved: !error,
    award,
    clanPoints: clanPlay + clanWin,
    couronnes: crownPlay + crownWin,
    trophies: trophees?.trophies ?? null,
    trophiesPause: trophees?.pause ?? false,
    replaySaved,
  }
}

// Le rival, refabriqué côté serveur. Un robot se dérive de la graine et du
// réglage annoncé (les trophées de référence sont bornés) ; un replay se relit
// en base — jamais depuis les pas que le client aurait pu renvoyer.
async function rebuildRival(supabase: Supabase, claim: OpponentClaim, seed: string) {
  if (!claim || typeof claim !== 'object') return null
  if (claim.kind === 'bot') {
    const ref = Number.isFinite(claim.trophiesRef)
      ? Math.max(0, Math.min(Math.floor(claim.trophiesRef), 20_000))
      : 0
    const opponent = botOpponent(String(claim.botId ?? ''), ref)
    return opponent ? opponentTimeline(opponent, seed) : null
  }
  if (claim.kind === 'replay') {
    const version = typeof claim.version === 'string' ? claim.version.slice(0, 40) : null
    const steps = await fetchReplaySteps(supabase, String(claim.replayId ?? ''), version)
    return steps ? timelineFromSteps(steps, goldenIndex(seed)) : null
  }
  return null
}

// Les trophées de la matière, par la RPC de la Route (238) — la même que les
// jeux de salon, avec l'id « programme » : le duel classé EST le jeu Programme
// de la matière, ses trophées vont sur le même compteur. `pause` : la RPC a
// répondu sans erreur mais sans résultat — la borne des 60 parties par heure.
async function applyTrophies(
  supabase: Supabase,
  subjectSlug: string,
  won: boolean,
  score: number,
): Promise<{ trophies: GameTrophyOutcome; pause: boolean }> {
  const { data, error } = await supabase.rpc('apply_game_trophies', {
    p_subject_slug: subjectSlug,
    p_game_id: PROGRAMME_GAME_ID,
    p_won: won,
    p_score: Math.max(0, Math.floor(score)),
  })
  if (error) {
    console.error('[duel] trophées non enregistrés:', error.message)
    return { trophies: null, pause: false }
  }
  if (!data) return { trophies: null, pause: true }
  return { trophies: lireTrophees(data), pause: false }
}

// Le bilan V/D (174). Rend ce que la RPC a versé (0 si plafond ou migration
// manquante) — la valeur n'est plus affichée, seul le bilan compte.
async function recordWinLoss(supabase: Supabase, won: boolean): Promise<number> {
  const { data, error } = await supabase.rpc('record_duel_result', { p_won: won })
  if (error || !data) return 0
  const r = data as { coins_awarded?: number }
  return Math.max(0, Number(r.coins_awarded) || 0)
}
