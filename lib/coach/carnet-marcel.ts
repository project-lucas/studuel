// -----------------------------------------------------------------------------
// LE CARNET DE MARCEL — ce qu'il sait de l'élève (16/10/2026).
//
// Deux couches, toutes deux visibles et effaçables dans l'onglet « Toi » :
//   • la CARTE D'IDENTITÉ, remplie à la première rencontre : cinq questions à
//     choix (passion, matière préférée, bête noire, objectif, moment de
//     travail). Aucun appel IA : elle est offerte au gratuit ;
//   • les NOTES, ce que l'élève a confié à Marcel en conversation (table
//     `marcel_notes`, migration 584) — réservées à Studuel+.
//
// La carte ne garde que des valeurs de LISTES FERMÉES (ou un slug de matière) :
// rien de libre, donc rien d'identifiant ni d'injectable dans la consigne du
// modèle. `normaliserIdentite` est le seul passage, côté app comme côté base
// (la RPC refuse les clés inconnues).
//
// Logique PURE et testée (carnet-marcel.test.ts).
// -----------------------------------------------------------------------------

export const PASSIONS = [
  { id: 'foot', label: 'Le foot', emoji: '⚽' },
  { id: 'basket', label: 'Le basket', emoji: '🏀' },
  { id: 'hand', label: 'Le hand', emoji: '🤾' },
  { id: 'danse', label: 'La danse', emoji: '💃' },
  { id: 'jeux', label: 'Les jeux vidéo', emoji: '🎮' },
  { id: 'mangas', label: 'Les mangas', emoji: '📚' },
  { id: 'musique', label: 'La musique', emoji: '🎧' },
  { id: 'dessin', label: 'Le dessin', emoji: '🎨' },
  { id: 'animaux', label: 'Les animaux', emoji: '🐾' },
  { id: 'series', label: 'Les séries', emoji: '🎬' },
  { id: 'cuisine', label: 'La cuisine', emoji: '🍳' },
  { id: 'sport', label: 'Un autre sport', emoji: '🏃' },
] as const

export const OBJECTIFS = [
  { id: 'examen', label: 'Réussir mon examen', emoji: '🎓' },
  { id: 'moyenne', label: 'Remonter ma moyenne', emoji: '📈' },
  { id: 'mention', label: 'Viser la mention', emoji: '🏅' },
  { id: 'stress', label: 'Moins stresser aux contrôles', emoji: '🧘' },
  { id: 'retard', label: 'Rattraper mon retard', emoji: '🚀' },
] as const

export const MOMENTS = [
  { id: 'matin', label: 'Le matin', emoji: '🌅' },
  { id: 'sortie', label: 'En sortant des cours', emoji: '🎒' },
  { id: 'soir', label: 'Le soir', emoji: '🌙' },
  { id: 'weekend', label: 'Le week-end', emoji: '📅' },
] as const

type Id<T extends readonly { id: string }[]> = T[number]['id']

export type IdentiteMarcel = {
  passion?: Id<typeof PASSIONS>
  preferee?: string
  beteNoire?: string
  objectif?: Id<typeof OBJECTIFS>
  moment?: Id<typeof MOMENTS>
}

const SLUG = /^[a-z0-9-]{1,40}$/

function dans<T extends readonly { id: string }[]>(liste: T, v: unknown): Id<T> | undefined {
  return typeof v === 'string' && liste.some((x) => x.id === v) ? (v as Id<T>) : undefined
}

/** Ne garde que les valeurs reconnues : tout le reste est ignoré. */
export function normaliserIdentite(brut: unknown): IdentiteMarcel {
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return {}
  const b = brut as Record<string, unknown>
  const id: IdentiteMarcel = {}
  const passion = dans(PASSIONS, b.passion)
  if (passion) id.passion = passion
  const objectif = dans(OBJECTIFS, b.objectif)
  if (objectif) id.objectif = objectif
  const moment = dans(MOMENTS, b.moment)
  if (moment) id.moment = moment
  if (typeof b.preferee === 'string' && SLUG.test(b.preferee)) id.preferee = b.preferee
  if (typeof b.beteNoire === 'string' && SLUG.test(b.beteNoire)) id.beteNoire = b.beteNoire
  return id
}

/** La carte est-elle encore vide ? (la première rencontre reste à faire) */
export function identiteVide(id: IdentiteMarcel): boolean {
  return Object.keys(id).length === 0
}

export type Puce = { cle: string; emoji: string; label: string }

/** Les puces de la carte d'identité, dans l'ordre où l'élève les a données. */
export function pucesIdentite(id: IdentiteMarcel, nomMatiere: (slug: string) => string | null): Puce[] {
  const puces: Puce[] = []
  const p = PASSIONS.find((x) => x.id === id.passion)
  if (p) puces.push({ cle: 'passion', emoji: p.emoji, label: p.label })
  const pref = id.preferee ? nomMatiere(id.preferee) : null
  if (pref) puces.push({ cle: 'preferee', emoji: '❤️', label: pref })
  const noire = id.beteNoire ? nomMatiere(id.beteNoire) : null
  if (noire) puces.push({ cle: 'beteNoire', emoji: '😬', label: noire })
  const o = OBJECTIFS.find((x) => x.id === id.objectif)
  if (o) puces.push({ cle: 'objectif', emoji: o.emoji, label: o.label })
  const m = MOMENTS.find((x) => x.id === id.moment)
  if (m) puces.push({ cle: 'moment', emoji: m.emoji, label: `Bosse ${m.label.toLowerCase()}` })
  return puces
}

// --------------------------------------------- ce que Marcel en FAIT
//
// Lucas, 16/10/2026, devant la puce « Remonter ma moyenne » : « à quoi ça sert ? ».
// La carte n’était qu’AFFICHÉE. Elle part désormais dans le profil envoyé à
// Marcel (lib/coach/profil-eleve), et l’onglet « Toi » dit, en clair, ce qu’il
// en fait. Rien de libre : des libellés des listes fermées et des noms de
// matières du catalogue.

const minuscule = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/** La carte, en une ligne pour la consigne du modèle (`null` si elle est vide). */
export function identitePourMarcel(id: IdentiteMarcel, nomMatiere: (slug: string) => string | null): string | null {
  const bouts: string[] = []
  const p = PASSIONS.find((x) => x.id === id.passion)
  if (p) bouts.push(`Sa passion : ${minuscule(p.label)} — prends tes exemples dedans.`)
  const pref = id.preferee ? nomMatiere(id.preferee) : null
  if (pref) bouts.push(`Matière préférée : ${pref}.`)
  const noire = id.beteNoire ? nomMatiere(id.beteNoire) : null
  if (noire) bouts.push(`Bête noire : ${noire} — rassure, va pas à pas.`)
  const o = OBJECTIFS.find((x) => x.id === id.objectif)
  if (o) bouts.push(`Son objectif de l’année : ${minuscule(o.label).replace(' ma ', ' sa ').replace(' mon ', ' son ')}.`)
  const m = MOMENTS.find((x) => x.id === id.moment)
  if (m) bouts.push(`Travaille plutôt ${minuscule(m.label)}.`)
  return bouts.length > 0 ? bouts.join(' ') : null
}

/** Ce que Marcel fait de chaque réponse, dit à l’élève dans l’onglet « Toi ». */
export function usagesIdentite(id: IdentiteMarcel, nomMatiere: (slug: string) => string | null): string[] {
  const u: string[] = []
  const p = PASSIONS.find((x) => x.id === id.passion)
  if (p) u.push(`Je prends mes exemples dans ${minuscule(p.label)}.`)
  const noire = id.beteNoire ? nomMatiere(id.beteNoire) : null
  if (noire) u.push(`En ${noire}, je vais pas à pas, sans te brusquer.`)
  const pref = id.preferee ? nomMatiere(id.preferee) : null
  if (pref) u.push(`Je m’appuie sur ce que tu aimes en ${pref}.`)
  const o = OBJECTIFS.find((x) => x.id === id.objectif)
  if (o) u.push(`Je garde ton objectif en tête : ${minuscule(o.label)}.`)
  return u
}

// ------------------------------------------------------------------ les notes

/** Ce qu'une note peut contenir au plus (miroir du CHECK de la 584). */
export const NOTE_MAX_LEN = 200
/** Les notes gardées par élève : au-delà, la plus ancienne s'efface (584). */
export const NOTES_MAX = 30

export type NoteMarcel = { id: string; texte: string; creeLe: string }

/** « Aujourd'hui », « Hier », « Il y a 3 jours », « Il y a 2 semaines ». */
export function depuisQuand(creeLe: string, maintenant: Date): string {
  const jours = Math.floor((maintenant.getTime() - Date.parse(creeLe)) / 86_400_000)
  if (!Number.isFinite(jours) || jours <= 0) return 'Aujourd’hui'
  if (jours === 1) return 'Hier'
  if (jours < 14) return `Il y a ${jours} jours`
  return `Il y a ${Math.floor(jours / 7)} semaines`
}
