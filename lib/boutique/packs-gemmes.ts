// -----------------------------------------------------------------------------
// LES PACKS DE GEMMES — la section « Gemmes » de la Boutique, sur le modèle du
// magasin de Clash Royale (Lucas, 18/09/2026) : TROIS packs sur une rangée —
// quelques gemmes, un sac, un baril —, chacun avec son illustration, sa
// quantité et son prix en euros. Les trois plus gros (charrette, tas…) ont
// été retirés à la demande de Lucas le jour même.
//
// PRIX ET QUANTITÉS PROVISOIRES (« on verra le prix plus tard ») : ce sont
// ceux du modèle, à régler ici ET dans le seed de `packs_gemmes` (migration
// 369) — un test compare les deux.
//
// L'app n'encaisse encore aucun euro : acheter un pack enregistre une demande
// (contact d'un parent) et l'admin crédite les gemmes une fois le paiement
// confirmé (`accorder_pack_gemmes`). Module PUR : aucune requête ici.
// -----------------------------------------------------------------------------

export type IdPack = 'poignee' | 'sac' | 'baril'

/**
 * Un pack. Son ILLUSTRATION n'est pas ici : c'est un import statique d'image
 * (URL à empreinte de contenu), déclaré dans le composant
 * (components/boutique/RayonGemmes.tsx), pour que ce module reste pur.
 */
export type PackGemmes = {
  id: IdPack
  titre: string
  gemmes: number
  prixEuros: number
}

export const PACKS_GEMMES: readonly PackGemmes[] = [
  { id: 'poignee', titre: 'Quelques gemmes', gemmes: 80, prixEuros: 1.19 },
  { id: 'sac', titre: 'Sac de gemmes', gemmes: 500, prixEuros: 5.99 },
  { id: 'baril', titre: 'Baril de gemmes', gemmes: 1200, prixEuros: 11.99 },
]

export function packParId(id: string): PackGemmes | null {
  return PACKS_GEMMES.find((p) => p.id === id) ?? null
}

/**
 * La taille du nom d'un pack, en % de la largeur de sa carte (unité `cqw`).
 * Comme au magasin de Clash Royale, le nom tient TOUJOURS sur une ligne : un
 * nom court s'écrit à la taille du modèle, un nom long se resserre jusqu'à
 * remplir ~87 % de la carte. Estimation au nombre de caractères (Baloo 2
 * extra-gras : ~0,56 em par caractère au pire, mesuré), pour rester pur.
 */
export const TITRE_PACK_CQW_MAX = 12.6
const TITRE_PACK_LARGEUR_CQW = 86.5
const EM_PAR_CARACTERE = 0.56

export function tailleTitrePack(titre: string): number {
  const caracteres = Math.max(1, titre.trim().length)
  const ajustee = TITRE_PACK_LARGEUR_CQW / (caracteres * EM_PAR_CARACTERE)
  return Math.round(Math.min(TITRE_PACK_CQW_MAX, ajustee) * 10) / 10
}

/** « 14 000 » : la quantité à la française, espace fine insécable. */
export function libelleQuantite(gemmes: number): string {
  return Math.round(gemmes).toLocaleString('fr-FR').replace(/\s/g, ' ')
}

/**
 * Combien de cristaux dessiner dans le tas de REPLI (un pack sans illustration),
 * du plus petit pack au plus gros.
 */
const CRISTAUX_PAR_RANG = [3, 5, 7, 9, 12, 16] as const

export type CristalDuTas = {
  /** Centre horizontal, en % de la largeur. */
  x: number
  /** Bas du cristal, en % depuis le bas. */
  bas: number
  /** Taille, en % de la largeur. */
  taille: number
  /** Inclinaison, en degrés. */
  rotation: number
}

/**
 * Le tas de repli d'un pack : des cristaux empilés en monticule, rangée par
 * rangée depuis le bas, chaque rangée plus courte que la précédente.
 * Déterministe (pas de hasard) : le même pack dessine toujours le même tas,
 * au serveur comme au client.
 */
export function tasDeCristaux(pack: PackGemmes): CristalDuTas[] {
  const rang = PACKS_GEMMES.findIndex((p) => p.id === pack.id)
  const total = CRISTAUX_PAR_RANG[Math.max(0, rang)] ?? CRISTAUX_PAR_RANG[0]
  const taille = Math.max(22, 44 - total * 1.4)
  const cristaux: CristalDuTas[] = []
  let parRangee = Math.ceil((Math.sqrt(8 * total + 1) - 1) / 2)
  let rangee = 0
  while (cristaux.length < total && parRangee > 0) {
    const n = Math.min(parRangee, total - cristaux.length)
    // Serrés comme un vrai tas, sans jamais sortir de la case (96 % utiles).
    const pas = n > 1 ? Math.min(taille * 0.72, (96 - taille) / (n - 1)) : 0
    const debut = 50 - (pas * (n - 1)) / 2
    for (let i = 0; i < n; i++) {
      const k = cristaux.length
      cristaux.push({
        x: Math.round((debut + i * pas) * 10) / 10,
        bas: Math.round(rangee * taille * 0.55 * 10) / 10,
        taille: Math.round(taille * 10) / 10,
        rotation: ((k * 37) % 30) - 15,
      })
    }
    rangee += 1
    parRangee -= 1
  }
  return cristaux
}
