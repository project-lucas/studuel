// -----------------------------------------------------------------------------
// LA FICHE D'UN JOUEUR — ce qu'on voit d'un ami ou d'un rival de ligue, comme
// la fiche d'un joueur de Clash Royale (Lucas, 05/10/2026 : « il faut pouvoir
// regarder les autres : nombre de victoires, défaites, records, badges »).
//
// Données : `fiche_joueur(id)` (558), lisible seulement pour soi, un ami ou un
// membre de mon groupe de ligue. Rien de l'école, rien du compte.
// -----------------------------------------------------------------------------

import { topPourcent } from '@/lib/defi/classement-arene'
import { echelon } from '@/lib/ligue'
import { isEpreuveId, type EpreuveId } from '@/lib/palmares/epreuves'
import { levelFromXp } from '@/lib/wallet'

export type RecordFiche = { mode: EpreuveId; best: number; top: number | null }

export type FicheJoueur = {
  id: string
  moi: boolean
  ami: boolean
  nom: string
  pseudo: string | null
  portrait: string
  classe: string | null
  niveau: number
  trophees: number
  meilleursTrophees: number
  victoires: number
  defaites: number
  serie: number
  secondes: number
  badges: string[]
  records: RecordFiche[]
  /** Sa division de ligue (0 = Bronze 4 … 20 = Maître ; 562, 0 avant). */
  echelon: number
}

const entier = (v: unknown): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : Number.NaN
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0
}

export function lireFicheJoueur(brut: unknown): FicheJoueur | null {
  if (!brut || typeof brut !== 'object') return null
  const r = brut as Record<string, unknown>
  if (typeof r.id !== 'string') return null
  const records = (Array.isArray(r.records) ? r.records : []).flatMap((x): RecordFiche[] => {
    if (!x || typeof x !== 'object') return []
    const l = x as Record<string, unknown>
    if (!isEpreuveId(l.mode)) return []
    const rang = typeof l.rang === 'number' ? l.rang : null
    const sur = typeof l.sur === 'number' ? l.sur : null
    return [{ mode: l.mode, best: entier(l.best), top: topPourcent(rang, sur) }]
  })
  return {
    id: r.id,
    moi: r.moi === true,
    ami: r.ami === true,
    nom: typeof r.nom === 'string' && r.nom.trim() ? r.nom.trim() : 'Élève',
    pseudo: typeof r.pseudo === 'string' && r.pseudo.trim() ? r.pseudo.trim() : null,
    portrait: typeof r.portrait === 'string' ? r.portrait : '',
    classe: typeof r.classe === 'string' ? r.classe : null,
    niveau: levelFromXp(entier(r.xp)),
    trophees: entier(r.trophees),
    meilleursTrophees: entier(r.meilleurs_trophees),
    victoires: entier(r.victoires),
    defaites: entier(r.defaites),
    serie: entier(r.serie),
    secondes: entier(r.secondes),
    badges: (Array.isArray(r.badges) ? r.badges : []).filter((b): b is string => typeof b === 'string'),
    records,
    echelon: echelon(entier(r.echelon)).index,
  }
}

/** « 64 % de victoires », ou null avant le premier duel. */
export function tauxVictoire(f: Pick<FicheJoueur, 'victoires' | 'defaites'>): number | null {
  const joues = f.victoires + f.defaites
  return joues > 0 ? Math.round((f.victoires / joues) * 100) : null
}
