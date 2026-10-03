// UN COMPTE QUI TIENT DANS LE BANDEAU (03/10/2026). Le bandeau du haut n'a
// pas la place d'écrire « 1 000 015 » : jusqu'à 99 999, le nombre s'écrit en
// entier (espace fine insécable des milliers) ; au-delà, il s'abrège —
// « 125 k », « 1 M », « 1,2 M ». Arrondi VERS LE BAS : un compte affiché
// n'annonce jamais plus que ce qu'on a. Pur et testé.

const ENTIER_MAX = 99_999

function decimale(n: number): string {
  // Une décimale au plus, à la française, sans « ,0 ».
  const t = Math.floor(n * 10) / 10
  return t.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
}

export function compteCourt(n: number): string {
  const v = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
  if (v <= ENTIER_MAX) return v.toLocaleString('fr-FR')
  if (v < 1_000_000) return `${Math.floor(v / 1000)} k`
  return `${decimale(v / 1_000_000)} M`
}
