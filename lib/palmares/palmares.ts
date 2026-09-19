// -----------------------------------------------------------------------------
// MON PALMARÈS — la vue de l'onglet Moi, telle que `my_mode_palmares` (352) la
// rend : une ligne par épreuve jouée. Ce module la normalise, la complète des
// épreuves jamais jouées (une collection montre ses cases vides), et en tire
// ce qui se lit d'un coup d'œil : la médaille de la semaine, le résumé.
// -----------------------------------------------------------------------------
import { standingFor, type Standing } from '@/lib/percentile'
import { EPREUVES, EPREUVES_JEUX, isEpreuveId, type EpreuveId } from '@/lib/palmares/epreuves'
import { metalDuRang, type Metal } from '@/lib/palmares/echelle'

export type LignePalmares = {
  mode: EpreuveId
  best: number
  bestAt: string | null
  last: number
  plays: number
  weekBest: number | null
  weekPlays: number
  weekRank: number | null
  weekTotal: number | null
  allRank: number | null
  allTotal: number | null
}

function num(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : null
}

export function parsePalmares(raw: unknown): LignePalmares[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((row) => {
    if (!row || typeof row !== 'object') return []
    const r = row as Record<string, unknown>
    if (!isEpreuveId(r.mode_id)) return []
    const best = num(r.best)
    if (best === null) return []
    return [
      {
        mode: r.mode_id,
        best,
        bestAt: typeof r.best_at === 'string' ? r.best_at : null,
        last: num(r.last) ?? best,
        plays: num(r.plays) ?? 1,
        weekBest: num(r.week_best),
        weekPlays: num(r.week_plays) ?? 0,
        weekRank: num(r.week_rank),
        weekTotal: num(r.week_total),
        allRank: num(r.all_rank),
        allTotal: num(r.all_total),
      },
    ]
  })
}

/** Une case du palmarès : l'épreuve, et ma ligne si je l'ai jouée. */
export type CasePalmares = {
  mode: EpreuveId
  ligne: LignePalmares | null
  /** Le métal de la semaine : podium de ma classe cette semaine. */
  metal: Metal
  /** La place de la semaine, aux règles de lib/percentile. */
  semaine: Standing
  /** La place de toujours. */
  toujours: Standing
}

function caseDe(id: EpreuveId, lignes: readonly LignePalmares[]): CasePalmares {
  const ligne = lignes.find((l) => l.mode === id) ?? null
  const semaine =
    ligne && ligne.weekRank !== null && ligne.weekTotal !== null
      ? standingFor({ rank: ligne.weekRank, total: ligne.weekTotal })
      : ({ kind: 'aucun' } as const)
  const toujours =
    ligne && ligne.allRank !== null && ligne.allTotal !== null
      ? standingFor({ rank: ligne.allRank, total: ligne.allTotal })
      : ({ kind: 'aucun' } as const)
  return {
    mode: id,
    ligne,
    metal: ligne?.weekRank ? metalDuRang(ligne.weekRank) : null,
    semaine,
    toujours,
  }
}

/**
 * Les cinq cases de l'Arène, dans l'ordre du catalogue, jouées ou non. Une
 * épreuve jamais jouée est une case vide — et une case vide donne envie de la
 * remplir.
 */
export function casesPalmares(lignes: readonly LignePalmares[]): CasePalmares[] {
  return EPREUVES.map((e) => caseDe(e.id, lignes))
}

/** Les jeux de salon d'une matière, chacun avec ma ligne. */
export type GroupeJeux = {
  matiere: string
  emoji: string
  cases: CasePalmares[]
}

/**
 * Les jeux de salon, matière par matière, dans l'ordre des salons. Chaque
 * matière montre TOUS ses jeux, joués ou non : le palmarès est une collection,
 * et une collection montre ses cases vides.
 */
export function casesJeux(lignes: readonly LignePalmares[]): GroupeJeux[] {
  const groupes: GroupeJeux[] = []
  for (const e of EPREUVES_JEUX) {
    let g = groupes.find((x) => x.matiere === e.matiere)
    if (!g) {
      g = { matiere: e.matiere, emoji: e.matiereEmoji, cases: [] }
      groupes.push(g)
    }
    g.cases.push(caseDe(e.id, lignes))
  }
  return groupes
}

export type ResumeJeux = {
  /** Jeux joués, sur le total des jeux jouables. */
  joues: number
  total: number
  /** Podiums de la semaine (top 3 de ma classe), tous jeux. */
  podiums: number
}

export function resumeJeux(groupes: readonly GroupeJeux[]): ResumeJeux {
  let joues = 0
  let total = 0
  let podiums = 0
  for (const g of groupes) {
    for (const c of g.cases) {
      total += 1
      if (c.ligne) joues += 1
      if (c.metal) podiums += 1
    }
  }
  return { joues, total, podiums }
}

/** La ligne sous le titre des jeux de salon. */
export function sousTitreJeux(r: ResumeJeux): string {
  if (r.joues === 0) return `${r.total} jeux par matière, un record à poser sur chacun.`
  if (r.podiums > 0) {
    return r.podiums === 1
      ? 'Un podium de jeu cette semaine dans ta classe.'
      : `${r.podiums} podiums de jeu cette semaine dans ta classe.`
  }
  return `${r.joues} jeu${r.joues > 1 ? 'x' : ''} joué${r.joues > 1 ? 's' : ''} sur ${r.total}.`
}

export type ResumePalmares = {
  /** Épreuves jouées sur les cinq. */
  jouees: number
  /** Podiums de la semaine (top 3 de ma classe). */
  podiums: number
  /** Le meilleur rang de la semaine, toutes épreuves, ou null. */
  meilleurRang: { mode: EpreuveId; rank: number } | null
  /** Parties jouées cette semaine, toutes épreuves. */
  partiesSemaine: number
}

export function resumePalmares(cases: readonly CasePalmares[]): ResumePalmares {
  let jouees = 0
  let podiums = 0
  let partiesSemaine = 0
  let meilleurRang: ResumePalmares['meilleurRang'] = null
  for (const c of cases) {
    if (!c.ligne) continue
    jouees += 1
    partiesSemaine += c.ligne.weekPlays
    if (c.metal) podiums += 1
    const rank = c.ligne.weekRank
    if (rank !== null && (meilleurRang === null || rank < meilleurRang.rank)) {
      meilleurRang = { mode: c.mode, rank }
    }
  }
  return { jouees, podiums, meilleurRang, partiesSemaine }
}

/** La ligne sous le titre du bloc, selon ce qu'il y a à dire. */
export function sousTitrePalmares(r: ResumePalmares): string {
  if (r.jouees === 0) return 'Cinq épreuves, cinq records à poser. L’échelle repart chaque lundi.'
  if (r.podiums > 0) {
    return r.podiums === 1
      ? 'Un podium cette semaine — tiens-le jusqu’à lundi.'
      : `${r.podiums} podiums cette semaine — tiens-les jusqu’à lundi.`
  }
  if (r.partiesSemaine === 0) return 'Aucune partie cette semaine : tes places sont à reprendre.'
  return `${r.jouees} épreuve${r.jouees > 1 ? 's' : ''} jouée${r.jouees > 1 ? 's' : ''} sur 5 — la semaine se joue jusqu’à lundi.`
}
