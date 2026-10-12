// -----------------------------------------------------------------------------
// DÉFIER UN AMI SUR UN MODE DE JEU — logique pure (05/10/2026).
//
// Lucas : « la fonction de défier un ami doit être présente dans l'onglet
// Amis : il cliquera sur l'ami en question, une invitation sera envoyée et
// notifiée à son ami, puis un panneau de choix des modes de jeu s'ouvrira
// pour se lancer ».
//
// LE PARCOURS :
//   1. l'épée de l'angle du bloc « Mes amis » passe l'onglet en mode défi ;
//   2. toucher un ami crée le duel (`creer_defi_ami`, 558) et le notifie ;
//   3. le panneau des modes s'ouvre : choisir un mode fixe le duel sur ce
//      mode et pose le COOKIE du défi en cours (ce module) ;
//   4. en fin de partie, l'enregistrement du score du mode (recordModeScore)
//      lit le cookie et dépose aussi le score sur le duel — un seul point
//      d'entrée pour les cinq modes de l'arène et tous les jeux de salon.
//   L'ami défié voit « Léa te défie ! » en tête de l'onglet Amis ; « Relever »
//   pose le même cookie et l'emmène sur le même mode.
//
// Seuls les modes qui CLASSENT un score (lib/palmares/epreuves) se défient :
// un score est la seule mesure commune à deux parties jouées à des heures
// différentes.
// -----------------------------------------------------------------------------

import { funModeTickets, sectionsMatieres, type ModeTicket } from '@/lib/defi/modes-catalog'
import { isArenaEpreuveId, isEpreuveId, type EpreuveId } from '@/lib/palmares/epreuves'

/** Le cookie du défi en cours : `<id du duel>|<mode>`. */
export const COOKIE_DEFI = 'studuel_defi_ami'
/** Une partie se joue dans l'heure : au-delà, le cookie n'engage plus rien. */
export const COOKIE_DEFI_SECONDES = 60 * 60
/** Le mode posé à la création, avant que le lanceur choisisse. */
export const MODE_PAR_DEFAUT: EpreuveId = 'blitz'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function encoderDefi(duelId: string, mode: EpreuveId): string {
  return `${duelId}|${mode}`
}

/** Le défi en cours lu dans le cookie, ou null s'il est mal formé. */
export function lireDefi(valeur: unknown): { duelId: string; mode: EpreuveId } | null {
  if (typeof valeur !== 'string') return null
  const [duelId, mode] = valeur.split('|')
  if (!duelId || !UUID.test(duelId) || !isEpreuveId(mode)) return null
  return { duelId, mode }
}

export type ModeDefi = { mode: EpreuveId; ticket: ModeTicket }

/**
 * Les modes qu'on peut défier : les modes classés de l'arène, puis le jeu de
 * chaque matière OUVERT à l'élève (le jeu libre, ou tous avec Studuel+).
 */
export function modesDuDefi(dayKey: string, premium: boolean): ModeDefi[] {
  const arene = funModeTickets(dayKey)
    .filter((t) => isEpreuveId(t.id) && t.href)
    .map((t) => ({ mode: t.id as EpreuveId, ticket: { ...t, badge: undefined, vedette: false } }))
  const jeux = sectionsMatieres(premium, premium).flatMap((s) =>
    s.tickets
      .filter((t) => t.gameId && isEpreuveId(t.gameId) && t.href && !t.verrou)
      .map((t) => ({ mode: t.gameId as EpreuveId, ticket: t })),
  )
  return [...arene, ...jeux]
}

/** Le lien qui lance un mode (le billet le porte déjà). */
export function lienDuMode(dayKey: string, premium: boolean, mode: EpreuveId): string | null {
  return modesDuDefi(dayKey, premium).find((m) => m.mode === mode)?.ticket.href ?? null
}

/**
 * Le lien d'un mode, sans passer par la vitrine : l'ami qui RELÈVE un défi va
 * sur le mode choisi par le lanceur, même si ce n'est pas son jeu libre — la
 * page du jeu garde sa propre porte (exigerAccesJeu).
 */
export function lienDirect(mode: EpreuveId): string {
  return isArenaEpreuveId(mode) ? `/defi/jouer?mode=${mode}` : `/defi/jeux/${mode}`
}

/** La notification de l'ami défié. */
export function messageDefi(lanceur: string): { kind: 'defi'; title: string; body: string; url: string } {
  const qui = lanceur.trim() || 'Un ami'
  return {
    kind: 'defi',
    title: `${qui} te défie !`,
    body: 'Relève le défi et bats son score.',
    url: '/amis',
  }
}

export type DefiRecu = {
  id: string
  /** L'ami qui m'a défié. */
  de: string
  nom: string
  portrait: string
  mode: EpreuveId | null
  /** Son score, s'il a déjà joué. */
  sonScore: number | null
}

/** Ce que rend `defis_recus()` (558), relu sans rien croire. */
export function lireDefisRecus(brut: unknown): DefiRecu[] {
  if (!Array.isArray(brut)) return []
  return brut.flatMap((l): DefiRecu[] => {
    if (!l || typeof l !== 'object') return []
    const r = l as Record<string, unknown>
    if (typeof r.id !== 'string' || !UUID.test(r.id) || typeof r.de !== 'string') return []
    const score = typeof r.son_score === 'number' && Number.isFinite(r.son_score) ? r.son_score : null
    return [
      {
        id: r.id,
        de: r.de,
        nom: typeof r.nom === 'string' && r.nom.trim() ? r.nom.trim() : 'Un ami',
        portrait: typeof r.portrait === 'string' ? r.portrait : '',
        mode: isEpreuveId(r.mode) ? r.mode : null,
        sonScore: score,
      },
    ]
  })
}
