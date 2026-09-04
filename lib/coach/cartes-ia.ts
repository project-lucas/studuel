import { MAX_RECTO_LEN, MAX_VERSO_LEN } from './vers-carnet'

// LES CARTES RENDUES PAR LE MODÈLE — les lire sans jamais lui faire confiance.
//
// Le mode « flashcards » demande un tableau JSON. Un modèle rend ce qu'il veut :
// du JSON entouré de bavardage, une ```clôture markdown```, des clés inventées,
// des cartes vides, ou vingt cartes quand on en voulait huit. Rien de tout ça
// ne doit atteindre le carnet de l'élève — c'est SON support de révision, et
// une carte vide ou dupliquée s'y verra pendant des mois.
//
// Ce module ne parle ni à la base ni au réseau : il transforme une chaîne en
// cartes propres, ou en rien. C'est ce qui le rend testable, et c'est là que
// vivent toutes les décisions de tolérance.

/** Au-delà, on coupe : la demande porte sur 6 à 10 cartes. */
export const MAX_CARTES = 12

export type CarteIa = { recto: string; verso: string }

/**
 * Le tableau JSON, extrait d'une réponse qui peut être entourée de texte.
 *
 * Même principe que le carnet (app/reviser/cours/ai-actions) : on cherche le
 * premier `[` et le dernier `]`. Une clôture markdown, une phrase d'intro ou un
 * « Voilà ! » final n'empêchent alors pas de lire la réponse — et un modèle en
 * met un une fois sur dix.
 */
function tableauJson(raw: string): unknown[] | null {
  const debut = raw.indexOf('[')
  const fin = raw.lastIndexOf(']')
  if (debut === -1 || fin === -1 || fin <= debut) return null
  try {
    const parsed: unknown = JSON.parse(raw.slice(debut, fin + 1))
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const texte = (v: unknown): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : ''

/**
 * Les cartes exploitables d'une réponse. Tableau vide si rien n'est lisible —
 * l'appelant le DIT à l'élève plutôt que d'écrire du vide dans son carnet.
 *
 * Trois filtres, dans cet ordre : une carte doit avoir ses deux faces, ne pas
 * répéter un recto déjà vu (le modèle se répète quand le sujet est mince), et
 * ne pas avoir un recto identique à son verso (« Napoléon » / « Napoléon »).
 */
export function lireCartes(raw: string): CarteIa[] {
  const items = tableauJson(raw)
  if (!items) return []

  const cartes: CarteIa[] = []
  const vus = new Set<string>()

  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>

    // On accepte les deux vocabulaires : le nôtre (recto/verso) et celui que
    // les modèles produisent spontanément (question/réponse, front/back).
    const recto = texte(o.recto ?? o.question ?? o.front).slice(0, MAX_RECTO_LEN)
    const verso = texte(o.verso ?? o.reponse ?? o.réponse ?? o.back).slice(
      0,
      MAX_VERSO_LEN,
    )
    if (recto.length === 0 || verso.length === 0) continue

    const cle = recto.toLowerCase()
    if (vus.has(cle)) continue
    if (cle === verso.toLowerCase()) continue

    vus.add(cle)
    cartes.push({ recto, verso })
    if (cartes.length >= MAX_CARTES) break
  }

  return cartes
}

/**
 * Ce que Marcel DIT quand il vient de fabriquer des cartes. La liste, elle,
 * s'affiche à part : le fil garde une phrase, pas un tableau JSON qui n'aurait
 * aucun sens à relire trois jours plus tard dans l'historique.
 */
export function phraseCartes(nombre: number): string {
  if (nombre === 0) {
    return 'Je n’ai pas réussi à en faire des cartes. Redis-moi le chapitre, plus précisément.'
  }
  if (nombre === 1) {
    return 'Voilà une carte. Relis-la : si elle est juste, range-la dans ton carnet.'
  }
  return `Voilà ${nombre} cartes. Relis-les : celles qui sont justes, range-les dans ton carnet.`
}
